Hi,

Blank sessions on restart is almost always a race condition between uvicorn's worker init and your session store load. Built a working demo of the appraisal pipeline: {VERCEL_URL}

The demo covers phase state persistence and the frontend caching bug where completed phases re-trigger. Both are fixable without touching your 692-test baseline.

Done similar work on a multi-phase async pipeline (Fleet Maintenance SaaS) — same class of startup sequencing problem.

One thing that'd help: is your session store SQLite, Redis, or in-memory? That changes where the race lives.

Quick call to walk through the fixes, or I can scope the first milestone async. Your pick.

Humam

P.S. Happy to record a Loom walkthrough of the demo if that's easier.
