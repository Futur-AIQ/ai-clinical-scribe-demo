# AI Clinical Scribe — live demo

A clickable demo of Hansa Technologies' **AI Clinical Scribe**. A doctor records a consultation, the AI transcribes it live, builds a summary and billing codes, drafts a SOAP note, and syncs it to the EMR.

**It is a demo.** There is no backend, no microphone, no real AI and no real EMR. Three scripted consultations (fever, diabetes follow-up, cardiology) play back as if they were live. Every name, record and code is fictional. Anything you change (notes, patients, settings) is saved only in your browser's localStorage, under `acs-demo-v1`.

## Run it locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). It redirects to the Dashboard.

| Command | What it does |
|---|---|
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Presenter tips

- **Reset before each client session.** Click the **Demo · Sample data** badge at the bottom left, then **Reset → Confirm reset**. This clears everything created in this browser and returns to the Dashboard.
- **Press Space to start.** On the Dashboard or the Consultation page, Space opens the visit picker; while recording, it pauses and resumes. **F** finishes the visit and **N** adds a note.
- **Use 2× speed for live demos.** A visit takes about 70–85 seconds at 1×. At 2× the summary and codes still fill in visibly, and the visit takes under a minute. Set the speed in the presenter panel or the visit picker.
- The presenter panel also opens from the profile menu (**Presenter controls**). Your client never sees it unless you open it.
- A good path to show: Dashboard → Space → Diabetes follow-up → Finish & Generate Note → edit a section, adjust a code → Approve & Sync → the note is Completed in Notes and appears at the top of the patient's visit history.

## Deploy

Deploy: import the GitHub repo in Vercel, framework Next.js, no environment variables.

No `vercel.json` is needed.

## Stack

Next.js (App Router) with TypeScript, Tailwind CSS v4, `zustand` for state, `lucide-react` for icons. Charts are hand-written SVG. The specs that describe each screen are in `docs/specs/`, and the prototype screenshots are in `docs/screens/`.
