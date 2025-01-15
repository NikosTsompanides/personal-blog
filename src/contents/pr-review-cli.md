---
author: Nikos Tsompanidis
datetime: 2025-01-14T18:00:00Z
title: "Introducing the PR Review CLI Tool: An Extra Pair of Eyes for Your Code"
slug: introducing-the-pr-review-cli-tool-an-extra-pair-of-eyes-for-your-code
featured: true
draft: false
tags:
  - Software Engineering
  - Best Practices
  - Refactoring
  - PR Reviews
  - AI
  - Chat GPT
  - Github
ogImage: "https://pewylbljypgmyciygfsg.supabase.co/storage/v1/object/public/photos/nikos-tsompanidis-blog-ogImage.webp"
description: This blog post introduces a PR review CLI tool that leverages OpenAI to automate code reviews, saving time for senior engineers and managers. It generates instant feedback on pull requests, allowing teams to focus more on strategic tasks while ensuring code quality.
---

## Introducing the PR Review CLI Tool: An Extra Pair of Eyes for Your Code

Hey there, fellow developers! Let’s be honest—code reviews can be tough. You spend hours crafting your code, making sure everything works, and then you send it off for review... only to wait. Sometimes you wish there was a way to get a second opinion _immediately_ without waiting for that busy senior engineer to free up. Well, I’ve got something for you.

Over the weekend (because, hey, sometimes that’s when you find time to work on fun stuff), I built a simple CLI tool that automates part of the code review process. It fetches the diff of your Pull Request (PR) from GitHub, uses ChatGPT to analyze it, and then generates a code review in a neat markdown file. All you have to do is provide the PR number, and bam—you’ve got a summary and highlighted issues. Cool, right? Here you can check it out: https://github.com/NikosTsompanides/pr-reviewer-cli

