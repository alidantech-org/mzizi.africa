import chalk from 'chalk';
import { cookies, headers } from 'next/headers';

const BASE_URL = process.env.SERVER_URL;
const NODE_ENV = process.env.NODE_ENV;

/**
 * Prefix for cookies set by the backend server.
 * This allows us to identify which cookies are from our backend.
 * When sending cookies to the backend, the prefix is removed.
 */
const BACKEND_COOKIE_PREFIX = 'prfi_';

/**
 * Validates all required environment variables and logs their status.
 * Throws an error if critical variables are missing.
 * Warns about optional but recommended variables.
 */
function validateEnv(): void {
  // Validate SERVER_URL (required)
  if (!BASE_URL) {
    console.error(chalk.red.bold('❌ SERVER_URL: NOT SET (SERVER_URL environment variable is not set)'));
    throw new Error('Please configure it in your .env file. this is required to use the AppServer function.');
  }
}

// Validate environment variables on module load
validateEnv();

interface RequestOptions {
  query?: Record<string, string | number | boolean>;
  params?: string[];
  cache?: 'no-store' | 'force-cache' | 'only-if-cached';
  isMultipart?: boolean;
  /**
   * If true, includes the client's full URL (protocol + host + port) in the x-client-url header.
   * Example: "http://192.168.100.8:3000" or "https://example.com:443"
   *
   * The header will be sent to the backend server in all requests when this option is enabled.
   * This allows the backend to identify which domain/URL the client is accessing the app from.
   */
  includeClientDomain?: boolean;
}

interface AppResponse<T> {
  success: boolean;
  message: string;
  body: T | null;
}

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  path?: string;
  domain?: string;
}

interface Cookie {
  name: string;
  value: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: string;
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
}

interface PrepareRequestResult {
  url: string;
  fetchOptions: RequestInit;
}

/**
 * AppServer provides a unified interface for making HTTP requests to your backend server.
 *
 * Cookie Management:
 * ==================
 * All cookies received from the backend are saved with a prefix ("app_") to identify them.
 * When sending cookies to the backend, only prefixed cookies are included, and the prefix is removed.
 * This ensures that only backend cookies are sent to the backend, and the backend doesn't need to know about the prefix.
 *
 * Example:
 * - Backend sets cookie: "session=abc123"
 * - Frontend saves as: "app_session=abc123"
 * - When sending to backend: "session=abc123" (prefix removed)
 *
 * Headers sent to backend:
 * ========================
 * When making requests, the following headers are automatically included:
 *
 * 1. Cache-Control: Based on the cache option (default: "no-store")
 *
 * 2. x-client-url: Full client URL (protocol + host + port) when includeClientDomain option is enabled.
 *    - Format: "http://192.168.100.8:3000" or "https://example.com:443"
 *    - Only included when { includeClientDomain: true } is passed in options
 *    - Example usage:
 *      ```typescript
 *      AppServer.get('/api/endpoint', { includeClientDomain: true })
 *      ```
 *
 * 3. Cookie: Only backend cookies (with prefix) are included, prefix is removed before sending
 *
 * 4. Content-Type: "application/json" for non-GET requests (unless isMultipart is true)
 *
 * Example:
 * --------
 * ```typescript
 * // Include client URL in request
 * const response = await AppServer.get('/api/organisations/by-domain', {
 *   includeClientDomain: true  // Adds x-client-url: "http://192.168.100.8:3000"
 * });
 * ```
 */
class AppServerClass {
  private cookieStore: Awaited<ReturnType<typeof cookies>> | null = null;

