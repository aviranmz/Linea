declare module '@linea/config' {
  export type Environment = 'development' | 'staging' | 'production';
  // Intentionally loose types to avoid CI typecheck coupling to config package types
  export type Config = any;
  export function getCurrentEnvironment(): Environment;
  export function loadConfig(environment?: Environment): any;
  export function getConfig(): any;
  export function validateConfig(config: any): void;
}
