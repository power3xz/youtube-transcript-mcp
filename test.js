// import playlist from "@distube/ytpl";
// playlist(
//   "https://www.youtube.com/playlist?list=PLrGN1Qi7t67V-9uXzj4VSQCffntfvn42v"
// ).then(console.log);

import { getTranscriptFromUrl } from "./build/api.js";
getTranscriptFromUrl("https://www.youtube.com/watch?v=5NWa4-J5Q-k").then(
  console.log
);
