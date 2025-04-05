import { Github, Shield, BookOpen, ExternalLink, Heart } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
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
              A comprehensive tool to analyze and improve website headers for security, performance, and maintainability. Generated using Replit Agent.
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
              Made with <Heart className="inline h-3 w-3 text-red-500" /> on Replit in Sydney
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-center text-xs text-[#36382E]/60 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} HTTP Header Analyzer. All rights reserved.
          </p>
          <div className="flex space-x-4 text-xs text-[#36382E]/60">
            <button 
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-[#1D3354] transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setTermsOpen(true)}
              className="hover:text-[#1D3354] transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Dialog */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription>Last updated: {new Date().toLocaleDateString()}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <h3 className="font-semibold text-lg">1. Information We Collect</h3>
            <p>When you use our HTTP Header Analyzer tool, we collect the following information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The URL you submit for analysis</li>
              <li>HTTP headers retrieved from that URL</li>
              <li>Analysis results and scores</li>
              <li>Basic usage statistics (time of analysis, browser information)</li>
            </ul>
            
            <h3 className="font-semibold text-lg">2. How We Use Your Information</h3>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide the requested header analysis</li>
              <li>Improve our tool's accuracy and performance</li>
              <li>Generate anonymous usage statistics</li>
              <li>Fix bugs and technical issues</li>
            </ul>
            
            <h3 className="font-semibold text-lg">3. Data Retention</h3>
            <p>We retain your analysis results for a limited period of time for technical and debugging purposes. We do not sell your data to third parties.</p>
            
            <h3 className="font-semibold text-lg">4. Third-Party Services</h3>
            <p>Our service may use third-party tools for analytics and monitoring. These services have their own privacy policies.</p>
            
            <h3 className="font-semibold text-lg">5. Changes to This Policy</h3>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
            
            <h3 className="font-semibold text-lg">6. Contact Us</h3>
            <p>If you have any questions about this privacy policy, please contact us at privacy@example.com.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Dialog */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogDescription>Last updated: {new Date().toLocaleDateString()}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <h3 className="font-semibold text-lg">1. Acceptance of Terms</h3>
            <p>By using the HTTP Header Analyzer, you agree to these Terms of Service. If you do not agree, please do not use this service.</p>
            
            <h3 className="font-semibold text-lg">2. Description of Service</h3>
            <p>The HTTP Header Analyzer is a tool designed to analyze HTTP headers from websites for security, performance, and maintainability best practices. We provide this service on an "as is" and "as available" basis.</p>
            
            <h3 className="font-semibold text-lg">3. User Responsibilities</h3>
            <p>When using our service, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Only analyze websites you own or have permission to analyze</li>
              <li>Not use our service for any illegal or unauthorized purpose</li>
              <li>Not attempt to interfere with or compromise the system integrity or security</li>
              <li>Not use automated systems or software to extract data from our service</li>
            </ul>
            
            <h3 className="font-semibold text-lg">4. Limitations of Liability</h3>
            <p>We strive for accuracy but cannot guarantee that all analyses are error-free or complete. We are not liable for any damages arising from your use or inability to use our service.</p>
            
            <h3 className="font-semibold text-lg">5. Intellectual Property</h3>
            <p>All content, design, graphics, compilation, digital conversion, and other matters related to the site are protected under applicable copyrights, trademarks, and other proprietary rights.</p>
            
            <h3 className="font-semibold text-lg">6. Modifications to Terms</h3>
            <p>We reserve the right to modify these terms at any time. Your continued use of the service after such changes constitutes your acceptance of the new terms.</p>
            
            <h3 className="font-semibold text-lg">7. Governing Law</h3>
            <p>These terms are governed by and construed in accordance with applicable laws, without regard to its conflict of law principles.</p>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
