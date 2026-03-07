# DealHub AI Expert Prompt Library v2

This folder contains a coordinated team of expert prompts for Cursor.

## Start here (new chat)

In a **new chat**, do this first so the expert system runs correctly:

1. **Bootstrap the expert system** — In your first message, paste the rules below (then add your actual request).
2. **Then state your task** — e.g. *"I want to add a new deal status"* or *"Review the auth flow for security."*

**Copy-paste prompt for first message:**

```
Use the expert system in `/experts` for this project.

Rules:
1. First read `/experts/project_context.md`.
2. Use `/experts/router.md` to choose the right expert.
3. If the problem spans multiple domains, use `/experts/orchestrator.md`.
4. Follow `/experts/review_pipeline.md` for any new feature or major refactor.
5. Have experts consult each other whenever their collaboration rules require it.
6. Return a final answer that shows: which experts were consulted, their main findings, the final recommendation, and next actions.

Do not answer as a generic assistant when the expert system applies.

[Then add your question or task here.]
```

## How to use
1. Put the `experts` folder in the root of your project.
2. Start most multi-domain requests with the Orchestrator.
3. Use the Review Pipeline for new features.
4. Keep `project_context.md` updated as your product evolves.

## Recommended entry points
- Multi-domain problem: `/experts/orchestrator.md`
- Need correct expert: `/experts/router.md`
- New feature planning: Product Manager + UX Designer + Architect
- Security concern: Security Auditor
- Launch readiness: Orchestrator using Product + Architect + Security + DevOps

## Team operating model
- Router chooses the right specialist(s)
- Orchestrator coordinates cross-functional work
- Review Pipeline enforces Plan -> Build -> Audit
