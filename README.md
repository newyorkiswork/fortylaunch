# FortyLaunch

**An AI-orchestrated CRM with voice-first command, multi-channel interaction tracking, and contract automation.**

> **Live:** [fortylaunch.vercel.app](https://fortylaunch.vercel.app)
> **AI Studio source (round-trip editable):** [ai.studio/apps/drive/1lyYbv2NbJ5oNyL1izOLmmIPCiP2mDHHG](https://ai.studio/apps/drive/1lyYbv2NbJ5oNyL1izOLmmIPCiP2mDHHG)

## What it is

FortyLaunch is a pipeline-management CRM where every primitive — opportunities, contracts, calendar, interactions, AI agents, files — is reachable from a single **voice-first AI orchestrator** plus a command bar. The user can talk to the CRM in real time, and the AI triggers structured CRM actions through a typed `AIAction` contract.

### Core surfaces

- **Opportunities / pipeline** — `Qualification → Discovery → Proposal → Negotiation → Closed Won → Active Project` with probability, sentiment, contacts, and project details
- **Contracts** — draft / pending signature / signed lifecycle with an in-app **e-signature pad**, AI summaries, and signer tracking
- **Calendar** — meetings, calls, tasks, and deadlines with attendees and recurrence
- **Interactions** — unified log across phone, video (Zoom / GoogleMeet), in-person, email, Slack, voice notes, and network events; with AI summaries, sentiment, action items, key topics, and expense capture
- **AI agents** — named workers (Email Agent, Web Agent, Field Ops) with roles (Scheduler, Legal, Sales, Analyst) and live status
- **Live voice session (Gemini Live)** — bidirectional real-time voice with declared function-calling tools so the agent can act on the CRM
- **Command bar** — keyboard-first action dispatch across all entities

## How AI is used

- **Gemini Live API** for bidirectional voice. Declared tools include `signContract`, `controlLight`, and other CRM-dispatching functions; tool calls are converted into typed `AIAction` payloads (`SIGN_CONTRACT`, `SCHEDULE_MEETING`, `SEND_DOCUMENT`, `DRAFT_REPLY`, `LOG_ACTIVITY`, `NAVIGATE_*`).
- **Gemini** for contract summaries, interaction summarization, sentiment, and the executive briefing.
- **Typed action contract** between AI and UI. The model never mutates state directly — it emits actions, the app validates and applies them. This is what keeps voice a real control plane and not a chat-toy.

## Stack

- **Frontend:** React 19 + TypeScript on Vite 6
- **Routing:** React Router v7 (HashRouter)
- **AI:** `@google/genai` (Gemini + Gemini Live)
- **Data:** Supabase (Postgres + auth)
- **Charts:** Recharts
- **Icons:** Lucide
- **Origin:** scaffolded in Google AI Studio, then extended out

## Run locally

**Prerequisites:** Node.js 18+, microphone permission for the voice features.

```bash
git clone https://github.com/newyorkiswork/fortylaunch.git
cd fortylaunch
npm install

# .env.local
#   GEMINI_API_KEY=...
#   VITE_SUPABASE_URL=...
#   VITE_SUPABASE_ANON_KEY=...

npm run dev
```

## Architecture notes

- App entry: `index.tsx` → `App.tsx`
- Domain types in `types.ts` (Opportunity, Contract, Interaction, Agent, AIAction, etc.)
- Mock seed data in `constants.ts`
- Reusable surfaces in `components/` (Layout, StatsCard, DealCard, NeuralCore, BiometricAuth, SignaturePad, **LiveVoiceSession**, CaptureModal, ClientHub, **CommandBar**, ExecutiveBriefing, ClientOnboarding)
- Services in `lib/`
- `metadata.json` is the AI Studio handshake file — it declares `microphone` and `camera` frame permissions for the voice + capture flows

## What's next

- Wire the typed `AIAction` dispatcher into Supabase row-level mutations end-to-end
- Persist live voice sessions as searchable interaction records
- Multi-tenant auth + per-org agent configuration
