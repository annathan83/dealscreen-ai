# Review Pipeline

Every meaningful feature should pass through a lightweight team review. The agent coordinates these phases: for new features, apply Plan then Build then Audit; do not mark the feature production-ready until Audit is complete.

## Plan -> Build -> Audit

### Phase 1: Plan
Required reviewers:
- Product Manager
- UX Designer
- Software Architect

Goal:
- confirm the feature belongs in MVP
- simplify scope
- validate workflow and technical design

### Phase 2: Build
Required reviewers:
- Backend Engineer and/or Mobile Engineer
- Software Architect if structure changes materially

Goal:
- implement cleanly
- maintain architecture quality
- avoid unnecessary complexity

### Phase 3: Audit
Required reviewers:
- Security Auditor
- Code Reviewer
- DevOps Engineer if release/deployment is affected

Goal:
- catch vulnerabilities
- catch bugs and maintainability issues
- confirm production readiness

## Approval rule
No feature is production-ready until Audit is complete. The agent drives the pipeline and must not skip or shortcut the Audit phase.
