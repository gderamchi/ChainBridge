// import { streamText, gateway } from 'ai';
// import { createOpenAI } from '@ai-sdk/openai';
// import { createHeaders } from "portkey-ai";
// import { createVertex } from '@ai-sdk/google-vertex';
// export const maxDuration = 30;

// export async function POST(req: Request) {
//     const { messages } = await req.json();
//       const result = streamText({
//         model: gateway('google/gemini-2.5-flash-lite'),
//         system: "You are a helpful assistant",
//         messages,
//       });

//       return result.toUIMessageStreamResponse();
// }


import { createMCPClient } from '@ai-sdk/mcp';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

const mcpClient = await createMCPClient({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',

    // optional: configure HTTP headers
    // headers: { Authorization: 'Bearer my-api-key' },

    // optional: provide an OAuth client provider for automatic authorization
    // authProvider: myOAuthClientProvider,
  },
});
const tools = await mcpClient.tools();

  const result = streamText({
    model: "google/gemini-2.5-flash-lite",
    system: "you are a helpful assistant",
    // system: "You are a magic eight balls game, when the user ask to shake, you call the tool",
    messages: await convertToModelMessages(messages),
    tools,
    toolChoice: "auto"
  });

  return result.toUIMessageStreamResponse();
}