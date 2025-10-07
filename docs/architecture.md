# Linea System Architecture

## C4 Level 1: System Context Diagram

```mermaid
graph TB
    subgraph "External Users"
        V[Event Visitors]
        O[Event Owners]
        A[Platform Admins]
    end

    subgraph "External Systems"
        E[Email Service<br/>SendGrid]
        M[Maps Service<br/>OpenStreetMap]
        P[Payment Provider<br/>Stripe]
        AN[Analytics<br/>Plausible]
    end

    subgraph "Linea Platform"
        FE[Frontend<br/>React 18 + Vite]
        API[Backend API<br/>Node.js 24 + Fastify]
        DB[(PostgreSQL<br/>Database)]
        CACHE[(Redis<br/>Session Cache)]
    end

    V --> FE
    O --> FE
    A --> FE

    FE --> API
    API --> DB
    API --> CACHE
    API --> E
    API --> M
    API --> P
    API --> AN
```

## C4 Level 2: Container Diagram

```mermaid
graph TB
    subgraph "User Interface"
        WEB[Web Application<br/>React 18 + Vite<br/>Port 3050]
    end

    subgraph "API Layer"
        GATEWAY[API Gateway<br/>Fastify + Helmet<br/>Port 9050]
        AUTH[Auth Service<br/>Magic Links + JWT]
        EVENTS[Event Service<br/>CRUD + Search]
        WAITLIST[Waitlist Service<br/>Management + Export]
        ADMIN[Admin Service<br/>User Management]
    end

    subgraph "Data Layer"
        POSTGRES[(PostgreSQL<br/>Primary Database)]
        REDIS[(Redis<br/>Session Store)]
    end

    subgraph "External Services"
        SENDGRID[SendGrid<br/>Email Service]
        OSM[OpenStreetMap<br/>Geocoding]
        SENTRY[Sentry<br/>Error Tracking]
    end

    WEB --> GATEWAY
    GATEWAY --> AUTH
    GATEWAY --> EVENTS
    GATEWAY --> WAITLIST
    GATEWAY --> ADMIN

    AUTH --> POSTGRES
    AUTH --> REDIS
    EVENTS --> POSTGRES
    WAITLIST --> POSTGRES
    ADMIN --> POSTGRES

    AUTH --> SENDGRID
    EVENTS --> OSM
    GATEWAY --> SENTRY
```

## C4 Level 3: Component Diagram

```mermaid
graph TB
    subgraph "Frontend Components"
        ROUTER[React Router<br/>Navigation]
        PAGES[Page Components<br/>Home, Event, Portal]
        AUTH_UI[Auth Components<br/>Magic Link Forms]
        FORMS[Form Components<br/>Waitlist, Event Creation]
        MAPS[Map Components<br/>Leaflet Integration]
    end

    subgraph "Backend Services"
        subgraph "API Layer"
            ROUTES[Route Handlers<br/>REST Endpoints]
            MIDDLEWARE[Middleware<br/>Auth, Validation, CORS]
            VALIDATION[Schema Validation<br/>Zod]
        end

        subgraph "Business Logic"
            AUTH_SVC[Auth Service<br/>Magic Link Generation]
            EVENT_SVC[Event Service<br/>CRUD Operations]
            WAITLIST_SVC[Waitlist Service<br/>Management Logic]
            EMAIL_SVC[Email Service<br/>SendGrid Integration]
            MAP_SVC[Map Service<br/>Geocoding & Nearby]
        end

        subgraph "Data Access"
            PRISMA[Prisma ORM<br/>Database Client]
            REDIS_CLIENT[Redis Client<br/>Session Management]
        end
    end

    subgraph "Database Schema"
        USERS[Users Table<br/>Visitors, Owners, Admins]
        EVENTS[Events Table<br/>Event Data]
        WAITLIST[Waitlist Table<br/>Email Subscriptions]
        SESSIONS[Sessions Table<br/>User Sessions]
        AUDIT[Audit Logs<br/>GDPR Compliance]
    end

    ROUTER --> PAGES
    PAGES --> AUTH_UI
    PAGES --> FORMS
    PAGES --> MAPS

    ROUTES --> MIDDLEWARE
    MIDDLEWARE --> VALIDATION
    VALIDATION --> AUTH_SVC
    VALIDATION --> EVENT_SVC
    VALIDATION --> WAITLIST_SVC

    AUTH_SVC --> EMAIL_SVC
    EVENT_SVC --> MAP_SVC
    WAITLIST_SVC --> EMAIL_SVC

    AUTH_SVC --> PRISMA
    EVENT_SVC --> PRISMA
    WAITLIST_SVC --> PRISMA
    AUTH_SVC --> REDIS_CLIENT

    PRISMA --> USERS
    PRISMA --> EVENTS
    PRISMA --> WAITLIST
    PRISMA --> SESSIONS
    PRISMA --> AUDIT
```

## Technology Stack

### Frontend

- **React 18**: Modern UI library with hooks and concurrent features
- **Vite**: Fast build tool and development server
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **React Query**: Server state management
- **Leaflet**: Interactive maps

### Backend

- **Node.js 24**: Latest LTS runtime
- **Fastify**: High-performance web framework
- **TypeScript**: Type-safe development
- **Prisma**: Modern ORM with type safety
- **Redis**: In-memory data store for sessions
- **Zod**: Schema validation
- **Pino**: Fast JSON logger

### Database

- **PostgreSQL 15**: Primary relational database
- **Redis 7**: Session storage and caching

### Infrastructure

- **Railway**: Cloud platform for deployment
- **Docker**: Containerization
- **GitHub Actions**: CI/CD pipeline

### External Services

- **SendGrid**: Email delivery service
- **OpenStreetMap**: Free map tiles and geocoding
- **Sentry**: Error tracking and monitoring
- **Plausible**: Privacy-friendly analytics

## Security Architecture

### Authentication

- **Magic Links**: Passwordless authentication via email
- **JWT Tokens**: Stateless session management
- **Redis Sessions**: Secure session storage
- **Double Opt-in**: GDPR-compliant email verification

### Data Protection

- **HTTPS Everywhere**: All communications encrypted
- **Helmet.js**: Security headers
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM protection

### Privacy Compliance

- **GDPR Compliance**: Data subject rights implementation
- **Audit Logging**: Complete action tracking
- **Data Retention**: Configurable retention policies
- **Consent Management**: Granular consent tracking

## Performance Considerations

### Frontend Optimization

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Service worker for offline support
- **Bundle Size**: Tree shaking and minification

### Backend Optimization

- **Database Indexing**: Optimized queries
- **Redis Caching**: Session and data caching
- **Connection Pooling**: Efficient database connections
- **Compression**: Gzip compression for responses

### Monitoring & Observability

- **Health Checks**: Application health monitoring
- **Error Tracking**: Sentry integration
- **Performance Metrics**: Response time tracking
- **Log Aggregation**: Structured logging with Pino

## Deployment Architecture

### Railway Deployment

- **Automatic Deployments**: Git-based CI/CD
- **Environment Variables**: Secure configuration
- **Health Checks**: Automated health monitoring
- **Scaling**: Automatic horizontal scaling

### Database Management

- **Migrations**: Prisma migration system
- **Backups**: Automated database backups
- **Monitoring**: Database performance tracking
- **Connection Pooling**: Efficient connection management
