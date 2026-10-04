# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A self-paced AI engineering course (frontend focus, TypeScript) where Claude acts as the teacher. Content, code comments, NOTES.md and commit messages are in Russian. Progress lives in the table in `README.md`: the ⏳ row is the current module, so "давай дальше" means continuing from there. When a module is done, update the table.

Each lesson is a folder `lessons/NN-topic/` with runnable `.ts` files and a `NOTES.md` summary. From lesson 8 on, lesson code goes into the running project `projects/feedback-inbox/` (an AI feedback inbox); the lesson folder then holds only `LESSON.md` and `NOTES.md`. The per-lesson plan, the current lesson ("Сейчас") and the lesson format are in `README.md`. Commit messages look like `Урок N: <что сделано>`.

## Commands

```bash
npm install
ollama pull qwen2.5:3b          # the model the lesson code uses (README also mentions qwen2.5:7b)
npm run lesson2                 # ...lesson5: each runs one lesson via tsx
npm run lesson6:server          # lesson 6 needs two terminals: API server on :3002
npm run lesson6:web             # Vite dev server, proxies /api -> :3002
npm run inbox:server            # running project projects/feedback-inbox: API server on :3003
npm run inbox:web               # its Vite dev server on :5174, proxies /api -> :3003
npx tsx lessons/<dir>/<file>.ts # run any single lesson file
npx tsc                         # type-check lessons/ and projects/ (noEmit)
```

There are no tests or linter. Add a `lessonN` script to `package.json` for each new lesson.

## Architecture and conventions

- **LLM backend is local Ollama** at `http://localhost:11434`. The model name and URL are hardcoded in each file. `.env.example` exists, but nothing loads it yet.
- Lessons build on each other: raw `fetch` to Ollama's `/api/chat` (lessons 2–3) → a hand-written `node:http` server with streaming (4) → the same server on the Vercel AI SDK (5) → React + `useChat` (6). Servers use plain `node:http`, not Express. Each lesson server has its own port (3000+), so they can run side by side.
- The AI SDK talks to Ollama through `@ai-sdk/openai-compatible` at `http://localhost:11434/v1`.
- **The AI SDK is v7 (`ai@7`, `@ai-sdk/react@4`)**, and its API differs from older docs and training data: `onEnd` instead of `onFinish`, system prompts via `instructions`, and standalone helpers such as `toTextStream`/`pipeTextStreamToResponse` and `toUIMessageStream`/`pipeUIMessageStreamToResponse`. Check the types in `node_modules/ai` before writing SDK code.
- ESM only (`"type": "module"`), TypeScript 7, `allowImportingTsExtensions`, top-level `await` is fine.

## Teaching style

Always reply to the user in Russian.

Explain simply. Give exercises as numbered, concrete steps ("открой X, замени на Y, запусти Z") with copy-paste code and the expected output, not abstract assignments.
