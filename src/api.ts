import {
  YoutubeTranscript,
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError,
} from "youtube-transcript";
import playlist from "@distube/ytpl";

export const getTranscriptFromUrl = async (url: string) => {
  try {
    const transcriptChunks = await YoutubeTranscript.fetchTranscript(url, {});
    return transcriptChunks.map((chunk) => chunk.text).join();
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
