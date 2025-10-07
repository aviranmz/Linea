// HTTP client module for external API integrations

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  apiKey?: string;
  apiSecret?: string;
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
  success: boolean;
  error?: string;
}

export class HttpClient {
  public config: HttpClientConfig;
  private defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig) {
    this.config = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      ...config,
    };

    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'Linea-API/1.0',
      ...this.config.headers,
    };

    if (this.config.apiKey) {
      this.defaultHeaders['Authorization'] = `Bearer ${this.config.apiKey}`;
    }
  }

  async request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildURL(options.path, options.params);
    const headers = { ...this.defaultHeaders, ...options.headers };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.retries!; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          options.timeout || this.config.timeout
        );

        const response = await fetch(url, {
          method: options.method,
          headers,
          body: options.body ? JSON.stringify(options.body) : null,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: ${data.message || 'Unknown error'}`
          );
        }

        return {
          data,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          success: true,
        };
      } catch (error) {
        lastError = error as Error;

        if (attempt < this.config.retries!) {
          const delay = this.config.retryDelay! * Math.pow(2, attempt);
          await this.sleep(delay);
        }
      }
    }

    return {
      data: null as T,
      status: 0,
      headers: {},
      success: false,
      error: lastError?.message || 'Request failed',
    };
  }

  async get<T = any>(
    path: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', path, params: params || {} });
  }

  async post<T = any>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', path, body });
  }

  async put<T = any>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', path, body });
  }

  async patch<T = any>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', path, body });
  }

  async delete<T = any>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', path });
  }

  private buildURL(path: string, params?: Record<string, any>): string {
    const url = new URL(path, this.config.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Supabase client
export class SupabaseClient extends HttpClient {
  constructor(apiKey: string, projectUrl: string) {
    super({
      baseURL: `${projectUrl}/rest/v1`,
      apiKey,
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  async rpc<T = any>(
    functionName: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    return this.post<T>(`/rpc/${functionName}`, params);
  }

  async from<T = any>(table: string): Promise<SupabaseQueryBuilder<T>> {
    return new SupabaseQueryBuilder<T>(this, table);
  }
}

export class SupabaseQueryBuilder<T> {
  constructor(
    private client: SupabaseClient,
    private table: string
  ) {}

  async select(columns: string = '*'): Promise<ApiResponse<T[]>> {
    return this.client.get<T[]>(`/${this.table}?select=${columns}`);
  }

  async insert(data: T | T[]): Promise<ApiResponse<T[]>> {
    return this.client.post<T[]>(`/${this.table}`, data);
  }

  async update(data: Partial<T>): Promise<ApiResponse<T[]>> {
    return this.client.patch<T[]>(`/${this.table}`, data);
  }

  async delete(): Promise<ApiResponse<T[]>> {
    return this.client.delete<T[]>(`/${this.table}`);
  }
}

// Travel Atlas client
export class TravelAtlasClient extends HttpClient {
  constructor(apiKey: string) {
    super({
      baseURL: 'https://api.travelatlas.com/v1',
      apiKey,
      headers: {
        'X-API-Key': apiKey,
      },
    });
  }

  async searchFlights(params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers?: number;
    class?: string;
  }): Promise<ApiResponse<any>> {
    return this.get('/flights/search', params);
  }

  async searchHotels(params: {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: number;
  }): Promise<ApiResponse<any>> {
    return this.get('/hotels/search', params);
  }
}

// SerpAPI client
export class SerpApiClient extends HttpClient {
  constructor(apiKey: string) {
    super({
      baseURL: 'https://serpapi.com/search',
      apiKey,
      headers: {
        'X-API-Key': apiKey,
      },
    });
  }

  async search(params: {
    q: string;
    engine?: string;
    location?: string;
    hl?: string;
    gl?: string;
    num?: number;
  }): Promise<ApiResponse<any>> {
    return this.get('', { ...params, api_key: this.config.apiKey });
  }
}

// OpenWeatherMap client
export class OpenWeatherMapClient extends HttpClient {
  constructor(apiKey: string) {
    super({
      baseURL: 'https://api.openweathermap.org/data/2.5',
      apiKey,
      headers: {
        'X-API-Key': apiKey,
      },
    });
  }

  async getCurrentWeather(params: {
    lat: number;
    lon: number;
    units?: string;
    lang?: string;
  }): Promise<ApiResponse<any>> {
    return this.get('/weather', { ...params, appid: this.config.apiKey });
  }

  async getForecast(params: {
    lat: number;
    lon: number;
    units?: string;
    lang?: string;
  }): Promise<ApiResponse<any>> {
    return this.get('/forecast', { ...params, appid: this.config.apiKey });
  }
}

// Google Places client
export class GooglePlacesClient extends HttpClient {
  constructor(apiKey: string) {
    super({
      baseURL: 'https://maps.googleapis.com/maps/api/place',
      apiKey,
      headers: {
        'X-API-Key': apiKey,
      },
    });
  }

  async searchPlaces(params: {
    query: string;
    location?: string;
    radius?: number;
    type?: string;
  }): Promise<ApiResponse<any>> {
    return this.get('/textsearch/json', { ...params, key: this.config.apiKey });
  }

  async getPlaceDetails(params: {
    place_id: string;
    fields?: string;
  }): Promise<ApiResponse<any>> {
    return this.get('/details/json', { ...params, key: this.config.apiKey });
  }
}

// Twilio client
export class TwilioClient extends HttpClient {
  constructor(accountSid: string, authToken: string) {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    super({
      baseURL: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}`,
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
  }

  async sendSMS(params: {
    To: string;
    From: string;
    Body: string;
  }): Promise<ApiResponse<any>> {
    return this.post('/Messages.json', params);
  }

  async sendWhatsApp(params: {
    To: string;
    From: string;
    Body: string;
  }): Promise<ApiResponse<any>> {
    return this.post('/Messages.json', {
      ...params,
      From: `whatsapp:${params.From}`,
      To: `whatsapp:${params.To}`,
    });
  }
}

