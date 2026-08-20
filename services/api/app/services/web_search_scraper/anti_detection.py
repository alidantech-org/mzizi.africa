"""
Advanced Anti-Detection and Stealth Utilities
Based on latest Cloudflare bypass and CAPTCHA avoidance techniques
"""

import random
import time
import logging
from typing import List, Dict, Any, Optional
from playwright.sync_api import Page, BrowserContext, Browser


class AntiDetectionEngine:
    """Advanced anti-detection engine for bypassing bot protection"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # Realistic browser user agents (latest versions)
        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
        ]
        
        # Realistic viewport sizes
        self.viewports = [
            {'width': 1920, 'height': 1080},
            {'width': 1366, 'height': 768},
            {'width': 1536, 'height': 864},
            {'width': 1440, 'height': 900},
            {'width': 1280, 'height': 720},
            {'width': 1600, 'height': 900},
        ]
        
        # Realistic screen resolutions
        self.screen_resolutions = [
            {'width': 1920, 'height': 1080},
            {'width': 1366, 'height': 768},
            {'width': 1536, 'height': 864},
            {'width': 1440, 'height': 900},
            {'width': 1280, 'height': 1024},
            {'width': 1600, 'height': 1200},
        ]

    def get_stealth_launch_args(self) -> List[str]:
        """Get advanced stealth launch arguments for browser"""
        return [
            "--disable-blink-features=AutomationControlled",
            "--disable-dev-shm-usage",
            "--disable-web-security",
            "--disable-features=IsolateOrigins,site-per-process",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-infobars",
            "--window-position=0,0",
            "--ignore-certifcate-errors",
            "--ignore-certifcate-errors-spki-list",
            "--disable-gpu",
            "--start-maximized",
            "--disable-default-apps",
            "--disable-extensions",
            "--disable-sync",
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
            "--disable-background-networking",
            "--disable-ipc-flooding-protection",
            "--enable-features=NetworkService",
            "--enable-features=NetworkServiceInProcess",
            "--disable-features=TranslateUI",
            "--disable-features=VizDisplayCompositor",
            "--disable-features=IsolateOrigins",
            "--disable-features=PerfDebug",
        ]

    def get_comprehensive_stealth_script(self) -> str:
        """Get comprehensive stealth script to hide automation"""
        return """
        // === NAVIGATOR PROPERTIES ===
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined
        });
        
        // Remove webdriver from window
        delete Object.getPrototypeOf(navigator).webdriver;
        
        // === PLUGINS ===
        Object.defineProperty(navigator, 'plugins', {
            get: () => [
                {
                    0: {type: "application/x-google-chrome-pdf", suffixes: "pdf", description: "Portable Document Format", enabledPlugin: Plugin},
                    description: "Portable Document Format",
                    filename: "internal-pdf-viewer",
                    length: 1,
                    name: "Chrome PDF Plugin"
                },
                {
                    0: {type: "application/pdf", suffixes: "pdf", description: "Portable Document Format", enabledPlugin: Plugin},
                    description: "Portable Document Format", 
                    filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
                    length: 1,
                    name: "Chrome PDF Viewer"
                }
            ]
        });
        
        // === LANGUAGES ===
        Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en']
        });
        
        // === CHROME OBJECT ===
        window.chrome = {
            runtime: {},
            loadTimes: function() {},
            csi: function() {},
            app: {}
        };
        
        // === PERMISSIONS ===
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );
        
        // === PLATFORM AND VENDOR ===
        Object.defineProperty(navigator, 'platform', {
            get: () => 'Win32'
        });
        
        Object.defineProperty(navigator, 'vendor', {
            get: () => 'Google Inc.'
        });
        
        // === HARDWARE PROPERTIES ===
        Object.defineProperty(navigator, 'maxTouchPoints', {
            get: () => 0
        });
        
        Object.defineProperty(navigator, 'hardwareConcurrency', {
            get: () => 8
        });
        
        Object.defineProperty(navigator, 'deviceMemory', {
            get: () => 8
        });
        
        // === BATTERY API ===
        if (!navigator.getBattery) {
            navigator.getBattery = () => Promise.resolve({
                charging: true,
                chargingTime: 0,
                dischargingTime: Infinity,
                level: 1.0
            });
        }
        
        // === AUTOMATION FLAG ===
        Object.defineProperty(navigator, 'automation', {
            get: () => undefined
        });
        
        // === MEDIA DEVICES ===
        if (!navigator.mediaDevices) {
            navigator.mediaDevices = {
                enumerateDevices: () => Promise.resolve([
                    {deviceId: "default", groupId: "default", kind: "audioinput", label: ""},
                    {deviceId: "default", groupId: "default", kind: "audiooutput", label: ""},
                    {deviceId: "default", groupId: "default", kind: "videoinput", label: ""}
                ])
            };
        }
        
        // === WEBGL VENDOR ===
        const getParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
            if (parameter === 37445) {
                return 'Intel Inc.';
            }
            if (parameter === 37446) {
                return 'Intel Iris OpenGL Engine';
            }
            return getParameter.apply(this, arguments);
        };
        
        // === CANVAS FINGERPRINTING ===
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
        
        HTMLCanvasElement.prototype.toDataURL = function(...args) {
            // Add some noise to canvas fingerprint
            const context = this.getContext('2d');
            if (context) {
                const imageData = context.getImageData(0, 0, this.width, this.height);
                for (let i = 0; i < imageData.data.length; i += 4) {
                    // Add tiny random noise
                    if (Math.random() < 0.01) {
                        imageData.data[i] += Math.floor(Math.random() * 3) - 1;
                        imageData.data[i + 1] += Math.floor(Math.random() * 3) - 1;
                        imageData.data[i + 2] += Math.floor(Math.random() * 3) - 1;
                    }
                }
                context.putImageData(imageData, 0, 0);
            }
            return originalToDataURL.apply(this, args);
        };
        
        CanvasRenderingContext2D.prototype.getImageData = function(...args) {
            return originalGetImageData.apply(this, args);
        };
        
        // === CONNECTION ===
        Object.defineProperty(navigator, 'connection', {
            get: () => ({
                effectiveType: '4g',
                rtt: 100,
                downlink: 10,
                saveData: false
            })
        });
        
        // === COOKIE STEALTH ===
        const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                                      Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
        
        if (originalCookieDescriptor) {
            Object.defineProperty(document, 'cookie', {
                get: function() {
                    return originalCookieDescriptor.get.call(this);
                },
                set: function(value) {
                    return originalCookieDescriptor.set.call(this, value);
                }
            });
        }
        
        // === IFRAME DETECTION ===
        Object.defineProperty(window, 'top', {
            get: () => window
        });
        
        Object.defineProperty(window, 'self', {
            get: () => window
        });
        
        // === toString OVERRIDES ===
        const originalToString = Function.prototype.toString;
        Function.prototype.toString = function() {
            if (this === navigator.getBattery) {
                return 'function getBattery() { [native code] }';
            }
            if (this === navigator.permissions.query) {
                return 'function query() { [native code] }';
            }
            return originalToString.apply(this, arguments);
        };
        
        // === MOUSE/KEYBOARD EVENTS ===
        let mouseEvents = 0;
        let keyboardEvents = 0;
        
        document.addEventListener('mousemove', () => mouseEvents++);
        document.addEventListener('mousedown', () => mouseEvents++);
        document.addEventListener('keydown', () => keyboardEvents++);
        
        // === CONSOLE DETECTION ===
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;
        
        console.log = function(...args) {
            if (args[0] && args[0].includes && args[0].includes('DevTools')) {
                return;
            }
            return originalLog.apply(console, args);
        };
        
        // === TIMING ATTACKS ===
        const originalNow = performance.now;
        performance.now = function() {
            const result = originalNow.apply(this, arguments);
            return result + Math.random() * 0.1;
        };
        
        // === HEADLESS DETECTION ===
        Object.defineProperty(navigator, 'headless', {
            get: () => undefined
        });
        
        // === WEBDRIVER DETECTION ===
        delete window.cdc_adoQpoasnfa76pfcZLmcfl_Array;
        delete window.cdc_adoQpoasnfa76pfcZLmcfl_Promise;
        delete window.cdc_adoQpoasnfa76pfcZLmcfl_Symbol;
        """

    def create_stealth_context(self, browser: Browser, headless: bool = False) -> BrowserContext:
        """Create a stealth browser context with realistic fingerprints"""
        
        # Randomize viewport and screen resolution
        viewport = random.choice(self.viewports)
        screen_resolution = random.choice(self.screen_resolutions)
        
        # Random user agent
        user_agent = random.choice(self.user_agents)
        
        # Create context with realistic settings
        context = browser.new_context(
            user_agent=user_agent,
            viewport=viewport,
            screen=screen_resolution,
            locale='en-US',
            timezone_id='America/New_York',  # More common timezone
            # Geolocation (random major US city)
            geolocation={'latitude': 40.7128 + random.uniform(-0.1, 0.1), 
                        'longitude': -74.0060 + random.uniform(-0.1, 0.1)},
            permissions=['geolocation'],
            # Extra HTTP headers
            extra_http_headers={
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Cache-Control': 'max-age=0',
                'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
            },
            # Bypass detection
            ignore_https_errors=True,
            java_script_enabled=True,
            # Reduce automation indicators
            reduced_motion='reduce',
            forced_colors='none',
        )
        
        # Add comprehensive stealth script
        context.add_init_script(self.get_comprehensive_stealth_script())
        
        self.logger.info(f"Created stealth context with viewport {viewport['width']}x{viewport['height']}")
        
        return context

    def simulate_human_behavior(self, page: Page):
        """Simulate human-like behavior patterns"""
        
        # Random mouse movements
        try:
            viewport_size = page.viewport_size
            if viewport_size:
                for _ in range(random.randint(3, 8)):
                    x = random.randint(0, viewport_size['width'])
                    y = random.randint(0, viewport_size['height'])
                    page.mouse.move(x, y)
                    page.wait_for_timeout(random.randint(50, 200))
        except:
            pass
        
        # Random scroll
        try:
            page.evaluate("""
                const scrollHeight = document.body.scrollHeight;
                const viewportHeight = window.innerHeight;
                const maxScroll = Math.max(0, scrollHeight - viewportHeight);
                
                if (maxScroll > 0) {
                    const scrollY = Math.random() * maxScroll;
                    window.scrollTo(0, scrollY);
                }
            """)
            page.wait_for_timeout(random.randint(500, 1500))
        except:
            pass

    def wait_for_cloudflare_challenge(self, page: Page, timeout: int = 30000) -> bool:
        """Wait for Cloudflare challenge to complete with enhanced detection"""
        
        self.logger.info("Waiting for Cloudflare challenge to complete...")
        
        try:
            # Wait for challenge to complete (multiple indicators)
            page.wait_for_function("""
                () => {
                    // Check if challenge indicators are gone
                    const body = document.body;
                    const bodyText = body ? body.innerText.toLowerCase() : '';
                    
                    // Multiple Cloudflare challenge indicators
                    const challengeIndicators = [
                        'checking your browser',
                        'cloudflare',
                        'security verification',
                        'verify you are not a bot',
                        'challenges.cloudflare.com',
                        'just a moment',
                        'enable javascript and cookies',
                        'ray id',
                        'performance & security by cloudflare'
                    ];
                    
                    // Check if any challenge indicators are still present
                    const hasChallenge = challengeIndicators.some(indicator => 
                        bodyText.includes(indicator)
                    );
                    
                    // Also check for challenge elements
                    const challengeElements = document.querySelectorAll([
                        '[data-ray]',
                        '.cf-browser-verification',
                        '#challenge-form',
                        '.cf-im-under-attack'
                    ].join(','));
                    
                    return !hasChallenge && challengeElements.length === 0;
                }
            """, timeout=timeout)
            
            # Additional wait after challenge completion
            page.wait_for_timeout(random.randint(2000, 4000))
            
            self.logger.info("✓ Cloudflare challenge completed successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Cloudflare challenge failed or timed out: {e}")
            return False

    def handle_captcha_manually(self, page: Page, timeout: int = 60000) -> bool:
        """Handle CAPTCHA with manual intervention option"""
        
        self.logger.warning("CAPTCHA detected! Manual intervention may be required.")
        
        try:
            # Look for common CAPTCHA elements
            captcha_selectors = [
                'iframe[title*="recaptcha"]',
                'iframe[title*="hCaptcha"]',
                'iframe[title*="CAPTCHA"]',
                '.cf-turnstile',
                '#cf-turnstile',
                '[data-sitekey]',
                '.g-recaptcha',
                '#recaptcha',
                '.h-captcha'
            ]
            
            captcha_found = False
            for selector in captcha_selectors:
                try:
                    element = page.query_selector(selector)
                    if element:
                        captcha_found = True
                        self.logger.info(f"CAPTCHA found with selector: {selector}")
                        break
                except:
                    continue
            
            if captcha_found:
                self.logger.info("Please solve the CAPTCHA manually in the browser window...")
                self.logger.info(f"Waiting {timeout/1000} seconds for CAPTCHA to be solved...")
                
                # Wait for CAPTCHA to be solved (check for success indicators)
                try:
                    page.wait_for_function("""
                        () => {
                            // Check for CAPTCHA success indicators
                            const successIndicators = [
                                '.g-recaptcha-response[value]',
                                'textarea[name="g-recaptcha-response"][value]',
                                '.h-captcha-response[value]',
                                'textarea[name="h-captcha-response"][value]',
                                '.cf-turnstile-response[value]'
                            ];
                            
                            return successIndicators.some(selector => {
                                const element = document.querySelector(selector);
                                return element && element.value && element.value.length > 0;
                            });
                        }
                    """, timeout=timeout)
                    
                    self.logger.info("✓ CAPTCHA appears to be solved!")
                    return True
                    
                except:
                    self.logger.warning("CAPTCHA was not solved within timeout period")
                    return False
            else:
                self.logger.info("No recognizable CAPTCHA elements found")
                return False
                
        except Exception as e:
            self.logger.error(f"Error handling CAPTCHA: {e}")
            return False

    def add_realistic_delays(self, base_delay: float = 2.0) -> float:
        """Add realistic human-like delays"""
        
        # Add random variation to base delay
        variation = random.uniform(0.5, 1.5)
        delay = base_delay * variation
        
        # Add occasional longer delays (human thinking time)
        if random.random() < 0.1:  # 10% chance
            delay += random.uniform(2.0, 5.0)
        
        # Add micro-delays for realism
        delay += random.uniform(0.1, 0.3)
        
        return delay
