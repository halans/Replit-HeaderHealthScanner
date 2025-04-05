import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { urlSchema, insertHeaderScanSchema } from "@shared/schema";
import fetch from "node-fetch";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Analyze Headers Route
  app.post("/api/analyze", async (req, res) => {
    try {
      // Validate the URL from the request body
      const { url } = urlSchema.parse(req.body);
      
      let fullUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = `https://${url}`;
      }
      
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
          maintainabilityHeaders: maintainabilityHeaders.details
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

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to calculate security score
function calculateSecurityScore(headers: Record<string, string>) {
  const securityHeaders = [
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
    const headerValue = Object.keys(headers).find(key => key.toLowerCase() === header.key);
    
    if (headerValue) {
      header.implemented = true;
      header.value = headers[headerValue];
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
  const performanceHeaders = [
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
      header.value = headers[headerValue];
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
  const maintainabilityHeaders = [
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
      header.value = headers[headerValue];
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
