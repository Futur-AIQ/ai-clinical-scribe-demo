# AI Clinical Scribe demo — starter kit

This kit turns the HTML prototype into a Next.js app on Vercel, built by you with Claude Code.

## What's inside

```
ai-clinical-scribe-demo/          ← copy these into your new Next.js project
├── CLAUDE.md                     project guide; Claude Code reads it automatically
├── docs/
│   ├── PROMPTS.md                every prompt, phase by phase, with commit messages
│   ├── prototype.html            the working prototype (open it in a browser to compare)
│   ├── specs/01 … 09             one short spec per phase
│   └── screens/
│       ├── reference/            your 5 original screenshots
│       └── prototype/            31 screenshots of every prototype screen and state
├── seed/                         typed sample data (cases, patients, notes, codes, analytics…)
└── public/                       logo-mark.png (sidebar icon), logo-full.png (wordmark)
```

## Start

1. Open `ai-clinical-scribe-demo/docs/PROMPTS.md` and follow **Phase 0**: create the project, install 3 packages, and copy the kit files in.
2. Run `claude` in the project folder and paste Step 0.1.
3. Continue step by step. Each step names the spec, the screenshots and the prototype functions to look at, so Claude Code reads only what it needs, which keeps you inside Pro plan limits.

## Rhythm per step

Paste the prompt → wait for the summary → `npm run dev` and compare with the named screenshot → fix small differences in the same session → commit. Type `/clear` after each phase.

## Plan

| Phase | What you get | Steps |
|---|---|---|
| 0 | Project set up with the kit | 1 |
| 1 | Design system, sidebar, top bar, all routes | 2 |
| 2 | Sample data and saved demo state | 1 |
| 3 | Dashboard | 1 |
| 4 | Live recording engine and Consultation page | 2 |
| 5 | Note generation, review, approve and sync | 2 |
| 6 | Patients list and patient record | 2 |
| 7 | Notes, Analytics, Billing Codes | 2 |
| 8 | Templates, Integrations, Team, Settings, Help | 2 |
| 9 | Presenter controls, polish, QA, README, deploy | 2 |

After Phase 5 you already have the core demo (record → note → sync) and can deploy early if a client meeting comes up.
