// CohereAIAgent.ts
import { CohereClient } from "cohere-ai";
import type { Channel, DefaultGenerics, Event, StreamChat } from "stream-chat";
import type { AIAgent } from "../type";
import { CohereResponseHandler } from "./CohereResponseHandler";

export class CohereAIAgent implements AIAgent {
  private cohere?: CohereClient;
  private lastInteractionTs = Date.now();

  // Maintain conversation history manually (Cohere doesn’t track it server-side)
  private conversation: { role: "USER" | "CHATBOT"; message: string }[] = [];

  private handlers: CohereResponseHandler[] = [];

  constructor(
    readonly chatClient: StreamChat,
    readonly channel: Channel
  ) {}

  dispose = async () => {
    this.chatClient.off("message.new", this.handleMessage);
    await this.chatClient.disconnectUser();

    this.handlers.forEach((h) => h.dispose());
    this.handlers = [];
  };

  get user() {
    return this.chatClient.user;
  }

  getLastInteraction = (): number => this.lastInteractionTs;

  init = async () => {
    const apiKey = process.env.COHERE_API_KEY as string | undefined;
    if (!apiKey) {
      throw new Error("Cohere API key is required");
    }
    this.cohere = new CohereClient({ token: apiKey });
    this.chatClient.on("message.new", this.handleMessage);
  };

