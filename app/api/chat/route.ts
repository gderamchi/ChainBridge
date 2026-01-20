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

  // const mcpClient = await createMCPClient({
  //   transport: {
  //     type: 'http',
  //     url: 'http://localhost:3000/mcp',

  //     // optional: configure HTTP headers
  //     // headers: { Authorization: 'Bearer my-api-key' },

  //     // optional: provide an OAuth client provider for automatic authorization
  //     // authProvider: myOAuthClientProvider,
  //   },
  // });
  // const mcpTools = await mcpClient.tools();

  const origin = new URL(req.url).origin;

  const result = streamText({
    model: "google/gemini-2.5-flash-lite",
    system: `You are a super friendly and convivial assistant here to help the user find the perfect manufacturing retailer! 🌟 Your goal is to understand their needs and match them with the right partner.

Currently, we specialize in **clothing materials**. When the user describes what they want to manufacture, enthusiastically affirm their choice! ✨ Then, identify the best fitting product group from the list below and use the \`searchRetailers\` tool.

Here is the list of available product groups you can choose from:
${JSON.stringify(productGroups, null, 2)}

**Your Guidelines:**
1.  **Be Convivial & Affirmative:** Always keep the tone warm, encouraging, and helpful. Use emojis to make the conversation lively! 🚀
2.  **Search Logic:** Use the \`searchRetailers\` tool by sending the detected product group.
3.  **Pre-Tool Communication:** Always inform the user of what you are doing *before* calling a tool (e.g., "That sounds like a great project! Let me look for retailers that specialize in that... 🕵️‍♀️").
4.  **Post-Tool Communication:** After getting results, provide a **concise summary** of what you found. Then, ask if they need further assistance with this request (e.g., "Do any of these look good to you, or shall we refine the search? 🤔").
5.  **Handling Misses:** If the request is off-topic or the product group isn't available, kindly let them know (e.g., "I'd love to help, but we don't have that category yet 🥺") and guide them back to what is available.
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