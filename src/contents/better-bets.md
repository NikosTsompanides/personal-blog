---
author: Nikos Tsompanidis
datetime: 2026-09-04T16:00:00Z
title: "Better Bets: A practical framework for making better decisions under uncertainty."
slug: better-bets-a-practical-framework-making-better-decisions-under-uncertainty
featured: true
draft: false
tags:
  - Decision Making
  - Reasoning
  - Strategic Thinking
  - Agentic AI
  - Agent Skills
  - Claude
  - Codex
  - Gemini
  - OpenCode
ogImage: "https://pewylbljypgmyciygfsg.supabase.co/storage/v1/object/public/photos/nikos-tsompanidis-blog-ogImage.webp"
description: What does it take for AI agents to make better decisions, not just execute faster? Better Bets is my attempt to bring structured thinking under uncertainty into everyday decisions, across engineering, product, strategy, hiring, and beyond.
---

# Better Bets: A Decision-Making Framework for AI Agents

I've been reading _[Thinking in Bets: Making Smarter Decisions When You Don't Have All the Facts](https://www.amazon.co.uk/Thinking-Bets-Making-Smarter-Decisions/dp/0735216355)_ by [Annie Duke](https://www.amazon.co.uk/stores/Annie-Duke/author/B001K88E4U?ref=ap_rdr&shoppingPortalEnabled=true) recently, and it made me think about how often we have to make important decisions without having all the information.

We make decisions with incomplete information all the time.

As engineers, we decide whether to introduce a technology, change an architecture, migrate data, or build something in a particular way. Product teams decide what to build. Companies decide which markets to enter. Managers decide who to hire.

Uncertainty runs through all of them, hence I started wondering: what would it look like to teach an AI agent to reason about decisions this way?

That became [better-bets](https://github.com/NikosTsompanides/better-bets).

## The Idea

One of the ideas I took from Thinking in Bets is that a good decision and a good outcome can be different things.

You can make a well-reasoned decision and still get a bad outcome. You can make a poor decision and get lucky. If we judge decisions purely by their outcomes, we risk learning the wrong lesson.

This matters even more when working with AI agents.

Agents are very good at producing answers. They can research, generate alternatives, write code, analyse data and move very quickly from a request to an implementation. But being able to execute quickly doesn't mean the decision is good. AI can make a bad bet more dangerous by making it cheap to execute.

So I wanted to explore a different question:

> Can we make AI agents better decision-making partners, rather than simply better executors?

## The framework

I wanted the framework to be simple enough to use in practice, but strong enough to work across different types of decisions. So, I ended up with five skills:

### 1. Frame

First, understand what we're actually deciding.

A surprising number of decisions start with a _solution_ disguised as a question:

> "Should we introduce Kafka?"

That's not necessarily the real question.

The better question might be:

> "How should we handle our expected event-processing requirements while keeping operational complexity manageable?"

`bet-frame` helps separate facts from assumptions, identify the actual decision, and surface the unknowns that matter.

### 2. Evaluate

Once the bet is clear, ask how big it is.

- How confident are we?
- What's the downside if we're wrong?
- What's the blast radius?
- How reversible is the decision?
- What alternatives exist?

A ten-minute experiment and a customer-data migration shouldn't go through the same decision process.

The size of the bet should determine the amount of thinking we put into it.

### 3. Experiment

If an important uncertainty remains, don't argue about it indefinitely.

Ask:

> What's the cheapest experiment that could meaningfully reduce our uncertainty?

That might be a prototype, benchmark, customer interview, load test, pilot, or something as simple as looking at data we already have. And importantly, decide beforehand what result would change our mind.

Otherwise, an "experiment" can easily become a search for evidence that confirms what we already wanted to do.

### 4. Update

New evidence should change our beliefs.

The goal is to make the best decision we can with the information available, then remain willing to change it.

This is also where the framework becomes useful beyond the initial decision.

We can record what we believed, why we believed it, and what evidence would have changed our mind.

### 5. Review

Eventually, we find out what happened.

This is where the distinction between decision quality and outcome quality becomes important.

A bad outcome doesn't automatically mean the decision was bad.

The review asks:

> Given what we knew at the time, was this a reasonable bet?

And then:

> What did the outcome teach us?

That distinction is important if we actually want to improve our judgment rather than simply become better at explaining past failures.

## Why five skills?

Initially, I considered making this one large decision-making skill, but I changed my mind.

A single framework tends to become a checklist, and checklists are easy to follow without really thinking. Instead, I wanted the skills to follow the life of a decision:

`Frame → Evaluate → Experiment → Update → Review`

Each skill has a clear responsibility, but they can also work together. Most importantly, the process is not meant to be equally heavy for every decision.

A reversible, low-risk decision might need almost no ceremony. A decision involving customer data, security, a major investment, or a difficult migration deserves much more scrutiny.

The framework should scale with the stakes.

## A general-purpose framework

Although my own background is in software engineering, I deliberately didn't make [Better Bets](https://github.com/NikosTsompanides/better-bets) an engineering framework.

The same structure applies surprisingly well to other decisions.

### Product

> "Should we build this feature?"

The interesting questions aren't only about implementation.

What are we assuming about customer demand? How confident are we? What's the cost of building the wrong thing? What's the cheapest way to find out?

### Hiring

> "Should we hire another senior engineer?"

Maybe the assumption is that the team is capacity-constrained. But perhaps the real bottleneck is prioritisation, coordination, or unclear ownership.

Before making a relatively expensive and difficult-to-reverse decision, test the assumption.

### Strategy

> "Should we enter this market?"

You might be highly confident that there is demand, but much less confident that you can acquire customers profitably. Those are different bets. Making them explicit leads to a much better conversation.

## Why build this for AI agents?

This is the part I'm most interested in.

AI makes experimentation much cheaper.

An agent can generate three implementations instead of one. It can benchmark them. It can inspect a codebase, research an unfamiliar technology, build a prototype, challenge an assumption, or analyse a dataset.

That changes the economics of decision-making. We don't necessarily need to debate every uncertain question for three days. Sometimes we can place a small bet, gather evidence, and update.

But AI also introduces a new problem.

- It can produce a very convincing answer to the wrong question.
- It can confidently implement an assumption that was never validated.
- It can make a poor decision look polished.

My Personal opinion?

**The future of AI-assisted work depends on getting agents to reason better before they act, not just execute more autonomously.**

## What I expect from Better Bets

I want it to make decisions more explicit, make uncertainty harder to ignore, encourage cheap experiments where they're useful, and create a record that allows us to learn from decisions later.

I'd also like it to become something that an AI agent can apply naturally rather than something a human has to remember to invoke.

If I ask:

> "Should we migrate this system?"

I don't necessarily want the agent to immediately start writing migration code.

Sometimes the better response is:

> "Before we do that, let's understand what we're betting on."

That's the behaviour I'm interested in.

## What others should expect

Better Bets is a thinking aid, not a magic decision engine.

It won't produce objective probabilities out of thin air or tell you what the "right" answer is.

It is a thinking aid.

Use it when the decision matters enough to justify some structure. Ignore it when the bet is small and reversible.

Challenge it. Adapt it. Use only parts of it if that's more useful.

And if you disagree with the framework, that's probably a good thing too.

The best outcome would not be for everyone to follow it exactly.

It would be for more people, and more AI agents, to get into the habit of asking:

- What are we assuming?
- How confident are we?
- What happens if we're wrong?
- How difficult is it to change course?
- What could we do to learn more?
- And what would make us change our minds?

That's what Better Bets is about.

> Don't try to eliminate uncertainty. Make better decisions in spite of it.

[Better Bets is open source on GitHub.](https://github.com/NikosTsompanides/better-bets)
