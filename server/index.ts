import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import helmet from "helmet";
import compression from "compression";
import crypto from "crypto";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Enable compression for performance - adds Content-Encoding header
app.use(compression({
  // Force compression for all responses
  filter: () => true,
  // Set compression level (0-9, where 9 is maximum compression)
  level: 6
}));

// Add security, performance and maintainability headers with helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allow unsafe-eval for React development
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://*"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://*"], // Allow external API connections
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      baseUri: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
      workerSrc: ["'self'", "blob:"],
      manifestSrc: ["'self'"],
      mediaSrc: ["'self'"]
    }
  },
  xssFilter: true,
  frameguard: { action: 'deny' },
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  dnsPrefetchControl: { allow: true }, // Improve performance with DNS prefetching
  hidePoweredBy: false, // We'll set our own X-Powered-By
  noSniff: true, // Prevent MIME type sniffing
  crossOriginEmbedderPolicy: false, // Temporarily disabled for development
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-site' },
  originAgentCluster: true
}));

// Add custom headers
app.use((req, res, next) => {
  // Customize the X-Powered-By header
  res.setHeader('X-Powered-By', 'HTTP Header Analyzer');
  
  // Add performance headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Vary', 'Accept-Encoding, Origin');
  
  // Add missing performance headers
  res.setHeader('ETag', `W/"${crypto.randomBytes(8).toString('hex')}"`);
  
  // Enable Accept-Ranges for maintainability
  res.setHeader('Accept-Ranges', 'bytes');
  
  // Additional security headers not covered by helmet
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  
  // Remove these as they're now handled by helmet
  // res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  // res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  // res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  
  // Add server timing header for better performance analysis
  res.setHeader('Server-Timing', 'app;dur=0');
  
  // Add more maintainability headers
  res.setHeader('X-Request-ID', crypto.randomUUID());
  
  // Ensure Content-Type is properly set for maintainability
  const originalSend = res.send;
  res.send = function(body) {
    // If Content-Type is not already set, set it based on content
    if (!res.getHeader('Content-Type')) {
      if (typeof body === 'string') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
      } else if (Buffer.isBuffer(body)) {
        res.setHeader('Content-Type', 'application/octet-stream');
      }
    }
    return originalSend.apply(res, arguments as any);
  };
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    // Set Content-Type for JSON responses
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    // For Transfer-Encoding
    if (!res.getHeader('Transfer-Encoding') && bodyJson && JSON.stringify(bodyJson).length > 1024) {
      res.setHeader('Transfer-Encoding', 'chunked');
    }
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    
    // Add Server-Timing header with request duration
    const timingValue = `total;dur=${duration};desc="Total Processing Time"`;
    res.setHeader('Server-Timing', timingValue);

    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
