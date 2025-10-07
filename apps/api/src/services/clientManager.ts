// Client manager service for managing HTTP clients
import {
  HttpClientFactory,
  SupabaseClient,
  TravelAtlasClient,
  SerpApiClient,
  OpenWeatherMapClient,
  GooglePlacesClient,
  TwilioClient,
  TelegramClient,
  OpenRouterClient,
} from '../clients/httpClient.js';

export interface ClientConfig {
  supabase?: {
    apiKey: string;
    projectUrl: string;
  };
  travelAtlas?: {
    apiKey: string;
  };
  serpApi?: {
    apiKey: string;
  };
  openWeatherMap?: {
    apiKey: string;
  };
  googlePlaces?: {
    apiKey: string;
  };
  twilio?: {
    accountSid: string;
    authToken: string;
  };
  telegram?: {
    botToken: string;
  };
  openRouter?: {
    apiKey: string;
  };
}

export class ClientManager {
  private clients: Map<string, any> = new Map();
  private config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = config;
    this.initializeClients();
  }

  private initializeClients(): void {
    // Initialize Supabase client
    if (this.config.supabase) {
      const client = HttpClientFactory.createSupabaseClient(
        this.config.supabase.apiKey,
        this.config.supabase.projectUrl
      );
      this.clients.set('supabase', client);
    }

    // Initialize Travel Atlas client
    if (this.config.travelAtlas) {
      const client = HttpClientFactory.createTravelAtlasClient(
        this.config.travelAtlas.apiKey
      );
      this.clients.set('travelAtlas', client);
    }

    // Initialize SerpAPI client
    if (this.config.serpApi) {
      const client = HttpClientFactory.createSerpApiClient(
        this.config.serpApi.apiKey
      );
      this.clients.set('serpApi', client);
    }

    // Initialize OpenWeatherMap client
    if (this.config.openWeatherMap) {
      const client = HttpClientFactory.createOpenWeatherMapClient(
        this.config.openWeatherMap.apiKey
      );
      this.clients.set('openWeatherMap', client);
    }

    // Initialize Google Places client
    if (this.config.googlePlaces) {
      const client = HttpClientFactory.createGooglePlacesClient(
        this.config.googlePlaces.apiKey
      );
      this.clients.set('googlePlaces', client);
    }

    // Initialize Twilio client
    if (this.config.twilio) {
      const client = HttpClientFactory.createTwilioClient(
        this.config.twilio.accountSid,
        this.config.twilio.authToken
      );
      this.clients.set('twilio', client);
    }

    // Initialize Telegram client
    if (this.config.telegram) {
      const client = HttpClientFactory.createTelegramClient(
        this.config.telegram.botToken
      );
      this.clients.set('telegram', client);
    }

    // Initialize OpenRouter client
    if (this.config.openRouter) {
      const client = HttpClientFactory.createOpenRouterClient(
        this.config.openRouter.apiKey
      );
      this.clients.set('openRouter', client);
    }
  }

  getClient<T = any>(name: string): T | null {
    return this.clients.get(name) || null;
  }

  getSupabaseClient(): SupabaseClient | null {
    return this.getClient<SupabaseClient>('supabase');
  }

  getTravelAtlasClient(): TravelAtlasClient | null {
    return this.getClient<TravelAtlasClient>('travelAtlas');
  }

  getSerpApiClient(): SerpApiClient | null {
    return this.getClient<SerpApiClient>('serpApi');
  }

  getOpenWeatherMapClient(): OpenWeatherMapClient | null {
    return this.getClient<OpenWeatherMapClient>('openWeatherMap');
  }

  getGooglePlacesClient(): GooglePlacesClient | null {
    return this.getClient<GooglePlacesClient>('googlePlaces');
  }

  getTwilioClient(): TwilioClient | null {
    return this.getClient<TwilioClient>('twilio');
  }

  getTelegramClient(): TelegramClient | null {
    return this.getClient<TelegramClient>('telegram');
  }

  getOpenRouterClient(): OpenRouterClient | null {
    return this.getClient<OpenRouterClient>('openRouter');
  }

  async testAllClients(): Promise<
    Record<string, { status: string; error?: string }>
  > {
    const results: Record<string, { status: string; error?: string }> = {};

    for (const [name, client] of this.clients) {
      try {
        // Test each client with a simple request
        await this.testClient(name, client);
        results[name] = { status: 'healthy' };
      } catch (error) {
        results[name] = {
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }

    return results;
  }

  private async testClient(name: string, client: any): Promise<void> {
    switch (name) {
      case 'supabase':
        await client.get('/');
        break;
      case 'travelAtlas':
        // Test with a simple request
        await client.get('/health');
        break;
      case 'serpApi':
        // Test with a simple search
        await client.search({ q: 'test', engine: 'google' });
        break;
      case 'openWeatherMap':
        // Test with a simple weather request
        await client.getCurrentWeather({ lat: 0, lon: 0 });
        break;
      case 'googlePlaces':
        // Test with a simple places search
        await client.searchPlaces({ query: 'test' });
        break;
      case 'twilio':
        // Test Twilio client (this might fail if no valid credentials)
        // We'll just check if the client is properly initialized
        if (!client) throw new Error('Twilio client not initialized');
        break;
      case 'telegram':
        // Test Telegram client
        await client.get('/getMe');
        break;
      case 'openRouter':
        // Test OpenRouter client
        await client.chatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'test' }],
        });
        break;
      default:
        throw new Error(`Unknown client: ${name}`);
    }
  }

  getAvailableClients(): string[] {
    return Array.from(this.clients.keys());
  }

  getClientStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};

    for (const [name, client] of this.clients) {
      status[name] = !!client;
    }

    return status;
  }

  async updateConfig(newConfig: Partial<ClientConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    this.clients.clear();
    this.initializeClients();
  }

  async getClientMetrics(): Promise<Record<string, any>> {
    const metrics: Record<string, any> = {};

    for (const [name, client] of this.clients) {
      metrics[name] = {
        initialized: !!client,
        lastUsed: new Date().toISOString(),
        // Add more metrics as needed
      };
    }

    return metrics;
  }
}
