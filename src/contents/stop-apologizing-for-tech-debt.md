---
author: Nikos Tsompanidis
datetime: 2025-07-20T09:00:00Z
title: "Stop Apologizing for Tech Debt"
slug: stop-apologizing-for-tech-debt
featured: true
draft: false
tags:
  - Software Engineering
  - Best Practices
  - Tech Debt
  - Engineering Investment
ogImage: "https://pewylbljypgmyciygfsg.supabase.co/storage/v1/object/public/photos/nikos-tsompanidis-blog-ogImage.webp"
description: Discover why tech debt isn't always a problem. It's often a strategic engineering investment. Learn how to manage it for long-term velocity and impact.
---

# Stop Apologizing for Tech Debt

**Tech debt** has become a catch-all term, one that's often misunderstood, or simply used as shorthand for "stuff we don't like." But what if we're framing it all wrong?

Instead of thinking about tech debt as a **liability**, it’s time to start thinking of it as an **engineering investment**. Like any investment, it has costs, yields, risks, and returns. But when handled strategically, it can power innovation and scale, not just cause outages and frustration.

## Rethinking What Tech Debt Really Means

People often see tech debt as a list of problems:

- Messy code we wish we could rewrite
- Outdated systems we’re stuck maintaining
- Quick fixes we now regret
- Tools and infrastructure that barely hold together

It can feel like everything that went wrong.
But in many cases, what we call “tech debt” isn’t a mistake — it’s a **decision**.

Here are some examples of that:

- We moved quickly instead of perfecting every detail and that helped us learn faster.
- We built a simple system because we didn’t yet know which parts would need to scale.
- We skipped tests in the early stages to see if the idea was even worth pursuing.

These weren’t careless choices, they were practical responses to the **reality of the moment**.

## The ROI of Engineering Choices

Not every quick fix or shortcut is a mistake. Many are smart decisions made with limited time, people, or information. Thinking of them as **investments** — not just **“tech debt”** — can change how we manage them.

Here’s how that might look in practice:

- **Skipping abstractions:**
  Helps ship faster early on, especially when the future shape of the system is unclear.

  - ✅ Benefit: Faster progress
  - ⚠️ Cost: Harder to update or extend later

- **Doing things manually instead of automating:**
  Makes sense when you're testing a process or still learning what users need.

  - ✅ Benefit: Saves upfront development time
  - ⚠️ Cost: Wastes team time at scale

- **Tightly connected parts of the system (instead of modular ones):**
  Easier to build when you're starting out, before the system grows complex.

  - ✅ Benefit: Quicker initial build
  - ⚠️ Cost: Changes in one area can break others later

These decisions aren't wrong — they’re **practical, often necessary**. But they do come with a cost over time, like:

- More time spent fixing bugs
- Slower development as things get harder to change
- Confusion for new team members

That’s why it’s important to:

- **Track** these decisions as they happen.
- **Review them regularly**.
- **Choose when to go back and improve them**, like any other kind of investment.

## Compounding Interest Isn’t Always Bad

**Interest is the cost of waiting** and in the case of engineering debt, that could mean:

- More time spent onboarding
- Bugs from legacy code paths
- Slower release cycles
- Rewrites that cost double what refactors would have

But like real-world investing, **some debt pays off before it costs you**. Smart engineers know how to balance debt with velocity.

High-growth startups often take on large amounts of "debt" to move quickly and succeed because of it, not in spite of it.

## Cultural Shift: From Shame to Strategy

Tech debt is often a source of shame. But if the culture shifts to:

- Transparency over perfection
- Investment thinking over reactivity
- Proactive planning over firefighting

Then we can empower teams to manage it like any other form of capital.

Let your teams say:

“We’re incurring this debt **intentionally** because speed matters right now and we have a plan to revisit it in Q3.”

That’s a powerful, strategic posture not technical guilt.

## How I Handle Tech Debt in Practice

When I spot areas of the codebase that need improvement, I don’t let them slip away. I create clear, scoped tickets and add them to the engineering backlog, not as chores, but as part of our ongoing investment. I also try to carve out time each quarter to revisit and refactor these areas, especially once the pressure of initial delivery has passed. This way, we stay agile in the short term without losing sight of long-term quality.

## Final Thought

Let’s stop demonizing **“tech debt”** and start managing **engineering investments** like the business-critical assets they are. We don’t need less debt. We need **better** debt, **tracked** with intent and paid down with purpose.

Because great engineering isn’t perfect — it’s strategic. It’s about making smart bets and knowing which trade-offs are worth it.
