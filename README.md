# CallRemind MCP Server

Model Context Protocol (MCP) server for **CallRemind's AI voice calling**. Let any
AI agent (Claude, ChatGPT, Cursor, Claude Code, Codex, opencode…) place automated
voice calls, schedule reminders, and manage your agents, leads, voice clones,
webhooks, and CEMAS emergency notifications — in English / Bahasa Malaysia.

There are **two ways** to use it:

| Path | Who it's for |
|------|--------------|
| **[Hosted endpoint](#hosted-endpoint-hosting-our-server)** — `https://mcp.callremind.my/mcp` | No setup. Add the remote URL to your client. |
| **[npm package / self-host](#self-host-npm-package)** — run it yourself | Full control; run stdio locally or HTTP/SSE. |

---

## Table of contents

- [Hosted endpoint](#hosted-endpoint-hosting-our-server)
- [Self-host (npm package)](#self-host-npm-package)
- [Configuration / Settings](#configuration--settings)
- [Client setup](#client-setup)
- [Tools](#tools)
- [Testing](#testing)

---

## Hosted endpoint (hosting our server)

No install needed — add the remote MCP server to any client. Sign in with your
**CallRemind account** (email one-time code, **Google**, or **GitHub**).

```
https://mcp.callremind.my/mcp
```

### Connect
- **Claude (desktop/app):** Settings → Connectors → Add custom connector → paste the URL → sign in.
- **ChatGPT:** Settings → Apps & Connectors → Advanced → Developer mode → add MCP connector → same URL.
- **Cursor:** add `https://mcp.callremind.my/mcp` as a remote MCP server → the client walks you through OAuth.
- **Any remote MCP client:** add the URL above (Streamable HTTP transport).

### Claude Code plugin
One-command install from our marketplace (adds the MCP server + a usage skill):

```
/plugin marketplace add callremind/callremind-claude-marketplace
/plugin install callremind@callremind
```

You can also install the plugin from the **community marketplace**:
`/plugin marketplace add anthropics/claude-plugins-community` then `callremind@claude-community`.

### Auth
- New accounts are created automatically and get **RM2 free credit**.
- OAuth consent + `/.well-known/oauth-*` discovery are served by the endpoint.
- Live setup/onboarding: <https://mcp.callremind.my/connect>

---

## Self-host (npm package)

### A. npm install + run

```bash
npm install -g callremind-mcp

# stdio (local clients)
CALLREMIND_API_KEY=your_key callremind-mcp

# HTTP/SSE (remote clients)
CALLREMIND_API_KEY=your_key CALLREMIND_MCP_PORT=8921 callremind-mcp index-sse.js
```

### B. From source

```bash
git clone git@github.com:callremind/callremind-mcp.git
cd callremind-mcp
npm install
cp .env.example .env      # set CALLREMIND_API_URL + CALLREMIND_API_KEY

npm start                  # stdio
npm run start:sse          # HTTP/SSE on http://0.0.0.0:8921/mcp
```

### C. Docker

```bash
docker build -t callremind-mcp .

# stdio
docker run --rm -e CALLREMIND_API_KEY=your_key callremind-mcp

# HTTP/SSE
docker run --rm -p 8921:8921 -e CALLREMIND_API_KEY=your_key callremind-mcp node index-sse.js
```

---

## Configuration / Settings

| Env var | Default | Description |
|---------|---------|-------------|
| `CALLREMIND_API_URL` | `https://api.callremind.my/v1` | CallRemind REST API base |
| `CALLREMIND_API_KEY` | *(none)* | Your `x-api-key` (required) |
| `CALLREMIND_MCP_PORT` | `8921` | HTTP/SSE port (`index-sse.js` only) |
| `CALLREMIND_MCP_HOST` | `0.0.0.0` | HTTP/SSE bind host |
| `CALLREMIND_MCP_ENDPOINT` | `/mcp` | HTTP/SSE MCP endpoint path |

> The **hosted endpoint** (`mcp.callremind.my/mcp`) manages these on our side — you
> only need `CALLREMIND_API_KEY` when self-hosting.

---

## Client setup (self-host)

### Claude Desktop

Edit `claude_desktop_config.json` (Claude Desktop → Settings → Developer → Edit Config):

```json
{
  "mcpServers": {
    "callremind": {
      "command": "npx",
      "args": ["-y", "callremind-mcp"],
      "env": { "CALLREMIND_API_KEY": "your_key" }
    }
  }
}
```

### Claude Code

```bash
claude mcp add callremind -- npx -y callremind-mcp
claude mcp add callremind -e CALLREMIND_API_KEY=your_key -- npx -y callremind-mcp
```

### Codex (OpenAI CLI)

```bash
codex mcp add callremind -- npx -y callremind-mcp
CALLREMIND_API_KEY=your_key codex
```

### ChatGPT (remote)

Use the [hosted endpoint](#hosted-endpoint-hosting-our-server): `https://mcp.callremind.my/mcp`.
ChatGPT discovers OAuth via `/.well-known/oauth-protected-resource` and signs you in.

### opencode

`opencode.json`:

```json
{
  "mcp": {
    "callremind": {
      "type": "local",
      "command": ["npx", "-y", "callremind-mcp"],
      "environment": { "CALLREMIND_API_KEY": "your_key" },
      "enabled": true
    }
  }
}
```

### Cursor

Cursor → Settings → MCP → Add server:

```json
{
  "mcpServers": {
    "callremind": {
      "command": "npx",
      "args": ["-y", "callremind-mcp"],
      "env": { "CALLREMIND_API_KEY": "your_key" }
    }
  }
}
```

### Generic HTTP/SSE

```
Transport: Streamable HTTP
URL:       http://<host>:8921/mcp
```

---

## Tools

| Tool | Endpoint | Purpose |
|------|----------|---------|
| `quickCall` | `POST /v1/calls/quick-call` | One-way call, only phone + message (Kokoro) |
| `quickCallWithEdge` | `POST /v1/calls/quick-call-with-edge` | One-way call using Edge TTS (backup) |
| `makeInstantCall` | `POST /v1/calls/instant` | Immediate outbound AI call |
| `makeInstantKokoroCall` | `POST /v1/calls/instant-kokoro-call` | Immediate one-way call (Kokoro) |
| `getCemasConfig` / `saveCemasConfig` | `/v1/cemas` | CEMAS config + voice prefs |
| `listEdgeVoices` / `previewEdgeVoice` | `/v1/tts/edge-*` | Edge TTS voices / preview |
| `listVoices` / `kokoroPreview` | `/v1/tts/voices`, `/v1/tts/kokoro` | All voices / Kokoro preview |
| `listTtsProviders` | `/v1/tts/providers` | List TTS providers |
| `generateTts` | `/v1/tts/generate` | Synthesize audio (openai/elevenlabs/minimax/qwen/kokoro/edge) |
| `validateTextSafety` | `/v1/validate-text-safety` | Profanity check (EN/MS/中文/Tamil) |
| `getProviderInfo` | `/v1/provider/numbers` | Your DIDs / provider |
| `listVoiceClones` / `createVoiceClone` | `/v1/voice-clones` | Manage voice clones |
| `listAgents` / `createAgent` / `updateAgent` | `/v1/agents` | Manage AI agents |
| `listLeads` / `createLead` | `/v1/contacts` | Manage contacts/leads |
| `listScheduledCalls` / `createScheduledCall` | `/v1/scheduled-calls` | Schedule calls |
| `listCallLogs` / `getReports` | `/v1/call-logs`, `/v1/reports` | History / analytics |
| `getProfile` / `updateProfile` | `/v1/profile` | Profile management |
| `listWebhookConfigurations` / `upsertWebhookConfiguration` | `/v1/webhooks/...` | Webhooks |
| `getSkillGuide` | `/v1/auth/skill` | Onboarding guide |
| `createNewUser` / `validateNewUser` / `loginUser` / `logoutUser` / `requestOtp` / `validateOtp` | `/v1/auth/...` | Account & sign-in helpers |

---

## Testing

```bash
npm test   # node test-api.js  (hits /v1/profile with your key)
```

---

## Links

- **Repo:** `https://github.com/callremind/callremind-mcp`
- **npm:** `https://www.npmjs.com/package/callremind-mcp`
- **REST API:** `https://api.callremind.my/v1`
- **Hosted MCP:** `https://mcp.callremind.my/mcp`
- **Connect/onboarding:** `https://mcp.callremind.my/connect`