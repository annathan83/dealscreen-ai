# Cursor Usage Prompts

## Standard system-use prompt
Use the expert system in `/experts` for this project.

Rules:
1. First read `/experts/project_context.md`.
2. Use `/experts/router.md` to choose the right expert.
3. If the problem spans multiple domains, use `/experts/orchestrator.md`.
4. Follow `/experts/review_pipeline.md` for any new feature or major refactor.
5. Make experts consult each other whenever their collaboration rules require it.
6. Return a final answer that shows:
   - which experts were consulted
   - their main findings
   - the final recommendation
   - next actions

Do not answer as a generic assistant when the expert system applies.
