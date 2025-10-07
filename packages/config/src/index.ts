import { readFileSync } from 'fs';
import { join } from 'path';

export interface Config {
  environment: {
    NODE_ENV: string;
    APP_NAME: string;
    APP_VERSION: string;
  };
  database: {
    DATABASE_URL: string;
    DB_POOL_MIN: number;
    DB_POOL_MAX: number;
    DB_POOL_IDLE_TIMEOUT: number;
  };
  redis: {
    REDIS_URL: string;
    REDIS_PASSWORD: string;
    REDIS_DB: number;
    REDIS_KEY_PREFIX: string;
  };
  server: {
    API_URL: string;
    FRONTEND_URL: string;
    PORT: number;
    HOST: string;
    CORS_ORIGIN: string;
    CORS_CREDENTIALS: boolean;
  };
  security: {
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    SESSION_SECRET: string;
    SESSION_COOKIE_NAME: string;
    SESSION_COOKIE_MAX_AGE: number;
    SESSION_COOKIE_SECURE: boolean;
    SESSION_COOKIE_HTTP_ONLY: boolean;
    SESSION_COOKIE_SAME_SITE: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
  };
  email: {
    SENDGRID_API_KEY: string;
    SENDGRID_FROM_EMAIL: string;
    SENDGRID_FROM_NAME: string;
    SENDGRID_REPLY_TO: string;
  };
  analytics: {
    ANALYTICS_ENABLED: boolean;
    ANALYTICS_ID: string;
    ANALYTICS_DOMAIN: string;
    ANALYTICS_SCRIPT_URL: string;
  };
  observability: {
    SENTRY_DSN: string;
    SENTRY_ENVIRONMENT: string;
    SENTRY_RELEASE: string;
    LOG_LEVEL: string;
    LOG_FORMAT: string;
    LOG_FILE: string;
  };
  maps: {
    NOMINATIM_BASE_URL: string;
    NOMINATIM_USER_AGENT: string;
    NOMINATIM_RATE_LIMIT: number;
    MAP_TILE_URL: string;
    MAP_ATTRIBUTION: string;
  };
  storage: {
    UPLOAD_MAX_SIZE: number;
    UPLOAD_ALLOWED_TYPES: string;
    UPLOAD_PATH: string;
    STORAGE_PROVIDER: string;
  };
  privacy: {
    DATA_RETENTION_SESSIONS: number;
    DATA_RETENTION_EMAILS: number;
    DATA_RETENTION_AUDIT_LOGS: number;
    REQUIRE_DOUBLE_OPT_IN: boolean;
    COOKIE_CONSENT_REQUIRED: boolean;
    ANALYTICS_CONSENT_REQUIRED: boolean;
  };
  features: {
    FEATURE_NEARBY_SUGGESTIONS: boolean;
    FEATURE_MAP_INTEGRATION: boolean;
    FEATURE_PAYMENTS: boolean;
    FEATURE_ADVANCED_ANALYTICS: boolean;
  };
  development: {
    SEED_ADMIN_EMAIL: string;
    SEED_ADMIN_PASSWORD: string;
    SEED_SAMPLE_EVENTS: boolean;
    DEBUG_SQL: boolean;
    DEBUG_REDIS: boolean;
    DEBUG_EMAIL: boolean;
    DEMO_MODE: boolean;
  };
}

export type Environment = 'development' | 'staging' | 'production';

/**
 * Load configuration for the specified environment
 */
