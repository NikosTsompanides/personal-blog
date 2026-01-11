---
author: Nikos Tsompanidis
datetime: 2026-01-11T10:00:00Z
title: "Never Miss a Prompt: How to Make Claude Code Send You Mac & Phone Alerts When It Needs You!"
slug: claude-code-notifications
featured: true
draft: false
tags:
  - Software Engineering
  - Best Practices
  - AI tools
  - Claude Code
ogImage: "https://pewylbljypgmyciygfsg.supabase.co/storage/v1/object/public/photos/nikos-tsompanidis-blog-ogImage.webp"
description: If you use Claude Code, you know the frustration of losing focus while it’s quietly waiting for your next input—or finishing a long process without telling you. There’s a built-in feature called hooks that lets you run custom shell commands at key moments in Claude’s lifecycle, like when it needs your attention or finishes a response.
---

# Never Miss a Prompt: How to Make Claude Code Send You Mac & Phone Alerts When It Needs You!

If you use Claude Code, you know the frustration of losing focus while it’s quietly waiting for your next input—or finishing a long process without telling you. There’s a built-in feature called hooks that lets you run custom shell commands at key moments in Claude’s lifecycle, like when it needs your attention or finishes a response.

This guide shows you how to hook into those moments and trigger notifications on macOS using terminal-notifier, and even send messages to your phone with AppleScript (osascript).

## 🧠 What Are Hooks in Claude Code?

Hooks are **user-configured shell commands** that run automatically at specific events inside Claude Code, such as:

- **Notification** — when Claude needs your permission or is idle waiting for your input
- **Stop** — when Claude finishes generating a response
- _…and more events like PreToolUse, PostToolUse, etc._ [Claude Code](https://code.claude.com/docs/en/hooks-guide)

You configure these in a JSON settings file, where you tell Claude _what commands to run_ for each hook event. [Claude Docs](https://docs.claude.com/de/docs/claude-code/hooks)

## 🛠 1. Install and Set Up `terminal-notifier`

On macOS, `terminal-notifier` lets you trigger native system alerts from the command line.

### 📥 Install

Open Terminal and install it with Homebrew:

```bash
brew install terminal-notifier
```

### 🔔 Enable Notifications

After installing, go to **System Settings → Notifications → terminal-notifier** and **turn on “Allow Notifications”** — otherwise macOS won’t show them.

## 🔧 2. Locate or Create Your Claude Hooks File

Hooks live inside settings files that Claude Code reads on startup. You can set them globally or per project:

| Location                             | Scope                 |
| ------------------------------------ | --------------------- |
| `~/.claude/settings.json`            | Global (all projects) |
| `.claude/settings.json` (in project) | Local to that project |

If you don’t have a hooks section yet, you can create one.

## 📄 3. Add a Notification Hook for Waiting & Finished Alerts

Open the hooks file in your editor. For example:

```bash
nano ~/.claude/settings.json
```

Then add a **Notification** section like this:

```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "terminal-notifier -title \"Claude Code\" -message \"Claude is waiting for your input\""
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "terminal-notifier -title \"Claude Code\" -message \"Claude has finished\""
          }
        ]
      }
    ]
  }
}
```

### 🧠 What This Does

- When Claude **waits for input or permission**, you get a **Mac notification**.

- When Claude **finishes a task**, you get another **Mac notification**.

Save and restart your Claude Code session so the new hooks take effect (Claude snapshots hooks at start). [Claude Docs](https://docs.claude.com/en/docs/claude-code/hooks)

## 📱 4. Optional: Send Alerts to Your Phone Using AppleScript

You can extend the notifications to your iPhone using **AppleScript** through `osascript`. Include this in your hook:

```bash
osascript -e 'tell application "Messages"     send "Claude has finished your task!" to buddy "+1234567890" of service "SMS" end tell'
```

> Replace `+1234567890` with your phone number.

You can combine both commands in the same hook — first `terminal-notifier`, then the `osascript` line — so you get **both Mac and phone notifications**.

## 🧪 5. Test Before You Rely On It

Run this in Terminal:

```bash
terminal-notifier -title "Test" -message "Notifications are working"
```

If you see a pop-up, you’re good to go.

To test phone alerts, run the `osascript` snippet manually first.

## 🧠 Best Practices

- Keep your messages short and clear (e.g., _“Claude needs input”_).
- Only enable hooks for the events you really care about.
- Test your commands manually before adding them to hooks.
- Remember Claude loads hooks on startup — restart after changing them. [Claude Docs](https://docs.claude.com/en/docs/claude-code/hooks)

### 📌 Summary

Using Claude Code’s **Notification** and **Stop** hooks, you can make Claude:

✅ Tell you when it’s stuck waiting for input
✅ Alert you when tasks finish
✅ Even send notifications to your phone

All with just a few lines in your settings file and simple tools like `terminal-notifier` and `osascript`. Easy, reliable, and keeps you in control of your workflow.
