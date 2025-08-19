// CohereResponseHandler.ts
import { CohereClient } from "cohere-ai";
import type { Channel, Event, MessageResponse, StreamChat } from "stream-chat";

// Define ChatStreamEvent type if not available from cohere-ai
type ChatStreamEvent = {
  eventType: string;
  text?: string;
  // Add other properties as needed based on SDK documentation
};


export class CohereResponseHandler {
  private message_text = "";
  private is_done = false;
  private last_update_time = 0;
  private stopped = false;

  

  constructor(
    private readonly cohere: CohereClient,
    private readonly chatClient: StreamChat,
    private readonly channel: Channel,
    private readonly message: MessageResponse,
    private readonly onDispose: () => void
  ) {
    this.chatClient.on("ai_indicator.stop", this.handleStopGenerating);
  }

  /**
   * Runs a streaming Cohere completion and updates the Stream message progressively.
   * @param prompt The user/composed prompt to send to Cohere.
   * @param opts Optional: preamble (system), chatHistory (prior turns), model, temperature.
   */
  run = async (prompt: string, opts?: {
    preamble?: string;
    chatHistory?: { role: "USER" | "CHATBOT"; message: string }[];
    model?: string;
    temperature?: number;
  }) => {
    const { cid, id: message_id } = this.message;

    const model = opts?.model ?? "command-r-plus";
    const temperature = typeof opts?.temperature === "number" ? opts!.temperature : 0.7;

    try {
      // Streamed chat response
      const stream = await this.cohere.chatStream({
        model,
        message: prompt,
        preamble: opts?.preamble,
        chatHistory: opts?.chatHistory,
        temperature,
      });

      for await (const event of stream) {
        if (this.stopped) break;
        this.handleStreamEvent(event);

        const now = Date.now();
        if (now - this.last_update_time > 1000) {
          await this.chatClient.partialUpdateMessage(message_id, {
            set: { text: this.message_text },
          });
          this.last_update_time = now;
        }
      }

      // final update
      if (!this.stopped) {
        await this.chatClient.partialUpdateMessage(message_id, {
          set: { text: this.message_text },
        });
      }

      await this.channel.sendEvent({
        type: "ai_indicator.clear",
        cid,
        message_id,
      });
    } catch (error) {
      console.error("Error in CohereResponseHandler:", error);
      await this.handleError(error as Error);
    } finally {
      await this.dispose();
    }
  };

  dispose = async () => {
    if (this.is_done) return;
    this.is_done = true;
    this.chatClient.off("ai_indicator.stop", this.handleStopGenerating);
    this.onDispose();
  };

  private handleStopGenerating = async (event: Event) => {
    if (this.is_done || event.message_id !== this.message.id) return;

    this.stopped = true;
    console.log("Stop generating for message", this.message.id);

    await this.channel.sendEvent({
      type: "ai_indicator.clear",
      cid: this.message.cid,
      message_id: this.message.id,
    });
    await this.dispose();
  };

  private handleStreamEvent = (event: ChatStreamEvent) => {
    if (event.eventType === "text-generation") {
      this.message_text += event.text ?? "";
    }
    // Other possible events: "tool-call", "stream-end", "error" (SDK dependent)
  };

  private handleError = async (error: Error) => {
    if (this.is_done) return;

    await this.channel.sendEvent({
      type: "ai_indicator.update",
      ai_state: "AI_STATE_ERROR",
      cid: this.message.cid,
      message_id: this.message.id,
    });

    await this.chatClient.partialUpdateMessage(this.message.id, {
      set: {
        text: error.message ?? "Error generating the message",
        message: error.toString(),
      },
    });

    await this.dispose();
  };
}
