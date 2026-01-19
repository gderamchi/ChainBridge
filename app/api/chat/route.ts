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
import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import { z } from 'zod';
import productGroups from '@/scripts/data/productGroups.json';

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
  const mcpTools = await mcpClient.tools();

  const origin = new URL(req.url).origin;

  const result = streamText({
    model: "google/gemini-2.5-flash-lite",
    system: `You are a helpful assistant that helps the user find the right retailer. For now, only clothing materials are available. The user can describe what kind of clothes they want to be manufactured, and you should use the searchRetailers tool by sending the right product group detected.

Here is the list of available product groups you can choose from:
${JSON.stringify(productGroups, null, 2)}
You will search the retailers with the product group that fits what the user need. If the question is off topic or what the user need is not covered by the product group, inform the user.
You have to inform the user of what you are doing at every steps, before calling and after calling a tool you have to communicate with the user.
`,
    // system: "You are a magic eight balls game, when the user ask to shake, you call the tool",
    messages: await convertToModelMessages(messages),
    tools: {
      // ...mcpTools,
      searchRetailers: tool({
        description: 'Search for retailers based on product group.',
        inputSchema: z.object({
          productGroup: z.string().describe("The product category to filter by (e.g., 'Functional', 'Cotton')"),
          page: z.number().int().min(1).optional().describe("Page number for pagination"),
        }),
        execute: async ({ productGroup, page }) => {
          const pageNum = page ?? 1;
          const params = new URLSearchParams({ productGroup, page: pageNum.toString() });
          const response = await fetch(`${origin}/api/retailers/search?${params}`);
          if (!response.ok) {
              throw new Error(`Failed to fetch retailers: ${response.statusText}`);
          }
          return await response.json();
        },
      }),
    },
    toolChoice: "auto"
  });

  return result.toUIMessageStreamResponse();
}