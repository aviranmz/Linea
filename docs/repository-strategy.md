# Repository & Branch Strategy

## Overview

This document outlines the Git repository structure, branching strategy, and development workflow for the Linea event management platform.

## Repository Structure

### Monorepo Architecture

```
linea/
├── apps/
│   ├── web/          # React 18 frontend application
│   └── api/          # Node.js 24 backend API
├── packages/         # Shared packages (future)
├── docs/            # Project documentation
├── .github/         # GitHub Actions workflows
├── docker/          # Docker configurations
└── scripts/         # Build and deployment scripts
```

### Package Management

- **Package Manager**: pnpm (fast, disk-efficient)
- **Workspaces**: Configured in `pnpm-workspace.yaml`
- **Lockfile**: `pnpm-lock.yaml` (committed to version control)

## Branch Strategy

### Main Branches

1. **`main`** - Production-ready code
   - Protected branch with required reviews
   - Auto-deploys to Railway production
   - Only accepts PRs from `develop`

2. **`develop`** - Integration branch for features
   - Protected branch with required reviews
   - Auto-deploys to Railway staging
   - Merges from feature branches

### Feature Branches

- **Naming**: `feature/TASK-123-description` or `feature/description`
- **Examples**:
  - `feature/user-authentication`
  - `feature/event-crud-operations`
  - `feature/waitlist-management`

### Release Branches

- **Naming**: `release/v1.0.0`
- **Purpose**: Final testing and bug fixes before release
- **Merge**: Into both `main` and `develop`

### Hotfix Branches

- **Naming**: `hotfix/critical-bug-description`
- **Purpose**: Critical production fixes
- **Merge**: Directly into `main` and back to `develop`

## Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# Make changes and commit
git add .
git commit -m "feat: add user authentication system"

# Push and create PR
git push origin feature/user-authentication
```

### 2. Pull Request Process

- **Target**: `develop` for features, `main` for hotfixes
- **Required**: At least 1 reviewer approval
- **Required**: All CI checks must pass
- **Required**: Up-to-date with target branch

### 3. Code Review Guidelines

- **Review Focus**: Code quality, security, performance
- **Testing**: Ensure tests pass and coverage is maintained
- **Documentation**: Update docs for new features
- **Breaking Changes**: Document in PR description

## CI/CD Pipeline

### GitHub Actions Workflows

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Triggers: Push to any branch, PR to main/develop
   - Steps: Lint, TypeCheck, Build, Test
   - Services: PostgreSQL, Redis

2. **Deployment** (Railway Auto-Deploy)
   - **Main Branch**: Deploys to production
   - **Develop Branch**: Deploys to staging
   - **Feature Branches**: Preview deployments

### Quality Gates

- **Linting**: ESLint passes for both frontend and backend
- **Type Checking**: TypeScript compilation without errors
- **Testing**: All tests pass (unit, integration)
- **Build**: Both frontend and backend build successfully

## Commit Convention

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat(auth): add JWT authentication system
fix(api): resolve database connection timeout
docs(readme): update installation instructions
test(api): add integration tests for events endpoint
```

## Version Management

### Semantic Versioning

- **Format**: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Version Bumping

- **Automatic**: Via `npm version` command
- **Manual**: Update `package.json` and create git tag
- **Release**: Create GitHub release with changelog

## Environment Strategy

### Environments

1. **Development** (`dev`)
   - Local development
   - Hot reloading enabled
   - Debug logging

2. **Staging** (`staging`)
   - Pre-production testing
   - Deployed from `develop` branch
   - Production-like configuration

3. **Production** (`prod`)
   - Live application
   - Deployed from `main` branch
   - Optimized for performance

### Environment Variables

- **Local**: `.env.local` (not committed)
- **Staging**: Railway environment variables
- **Production**: Railway environment variables
- **Example**: `.env.example` (committed template)

## Security Considerations

### Branch Protection

- **Main Branch**: Require PR reviews, status checks
- **Develop Branch**: Require PR reviews, status checks
- **Force Push**: Disabled on protected branches

### Secrets Management

- **GitHub Secrets**: CI/CD tokens, API keys
- **Railway Variables**: Database URLs, JWT secrets
- **Local Secrets**: `.env.local` (gitignored)

### Code Security

- **Dependencies**: Regular security audits
- **Secrets**: Never commit secrets to repository
- **Access**: Limit repository access to team members

## Documentation

### Required Documentation

- **README**: Project setup and development guide
- **API Docs**: Swagger/OpenAPI documentation
- **Architecture**: System design and decisions
- **Deployment**: Environment setup and deployment guide

### Documentation Updates

- **New Features**: Update relevant documentation
- **API Changes**: Update Swagger documentation
- **Architecture Changes**: Update architecture diagrams

## Monitoring and Observability

### Logging

- **Structured Logging**: JSON format with correlation IDs
- **Log Levels**: ERROR, WARN, INFO, DEBUG
- **Log Aggregation**: Railway logging system

### Metrics

- **Application Metrics**: Response times, error rates
- **Infrastructure Metrics**: CPU, memory, disk usage
- **Business Metrics**: User registrations, event bookings

### Alerts

- **Error Rate**: Alert on high error rates
- **Response Time**: Alert on slow responses
- **Infrastructure**: Alert on resource exhaustion

## Rollback Strategy

### Deployment Rollback

- **Railway**: Use Railway's rollback feature
- **Database**: Use Prisma migrations for schema rollbacks
- **Code**: Revert to previous commit and redeploy

### Emergency Procedures

- **Critical Issues**: Create hotfix branch from main
- **Data Issues**: Use database backups
- **Communication**: Notify team via Slack/email

## Team Collaboration

### Code Ownership

- **Frontend**: React/TypeScript expertise
- **Backend**: Node.js/API expertise
- **DevOps**: Railway/deployment expertise
- **Cross-functional**: Code reviews across all areas

### Communication

- **Daily Standups**: Progress updates and blockers
- **Code Reviews**: Collaborative code improvement
- **Documentation**: Shared knowledge and decisions

## Future Considerations

### Scalability

- **Microservices**: Potential split of monorepo
- **Database**: Read replicas and sharding
- **Caching**: Redis cluster for session management

### Tooling

- **Monitoring**: Advanced APM tools
- **Testing**: E2E testing with Playwright
- **Security**: SAST/DAST scanning tools

---

_This document should be reviewed and updated regularly as the project evolves._
