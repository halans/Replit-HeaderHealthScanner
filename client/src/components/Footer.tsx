import { Github, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6 md:order-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#1D3354]/70 hover:text-[#1D3354]">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
            <a href="#" className="text-[#1D3354]/70 hover:text-[#1D3354]">
              <span className="sr-only">Security</span>
              <Shield className="h-6 w-6" />
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-[#1D3354]/70">
              &copy; {new Date().getFullYear()} HTTP Header Analyzer. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
