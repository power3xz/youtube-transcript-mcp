import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { YoutubeTranscript } from "youtube-transcript";
import z from "zod";

export const server = new McpServer({
  name: "youtube-transcript",
  version: "0.0.1",
});

server.tool(
  "get-youtube-transcript",
  "youtube `url` 이용해 자막을 조회합니다.",
  {
    url: z.string().describe("youtube 동영상의 url입니다."),
  },
  async ({ url }) => {
    if (!url) {
      return {
        isError: true,
        content: [{ type: "text", text: "url is not provided." }],
      };
    }
    try {
      const transcriptChunks = await YoutubeTranscript.fetchTranscript(url, {});
      return {
        content: [
          {
            type: "text",
            text: transcriptChunks.map((chunk) => chunk.text).join(),
          },
        ],
      };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: "text", text: "failed to get transcript" }],
      };
    }
  }
);