Now, before you think this tool is trying to replace human reviewers, let’s put that to rest. It’s not about taking over your job (don't worry, your job security is safe). The idea is to give you an extra pair of eyes. Sometimes we, humans, get tired, miss small things, or forget to check for certain things after hours of work. That’s where this tool comes in. It does a quick check so you can focus on the big picture stuff—like architectural decisions, not whether the semicolon is in the right place.

The best part? This is just the beginning. We can easily automate this in our CI pipeline and set it up to run every time a PR is marked as “Ready for Review.” Imagine the time saved when you’ve got an AI-backed second opinion giving you feedback before a senior engineer even looks at your code. It’s like adding a helpful sidekick to your team, without the awkward high-fives.

## How the PR Review CLI Tool Works: A Sneak Peek Under the Hood

This tool allows you to pass in a few parameters:

- `owner`: GitHub repository owner
- `repo`: The repository name
- `pr`: Pull request number
- `filename`: File name to save the review (defaults to PR\_<pr_number>\_Review)
- `folder`: Folder where reviews will be saved (defaults to ./reviews)
- `override`: If set to true, it will override an existing review file if found

So, how does this magical tool actually work? Well, it’s pretty straightforward, really. The tool leverages two powerful things: GitHub’s API and ChatGPT. When you give it a PR number, it fetches the diff from GitHub, sends that diff over to ChatGPT, and receives a well-structured code review in return. Think of it like sending your code to a reviewer who’s super fast, never sleeps, and only focuses on the details.

Here’s a basic rundown of what’s happening behind the scenes:

1. Fetching the Diff: We first use GitHub's API to fetch the diff for the given PR.
2. Trimming the Diff: The diff is trimmed to avoid sending too much content to OpenAI (because, well, it can get messy!).
3. Sending to ChatGPT: The trimmed diff is then sent to OpenAI for analysis.
4. Generating the Review: Once the review is received, it’s saved in the markdown format inside the specified folder.

### Here’s how you can use the tool:

Once you’ve installed the tool and set up your environment variables, you can easily run the CLI to fetch a pull request diff, analyze it, and generate a review. Here’s a sample command you would run in your terminal:

```bash
npm run start -- --owner "your-github-username" --repo "your-repository-name" --pr 1234 --filename "PR_1234_Review" --folder "./reviews" --override true
```

### What Do You Get Out of It?

After running the CLI tool, you get a neatly formatted markdown file with a summary and suggestions from ChatGPT. The review will look something like this:

```markdown
# Code Review for PR #12345

### Summary:

- Good job overall! The changes are mostly clear and easy to follow.
- A few minor issues that should be addressed before merging.

### Issues:

- **Line 32**: Consider using `const` instead of `let` for variables that don't change.
- **Line 56**: The function name could be more descriptive (e.g., `calculateTotal` instead of `doStuff`).

### Suggestions:

- Add more comments explaining the purpose of the new feature.
- Try using `async/await` for cleaner asynchronous code.
```

## I'm a Senior Engineer/Tech Lead/Manager. Can this tool help me?

PR reviews are an essential part of maintaining code quality, but let’s face it — they can be time-consuming. As a Tech Lead, Senior Engineer, or Engineering Manager, your time is precious. Between overseeing architectural decisions, leading teams, and making high-level strategic choices, you don’t always have the bandwidth to dive deep into every single PR.

That’s where the PR Review CLI Tool comes in. By automating the **first layer** of feedback on PRs, this tool can help you cut down the time spent on reviewing each request. Instead of spending your time manually going through line-by-line changes, you can rely on the tool to provide an instant code review. It checks for common issues, suggests improvements, and gives you a starting point for your feedback.

This allows you to focus on what really matters — guiding your team, making critical decisions, and overseeing the larger picture, rather than getting bogged down by every minor detail in a PR. It’s like having a trusted assistant who can review code 24/7, so you can be more efficient and effective in your role.

It’s a win-win situation for both the senior team members who can spend more time on strategic tasks, and the less experienced engineers who get faster feedback and can move through the process quicker. So, with just a few minutes of setup, you can help streamline your team’s workflow and boost productivity across the board.

## Future Improvements: What's Next for the PR Review CLI Tool?

While this tool is already a neat little sidekick for your development workflow, there’s always room for improvement (and let's be honest, what developer doesn’t love a good upgrade?). Here are some of the exciting features and improvements I'm thinking about for the next versions of the tool:

### 1. **GitHub Action Integration**

One of the most obvious next steps is to integrate this CLI tool directly into our CI/CD pipeline with GitHub Actions. This would allow the tool to automatically run every time a PR is marked as “Ready for Review,” giving instant feedback without any manual effort. Imagine the speed: you push your code, and within minutes, you get feedback directly on the PR!

### 2. **More Granular Feedback**

Right now, ChatGPT gives a general code review, but we can make it smarter. For example, we could fine-tune the model to provide feedback on specific areas like security vulnerabilities, performance optimizations, or adherence to company coding standards. By narrowing the focus, we can provide more precise, actionable insights.

### 3. **Handling Larger PRs**

Sometimes, PRs are just... big. Super big. I'm considering adding functionality to split large PR diffs into smaller chunks to avoid overwhelming ChatGPT (or the poor developer reading the feedback). This would ensure that reviews are thorough without missing important details, even in massive PRs.

### 4. **Interactive Reviews**

Why stop at generating a static markdown file? The future might bring the option to have interactive reviews where the tool can leave comments directly on the PR in GitHub. Instead of just generating a markdown file, it would post the review comments to the PR itself, making it even easier to track feedback.

### 5. **Customizable Prompts**

Not every project or team wants the same kind of feedback. I'm thinking of adding an option to customize the review prompt. Want ChatGPT to focus more on readability than performance? Or maybe you want a more thorough analysis of edge cases? With a customizable prompt, you’ll be able to fine-tune what the tool checks for in each PR.

These are just a few ideas we’ve got on our radar. As with any tool, the goal is to keep making it more useful, faster, and more in tune with the needs of the developers using it. Stay tuned for more updates, and feel free to pitch in with your own suggestions—we’d love to make this tool even better with your help!

## Drawbacks of Using an Automated PR Review Tool

While the PR Review CLI Tool can certainly save time and provide valuable feedback, it’s important to recognize that **it’s not a perfect replacement** for human code review. Here are a few drawbacks to keep in mind:

1. **Lack of Context**: One of the biggest challenges for an AI tool is understanding the full context of a pull request. While the tool can analyze the code and suggest improvements, it doesn't know the business goals, specific project requirements, or nuances of the system you're working on. Sometimes, code decisions are made for reasons that aren’t immediately obvious to a machine, and only a human reviewer can provide that crucial insight.

2. **Inability to Catch Complex Logic Issues**: Automated tools like this can be great for spotting common issues like formatting mistakes or minor inconsistencies, but they often miss deeper issues in logic, architecture, or design decisions. Complex edge cases or interdependencies between different parts of the system might be overlooked by the AI, and only a skilled human reviewer will catch those.

3. **Over-Reliance on Automation**: There’s always a risk that engineers might rely too heavily on the automated review and not give the code a thorough human check. A good code review involves more than just identifying bugs — **it’s about mentorship, collaboration, and discussing design choices with the team**. If developers start skipping these critical conversations in favor of relying solely on AI, the overall quality and health of the codebase could suffer.

4. **Potential for Inaccurate or Vague Feedback**: While OpenAI’s GPT model is impressive, it’s not infallible. Sometimes, the feedback generated might be inaccurate, vague, or not entirely relevant to the specific PR. It’s important to treat the AI-generated review as a suggestion, not a final judgment. A human should always validate the feedback to ensure its relevance and accuracy.

While the tool is a fantastic aid, it should be seen as just one part of the review process. It’s there to complement, not replace, the human element in PR reviews. With the right balance, you can leverage the tool to speed up the review process while still maintaining high-quality, thoughtful feedback from your team.

## Conclusion

In conclusion, the PR Review CLI Tool is a powerful assistant to streamline and speed up your code review process. It helps senior engineers, tech leads, and managers save time on repetitive tasks, giving them more space to focus on strategic decisions and team growth. While it’s not a replacement for human judgment, it provides a solid foundation for feedback that can accelerate your workflow and reduce friction for less experienced developers.

As with any tool, it’s all about finding the right balance. When used in conjunction with thorough human reviews, this tool can enhance productivity, improve the quality of your PRs, and ultimately help your team ship better software faster. So give it a try, and let us know how it works for you!
