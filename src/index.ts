import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { server } from "./server";

const main = async () => {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (err) {
    console.error("error in main(): ", err);
    process.exit(1);
  }
};

main();
