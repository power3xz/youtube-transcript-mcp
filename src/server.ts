import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import z from "zod";

import { getTranscriptFromUrl, getVideoListData } from "./api";

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
      const transcript = await getTranscriptFromUrl(url);
      return {
        content: [
          {
            type: "text",
            text: transcript,
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

const delay = () =>
  new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 100 + Math.random() * 100);
  });

server.tool(
  "get-youtube-transcript-from-playlist",
  "youtube `playlistUrl` 이용해 목록의 모든 영상의 자막을 조회합니다.",
  {
    playlistUrl: z.string().describe("youtube 동영상목록의 url입니다."),
  },
  async ({ playlistUrl }) => {
    const videoList = await getVideoListData(playlistUrl);
    const result = [];
    for (const video of videoList) {
      const transcript = await getTranscriptFromUrl(video.videoUrl);
      result.push({ title: video.title, transcript });
      await delay();
    }

    return {
      content: [
        {
          type: "text",
          text: result
            .map(
              (item, index) => `video${index + 1}: ${item.title}:
${item.transcript}`
            )
            .join("\n\n"),
        },
      ],
    };
  }
);