export function loadConfig(environment: Environment = 'development'): Config {
  const candidates: string[] = [];

  // Allow explicit project root via env
  if (process.env.PROJECT_ROOT) {
    candidates.push(
      join(
        process.env.PROJECT_ROOT,
        'config',
        'environments',
        `${environment}.json`
      )
    );
  }

  // Common monorepo layouts
  // 1) When running from repo root
  candidates.push(
    join(process.cwd(), 'config', 'environments', `${environment}.json`)
  );
  // 2) When running from a workspace like apps/api or apps/web
  candidates.push(
    join(
      process.cwd(),
      '..',
      '..',
      'config',
      'environments',
      `${environment}.json`
    )
  );
  // 3) When running from a package like packages/config consumers
  candidates.push(
    join(process.cwd(), '..', 'config', 'environments', `${environment}.json`)
  );

  // 4) Resolve relative to this package file (packages/config)
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - import.meta available in ESM context
    const here = new URL('.', import.meta.url).pathname;
    candidates.push(
      join(
        here,
        '..',
        '..',
        '..',
        'config',
        'environments',
        `${environment}.json`
      )
    );
    candidates.push(
      join(
        here,
        '..',
        '..',
        '..',
        '..',
        'config',
        'environments',
        `${environment}.json`
      )
    );
  } catch {
    // ignore
  }

  let lastError: unknown;
  for (const p of candidates) {
    try {
      const configFile = readFileSync(p, 'utf-8');
      const config = JSON.parse(configFile) as Config;
      return overrideWithEnvVars(config);
    } catch (err) {
      lastError = err;
      continue;
    }
  }
  // If nothing worked, throw a helpful error
  console.error(
    `Failed to locate configuration for environment: ${environment}`
  );
  console.error('Tried paths:', candidates);
  if (lastError) console.error('Last error:', lastError);
  throw new Error(
    `Configuration file not found for environment: ${environment}`
  );
}

/**
 * Override configuration with environment variables
 */
