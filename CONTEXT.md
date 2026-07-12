# Ghost Commit

This context defines the language for analyzing a stale GitHub repository and turning evidence into a resurrection plan.

## Language

**Target Repository**:
The GitHub repository a user asks Ghost Commit to analyze.
_Avoid_: Local clone, organization, generated demo

**Repository Snapshot**:
The fetched state used for one analysis, including metadata, recent commits, dependencies, and open issues.
_Avoid_: Live repository state after the analysis finishes

**Staleness Signal**:
Observed evidence that maintenance may be needed, such as inactivity, aging dependencies, or an outdated framework.
_Avoid_: Proof that the project is abandoned

**Resurrection Finding**:
A specific problem or opportunity supported by one or more Staleness Signals.
_Avoid_: Generic best practice, invented defect

**Resurrection Plan**:
An ordered set of actions intended to return the Target Repository to a maintainable, releasable state.
_Avoid_: Marketing summary, automatic code change

**AI Plan**:
A Resurrection Plan produced with the configured model from the Repository Snapshot.
_Avoid_: Guaranteed-correct recommendation

**Heuristic Plan**:
A clearly labelled deterministic fallback used when model access is unavailable.
_Avoid_: AI Plan, hidden mock response

**Plan Step**:
One actionable, verifiable unit in a Resurrection Plan with a reason and expected outcome.
_Avoid_: Vague theme, completed GitHub task

**Issue Publication**:
The explicit write action that creates a GitHub issue containing the current Resurrection Plan.
_Avoid_: Analysis, draft preview, silent repository mutation

**Write Authority**:
The GitHub credential and repository permission required for Issue Publication. Read-only analysis does not imply Write Authority.
_Avoid_: Public repository access, user login alone
