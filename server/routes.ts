import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { urlSchema, insertHeaderScanSchema } from "@shared/schema";
import fetch from "node-fetch";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Define the HeaderDetail type interface
interface HeaderDetail {
  name: string;
  key: string;
  implemented: boolean;
  value: string | null;
  status: 'missing' | 'implemented' | 'warning';
  importance: 'critical' | 'important' | 'recommended' | 'optional';
  description: string;
  recommendation?: string;
  link: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Analyze Headers Route
  app.post("/api/analyze", async (req, res) => {
    console.log("Received analyze request with body:", req.body);
    try {
      // Validate the URL from the request body
      // The urlSchema now handles URL transformation
      const { url } = urlSchema.parse(req.body);
      console.log("Validated URL:", url);
      const fullUrl = url;
      
      // Fetch the headers from the URL
      try {
        const response = await fetch(fullUrl, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'HTTPHeaderAnalyzer/1.0'
          },
          redirect: 'follow'
        });
        
        // Extract and format the headers
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        
        // Calculate scores (this would be much more detailed in a real implementation)
        const securityHeaders = calculateSecurityScore(headers);
        const performanceHeaders = calculatePerformanceScore(headers);
        const maintainabilityHeaders = calculateMaintainabilityScore(headers);
        
        // Check for Cloudflare headers
        const cloudflareHeaders = analyzeCloudflareHeaders(headers);
        
        // Calculate overall score
        const overallScore = Math.round(
          (securityHeaders.score + performanceHeaders.score + maintainabilityHeaders.score) / 3
        );
        
        // Create a header scan record
        const headerScan = {
          url: fullUrl,
          rawHeaders: headers,
          securityScore: securityHeaders.score,
          performanceScore: performanceHeaders.score,
          maintainabilityScore: maintainabilityHeaders.score,
          overallScore,
          totalSecurityHeaders: securityHeaders.total,
          implementedSecurityHeaders: securityHeaders.implemented,
          totalPerformanceHeaders: performanceHeaders.total,
          implementedPerformanceHeaders: performanceHeaders.implemented,
          totalMaintainabilityHeaders: maintainabilityHeaders.total,
          implementedMaintainabilityHeaders: maintainabilityHeaders.implemented,
          securityGrade: getGrade(securityHeaders.score),
          performanceGrade: getGrade(performanceHeaders.score),
          maintainabilityGrade: getGrade(maintainabilityHeaders.score),
          overallGrade: getGrade(overallScore)
        };
        
        // Save the record
        const savedHeaderScan = await storage.saveHeaderScan(headerScan);
        
        // Return the analysis to the client
        res.json({
          scan: savedHeaderScan,
          securityHeaders: securityHeaders.details,
          performanceHeaders: performanceHeaders.details,
          maintainabilityHeaders: maintainabilityHeaders.details,
          cloudflareHeaders: cloudflareHeaders.details,
          isUsingCloudflare: cloudflareHeaders.isUsingCloudflare
        });
      } catch (error) {
        console.error('Error fetching URL headers:', error);
        res.status(500).json({
          message: `Failed to fetch headers from URL. ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error('Error in /api/analyze route:', error);
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });

  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  
  // Self-check route - analyze our own headers
  app.get("/api/self-check", (req, res) => {
    // Create a new response object to send to ourselves
    const url = `http://localhost:5000${req.originalUrl}`;
    
    // Short circuit to prevent infinite recursion
    if (req.headers['x-self-check'] === 'true') {
      const headers = { ...res.getHeaders() as Record<string, string> };
      
      // Need to explicitly set Content-Type, Content-Encoding and Transfer-Encoding
      // since they're typically added during response sending
      headers['content-type'] = 'application/json; charset=utf-8';
      
      // If compression middleware is active, it will add content-encoding
      if (req.headers['accept-encoding']?.includes('gzip')) {
        headers['content-encoding'] = 'gzip';
      }
      
      // For large responses, transfer-encoding will be set
      headers['transfer-encoding'] = 'chunked';
      
      // Calculate scores using our explicitly enhanced headers
      const securityHeaders = calculateSecurityScore(headers);
      const performanceHeaders = calculatePerformanceScore(headers);
      const maintainabilityHeaders = calculateMaintainabilityScore(headers);
      
      // Calculate overall score
      const overallScore = Math.round(
        (securityHeaders.score + performanceHeaders.score + maintainabilityHeaders.score) / 3
      );
      
      // Return our own header analysis
      res.json({
        appName: "HTTP Header Analyzer",
        rawHeaders: headers,
        securityScore: securityHeaders.score,
        performanceScore: performanceHeaders.score,
        maintainabilityScore: maintainabilityHeaders.score,
        overallScore,
        securityGrade: getGrade(securityHeaders.score),
        performanceGrade: getGrade(performanceHeaders.score),
        maintainabilityGrade: getGrade(maintainabilityHeaders.score),
        overallGrade: getGrade(overallScore),
        securityHeaders: securityHeaders.details,
        performanceHeaders: performanceHeaders.details,
        maintainabilityHeaders: maintainabilityHeaders.details
      });
      return;
    }
    
    // Make an actual request to ourselves to capture all headers
    fetch(url, {
      headers: {
        'X-Self-Check': 'true',
        'Accept-Encoding': 'gzip'
      }
    })
    .then(response => {
      // Extract all headers from the response
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      
      // Calculate scores with the complete set of headers
      const securityHeaders = calculateSecurityScore(headers);
      const performanceHeaders = calculatePerformanceScore(headers);
      const maintainabilityHeaders = calculateMaintainabilityScore(headers);
      
      // Calculate overall score
      const overallScore = Math.round(
        (securityHeaders.score + performanceHeaders.score + maintainabilityHeaders.score) / 3
      );
      
      // Return the full header analysis
      res.json({
        appName: "HTTP Header Analyzer",
        rawHeaders: headers,
        securityScore: securityHeaders.score,
        performanceScore: performanceHeaders.score,
        maintainabilityScore: maintainabilityHeaders.score,
        overallScore,
        securityGrade: getGrade(securityHeaders.score),
        performanceGrade: getGrade(performanceHeaders.score),
        maintainabilityGrade: getGrade(maintainabilityHeaders.score),
        overallGrade: getGrade(overallScore),
        securityHeaders: securityHeaders.details,
        performanceHeaders: performanceHeaders.details,
        maintainabilityHeaders: maintainabilityHeaders.details
      });
    })
    .catch(error => {
      console.error('Error in self-check request:', error);
      res.status(500).json({ message: 'Error performing self-check' });
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to calculate security score
function calculateSecurityScore(headers: Record<string, string>) {
  const securityHeaders: HeaderDetail[] = [
    {
      name: 'Content-Security-Policy',
      key: 'content-security-policy',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'critical',
      description: 'Content Security Policy helps prevent Cross-Site Scripting (XSS) and data injection attacks by controlling which resources can be loaded by the browser.',
      recommendation: "Implement a strict Content Security Policy to restrict which resources can be loaded: default-src 'self'; script-src 'self' https://trusted-cdn.com",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP'
    },
    {
      name: 'X-XSS-Protection',
      key: 'x-xss-protection',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'important',
      description: 'X-XSS-Protection enables the browser\'s built-in XSS filtering capabilities to prevent some types of cross-site scripting attacks.',
      recommendation: "Set X-XSS-Protection to 1; mode=block to enable the browser's XSS filter",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection'
    },
    {
      name: 'X-Frame-Options',
      key: 'x-frame-options',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'important',
      description: 'X-Frame-Options prevents your site from being embedded in iframes on other domains, protecting against clickjacking attacks.',
      recommendation: "Set X-Frame-Options to DENY or SAMEORIGIN to prevent your site from being framed",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options'
    },
    {
      name: 'X-Content-Type-Options',
      key: 'x-content-type-options',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'important',
      description: 'X-Content-Type-Options prevents MIME type sniffing which can lead to security vulnerabilities.',
      recommendation: "Set X-Content-Type-Options to nosniff to prevent MIME type sniffing",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options'
    },
    {
      name: 'Strict-Transport-Security',
      key: 'strict-transport-security',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'critical',
      description: 'HTTP Strict Transport Security (HSTS) forces browsers to use HTTPS on your site, preventing man-in-the-middle attacks and cookie hijacking.',
      recommendation: "Set Strict-Transport-Security to max-age=31536000; includeSubDomains; preload to enforce HTTPS for your domain and subdomains",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security'
    },
    {
      name: 'Referrer-Policy',
      key: 'referrer-policy',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'recommended',
      description: 'Referrer-Policy controls how much referrer information is included with requests.',
      recommendation: "Set Referrer-Policy to no-referrer-when-downgrade or stricter to control information leakage",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy'
    },
    {
      name: 'Permissions-Policy',
      key: 'permissions-policy',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'recommended',
      description: 'Permissions-Policy (formerly Feature-Policy) provides a mechanism to allow or deny the use of browser features in a document.',
      recommendation: "Implement Permissions-Policy to restrict access to powerful features",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy'
    },
    {
      name: 'Cross-Origin-Embedder-Policy',
      key: 'cross-origin-embedder-policy',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'optional',
      description: 'Cross-Origin-Embedder-Policy prevents a document from loading any cross-origin resources that don\'t explicitly grant the document permission.',
      recommendation: "Consider setting Cross-Origin-Embedder-Policy to require-corp for sensitive applications",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy'
    },
    {
      name: 'Cross-Origin-Opener-Policy',
      key: 'cross-origin-opener-policy',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'optional',
      description: 'Cross-Origin-Opener-Policy allows you to ensure a top-level document does not share a browsing context group with cross-origin documents.',
      recommendation: "Consider setting Cross-Origin-Opener-Policy to same-origin to isolate your browsing context",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy'
    },
    {
      name: 'Cross-Origin-Resource-Policy',
      key: 'cross-origin-resource-policy',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'optional',
      description: 'Cross-Origin-Resource-Policy prevents other domains from reading resources.',
      recommendation: "Consider setting Cross-Origin-Resource-Policy to same-origin or same-site",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy'
    }
  ];
  
  // Check which headers are implemented
  let implemented = 0;
  
  for (const header of securityHeaders) {
    // Special case for Content-Security-Policy to also check for Report-Only variant
    let headerValue: string | undefined;
    if (header.key === 'content-security-policy') {
      headerValue = Object.keys(headers).find(
        key => key.toLowerCase() === header.key || key.toLowerCase() === 'content-security-policy-report-only'
      );
      
      // If only the report-only version is implemented, mark as warning instead of implemented
      if (headerValue && headerValue.toLowerCase() === 'content-security-policy-report-only') {
        header.implemented = true;
        header.value = headers[headerValue] as string;
        header.status = 'warning';
        header.recommendation = "You're using Content-Security-Policy-Report-Only which only monitors violations. Consider implementing the enforced Content-Security-Policy header for better security.";
        implemented++;
        continue;
      }
    } else {
      headerValue = Object.keys(headers).find(key => key.toLowerCase() === header.key);
    }
    
    if (headerValue) {
      header.implemented = true;
      header.value = headers[headerValue] as string;
      header.status = 'implemented';
      
      // Additional checks for specific headers
      if (header.key === 'strict-transport-security') {
        if (!header.value.includes('includeSubDomains')) {
          header.status = 'warning';
          header.recommendation = "Update your HSTS header to include subdomains and preload: max-age=31536000; includeSubDomains; preload";
        }
      } else if (header.key === 'content-security-policy') {
        if (header.value.includes("unsafe-inline") || header.value.includes("unsafe-eval")) {
          header.status = 'warning';
          header.recommendation = "Avoid using 'unsafe-inline' and 'unsafe-eval' in your CSP as they undermine its security benefits";
        }
      }
      
      implemented++;
    }
  }
  
  // Calculate score out of 100
  const score = Math.round((implemented / securityHeaders.length) * 100);
  
  return {
    score,
    total: securityHeaders.length,
    implemented,
    details: securityHeaders
  };
}

// Helper function to calculate performance score
function calculatePerformanceScore(headers: Record<string, string>) {
  const performanceHeaders: HeaderDetail[] = [
    {
      name: 'Cache-Control',
      key: 'cache-control',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'critical',
      description: 'Cache-Control defines how, and for how long, a browser or other cache can store a response.',
      recommendation: "Implement appropriate Cache-Control directives for your assets, such as 'max-age=31536000' for static assets",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control'
    },
    {
      name: 'ETag',
      key: 'etag',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'important',
      description: 'ETag provides a mechanism for validating cached resources, enabling conditional requests to save bandwidth.',
      recommendation: "Enable ETags to allow efficient validation of cached resources",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag'
    },
    {
      name: 'Vary',
      key: 'vary',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'important',
      description: 'Vary informs caches how to key their cache entries, allowing different cached responses based on client capabilities.',
      recommendation: "Use the Vary header with 'Accept-Encoding' to properly handle compressed content, and consider other values based on your content negotiation",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary'
    },
    {
      name: 'Content-Encoding',
      key: 'content-encoding',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'recommended',
      description: 'Content-Encoding indicates compression methods applied to the response, reducing payload size.',
      recommendation: "Enable compression (gzip or brotli) for text-based resources to reduce transfer size",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding'
    },
    {
      name: 'Transfer-Encoding',
      key: 'transfer-encoding',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'optional',
      description: 'Transfer-Encoding specifies transformations applied to the message body during transfer.',
      recommendation: "Consider using 'chunked' Transfer-Encoding for larger dynamic responses",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding'
    }
  ];
  
  // Check which headers are implemented
  let implemented = 0;
  
  for (const header of performanceHeaders) {
    const headerValue = Object.keys(headers).find(key => key.toLowerCase() === header.key);
    
    if (headerValue) {
      header.implemented = true;
      header.value = headers[headerValue] as string;
      header.status = 'implemented';
      
      // Additional checks for specific headers
      if (header.key === 'cache-control') {
        if (header.value === 'no-store' || header.value === 'no-cache, no-store' || header.value === 'private, no-cache, no-store') {
          // These are valid security-focused cache policies, but not performance-focused
          header.status = 'warning';
          header.recommendation = "Your cache policy is security-focused. For static assets, consider a longer cache duration with versioned URLs for better performance";
        } else if (!header.value.includes('max-age') && !header.value.includes('s-maxage')) {
          header.status = 'warning';
          header.recommendation = "Consider adding a max-age directive to your Cache-Control header for better caching";
        }
      }
      
      implemented++;
    }
  }
  
  // Calculate score out of 100
  const score = Math.round((implemented / performanceHeaders.length) * 100);
  
  return {
    score,
    total: performanceHeaders.length,
    implemented,
    details: performanceHeaders
  };
}

// Helper function to calculate maintainability score
function calculateMaintainabilityScore(headers: Record<string, string>) {
  const maintainabilityHeaders: HeaderDetail[] = [
    {
      name: 'Content-Type',
      key: 'content-type',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'critical',
      description: 'Content-Type specifies the media type of the resource, ensuring proper handling by clients.',
      recommendation: "Always set an appropriate Content-Type with charset for text-based resources",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type'
    },
    {
      name: 'Accept-Ranges',
      key: 'accept-ranges',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'recommended',
      description: 'Accept-Ranges indicates server support for range requests, enabling partial content retrieval.',
      recommendation: "Enable Accept-Ranges for large resources that might benefit from partial retrieval",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Ranges'
    },
    {
      name: 'Server-Timing',
      key: 'server-timing',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'optional',
      description: 'Server-Timing communicates timing information for request processing, aiding performance debugging.',
      recommendation: "Consider implementing Server-Timing to expose server processing metrics for debugging",
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing'
    }
  ];
  
  // Check which headers are implemented
  let implemented = 0;
  
  for (const header of maintainabilityHeaders) {
    const headerValue = Object.keys(headers).find(key => key.toLowerCase() === header.key);
    
    if (headerValue) {
      header.implemented = true;
      header.value = headers[headerValue] as string;
      header.status = 'implemented';
      
      // Additional checks for specific headers
      if (header.key === 'content-type') {
        if (header.value.startsWith('text/') && !header.value.includes('charset=')) {
          header.status = 'warning';
          header.recommendation = "Specify a character set in your Content-Type header for text-based resources";
        }
      }
      
      implemented++;
    }
  }
  
  // Calculate score out of 100
  const score = Math.round((implemented / maintainabilityHeaders.length) * 100);
  
  return {
    score,
    total: maintainabilityHeaders.length,
    implemented,
    details: maintainabilityHeaders
  };
}

// Helper function to get a letter grade based on score
function getGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  if (score >= 50) return 'E';
  return 'F';
}

// Helper function to analyze Cloudflare headers
function analyzeCloudflareHeaders(headers: Record<string, string>) {
  const cloudflareHeaders: HeaderDetail[] = [
    {
      name: 'CF-Cache-Status',
      key: 'cf-cache-status',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'optional',
      description: 'Indicates whether an asset was served from Cloudflare cache and its cache status.',
      recommendation: "This header shows how Cloudflare's cache is handling your content. Values like HIT, MISS, DYNAMIC indicate different caching behaviors.",
      link: 'https://developers.cloudflare.com/cache/concepts/cache-responses/'
    },
    {
      name: 'CF-Ray',
      key: 'cf-ray',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'optional',
      description: 'A unique identifier for the request through Cloudflare, useful for troubleshooting.',
      recommendation: "The presence of this header confirms your site is using Cloudflare. Keep this ID when reporting issues to Cloudflare support.",
      link: 'https://developers.cloudflare.com/fundamentals/get-started/reference/cloudflare-ray-id/'
    },
    {
      name: 'cf-edge-cache',
      key: 'cf-edge-cache',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'optional',
      description: 'Indicates whether your content was delivered through a Cloudflare edge server.',
      recommendation: "This header appears when your content is served through Cloudflare Edge Cache.",
      link: 'https://developers.cloudflare.com/cache/concepts/cache-responses/'
    },
    {
      name: 'cf-apo-via',
      key: 'cf-apo-via',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'optional',
      description: 'Indicates that the response was served by Cloudflare Automatic Platform Optimization.',
      recommendation: "This header appears when using Cloudflare's APO service for faster page loads.",
      link: 'https://developers.cloudflare.com/automatic-platform-optimization/'
    },
    {
      name: 'CF-Worker',
      key: 'cf-worker',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'optional',
      description: 'Indicates that the request was processed by a Cloudflare Worker script.',
      recommendation: "This header shows when your site is using Cloudflare Workers to modify responses.",
      link: 'https://developers.cloudflare.com/workers/'
    },
    {
      name: 'Server',
      key: 'server',
      implemented: false,
      value: null,
      status: 'missing',
      importance: 'optional',
      description: 'The Server header might indicate Cloudflare is serving your content.',
      recommendation: "If this header contains 'cloudflare', it confirms you're using their services.",
      link: 'https://developers.cloudflare.com/'
    }
  ];
  
  let implementedCount = 0;
  let isUsingCloudflare = false;
  
  // Check for Cloudflare headers
  for (const header of cloudflareHeaders) {
    const headerValue = Object.keys(headers).find(key => key.toLowerCase() === header.key);
    
    if (headerValue) {
      header.implemented = true;
      header.value = headers[headerValue] as string;
      header.status = 'implemented';
      implementedCount++;
      isUsingCloudflare = true;
    } else if (header.key === 'server' && headers['server']?.toLowerCase().includes('cloudflare')) {
      header.implemented = true;
      header.value = headers['server'];
      header.status = 'implemented';
      implementedCount++;
      isUsingCloudflare = true;
    }
  }
  
  return {
    isUsingCloudflare,
    total: cloudflareHeaders.length,
    implemented: implementedCount,
    details: cloudflareHeaders
  };
}
