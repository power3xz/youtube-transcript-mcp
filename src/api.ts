import {
  YoutubeTranscript,
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError,
} from "youtube-transcript";
import playlist from "@distube/ytpl";

const offsetToTimestamp = (offset: number) => {
  const hms = [];
  if (offset >= 3600) {
    const h = Math.floor(offset / 3600);
    if (h < 10) {
      hms.push(`0${h}`);
    } else {
      hms.push(h);
    }
  }

  if (offset >= 60) {
    const m = Math.floor(offset / 60);
    if (m < 10) {
      hms.push(`0${m}`);
    } else {
      hms.push(m);
    }
  } else {
    hms.push("00");
  }

  const s = Math.floor(offset % 60);
  if (s < 10) {
    hms.push(`0${s}`);
  } else {
    hms.push(s);
  }

  return hms.join(":");
};

export const getTranscriptFromUrl = async (url: string) => {
  try {
    const transcriptChunks = await YoutubeTranscript.fetchTranscript(url, {});
    return `\`\`\`
(h?:m:s)|script

${transcriptChunks
  .map((chunk) => `(${offsetToTimestamp(chunk.offset)})|${chunk.text}`)
  .join("\n")}
\`\`\``;
  } catch (err: unknown) {
    if (err instanceof YoutubeTranscriptDisabledError) {
      return "(disabled transcript)";
    }
    if (err instanceof YoutubeTranscriptTooManyRequestError) {
      return "(to many request error)";
    }
    if (err instanceof YoutubeTranscriptVideoUnavailableError) {
      return "(not available video)";
    }
    throw err;
  }
};

export const getVideoListData = async (
  playlistUrl: string
): Promise<
  Array<{
    title: string;
    videoUrl: string;
  }>
> => {
  const result = await playlist(playlistUrl, {});
  return result.items.map((item) => {
    return {
      title: item.title,
      videoUrl: (item as any).shortUrl,
    };
  });
};
