# Data Model & Database Schema

## Overview
This document describes the database schema, data models, and migration strategy for the Linea event management platform.

## Database Technology
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5.x
- **Migrations**: Prisma Migrate
- **Connection Pooling**: Built-in Prisma connection pooling

## Core Entities

### 1. User Management

#### User
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      UserRole @default(VISITOR)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  // Relations
  ownedEvents     Event[]        @relation("EventOwner")
  waitlistEntries WaitlistEntry[]
  sessions        Session[]
  auditLogs       AuditLog[]

  @@map("users")
}
```

**Purpose**: Central user entity supporting multiple roles
**Key Features**:
- Soft deletion with `deletedAt`
- Role-based access control
- Email as unique identifier
- Audit trail through relations

#### User Roles
```prisma
enum UserRole {
  VISITOR  // Anonymous users, can join waitlists
  OWNER    // Event creators and managers
  ADMIN    // Platform administrators
}
```

### 2. Event Management

#### Event
```prisma
model Event {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  description String?
  status      EventStatus @default(DRAFT)
  startDate   DateTime
  endDate     DateTime?
  capacity    Int?
  youtubeUrl  String?
  mapLat      Float?
  mapLng      Float?
  mapZoom     Int?
  ownerId     String
  venueId     String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  deletedAt   DateTime?

  // Relations
  owner    User           @relation("EventOwner", fields: [ownerId], references: [id])
  venue    Venue?         @relation(fields: [venueId], references: [id])
  waitlist WaitlistEntry[]

  @@index([slug])
  @@index([startDate])
  @@index([status])
  @@map("events")
}
```

**Purpose**: Core event entity with full lifecycle management
**Key Features**:
- SEO-friendly slugs
- Flexible date handling (start/end)
- Geographic coordinates for maps
- YouTube integration
- Capacity management
- Soft deletion

#### Event Status
```prisma
enum EventStatus {
  DRAFT      // Being created/edited
  PUBLISHED  // Live and visible
  CANCELLED  // Cancelled by owner
  COMPLETED  // Event has ended
}
```

### 3. Venue Management

#### Venue
```prisma
model Venue {
  id          String   @id @default(cuid())
  name        String
  address     String
  city        String
  country     String
  latitude    Float?
  longitude   Float?
  website     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  // Relations
  events Event[]

  @@map("venues")
}
```

**Purpose**: Venue information and location data
**Key Features**:
- Full address information
- Geographic coordinates
- Website links
- Reusable across multiple events

### 4. Waitlist Management

#### WaitlistEntry
```prisma
model WaitlistEntry {
  id        String         @id @default(cuid())
  email     String
  eventId   String
  userId    String?
  status    WaitlistStatus @default(PENDING)
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
  deletedAt DateTime?

  // Relations
  event Event @relation(fields: [eventId], references: [id])
  user  User? @relation(fields: [userId], references: [id])

  @@unique([email, eventId])
  @@index([eventId])
  @@index([email])
  @@map("waitlist_entries")
}
```

**Purpose**: Waitlist management for events
**Key Features**:
- Email-based waitlist (no account required)
- Optional user association
- Status tracking
- Duplicate prevention with unique constraint

#### Waitlist Status
```prisma
enum WaitlistStatus {
  PENDING    // On waitlist, waiting
  CONFIRMED  // Confirmed for event
  CANCELLED  // Removed from waitlist
}
```

### 5. Session Management

#### Session
```prisma
model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  // Relations
  user User @relation(fields: [userId], references: [id])

  @@index([token])
  @@index([expiresAt])
  @@map("sessions")
}
```

**Purpose**: User session management
**Key Features**:
- JWT token storage
- Automatic expiration
- User association
- Performance indexes

### 6. Audit & Compliance

#### AuditLog
```prisma
model AuditLog {
  id         String   @id @default(cuid())
  action     String   // CREATE, UPDATE, DELETE
  resource   String   // Event, User, etc.
  resourceId String
  userId     String?
  ipAddress  String?
  userAgent  String?
  metadata   Json?
  createdAt  DateTime @default(now())

  // Relations
  user User? @relation(fields: [userId], references: [id])

  @@index([resource, resourceId])
  @@index([userId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

**Purpose**: Comprehensive audit trail for compliance
**Key Features**:
- Action tracking (CRUD operations)
- Resource identification
- User context
- IP and user agent logging
- Flexible metadata storage
- Performance indexes

## Database Indexes

### Performance Indexes
```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- Event indexes
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_owner_id ON events(owner_id);
CREATE INDEX idx_events_venue_id ON events(venue_id);
CREATE INDEX idx_events_deleted_at ON events(deleted_at);

-- Waitlist indexes
CREATE INDEX idx_waitlist_entries_event_id ON waitlist_entries(event_id);
CREATE INDEX idx_waitlist_entries_email ON waitlist_entries(email);
CREATE INDEX idx_waitlist_entries_status ON waitlist_entries(status);

-- Session indexes
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Audit log indexes
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource, resource_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## Migration Strategy

### Prisma Migrate
- **Tool**: Prisma Migrate
- **Location**: `apps/api/prisma/migrations/`
- **Commands**:
  ```bash
  pnpm db:migrate    # Create and apply migration
  pnpm db:push       # Push schema changes (dev only)
  pnpm db:reset      # Reset database (dev only)
  ```

### Migration Workflow
1. **Schema Changes**: Modify `schema.prisma`
2. **Generate Migration**: `pnpm db:migrate dev --name description`
3. **Review Migration**: Check generated SQL
4. **Apply Migration**: `pnpm db:migrate deploy`
5. **Update Client**: `pnpm db:generate`

### Rollback Strategy
- **Development**: Use `pnpm db:reset` to reset to clean state
- **Production**: Create rollback migration
- **Backup**: Always backup before major migrations

## Data Validation

### Prisma Validation
- **Required Fields**: Enforced at database level
- **Unique Constraints**: Email, slug uniqueness
- **Foreign Keys**: Referential integrity
- **Enums**: Type safety for status fields

### Application Validation
- **Zod Schemas**: Runtime validation
- **API Validation**: Request/response validation
- **Business Rules**: Custom validation logic

## Security Considerations

### Data Protection
- **Soft Deletion**: No hard deletes for audit trail
- **Encryption**: Sensitive data encryption at rest
- **Access Control**: Role-based permissions
- **Audit Trail**: Complete action logging

### GDPR Compliance
- **Data Minimization**: Only collect necessary data
- **Right to Erasure**: Soft delete with anonymization
- **Data Portability**: Export user data
- **Consent Management**: Track user consent

## Performance Optimization

### Query Optimization
- **Indexes**: Strategic indexing for common queries
- **Connection Pooling**: Prisma connection pooling
- **Query Caching**: Redis for frequently accessed data
- **Pagination**: Cursor-based pagination

### Monitoring
- **Query Performance**: Prisma query logging
- **Database Metrics**: Connection pool monitoring
- **Slow Queries**: Identify and optimize slow queries
- **Index Usage**: Monitor index effectiveness

## Future Enhancements

### Planned Features
- **Categories**: Event categorization
- **Tags**: Flexible tagging system
- **Notifications**: Email notification preferences
- **Analytics**: Event analytics and reporting
- **Multi-tenancy**: Organization support

### Schema Evolution
- **Backward Compatibility**: Maintain API compatibility
- **Gradual Migration**: Phased rollout of changes
- **Feature Flags**: Toggle new features
- **A/B Testing**: Support for experimentation

## Development Guidelines

### Schema Changes
1. **Always Use Migrations**: Never modify database directly
2. **Test Migrations**: Test on development database first
3. **Backup Production**: Always backup before production migrations
4. **Review SQL**: Review generated migration SQL
5. **Document Changes**: Update this document with changes

### Naming Conventions
- **Tables**: Plural, snake_case (`users`, `waitlist_entries`)
- **Columns**: snake_case (`created_at`, `user_id`)
- **Indexes**: `idx_` prefix (`idx_users_email`)
- **Foreign Keys**: `_id` suffix (`user_id`, `event_id`)

---

*This document should be updated whenever the database schema changes.*
