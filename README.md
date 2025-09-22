# Linea - Event Management Platform

A modern event management platform with email-only access, waitlist functionality, and comprehensive owner/admin portals.

## 🚀 Quick Start

### Prerequisites

- Node.js 24+
- pnpm 8+
- PostgreSQL 15+
- Redis 7+

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd linea
   pnpm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database setup:**
   ```bash
   pnpm db:push
   pnpm db:seed
   ```

4. **Start development servers:**
   ```bash
   pnpm dev
   ```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Node.js 24 + Fastify + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Deployment**: Railway
- **Email**: SendGrid
- **Analytics**: Privacy-friendly (Plausible/Matomo)

### Project Structure

```
linea/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # Fastify backend
├── packages/
│   ├── shared/       # Shared types and utilities
│   ├── ui/           # Component library
│   └── config/       # Shared configuration
└── docs/             # Documentation
```

## 🎯 Features

### MVP Features
- Email-only visitor authentication (magic links)
- Event pages with waitlist functionality
- Owner portal for event management
- Admin portal for platform management
- GDPR compliance
- Mobile-first responsive design
- Milano Design Week inspired theme

### Future Features
- Payment integration
- Maps and nearby suggestions
- Advanced analytics
- Multi-language support (EN/IT)

## 🛠️ Development

### Available Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all packages
- `pnpm typecheck` - Type check all packages

### Database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Reset database
pnpm db:reset

# Seed database
pnpm db:seed
```

## 🚀 Deployment

The application is deployed on Railway with automatic deployments from the main branch.

### Environment Variables

See `.env.example` for required environment variables.

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./docs/contributing.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Project Board](https://app.asana.com/1/1211186475239403/project/1211419367649012/board/1211420999627060)
- [API Documentation](https://api.linea.app/docs)
- [Production Site](https://linea.app)
