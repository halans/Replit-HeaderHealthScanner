import { Github, Shield, BookOpen, ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-[#1D3354] mr-2" />
              <span className="font-semibold text-[#1D3354]">HTTP Header Analyzer</span>
            </div>
            <p className="text-sm text-[#36382E]/70 leading-relaxed">
              A comprehensive tool to analyze and improve website headers for security, performance, and maintainability.
            </p>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-medium text-[#1D3354] mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="text-[#36382E]/70 hover:text-[#1D3354] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#docs" className="text-[#36382E]/70 hover:text-[#1D3354] transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a 
                  href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#36382E]/70 hover:text-[#1D3354] transition-colors flex items-center"
                >
                  MDN Headers
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-medium text-[#1D3354] mb-4">Related Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://securityheaders.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#36382E]/70 hover:text-[#1D3354] transition-colors flex items-center"
                >
                  SecurityHeaders.com
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://observatory.mozilla.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#36382E]/70 hover:text-[#1D3354] transition-colors flex items-center"
                >
                  Mozilla Observatory
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://webhint.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#36382E]/70 hover:text-[#1D3354] transition-colors flex items-center"
                >
                  WebHint
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-medium text-[#1D3354] mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://github.com/halans/Replit-HeaderHealthScanner" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#1D3354]/70 hover:text-[#1D3354] transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://owasp.org/www-project-secure-headers/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#1D3354]/70 hover:text-[#1D3354] transition-colors"
              >
                <span className="sr-only">OWASP</span>
                <BookOpen className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-[#36382E]/60">
              Built with <Heart className="inline h-3 w-3 text-red-500" /> on Replit
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-center text-xs text-[#36382E]/60 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} HTTP Header Analyzer. All rights reserved.
          </p>
          <div className="flex space-x-4 text-xs text-[#36382E]/60">
            <a href="#" className="hover:text-[#1D3354] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#1D3354] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