  private getWritingAssistantPrompt = (context?: string): string => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `You are an expert AI Writing Assistant. Your primary purpose is to be a collaborative writing partner.

**Core Capabilities**
- Content creation, improvement, style adaptation, brainstorming, and writing coaching.
- You can leverage web search results when the system provides them.

**Current Date**: ${currentDate}

**Crucial Instructions**
1) If the task requires up-to-date facts, explicitly state that you used the provided search results.
2) When search results are provided, synthesize them and cite the included sources (if present).
3) Be direct and production-ready. Use clear formatting. Do not add unnecessary preambles.

**Writing Context**: ${context || "General writing assistance."}`;
  };

  /**
   * Simple "planner" that asks the model if it needs web search.
   * Returns { needsSearch, query }.
   */
  private decideWebSearch = async (userMessage: string, contextPrompt: string): Promise<{ needsSearch: boolean; query?: string }> => {
    if (!this.cohere) throw new Error("Cohere not initialized");

    // Fast-path heuristic: if message mentions recency terms, ask for search.
    const heuristic = /\b(today|yesterday|latest|news|current|recent|update|price|who won|score|weather|release|launch)\b/i.test(
      userMessage
    );
    const initialGuess = heuristic ? "LIKELY" : "UNKNOWN";

    const deciderPreamble = `${contextPrompt}

You are a decision-making module. Decide if the user's request requires web search for CURRENT information.
Respond in pure JSON with this shape:
{"needsSearch": boolean, "query": string}

Rules:
- If the question depends on recent events, data, or current facts, needsSearch = true and set "query" to an effective search query.
- Otherwise, needsSearch = false and query = "".

Heuristic hint: ${initialGuess}.`;

    const result = await this.cohere.chat({
      model: "command-r-plus",
      message: userMessage,
      preamble: deciderPreamble,
      temperature: 0.2,
    });

    try {
      const text = result.text?.trim() ?? "";
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      const json = jsonStart >= 0 && jsonEnd > jsonStart ? text.slice(jsonStart, jsonEnd + 1) : "{}";
      const parsed = JSON.parse(json) as { needsSearch?: boolean; query?: string };
      return { needsSearch: !!parsed.needsSearch, query: parsed.query || undefined };
    } catch (e) {
      // Fallback: use heuristic only
      return { needsSearch: heuristic, query: heuristic ? userMessage : undefined };
    }
  };

  private handleMessage = async (e: Event<DefaultGenerics>) => {
    if (!this.cohere) {
      console.log("Cohere not initialized");
      return;
    }
    if (!e.message || e.message.ai_generated) return;

    const message = e.message.text;
    if (!message) return;

    this.lastInteractionTs = Date.now();

    const writingTask = (e.message.custom as { writingTask?: string })?.writingTask;
    const context = writingTask ? `Writing Task: ${writingTask}` : undefined;
    const systemPrompt = this.getWritingAssistantPrompt(context);

    // Add user message to conversation
    this.conversation.push({ role: "USER", message });

    const { message: channelMessage } = await this.channel.sendMessage({
      text: "",
      ai_generated: true,
    });

    // Show "thinking"
    await this.channel.sendEvent({
      type: "ai_indicator.update",
      ai_state: "AI_STATE_THINKING",
      cid: channelMessage.cid,
      message_id: channelMessage.id,
    });

    try {
      // 1) Decide if we need web search
      const { needsSearch, query } = await this.decideWebSearch(message, systemPrompt);

      let finalPrompt = message;
      let preamble = systemPrompt;

      // 2) If search needed, call Tavily and inject results
      if (needsSearch && query) {
        await this.channel.sendEvent({
          type: "ai_indicator.update",
          ai_state: "AI_STATE_EXTERNAL_SOURCES",
          cid: channelMessage.cid,
          message_id: channelMessage.id,
        });

        const searchResult = await this.performWebSearch(query);

        // Provide the results to the assistant (Cohere) via preamble context.
        preamble =
          `${systemPrompt}

The system performed a web search for the user's request.

=== WEB_SEARCH_RESULTS (JSON) ===
${searchResult}
=== END_RESULTS ===

Guidelines:
- Base current facts on these results when relevant.
- If results contain URLs, cite them at the end of the response.
- If results seem unrelated or low quality, say so briefly and proceed with best-effort answer.`;

        // Switch state to "generating"
        await this.channel.sendEvent({
          type: "ai_indicator.update",
          ai_state: "AI_STATE_GENERATING",
          cid: channelMessage.cid,
          message_id: channelMessage.id,
        });
      } else {
        // No search needed → start generating
        await this.channel.sendEvent({
          type: "ai_indicator.update",
          ai_state: "AI_STATE_GENERATING",
          cid: channelMessage.cid,
          message_id: channelMessage.id,
        });
      }

      // 3) Stream the final answer
      const handler = new CohereResponseHandler(
        this.cohere,
        this.chatClient,
        this.channel,
        channelMessage,
        () => this.removeHandler(handler)
      );
      this.handlers.push(handler);

      // Provide prior conversation so the model keeps context
      await handler.run(finalPrompt, {
        preamble,
        chatHistory: this.conversation,
        model: "command-r-plus",
        temperature: 0.7,
      });

      // After streaming completes, persist assistant response in history
      // (We fetch the latest message text from Stream, but here we already have it inside handler; for simplicity,
      // we can fetch the updated message if needed. Alternatively, track it inside handler and expose it.)
      // Minimal approach: add last text to history (best-effort).
      // If you want exact fidelity, you can add a getter on CohereResponseHandler to retrieve the final text.
      // this.conversation.push({ role: "CHATBOT", message: finalText });

    } catch (error) {
      console.error("Cohere agent error:", error);
      await this.channel.sendEvent({
        type: "ai_indicator.update",
        ai_state: "AI_STATE_ERROR",
        cid: channelMessage.cid,
        message_id: channelMessage.id,
      });
    }
  };

  private removeHandler = (handlerToRemove: CohereResponseHandler) => {
    this.handlers = this.handlers.filter((h) => h !== handlerToRemove);
  };

  // === Utilities ===
  private performWebSearch = async (query: string): Promise<string> => {
    const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

    if (!TAVILY_API_KEY) {
      return JSON.stringify({
        error: "Web search is not available. API key not configured.",
      });
    }

    console.log(`Performing web search for: "${query}"`);

    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TAVILY_API_KEY}`,
        },
        body: JSON.stringify({
          query,
          search_depth: "advanced",
          max_results: 5,
          include_answer: true,
          include_raw_content: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Tavily search failed for query "${query}":`, errorText);
        return JSON.stringify({
          error: `Search failed with status: ${response.status}`,
          details: errorText,
        });
      }

      const data = await response.json();
      console.log(`Tavily search successful for query "${query}"`);
      return JSON.stringify(data);
    } catch (error) {
      console.error(
        `An exception occurred during web search for "${query}":`,
        error
      );
      return JSON.stringify({
        error: "An exception occurred during the search.",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}

export default CohereAIAgent;