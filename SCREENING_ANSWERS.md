# Screening Answers

No explicit screening questions were listed in this job posting. The following are prepared answers for the implied questions a client with this background would likely ask.

---

**FastAPI production experience?**

3+ years with FastAPI in production. Familiar with uvicorn worker lifecycle, startup/shutdown event hooks, and async session state patterns — the exact surface where your blank-session bug lives. Demo: {VERCEL_URL}

---

**Comfortable debugging async Python?**

Yes. The session persistence issue reads like an async initialization race — the kind where lifespan context or dependency injection fires before the store is ready. I'd isolate it with startup logs before touching anything the test suite covers.

---

**React/TypeScript proficiency?**

5+ years with React + TypeScript. The frontend phase caching issue (re-running completed phases) is typically a stale closure or missing dependency in a useEffect. The demo covers how I'd handle the phase state: {VERCEL_URL}
