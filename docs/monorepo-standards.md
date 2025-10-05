# Monorepo Standards & Development Guidelines

This document outlines the development standards and practices for the Linea monorepo.

## 📁 Project Structure

```
linea/
├── apps/                    # Applications
│   ├── api/                # Backend API (Fastify + Prisma)
│   └── web/                # Frontend (React + Vite)
├── packages/               # Shared packages
│   ├── config/             # Shared configuration
│   ├── shared/             # Shared utilities
│   └── ui/                 # Shared UI components
├── config/                 # Environment configurations
├── docs/                   # Documentation
└── scripts/                # Build and utility scripts
```

## 🛠️ Development Standards

### Code Style

- **Prettier**: Automatic code formatting
- **ESLint**: Code linting with TypeScript support
- **EditorConfig**: Consistent editor settings
- **Conventional Commits**: Standardized commit messages

### TypeScript Configuration

- Strict mode enabled
- Path mapping for clean imports
- Consistent target: ES2022
- Source maps for debugging

### Package Management

- **pnpm**: Fast, disk space efficient package manager
- **Workspaces**: Monorepo package management
- **Engines**: Node >=24.0.0, pnpm >=8.0.0

## 🚀 Available Scripts

### Root Level Commands

```bash
# Development
pnpm dev                    # Start all services in development
pnpm build                  # Build all packages
pnpm start                  # Start production API

# Code Quality
pnpm lint                   # Lint all packages
pnpm lint:fix               # Fix linting issues
pnpm format                 # Format code with Prettier
pnpm format:check           # Check code formatting
pnpm typecheck              # Type check all packages

# Testing
pnpm test                   # Run all tests
pnpm clean                  # Clean all build artifacts
```

### Package-Specific Commands

```bash
# API (Backend)
pnpm --filter @linea/api dev
pnpm --filter @linea/api build
pnpm --filter @linea/api start

# Web (Frontend)
pnpm --filter @linea/web dev
pnpm --filter @linea/web build
pnpm --filter @linea/web preview
```

## 📝 Commit Standards

### Conventional Commits

All commits must follow the conventional commit format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks
- `revert`: Reverting changes

### Examples

```bash
feat(auth): add magic link authentication
fix(api): resolve database connection timeout
docs(readme): update installation instructions
style(ui): format components with prettier
```

## 🔧 Pre-commit Hooks

Husky is configured to run the following checks before each commit:

1. **Lint-staged**: Run ESLint and Prettier on staged files
2. **Commitlint**: Validate commit message format
3. **Type checking**: Ensure TypeScript compilation

## 📦 Package Dependencies

### Root Dependencies

- **TypeScript**: ^5.3.0
- **Prettier**: ^3.1.0
- **ESLint**: ^8.0.0
- **Husky**: ^8.0.0
- **Commitlint**: ^18.0.0

### Workspace Dependencies

Each package manages its own dependencies while sharing common dev dependencies from the root.

## 🏗️ Build Process

1. **Type Checking**: All TypeScript files are type-checked
2. **Linting**: ESLint runs on all source files
3. **Formatting**: Prettier ensures consistent code style
4. **Testing**: Jest/Vitest runs all tests
5. **Building**: Each package builds independently

## 🚀 Deployment

- **Development**: `pnpm dev` starts all services
- **Production**: `pnpm build && pnpm start`
- **Individual Services**: Use `--filter` to target specific packages

## 📋 Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] ESLint passes without errors
- [ ] Prettier formatting is applied
- [ ] Tests pass
- [ ] Commit message follows conventional format
- [ ] No console.log statements in production code
- [ ] Proper error handling implemented
- [ ] Documentation updated if needed

## 🔍 Troubleshooting

### Common Issues

1. **ESLint Errors**: Run `pnpm lint:fix` to auto-fix issues
2. **Prettier Conflicts**: Run `pnpm format` to format code
3. **Type Errors**: Run `pnpm typecheck` to identify issues
4. **Build Failures**: Check individual package configurations

### Getting Help

- Check package-specific README files
- Review ESLint and Prettier configurations
- Ensure all dependencies are installed with `pnpm install`