  /**
   * Logs a message with optional status and success flag.
   * Determines color based on success flag and status code.
   * @param {string} message - The message to log.
   * @param {number} [status] - Optional HTTP status code.
   * @param {boolean} [success] - Optional success flag to determine color.
   */
  private log(message: string, status?: number, success?: boolean): void {
    // Determine if logging should occur based on NODE_ENV
    const shouldLogError = NODE_ENV !== 'test';
    const shouldLogSuccess = NODE_ENV === 'development';

    // Determine color based on success flag or status code
    let coloredMessage = message;

    if (status !== undefined) {
      // If status is provided, color it yellow and append to message
      const statusText = String(status);
      coloredMessage = `${message} ${chalk.yellow(statusText)}`;
    }

    // Determine color based on success flag (prioritize success flag over status code)
    if (success === true) {
      // Success: green color, only log in development
      if (shouldLogSuccess) {
        console.log(chalk.green(coloredMessage));
      }
    } else if (success === false) {
      // Explicit error: red color, log in all environments except test
      if (shouldLogError) {
        console.error(chalk.red(coloredMessage));
      }
    } else if (status !== undefined && (status < 200 || status >= 300)) {
      // Status code indicates error (not in 200-299 range): red color, log in all environments except test
      if (shouldLogError) {
        console.error(chalk.red(coloredMessage));
      }
    } else {
      // Default: no color, log in all environments except test
      if (shouldLogError) {
        console.log(coloredMessage);
      }
    }
  }

  /**
   * Sends an HTTP request to the backend server.
   * Uses request-specific parameters passed to this method.
   * @template T
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {string} path - API endpoint path
   * @param {any} body - Request body (optional)
   * @param {RequestOptions} options - Request options (query, params, cache, isMultipart)
   * @returns {Promise<AppResponse<T>>} Promise resolving to a standardized response object.
   */
  private async request<T>(method: string, path: string, body: any = {}, options: RequestOptions = {}): Promise<AppResponse<T>> {
    // Initialize cookie store
    this.cookieStore = await cookies();

    const { query = {}, params = [], cache = 'no-store', isMultipart = false, includeClientDomain = false } = options;

    try {
      // Prepare the request
      const { url, fetchOptions } = await this.prepareRequest(method, path, body, query, params, cache, isMultipart, includeClientDomain);

      // Make the request
      const response = await fetch(url, fetchOptions);

      // Handle cookies from response
      await this.handleCookies(response);

      // Parse and return the response
      return await this.parseResponse<T>(response, url, method);
    } catch (error: any) {
      // Log the error
      const errorMessage = error.message || 'Unknown error';
      this.log(`Error on ${method.toUpperCase()} ${path}: ${errorMessage}`, undefined, false);

      // Return the error data
      return { message: errorMessage, success: false, body: null };
    }
  }

  /**
   * Helper function to get the client's full URL (protocol + host + port) from headers.
   * Tries multiple header sources in priority order to construct the complete URL.
   *
   * @returns {Promise<string>} The full client URL (e.g., "http://192.168.100.8:3000" or "https://example.com:443").
   *                            Falls back to "http://localhost:3000" if headers are not available.
   */
  private async getClientHost(): Promise<string> {
    try {
      const headersList = await headers();

      // Try multiple header sources in priority order
      const host =
        headersList.get('x-forwarded-host') ||
        headersList.get('x-original-host') ||
        headersList.get('x-client-host') ||
        headersList.get('host');

      if (host) {
        // Determine the protocol
        // Priority: x-forwarded-proto > referer header > default to http
        const forwardedProto = headersList.get('x-forwarded-proto');
        const referer = headersList.get('referer');

        let protocol = 'http'; // default
        if (forwardedProto) {
          protocol = forwardedProto;
        } else if (referer) {
          protocol = referer.startsWith('https://') ? 'https' : 'http';
        }

        // Build the full URL with protocol and host (host may include port)
        const fullUrl = `${protocol}://${host}`;

        return fullUrl;
      }

      return 'http://localhost:3000'; // fallback for local development
    } catch (error) {
      this.log(`❌ [Frontend] Error getting host from headers: ${error}`, undefined, false);
      return 'http://localhost:3000'; // fallback for local development
    }
  }

