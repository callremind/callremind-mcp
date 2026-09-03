#!/usr/bin/env node
import { createServer } from "./server.js";

// Plugin hint: emitted ONLY when running inside Claude Code (CLAUDECODE set) so
// Claude Code can prompt to install the official CallRemind plugin. Per Anthropic's
// hint protocol, hints are honored ONLY for plugins listed in the official
// Anthropic marketplace (claude-plugins-official) — self-hosted/community marketplaces
// are silently dropped. Emission is gated + single-line to stderr.
if (process.env.CLAUDECODE) {
    process.stderr.write('<claude-code-hint v="1" type="plugin" value="callremind@claude-plugins-official" />\n');
}

// stdio transport   for local MCP clients (Claude Desktop, opencode, etc.)
const mcp = createServer();
await mcp.start({
    transportType: "stdio",
});
