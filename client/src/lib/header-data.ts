import { HeaderDetail } from "@/components/HeaderAnalysisSection";

// Security header descriptions
export const SECURITY_HEADERS: Record<string, Partial<HeaderDetail>> = {
  "Content-Security-Policy": {
    name: "Content-Security-Policy",
    key: "content-security-policy",
    description: "Content Security Policy helps prevent Cross-Site Scripting (XSS) and data injection attacks by controlling which resources can be loaded by the browser.",
    recommendation: "Implement a strict Content Security Policy to restrict which resources can be loaded",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP",
    importance: "critical"
  },
  "X-XSS-Protection": {
    name: "X-XSS-Protection",
    key: "x-xss-protection",
    description: "X-XSS-Protection enables the browser's built-in XSS filtering capabilities to prevent some types of cross-site scripting attacks.",
    recommendation: "Set X-XSS-Protection to 1; mode=block to enable the browser's XSS filter",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection",
    importance: "important"
  },
  "X-Frame-Options": {
    name: "X-Frame-Options",
    key: "x-frame-options",
    description: "X-Frame-Options prevents your site from being embedded in iframes on other domains, protecting against clickjacking attacks.",
    recommendation: "Set X-Frame-Options to DENY or SAMEORIGIN to prevent your site from being framed",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options",
    importance: "important"
  },
  "X-Content-Type-Options": {
    name: "X-Content-Type-Options",
    key: "x-content-type-options",
    description: "X-Content-Type-Options prevents MIME type sniffing which can lead to security vulnerabilities.",
    recommendation: "Set X-Content-Type-Options to nosniff to prevent MIME type sniffing",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options",
    importance: "important"
  },
  "Strict-Transport-Security": {
    name: "Strict-Transport-Security",
    key: "strict-transport-security",
    description: "HTTP Strict Transport Security (HSTS) forces browsers to use HTTPS on your site, preventing man-in-the-middle attacks and cookie hijacking.",
    recommendation: "Set Strict-Transport-Security to max-age=31536000; includeSubDomains; preload to enforce HTTPS for your domain and subdomains",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security",
    importance: "critical"
  }
};

// Performance header descriptions
export const PERFORMANCE_HEADERS: Record<string, Partial<HeaderDetail>> = {
  "Cache-Control": {
    name: "Cache-Control",
    key: "cache-control",
    description: "Cache-Control defines how, and for how long, a browser or other cache can store a response.",
    recommendation: "Implement appropriate Cache-Control directives for your assets, such as 'max-age=31536000' for static assets",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control",
    importance: "critical"
  },
  "ETag": {
    name: "ETag",
    key: "etag",
    description: "ETag provides a mechanism for validating cached resources, enabling conditional requests to save bandwidth.",
    recommendation: "Enable ETags to allow efficient validation of cached resources",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag",
    importance: "important"
  },
  "Vary": {
    name: "Vary",
    key: "vary",
    description: "Vary informs caches how to key their cache entries, allowing different cached responses based on client capabilities.",
    recommendation: "Use the Vary header with 'Accept-Encoding' to properly handle compressed content, and consider other values based on your content negotiation",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary",
    importance: "important"
  },
  "Server-Timing": {
    name: "Server-Timing",
    key: "server-timing",
    description: "Server-Timing communicates timing information for request processing, aiding performance debugging and optimization.",
    recommendation: "Implement Server-Timing to expose server processing metrics for debugging and performance analysis",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing",
    importance: "recommended"
  }
};

// Maintainability header descriptions
export const MAINTAINABILITY_HEADERS: Record<string, Partial<HeaderDetail>> = {
  "Content-Type": {
    name: "Content-Type",
    key: "content-type",
    description: "Content-Type specifies the media type of the resource, ensuring proper handling by clients.",
    recommendation: "Always set an appropriate Content-Type with charset for text-based resources",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type",
    importance: "critical"
  },
  "Accept-Ranges": {
    name: "Accept-Ranges",
    key: "accept-ranges",
    description: "Accept-Ranges indicates server support for range requests, enabling partial content retrieval.",
    recommendation: "Enable Accept-Ranges for large resources that might benefit from partial retrieval",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Ranges",
    importance: "recommended"
  },
  "X-Request-ID": {
    name: "X-Request-ID",
    key: "x-request-id",
    description: "X-Request-ID provides a unique identifier for HTTP requests, making request tracing and debugging easier.",
    recommendation: "Generate and include a unique X-Request-ID for each request to facilitate troubleshooting",
    link: "https://devcenter.heroku.com/articles/http-request-id",
    importance: "recommended"
  }
};