  /**
   * Prepares the request by building URL and fetch options.
   *
   * Headers sent to the backend server:
   * - Cache-Control: Set based on the cache option (default: "no-store")
   * - x-client-url: Full client URL (protocol + host + port) when includeClientDomain is true
   *                 Example: "http://192.168.100.8:3000" or "https://example.com:443"
   * - Cookie: Only backend cookies (with "app_" prefix) are included, prefix is removed before sending
   * - Content-Type: "application/json" for non-GET requests (unless isMultipart is true)
   *
   * @param {string} method - HTTP method
   * @param {string} path - API endpoint path
   * @param {any} body - Request body
   * @param {Record<string, string | number | boolean>} query - Query parameters
   * @param {string[]} params - Path parameters
   * @param {string} cache - Cache control option
   * @param {boolean} isMultipart - Whether request is multipart
   * @param {boolean} includeClientDomain - Whether to include client's full URL in x-client-url header
   * @returns {Promise<Object>} Promise resolving to an object containing the URL and fetch options.
   */
  private async prepareRequest(
    method: string,
    path: string,
    body: any,
    query: Record<string, string | number | boolean>,
    params: string[],
    cache: 'no-store' | 'force-cache' | 'only-if-cached',
    isMultipart: boolean,
    includeClientDomain: boolean,
  ): Promise<PrepareRequestResult> {
    // Build the base URL
    let url = `${BASE_URL}${path}`;

    // Add path parameters to the URL
    if (params && params.length) {
      url += `/${params.join('/')}`;
    }

    // Add query parameters to the URL
    if (query && Object.keys(query).length) {
      const queryString = new URLSearchParams(Object.entries(query).map(([key, value]) => [key, String(value)])).toString();
      url += `?${queryString}`;
    }

    // Get all existing cookies
    const allCookies = this.cookieStore!.getAll();

    // Build headers
    const headers: Record<string, string> = {
      'Cache-Control': cache,
    };

    // Add the client's full URL header if requested (protocol + host + port, e.g., http://192.168.100.8:3000)
    if (includeClientDomain) {
      const clientUrl = await this.getClientHost();
      headers['x-client-url'] = clientUrl;
    }

    // Filter cookies to only include backend cookies (with prefix) and remove prefix when sending
    const backendCookies = allCookies
      .filter((cookie) => cookie.name.startsWith(BACKEND_COOKIE_PREFIX))
      .map((cookie) => {
        // Remove prefix before sending to backend
        const backendCookieName = cookie.name.substring(BACKEND_COOKIE_PREFIX.length);
        return `${backendCookieName}=${cookie.value}`;
      });

    // Only include backend cookies in the request
    if (backendCookies.length > 0) {
      headers['Cookie'] = backendCookies.join('; ');
    }

    // Add content type to the request
    if (!isMultipart && method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }

    // Build the fetch options
    const fetchOptions: RequestInit = {
      method,
      cache: 'no-store',
      headers,
      body: method === 'GET' ? undefined : isMultipart ? body : JSON.stringify(body ?? {}),
      credentials: 'include',
    };

    return { url, fetchOptions };
  }

