// src/agents/createAgent.ts
import { StreamChat } from "stream-chat";
import { apiKey, serverClient } from "../serverClient";
import  CohereAIAgent  from "./openai/CohereAIAgent";
import { AgentPlatform, AIAgent } from "./type";

export const createAgent = async (
  user_id: string,
  platform: AgentPlatform,
  channel_type: string,
  channel_id: string
): Promise<AIAgent> => {
  const token = serverClient.createToken(user_id);

  // Stream client
  const chatClient = new StreamChat(apiKey, undefined, {
    allowServerSideConnect: true,
  });

  await chatClient.connectUser({ id: user_id }, token);
  const channel = chatClient.channel(channel_type, channel_id);
  await channel.watch();

  switch (platform) {
    
    case AgentPlatform.COHERE:
      return new CohereAIAgent(chatClient, channel);

    

    default:
      throw new Error(`Unsupported agent platform: ${platform}`);
  }
};
