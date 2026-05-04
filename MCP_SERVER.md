# Kernel MCP Server

A Go-based MCP (Model Context Protocol) server that exposes Kernel's documentation to LLMs (Claude, Cursor, Windsurf, etc.). Users add the server URL to their AI assistant config and the assistant can search and retrieve Kernel docs during conversation.

## What is MCP

Model Context Protocol is an open standard by Anthropic that lets LLMs call external tools. Instead of copy-pasting documentation into a chat, the LLM calls a tool on your server and gets the content automatically. The LLM decides when to call the tool based on the user's question.

## Architecture

```
User → Claude Desktop / Cursor
           ↓ MCP tool call (HTTP)
     Kernel MCP Server (Go)
           ↓ SQL query
        Supabase (PostgreSQL)
           ↓ doc rows
     Kernel MCP Server (Go)
           ↑ JSON response
     Claude Desktop / Cursor
```

The Go server implements the MCP Streamable HTTP transport (the current standard as of 2024). It exposes a single `/mcp` endpoint that handles the full MCP lifecycle: initialize, tools/list, tools/call.

## Tools

### `search_docs`

Searches published docs by title and content using Supabase full-text search.

**Input:**
```json
{
  "query": "string — search term",
  "category": "string — optional, filter by category",
  "limit": "number — optional, default 5, max 20"
}
```

**Output:**
```json
[
  {
    "title": "What is MCP?",
    "slug": "what-is-mcp",
    "category": "mcp",
    "description": "Overview of the Model Context Protocol",
    "url": "https://kernel.so/docs/mcp/what-is-mcp"
  }
]
```

### `get_doc`

Returns the full content of a specific doc by category and slug.

**Input:**
```json
{
  "category": "string",
  "slug": "string"
}
```

**Output:**
```json
{
  "title": "What is MCP?",
  "description": "Overview of the Model Context Protocol",
  "category": "mcp",
  "content": "full raw text content…",
  "tags": ["mcp", "protocol"],
  "source_url": "https://modelcontextprotocol.io/introduction",
  "url": "https://kernel.so/docs/mcp/what-is-mcp"
}
```

### `list_categories`

Returns all available categories with doc counts.

**Input:** none

**Output:**
```json
[
  { "category": "mcp", "count": 12 },
  { "category": "agents", "count": 8 }
]
```

## Implementation

### Project structure

```
kernel-mcp/
├── main.go
├── server.go       — MCP HTTP handler, protocol logic
├── tools.go        — tool definitions and dispatch
├── db.go           — Supabase REST client
├── go.mod
└── Dockerfile
```

### Dependencies

```go
// go.mod
module github.com/aykutssert/kernel-mcp

go 1.23

require (
    github.com/joho/godotenv v1.5.1
)
```

No MCP SDK needed — the protocol is simple JSON over HTTP. The server handles it directly.

### MCP protocol flow

The server accepts `POST /mcp` with `Content-Type: application/json`.

**Initialize:**
```json
{ "jsonrpc": "2.0", "id": 1, "method": "initialize", "params": { "protocolVersion": "2024-11-05", "clientInfo": { "name": "claude-desktop" } } }
```

**List tools:**
```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }
```

**Call tool:**
```json
{ "jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": { "name": "search_docs", "arguments": { "query": "MCP server" } } }
```

### Supabase integration

The Go server calls Supabase REST API directly — no Go Supabase SDK needed, standard `net/http` is enough.

```go
// db.go — search query
GET https://<project>.supabase.co/rest/v1/docs
  ?select=title,slug,category,description
  &published=eq.true
  &or=(title.ilike.*{query}*,content.ilike.*{query}*)
  &limit={limit}
Headers:
  apikey: SUPABASE_ANON_KEY
  Authorization: Bearer SUPABASE_ANON_KEY
```

### Environment variables

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SITE_URL=https://kernel.so
PORT=8080
```

### Dockerfile

```dockerfile
FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o kernel-mcp .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/kernel-mcp .
EXPOSE 8080
CMD ["./kernel-mcp"]
```

Multi-stage build keeps the final image under 15MB.

## Deployment (Railway)

1. Create a new Railway project, connect the `kernel-mcp` GitHub repo
2. Railway auto-detects the Dockerfile and builds
3. Set environment variables in Railway dashboard
4. Railway assigns a public URL: `https://kernel-mcp-production.up.railway.app`
5. Free tier covers ~500 hours/month — enough for a low-traffic personal site

## Connecting to Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "kernel": {
      "type": "http",
      "url": "https://kernel-mcp-production.up.railway.app/mcp"
    }
  }
}
```

Restart Claude Desktop. The tools `search_docs`, `get_doc`, `list_categories` appear automatically.

## Connecting to Cursor

Add to Cursor Settings → MCP → Add Server:

```json
{
  "kernel": {
    "type": "http",
    "url": "https://kernel-mcp-production.up.railway.app/mcp"
  }
}
```

## Site integration

A "Use with AI" section on the Kernel site shows the config snippets above so users can copy-paste into their tools. One-click copy button, same pattern as the existing `CopyPageButton` component.

## CORS

The server sets permissive CORS headers since MCP clients are desktop apps, not browsers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Health check

`GET /health` returns `{ "ok": true }` — used by Railway for uptime monitoring.