  /**
   * Handles cookies from the fetch response and sets them in Next.js.
   * All cookies from the backend are saved with a prefix ("app_") to identify them as backend cookies.
   * Note: Cookie modifications are only allowed in Server Actions or Route Handlers.
   * If called from a Server Component context, cookie modifications will be silently skipped.
   * @param {Response} response - The fetch response object.
   */
  private async handleCookies(response: Response): Promise<void> {
    if (!this.cookieStore) return;

    try {
      // Try to use getSetCookie() if available (modern fetch API - Node.js 18+)
      if (typeof response.headers.getSetCookie === 'function') {
        const setCookieHeaders = response.headers.getSetCookie();
        if (setCookieHeaders && setCookieHeaders.length > 0) {
          for (const cookieString of setCookieHeaders) {
            this.parseAndSetCookie(cookieString);
          }
          return;
        }
      }

      // Fallback: parse Set-Cookie header manually
      // Note: response.headers.get() may only return the first Set-Cookie header
      // For multiple cookies, the server should send them as separate Set-Cookie headers
      // and getSetCookie() above will handle them. This fallback handles single cookie cases.
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        // Parse the Set-Cookie header (might contain multiple cookies separated by commas)
        const cookies = this.parseSetCookieHeader(setCookieHeader);
        for (const cookie of cookies) {
          // Check if cookie should be deleted
          const shouldDelete =
            (cookie.maxAge !== undefined && cookie.maxAge <= 0) ||
            (cookie.expires !== undefined && cookie.expires.getTime() < Date.now()) ||
            cookie.value === '' ||
            cookie.value === '""';

          // Add prefix to cookie name when saving (so we can identify backend cookies)
          const prefixedCookieName = `${BACKEND_COOKIE_PREFIX}${cookie.name}`;

          if (shouldDelete) {
            // Delete the cookie (try both prefixed and non-prefixed names for backward compatibility)
            this.cookieStore.delete(prefixedCookieName);
            this.cookieStore.delete(cookie.name);
            this.log(`Deleted cookie: ${cookie.name}`, undefined, true);
          } else {
            // Set the cookie with prefix
            this.cookieStore.set(prefixedCookieName, cookie.value, {
              httpOnly: cookie.httpOnly,
              secure: cookie.secure,
              sameSite: cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
              maxAge: cookie.maxAge,
              path: cookie.path,
              domain: cookie.domain,
            });
            // Also delete the old non-prefixed version if it exists (for migration)
            this.cookieStore.delete(cookie.name);
            this.log(`Set cookie: ${prefixedCookieName} (backend: ${cookie.name})`, undefined, true);
          }
        }
      }
    } catch (error: any) {
      // Cookies can only be modified in Server Actions or Route Handlers.
      // If we're in a Server Component context, silently skip cookie handling.
      // This prevents the error from breaking the request.
      const errorMessage = error?.message || String(error);
      if (errorMessage.includes('Cookies can only be modified')) {
        // Silently skip - this is expected in Server Component contexts
        return;
      }
      // Log other cookie-related errors
      this.log(`Warning: Failed to handle cookies: ${errorMessage}`, undefined, false);
    }
  }

  /**
   * Parses a single Set-Cookie header string into cookie properties.
   * Note: Cookie modifications are only allowed in Server Actions or Route Handlers.
   * @param {string} cookieString - The Set-Cookie header string.
   */
  private parseAndSetCookie(cookieString: string): void {
    if (!this.cookieStore) return;

    try {
      const parts = cookieString.split(';').map((p) => p.trim());
      const [nameValue] = parts;
      const [name, ...valueParts] = nameValue.split('=');
      const value = valueParts.join('='); // Handle values that contain "="

      const cookieOptions: CookieOptions = {};
      let shouldDelete = false;
      let expiresDate: Date | null = null;

      for (let i = 1; i < parts.length; i++) {
        const part = parts[i].toLowerCase();
        if (part === 'httponly') {
          cookieOptions.httpOnly = true;
        } else if (part === 'secure') {
          cookieOptions.secure = true;
        } else if (part.startsWith('samesite=')) {
          const sameSiteValue = part.split('=')[1];
          if (['strict', 'lax', 'none'].includes(sameSiteValue)) {
            cookieOptions.sameSite = sameSiteValue as 'strict' | 'lax' | 'none';
          }
        } else if (part.startsWith('max-age=')) {
          const maxAge = parseInt(part.split('=')[1], 10);
          if (!isNaN(maxAge)) {
            cookieOptions.maxAge = maxAge;
            // If max-age is 0 or negative, the cookie should be deleted
            if (maxAge <= 0) {
              shouldDelete = true;
            }
          }
        } else if (part.startsWith('path=')) {
          cookieOptions.path = part.split('=')[1];
        } else if (part.startsWith('domain=')) {
          cookieOptions.domain = part.split('=')[1];
        } else if (part.startsWith('expires=')) {
          // Parse expires date
          const expiresValue = parts[i].substring(8); // Get value after "expires=" (case-sensitive)
          try {
            expiresDate = new Date(expiresValue);
            // If expires date is in the past, the cookie should be deleted
            if (expiresDate.getTime() < Date.now()) {
              shouldDelete = true;
            }
          } catch (e) {
            // Invalid date format, ignore
          }
        }
      }

      const cookieName = name.trim();
      // Add prefix to cookie name when saving (so we can identify backend cookies)
      const prefixedCookieName = `${BACKEND_COOKIE_PREFIX}${cookieName}`;

      // Delete cookie if: max-age <= 0, expires in past, or empty value
      if (shouldDelete || value === '' || value === '""') {
        // Delete the cookie (try both prefixed and non-prefixed names for backward compatibility)
        this.cookieStore.delete(prefixedCookieName);
        this.cookieStore.delete(cookieName);
        this.log(`Deleted cookie: ${cookieName}`, undefined, true);
      } else {
        // Set the cookie with prefix
        this.cookieStore.set(prefixedCookieName, value, cookieOptions);
        // Also delete the old non-prefixed version if it exists (for migration)
        this.cookieStore.delete(cookieName);
        this.log(`Set cookie: ${prefixedCookieName} (backend: ${cookieName})`, undefined, true);
      }
    } catch (error: any) {
      // Cookies can only be modified in Server Actions or Route Handlers.
      // If we're in a Server Component context, silently skip cookie handling.
      const errorMessage = error?.message || String(error);
      if (errorMessage.includes('Cookies can only be modified')) {
        // Silently skip - this is expected in Server Component contexts
        return;
      }
      // Log other cookie-related errors
      this.log(`Warning: Failed to parse/set cookie: ${errorMessage}`, undefined, false);
    }
  }

  /**
   * Parses Set-Cookie header string into an array of cookie objects.
   * Handles multiple cookies separated by commas (with proper parsing).
   * @param {string} setCookieHeader - The Set-Cookie header string.
   * @returns {Array} Array of parsed cookie objects.
   */
  private parseSetCookieHeader(setCookieHeader: string): Cookie[] {
    const cookies: Cookie[] = [];

    // Split by comma, but be careful - cookie values can contain commas
    // We'll split on ", " (comma followed by space) which is the standard separator
    // and check if the next part looks like a cookie name (contains "=" before any ";")
    let currentCookie = '';
    const parts = setCookieHeader.split(', ');

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      // Check if this part starts a new cookie (has "=" before ";")
      const equalsIndex = part.indexOf('=');
      const semicolonIndex = part.indexOf(';');

      if (equalsIndex !== -1 && (semicolonIndex === -1 || equalsIndex < semicolonIndex)) {
        // This is a new cookie
        if (currentCookie) {
          this.parseCookieString(currentCookie, cookies);
        }
        currentCookie = part;
      } else {
        // This is a continuation of the current cookie
        currentCookie += ', ' + part;
      }
    }

    // Parse the last cookie
    if (currentCookie) {
      this.parseCookieString(currentCookie, cookies);
    }

    return cookies;
  }

  /**
   * Parses a single cookie string into a cookie object.
   * @param {string} cookieString - The cookie string to parse.
   * @param {Array} cookies - Array to push the parsed cookie to.
   */
  private parseCookieString(cookieString: string, cookies: Cookie[]): void {
    const parts = cookieString.split(';').map((p) => p.trim());
    const [nameValue] = parts;
    const equalsIndex = nameValue.indexOf('=');

    if (equalsIndex === -1) return;

    const name = nameValue.substring(0, equalsIndex).trim();
    const value = nameValue.substring(equalsIndex + 1).trim();

    const cookie: Cookie = { name, value };

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i].toLowerCase();
      if (part === 'httponly') {
        cookie.httpOnly = true;
      } else if (part === 'secure') {
        cookie.secure = true;
      } else if (part.startsWith('samesite=')) {
        cookie.sameSite = part.split('=')[1];
      } else if (part.startsWith('max-age=')) {
        const maxAge = parseInt(part.split('=')[1], 10);
        if (!isNaN(maxAge)) {
          cookie.maxAge = maxAge;
        }
      } else if (part.startsWith('expires=')) {
        // Parse expires date (case-insensitive check, but preserve original case for parsing)
        const expiresValue = parts[i].substring(8); // Get value after "expires=" (case-sensitive)
        try {
          cookie.expires = new Date(expiresValue);
        } catch (e) {
          // Invalid date format, ignore
        }
      } else if (part.startsWith('path=')) {
        cookie.path = part.split('=')[1];
      } else if (part.startsWith('domain=')) {
        cookie.domain = part.split('=')[1];
      }
    }

    cookies.push(cookie);
  }

  /**
   * Parses the response and returns a standardized AppResponse.
   * @template T
   * @param {Response} response - The fetch response object.
   * @param {string} url - The request URL for logging.
   * @param {string} method - The HTTP method for logging.
   * @returns {Promise<AppResponse<T>>} Promise resolving to a standardized response object.
   */
  private async parseResponse<T>(response: Response, url: string, method: string): Promise<AppResponse<T>> {
    const responseStatus = response.status;

    // Log the response status - use response.ok to check for success (200-299 status codes)
    const isSuccess = response.ok;
    this.log(`${method.toUpperCase()} ${url}`, responseStatus, isSuccess);

    // Parse the response data
    let responseData = null;
    try {
      responseData = await response.json();
    } catch (error: any) {
      const errorMessage = error?.message || String(error) || 'Unknown error';
      this.log(`Error parsing JSON from ${url}: ${errorMessage}`);
    }

    const success = responseData?.success ?? response.ok;
    const message = responseData?.message || response.statusText;

    // if key success or message in data please remove it
    if (responseData?.success) {
      delete responseData.success;
    }
    if (responseData?.message) {
      delete responseData.message;
    }

    // Return the response data
    return {
      message: message,
      success: success,
      body: responseData ?? null,
    };
  }

  /**
   * Sends a GET request.
   * @template T
   * @param {string} path - API endpoint path.
   * @param {RequestOptions} [options] - Optional query and cache options.
   * @returns {Promise<AppResponse<T>>} Promise resolving to the response.
   */
  async get<T>(path: string, options?: RequestOptions): Promise<AppResponse<T>> {
    return this.request<T>('GET', path, {}, options);
  }

  /**
   * Sends a POST request.
   * @template T
   * @param {string} path - API endpoint path.
   * @param {Object} [body] - Request body data.
   * @param {RequestOptions} [options] - Optional query, multipart and cache options.
   * @returns {Promise<AppResponse<T>>} Promise resolving to the response.
   */
  async post<T>(path: string, body?: any, options?: RequestOptions): Promise<AppResponse<T>> {
    return this.request<T>('POST', path, body ?? {}, options);
  }

  /**
   * Sends a PATCH request.
   * @template T
   * @param {string} path - API endpoint path.
   * @param {Object} [body] - Request body data.
   * @param {RequestOptions} [options] - Optional query, multipart and cache options.
   * @returns {Promise<AppResponse<T>>} Promise resolving to the response.
   */
  async patch<T>(path: string, body?: any, options?: RequestOptions): Promise<AppResponse<T>> {
    return this.request<T>('PATCH', path, body ?? {}, options);
  }

  /**
   * Sends a PUT request.
   * @template T
   * @param {string} path - API endpoint path.
   * @param {Object} [body] - Request body data.
   * @param {RequestOptions} [options] - Optional query, multipart and cache options.
   * @returns {Promise<AppResponse<T>>} Promise resolving to the response.
   */
  async put<T>(path: string, body?: any, options?: RequestOptions): Promise<AppResponse<T>> {
    return this.request<T>('PUT', path, body ?? {}, options);
  }

  /**
   * Sends a DELETE request.
   * @template T
   * @param {string} path - API endpoint path.
   * @param {Object} [body] - Request body data (optional).
   * @param {RequestOptions} [options] - Optional query, multipart and cache options.
   * @returns {Promise<AppResponse<T>>} Promise resolving to the response.
   */
  async delete<T>(path: string, body?: any, options?: RequestOptions): Promise<AppResponse<T>> {
    return this.request<T>('DELETE', path, body ?? {}, options);
  }

  /**
   * Sets a cookie that will be sent to the backend.
   * The cookie name is automatically prefixed to identify it as a backend cookie.
   * When sending to the backend, the prefix is removed.
   * @param {string} name - Cookie name (without prefix, e.g., "session_id")
   * @param {string} value - Cookie value
   * @param {CookieOptions} [options] - Optional cookie options (httpOnly, secure, sameSite, maxAge, path, domain)
   * @returns {Promise<void>} Promise that resolves when the cookie is set.
   */
  async setCookie(name: string, value: string, options?: CookieOptions): Promise<void> {
    const cookieStore = await cookies();
    const prefixedName = `${BACKEND_COOKIE_PREFIX}${name}`;

    try {
      // Set the cookie with prefix
      cookieStore.set(prefixedName, value, {
        httpOnly: options?.httpOnly,
        secure: options?.secure,
        sameSite: options?.sameSite,
        maxAge: options?.maxAge,
        path: options?.path,
        domain: options?.domain,
      });

      // Also delete the old non-prefixed version if it exists (for migration)
      cookieStore.delete(name);

      this.log(`Set cookie: ${prefixedName} (backend: ${name})`, undefined, true);
    } catch (error: any) {
      // Cookies can only be modified in Server Actions or Route Handlers.
      // If we're in a Server Component context, silently skip cookie handling.
      const errorMessage = error?.message || String(error);
      if (errorMessage.includes('Cookies can only be modified')) {
        // Silently skip - this is expected in Server Component contexts
        return;
      }
      // Log other cookie-related errors
      this.log(`Warning: Failed to set cookie: ${errorMessage}`, undefined, false);
    }
  }

  /**
   * Gets a cookie value by name (checks both prefixed and non-prefixed versions for backward compatibility).
   * @param {string} name - Cookie name (without prefix, e.g., "session_id")
   * @returns {Promise<string | undefined>} Promise that resolves to the cookie value or undefined.
   */
  async getCookie(name: string): Promise<string | undefined> {
    const cookieStore = await cookies();
    const prefixedName = `${BACKEND_COOKIE_PREFIX}${name}`;

    // Try prefixed name first
    const prefixedCookie = cookieStore.get(prefixedName);
    if (prefixedCookie?.value) {
      return prefixedCookie.value;
    }

    // Fallback to non-prefixed for backward compatibility
    const cookie = cookieStore.get(name);
    return cookie?.value;
  }

  /**
   * Deletes all cookies that were set by the server.
   * This method can be called from outside the class to clear all cookies.
   * If cookieNames are provided, only those cookies will be deleted.
   * If cookieNames are not provided, all backend cookies (with prefix) will be deleted.
   * @param {string[]} [cookieNames] - Optional array of cookie names to delete (without prefix).
   * @returns {Promise<void>} Promise that resolves when all cookies are deleted.
   */
  async deleteCookies(cookieNames?: string[]): Promise<void> {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    let deletedCount = 0;

    if (cookieNames && cookieNames.length > 0) {
      // Delete specific cookies (with prefix)
      for (const cookieName of cookieNames) {
        const prefixedName = `${BACKEND_COOKIE_PREFIX}${cookieName}`;
        cookieStore.delete(prefixedName);
        // Also try deleting non-prefixed version for backward compatibility
        cookieStore.delete(cookieName);
        deletedCount++;
      }
    }

    this.log(`Deleted ${deletedCount} cookie(s)`, undefined, true);
  }
}

// Export a singleton instance
const AppServer = new AppServerClass();
export default AppServer;
