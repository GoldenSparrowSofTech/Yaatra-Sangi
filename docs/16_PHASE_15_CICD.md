# Phase 15 — CI/CD & Release

Git:
main, develop, feature/*, hotfix/*.

CI:
install, lint, typecheck, unit/integration tests, backend build, web build, Flutter analyze/test, security checks.

CD:
staging on develop; controlled production release from main.

Artifacts:
backend Docker image, web production build, Android APK/AAB as needed, iOS archive/IPA according to Apple distribution.

Rollback:
app rollback, DB migration strategy, backups, feature flags.

Exit: tagged release reproducible from Git and deployable.
