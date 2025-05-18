---
author: Nikos Tsompanidis
datetime: 2025-04-27T18:00:00Z
title: "Enhancing the PR Reviewer CLI: Now with MCP Server Support 🎉"
slug: pr-reviewer-mcp-server-support
featured: true
draft: false
tags:
  - Software Engineering
  - PR Reviews
  - AI
  - GPT
  - Github
  - MCP Server
ogImage: "https://pewylbljypgmyciygfsg.supabase.co/storage/v1/object/public/photos/nikos-tsompanidis-blog-ogImage.webp"
description: This blog explains how to set up an MCP server that handles PR review requests by integrating GitHub and OpenAI APIs. It covers the code's structure, tool handlers, and the server's communication mechanism, providing an overview of automating PR reviews.
---

# Enhancing the PR Reviewer CLI: Now with MCP Server Support

Hey fellow developers! Remember that PR Review CLI tool I shared a few weeks ago? Well, I've been busy adding some exciting new functionality that takes it to the next level. Today, I'm thrilled to introduce MCP server support for our PR reviewer tool, allowing you to use it with Claude client and other MCP-compatible clients.

## What is the MC Protocol? A Quick Overview

If you haven't heard of it yet, the Model Context Protocol (MCP) is a standardized way for AI tools to communicate with each other. Think of it as the common language that lets different AI assistants and tools talk to each other seamlessly. With MCP, Claude and other AI assistants can directly interact with tools like our PR reviewer without any complex integration work on your part.

The beauty of MCP lies in its simplicity and flexibility. It allows tools to expose their functionality through a consistent interface, making it incredibly easy to extend the capabilities of AI assistants. When an assistant needs to perform a specific task—like reviewing a PR—it can simply call the appropriate MCP-compatible tool and get the results back in a standardized format.

You can learn more on the Model Context Protocol's Documentation page: https://modelcontextprotocol.io/introduction

## The PR Reviewer as an MCP Server Tool: How It Works

With our new implementation, the PR reviewer now functions as an MCP tool that any compatible client can access. This means you can ask Claude or another assistant to review your PR, and they'll seamlessly connect to our tool to fetch, analyze, and present the results—all without you having to manually run commands or switch between different interfaces.

Here's how the flow works:

1. You ask your assistant (like Claude) to review a specific PR
2. The assistant recognizes this task and calls our PR reviewer MCP resource
3. Our tool fetches the PR diff from GitHub
4. The tool analyzes the code and generates a review
5. The results are sent back to the assistant, which presents them to you in a clean, readable format

The entire process happens in seconds, giving you instant feedback on your code without interrupting your workflow.

## What does the server look like?

The main purpose of the code is to set up an MCP server that listens for requests to review PRs and responds with a generated review. It uses a few key components like:

- **MCP Server Transport**: To connect the server to the environment (stdin/stdout in this case).
- **Tool Handlers**: To define how the server will handle different types of requests.
- **GitHub and OpenAI Integration**: To fetch PR details and generate reviews based on those details.

Let's break it down step-by-step.

### 1. Imports and Setup

The first part of the code imports various modules needed to set up the server and handle specific tasks like processing request data, making API calls, and handling the review generation:

```ts
//Used to set up a connection to the server via standard input/output (stdio). It allows the server to interact with the environment.
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// .... rest of the imports
```

### 2. Setting up Tool Handlers

The core functionality of the MCP server lies in defining how it handles incoming requests. The two tool handlers defined here are for listing tools and calling a specific tool (in this case, the PR review tool).

```ts
// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [PRReviewer.definition],
}));
```

The `ListToolsRequestSchema` handler simply responds with a list of available tools, in this case, the `PRReviewer`. This allows clients to discover which tools they can interact with.

Next, the handler for the `CallToolRequestSchema` is defined to process the request when a client calls the review tool:

```ts
server.setRequestHandler(CallToolRequestSchema, async request => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case PRReviewer.name: {
        const { pr, owner, repo } = ReviewDetails.parse(args);
        const { GITHUB_TOKEN, OPENAI_API_KEY } = EnvVariables.parse(
          process.env
        );

        const openAIClient = createOpenAIClient(OPENAI_API_KEY);
        const githubClient = createGithubClient(GITHUB_TOKEN);

        const review = await generateReview(
          { pr, owner, repo },
          { openAIClient, githubClient, logger: console }
        );

        return {
          content: [{ type: "text", text: review }],
        };
      }
      // we can add more tool cases here in the future...
      // case ArchitectureReviewer.name

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: errorMessage }],
      isError: true,
    };
  }
});
```

This handler does a few important things:

- **Parsing Request Arguments**: It extracts necessary parameters like the PR number, repository owner, and repo name from the incoming request.
- **Environment Variables**: It fetches the GitHub token and OpenAI API key to authenticate requests to the respective services.
- **Generating Review**: The main logic here is to generate the PR review by calling `generateReview` service, which interacts with both GitHub (to get PR details) and OpenAI (to generate the review).
- **Error Handling**: If something goes wrong, it catches the error and returns an error message in the response.

### 3. Starting the Server

Finally, the `runServer` function is responsible for starting the server by connecting it to the StdioServerTransport:

```ts
// Start server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Secure MCP Server running on stdio");
}

runServer().catch(error => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
```

This establishes the server connection and handles any fatal errors that might occur during startup. Once connected, the server is ready to accept requests for tool execution.

You can find more about the implementation in the Github Repo: https://github.com/NikosTsompanides/pr-reviewer-cli

## Setting Up the MCP Server for AI Clients

Setting up the MCP server is straightforward. All you need to do is clone the repository, build the code, and add our MCP server to your client’s configuration.

For example your configuration should look like this:

```json
{
  "mcpServers": {
    "pr-reviewer-mcp": {
      "command": "npx",
      "args": ["-y", "absolute/path/to/server's/index.js"],
      "env": {
        "PATH": "<path_to_your_node_bin>",
        "GITHUB_TOKEN": "<your_github_token_here>",
        "OPENAI_API_KEY": "your_open_ai_api_key_here"
      }
    }
  }
}
```

## Demo

![Demo](https://github.com/NikosTsompanides/personal-blog/blob/main/src/assets/gifs/pr-reviewer-mcp-demo.gif?raw=true)

## Conclusion

By adding MCP server support to our PR Review CLI tool, we've taken a significant step toward a more integrated, AI-enhanced development workflow. Now, instead of context-switching between different tools, you can ask your favorite assistant to review your PR and get instant, actionable feedback without leaving your current environment.

This is just the beginning of what's possible when we combine specialized development tools with the conversational interfaces of modern AI assistants. I'm incredibly excited to see how others will use this capability to streamline their workflows and ship better code faster.

Give it a try, and let me know what you think! And if you have ideas for how we can make the MCP integration even better, I'd love to hear them.
