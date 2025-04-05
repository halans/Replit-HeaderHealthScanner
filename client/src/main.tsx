import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Make sure the app renders with the correct title
document.title = "HTTP Header Analyzer";

// Add required meta tags for the app
const metaTags = [
  { name: "description", content: "Analyze and visualize HTTP header best practices for security, performance, and maintainability" },
  { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1" },
  { name: "theme-color", content: "#3b82f6" },
  // Add security headers as meta tags
  { "http-equiv": "Content-Security-Policy", content: "default-src 'self'; script-src 'self' https://replit.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;" },
  { "http-equiv": "X-Content-Type-Options", content: "nosniff" },
  { "http-equiv": "X-Frame-Options", content: "DENY" },
  { "http-equiv": "X-XSS-Protection", content: "1; mode=block" },
  { "http-equiv": "Referrer-Policy", content: "no-referrer-when-downgrade" }
];

// Add the meta tags to the document head
metaTags.forEach(metaTag => {
  const meta = document.createElement("meta");
  Object.entries(metaTag).forEach(([key, value]) => {
    meta.setAttribute(key, value);
  });
  document.head.appendChild(meta);
});

// Add Google Fonts
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
document.head.appendChild(fontLink);

// Add Material Icons
const iconLink = document.createElement("link");
iconLink.rel = "stylesheet";
iconLink.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
document.head.appendChild(iconLink);

createRoot(document.getElementById("root")!).render(<App />);