// Telegram client
export class TelegramClient extends HttpClient {
  constructor(botToken: string) {
    super({
      baseURL: `https://api.telegram.org/bot${botToken}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMessage(params: {
    chat_id: string;
    text: string;
    parse_mode?: string;
    reply_to_message_id?: number;
  }): Promise<ApiResponse<any>> {
    return this.post('/sendMessage', params);
  }

  async setWebhook(params: {
    url: string;
    secret_token?: string;
  }): Promise<ApiResponse<any>> {
    return this.post('/setWebhook', params);
  }
}

// OpenRouter client
export class OpenRouterClient extends HttpClient {
  constructor(apiKey: string) {
    super({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://linea.dev',
        'X-Title': 'Linea API',
      },
    });
  }

  async chatCompletion(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    max_tokens?: number;
    temperature?: number;
  }): Promise<ApiResponse<any>> {
    return this.post('/chat/completions', params);
  }
}

// Client factory
export class HttpClientFactory {
  static createSupabaseClient(
    apiKey: string,
    projectUrl: string
  ): SupabaseClient {
    return new SupabaseClient(apiKey, projectUrl);
  }

  static createTravelAtlasClient(apiKey: string): TravelAtlasClient {
    return new TravelAtlasClient(apiKey);
  }

  static createSerpApiClient(apiKey: string): SerpApiClient {
    return new SerpApiClient(apiKey);
  }

  static createOpenWeatherMapClient(apiKey: string): OpenWeatherMapClient {
    return new OpenWeatherMapClient(apiKey);
  }

  static createGooglePlacesClient(apiKey: string): GooglePlacesClient {
    return new GooglePlacesClient(apiKey);
  }

  static createTwilioClient(
    accountSid: string,
    authToken: string
  ): TwilioClient {
    return new TwilioClient(accountSid, authToken);
  }

  static createTelegramClient(botToken: string): TelegramClient {
    return new TelegramClient(botToken);
  }

  static createOpenRouterClient(apiKey: string): OpenRouterClient {
    return new OpenRouterClient(apiKey);
  }
}
