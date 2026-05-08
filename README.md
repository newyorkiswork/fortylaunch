# FortyLaunch CRM

**An operations-focused CRM I built for the FortyLaunch team — voice-first AI orchestrator that captures and structures deal information in the moment, so nothing gets lost as the team scales.**

> **Live:** [fortylaunch.vercel.app](https://fortylaunch.vercel.app)
> **Built for:** the FortyLaunch operations workflow.
> **AI Studio source (round-trip editable):** [ai.studio/apps/drive/1lyYbv2NbJ5oNyL1izOLmmIPCiP2mDHHG](https://ai.studio/apps/drive/1lyYbv2NbJ5oNyL1izOLmmIPCiP2mDHHG)

---

## Why this exists

FortyLaunch operates fast — that is the business. The downside of speed is that information from calls, meetings, contracts, and the long tail of client touches does not always reach the next person on the deal when they need it. As the team scales, "ask whoever was in the room" stops being a workflow.

This CRM is purpose-built for that environment: AI captures and structures information in the moment, the data layer is the source of truth, and a voice-first orchestrator turns the CRM into a control plane the team can actually keep up with.

## What it does

- **Pipeline** — opportunities through `Qualification → Discovery → Proposal → Negotiation → Closed Won → Active Project`, with probability, sentiment, contacts, and project details
- **Contracts** — draft / pending signature / signed lifecycle with an in-app **e-signature pad**, AI summaries, and signer tracking
- **Calendar** — meetings, calls, tasks, and deadlines with attendees and recurrence
- **Interactions** — unified log across phone, video (Zoom / GoogleMeet), in-person, email, Slack, voice notes, and network events; with AI summaries, sentiment, action items, key topics, and expense capture
- **AI agents** — named workers (Email Agent, Web Agent, Field Ops) with roles (Scheduler, Legal, Sales, Analyst) and live status
- **Live voice session (Gemini Live)** — bidirectional real-time voice with declared function-calling tools so the agent can act on the CRM
- **Command bar** — keyboard-first action dispatch across all entities

## How AI is used

- **Gemini Live API** for bidirectional voice. Declared tools include `signContract`, `controlLight`, and other CRM-dispatching functions; tool calls are converted into typed `AIAction` payloads (`SIGN_CONTRACT`, `SCHEDULE_MEETING`, `SEND_DOCUMENT`, `DRAFT_REPLY`, `LOG_ACTIVITY`, `NAVIGATE_*`).
- **Gemini** for contract summaries, interaction summarization, sentiment, and the executive briefing.
- **Typed action contract** between AI and UI. The model never mutates state directly — it emits actions, the app validates and applies them. This keeps the AI honest and the CRM auditable, which is what makes a voice agent usable on a fast-moving sales floor.

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

## What I learned building this for FortyLaunch

Operations-grade AI has to be **deterministic from the user's seat.** A voice agent on a fast-paced sales floor is only useful if every action it takes is typed, auditable, and reversible. That is why I put the `AIAction` contract between Gemini and the UI. Without it, you ship a chat-toy. With it, the CRM becomes a real control plane that scales **with** the team instead of fighting it.

## What's next

- Wire the typed `AIAction` dispatcher into Supabase row-level mutations end-to-end
- Persist live voice sessions as searchable interaction records
- Multi-tenant auth + per-org agent configuration
- Tighter integration with FortyLaunch's existing tooling (calendar / email / Slack sources)