function overrideWithEnvVars(config: Config): Config {
  const env = process.env;

  // Helper function to get env var with fallback
  const getEnvVar = (key: string, fallback: any) => {
    const value = env[key];
    if (value === undefined) return fallback;

    // Try to parse as number
    if (!isNaN(Number(value))) return Number(value);

    // Try to parse as boolean
    if (value === 'true') return true;
    if (value === 'false') return false;

    return value;
  };

  return {
    environment: {
      NODE_ENV: getEnvVar('NODE_ENV', config.environment.NODE_ENV),
      APP_NAME: getEnvVar('APP_NAME', config.environment.APP_NAME),
      APP_VERSION: getEnvVar('APP_VERSION', config.environment.APP_VERSION),
    },
    database: {
      DATABASE_URL: getEnvVar('DATABASE_URL', config.database.DATABASE_URL),
      DB_POOL_MIN: getEnvVar('DB_POOL_MIN', config.database.DB_POOL_MIN),
      DB_POOL_MAX: getEnvVar('DB_POOL_MAX', config.database.DB_POOL_MAX),
      DB_POOL_IDLE_TIMEOUT: getEnvVar(
        'DB_POOL_IDLE_TIMEOUT',
        config.database.DB_POOL_IDLE_TIMEOUT
      ),
    },
    redis: {
      REDIS_URL: getEnvVar('REDIS_URL', config.redis.REDIS_URL),
      REDIS_PASSWORD: getEnvVar('REDIS_PASSWORD', config.redis.REDIS_PASSWORD),
      REDIS_DB: getEnvVar('REDIS_DB', config.redis.REDIS_DB),
      REDIS_KEY_PREFIX: getEnvVar(
        'REDIS_KEY_PREFIX',
        config.redis.REDIS_KEY_PREFIX
      ),
    },
    server: {
      API_URL: getEnvVar('API_URL', config.server.API_URL),
      FRONTEND_URL: getEnvVar('FRONTEND_URL', config.server.FRONTEND_URL),
      PORT: getEnvVar('PORT', config.server.PORT),
      HOST: getEnvVar('HOST', config.server.HOST),
      CORS_ORIGIN: getEnvVar('CORS_ORIGIN', config.server.CORS_ORIGIN),
      CORS_CREDENTIALS: getEnvVar(
        'CORS_CREDENTIALS',
        config.server.CORS_CREDENTIALS
      ),
    },
    security: {
      JWT_SECRET: getEnvVar('JWT_SECRET', config.security.JWT_SECRET),
      JWT_EXPIRES_IN: getEnvVar(
        'JWT_EXPIRES_IN',
        config.security.JWT_EXPIRES_IN
      ),
      JWT_REFRESH_EXPIRES_IN: getEnvVar(
        'JWT_REFRESH_EXPIRES_IN',
        config.security.JWT_REFRESH_EXPIRES_IN
      ),
      SESSION_SECRET: getEnvVar(
        'SESSION_SECRET',
        config.security.SESSION_SECRET
      ),
      SESSION_COOKIE_NAME: getEnvVar(
        'SESSION_COOKIE_NAME',
        config.security.SESSION_COOKIE_NAME
      ),
      SESSION_COOKIE_MAX_AGE: getEnvVar(
        'SESSION_COOKIE_MAX_AGE',
        config.security.SESSION_COOKIE_MAX_AGE
      ),
      SESSION_COOKIE_SECURE: getEnvVar(
        'SESSION_COOKIE_SECURE',
        config.security.SESSION_COOKIE_SECURE
      ),
      SESSION_COOKIE_HTTP_ONLY: getEnvVar(
        'SESSION_COOKIE_HTTP_ONLY',
        config.security.SESSION_COOKIE_HTTP_ONLY
      ),
      SESSION_COOKIE_SAME_SITE: getEnvVar(
        'SESSION_COOKIE_SAME_SITE',
        config.security.SESSION_COOKIE_SAME_SITE
      ),
      RATE_LIMIT_WINDOW_MS: getEnvVar(
        'RATE_LIMIT_WINDOW_MS',
        config.security.RATE_LIMIT_WINDOW_MS
      ),
      RATE_LIMIT_MAX_REQUESTS: getEnvVar(
        'RATE_LIMIT_MAX_REQUESTS',
        config.security.RATE_LIMIT_MAX_REQUESTS
      ),
    },
    email: {
      SENDGRID_API_KEY: getEnvVar(
        'SENDGRID_API_KEY',
        config.email.SENDGRID_API_KEY
      ),
      SENDGRID_FROM_EMAIL: getEnvVar(
        'SENDGRID_FROM_EMAIL',
        config.email.SENDGRID_FROM_EMAIL
      ),
      SENDGRID_FROM_NAME: getEnvVar(
        'SENDGRID_FROM_NAME',
        config.email.SENDGRID_FROM_NAME
      ),
      SENDGRID_REPLY_TO: getEnvVar(
        'SENDGRID_REPLY_TO',
        config.email.SENDGRID_REPLY_TO
      ),
    },
    analytics: {
      ANALYTICS_ENABLED: getEnvVar(
        'ANALYTICS_ENABLED',
        config.analytics.ANALYTICS_ENABLED
      ),
      ANALYTICS_ID: getEnvVar('ANALYTICS_ID', config.analytics.ANALYTICS_ID),
      ANALYTICS_DOMAIN: getEnvVar(
        'ANALYTICS_DOMAIN',
        config.analytics.ANALYTICS_DOMAIN
      ),
      ANALYTICS_SCRIPT_URL: getEnvVar(
        'ANALYTICS_SCRIPT_URL',
        config.analytics.ANALYTICS_SCRIPT_URL
      ),
    },
    observability: {
      SENTRY_DSN: getEnvVar('SENTRY_DSN', config.observability.SENTRY_DSN),
      SENTRY_ENVIRONMENT: getEnvVar(
        'SENTRY_ENVIRONMENT',
        config.observability.SENTRY_ENVIRONMENT
      ),
      SENTRY_RELEASE: getEnvVar(
        'SENTRY_RELEASE',
        config.observability.SENTRY_RELEASE
      ),
      LOG_LEVEL: getEnvVar('LOG_LEVEL', config.observability.LOG_LEVEL),
      LOG_FORMAT: getEnvVar('LOG_FORMAT', config.observability.LOG_FORMAT),
      LOG_FILE: getEnvVar('LOG_FILE', config.observability.LOG_FILE),
    },
    maps: {
      NOMINATIM_BASE_URL: getEnvVar(
        'NOMINATIM_BASE_URL',
        config.maps.NOMINATIM_BASE_URL
      ),
      NOMINATIM_USER_AGENT: getEnvVar(
        'NOMINATIM_USER_AGENT',
        config.maps.NOMINATIM_USER_AGENT
      ),
      NOMINATIM_RATE_LIMIT: getEnvVar(
        'NOMINATIM_RATE_LIMIT',
        config.maps.NOMINATIM_RATE_LIMIT
      ),
      MAP_TILE_URL: getEnvVar('MAP_TILE_URL', config.maps.MAP_TILE_URL),
      MAP_ATTRIBUTION: getEnvVar(
        'MAP_ATTRIBUTION',
        config.maps.MAP_ATTRIBUTION
      ),
    },
    storage: {
      UPLOAD_MAX_SIZE: getEnvVar(
        'UPLOAD_MAX_SIZE',
        config.storage.UPLOAD_MAX_SIZE
      ),
      UPLOAD_ALLOWED_TYPES: getEnvVar(
        'UPLOAD_ALLOWED_TYPES',
        config.storage.UPLOAD_ALLOWED_TYPES
      ),
      UPLOAD_PATH: getEnvVar('UPLOAD_PATH', config.storage.UPLOAD_PATH),
      STORAGE_PROVIDER: getEnvVar(
        'STORAGE_PROVIDER',
        config.storage.STORAGE_PROVIDER
      ),
    },
    privacy: {
      DATA_RETENTION_SESSIONS: getEnvVar(
        'DATA_RETENTION_SESSIONS',
        config.privacy.DATA_RETENTION_SESSIONS
      ),
      DATA_RETENTION_EMAILS: getEnvVar(
        'DATA_RETENTION_EMAILS',
        config.privacy.DATA_RETENTION_EMAILS
      ),
      DATA_RETENTION_AUDIT_LOGS: getEnvVar(
        'DATA_RETENTION_AUDIT_LOGS',
        config.privacy.DATA_RETENTION_AUDIT_LOGS
      ),
      REQUIRE_DOUBLE_OPT_IN: getEnvVar(
        'REQUIRE_DOUBLE_OPT_IN',
        config.privacy.REQUIRE_DOUBLE_OPT_IN
      ),
      COOKIE_CONSENT_REQUIRED: getEnvVar(
        'COOKIE_CONSENT_REQUIRED',
        config.privacy.COOKIE_CONSENT_REQUIRED
      ),
      ANALYTICS_CONSENT_REQUIRED: getEnvVar(
        'ANALYTICS_CONSENT_REQUIRED',
        config.privacy.ANALYTICS_CONSENT_REQUIRED
      ),
    },
    features: {
      FEATURE_NEARBY_SUGGESTIONS: getEnvVar(
        'FEATURE_NEARBY_SUGGESTIONS',
        config.features.FEATURE_NEARBY_SUGGESTIONS
      ),
      FEATURE_MAP_INTEGRATION: getEnvVar(
        'FEATURE_MAP_INTEGRATION',
        config.features.FEATURE_MAP_INTEGRATION
      ),
      FEATURE_PAYMENTS: getEnvVar(
        'FEATURE_PAYMENTS',
        config.features.FEATURE_PAYMENTS
      ),
      FEATURE_ADVANCED_ANALYTICS: getEnvVar(
        'FEATURE_ADVANCED_ANALYTICS',
        config.features.FEATURE_ADVANCED_ANALYTICS
      ),
    },
    development: {
      SEED_ADMIN_EMAIL: getEnvVar(
        'SEED_ADMIN_EMAIL',
        config.development.SEED_ADMIN_EMAIL
      ),
      SEED_ADMIN_PASSWORD: getEnvVar(
        'SEED_ADMIN_PASSWORD',
        config.development.SEED_ADMIN_PASSWORD
      ),
      SEED_SAMPLE_EVENTS: getEnvVar(
        'SEED_SAMPLE_EVENTS',
        config.development.SEED_SAMPLE_EVENTS
      ),
      DEBUG_SQL: getEnvVar('DEBUG_SQL', config.development.DEBUG_SQL),
      DEBUG_REDIS: getEnvVar('DEBUG_REDIS', config.development.DEBUG_REDIS),
      DEBUG_EMAIL: getEnvVar('DEBUG_EMAIL', config.development.DEBUG_EMAIL),
      DEMO_MODE: getEnvVar('DEMO_MODE', config.development.DEMO_MODE),
    },
  };
}

/**
 * Get the current environment from NODE_ENV
 */
export function getCurrentEnvironment(): Environment {
  const env = process.env.NODE_ENV as Environment;
  return env && ['development', 'staging', 'production'].includes(env)
    ? env
    : 'development';
}

/**
 * Load configuration for the current environment
 */
export function getConfig(): Config {
  const environment = getCurrentEnvironment();
  return loadConfig(environment);
}

/**
 * Validate required configuration values
 */
export function validateConfig(config: Config): void {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'SESSION_SECRET'] as const;

  const missing: string[] = [];

  for (const key of required) {
    if (!config.database.DATABASE_URL && key === 'DATABASE_URL') {
      missing.push('DATABASE_URL');
    }
    if (!config.security.JWT_SECRET && key === 'JWT_SECRET') {
      missing.push('JWT_SECRET');
    }
    if (!config.security.SESSION_SECRET && key === 'SESSION_SECRET') {
      missing.push('SESSION_SECRET');
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
}
