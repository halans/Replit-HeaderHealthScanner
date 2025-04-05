import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type HeaderScan } from "@shared/schema";
import { type HeaderDetail } from "@/components/HeaderAnalysisSection";
import UrlInputForm from "@/components/UrlInputForm";
import OverallScore from "@/components/OverallScore";
import HeaderAnalysisSection from "@/components/HeaderAnalysisSection";
import RawHeadersSection from "@/components/RawHeadersSection";
import CloudflareHeadersSection from "@/components/CloudflareHeadersSection";
import { generateSummary } from "@/lib/score-calculator";

interface AnalysisResult {
  scan: HeaderScan;
  securityHeaders: HeaderDetail[];
  performanceHeaders: HeaderDetail[];
  maintainabilityHeaders: HeaderDetail[];
  cloudflareHeaders?: HeaderDetail[];
  isUsingCloudflare?: boolean;
  httpProtocol?: {
    protocol: string;
    details?: string;
  };
}

export default function Home() {
  const { toast } = useToast();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Mutation for analyzing headers
  const analyzeHeadersMutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await apiRequest("POST", "/api/analyze", { url });
      return res.json();
    },
    onSuccess: (data: AnalysisResult) => {
      setResult(data);
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze the website. Please check the URL and try again.",
        variant: "destructive",
      });
    },
  });

  // Handle analyze button click
  const handleAnalyze = (url: string) => {
    console.log("Analyze button clicked with URL:", url);
    analyzeHeadersMutation.mutate(url);
  };

  // Generate a summary if we have a result
  const summary = result ? generateSummary(
    result.scan.implementedSecurityHeaders,
    result.scan.totalSecurityHeaders,
    result.scan.implementedPerformanceHeaders,
    result.scan.totalPerformanceHeaders,
    result.scan.implementedMaintainabilityHeaders,
    result.scan.totalMaintainabilityHeaders,
    result.securityHeaders
  ) : "";

  return (
    <>
      <UrlInputForm onAnalyze={handleAnalyze} isLoading={analyzeHeadersMutation.isPending} />
      
      {/* Loading State */}
      {analyzeHeadersMutation.isPending && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-primary-600 animate-spin"></div>
          <p className="mt-4 text-slate-600">
            Analyzing headers for <span className="font-medium">{analyzeHeadersMutation.variables}</span>...
          </p>
        </div>
      )}
      
      {/* Results Content */}
      {result && !analyzeHeadersMutation.isPending && (
        <>
          <OverallScore
            url={result.scan.url}
            timestamp={new Date(result.scan.timestamp)}
            overallScore={result.scan.overallScore}
            overallGrade={result.scan.overallGrade}
            security={{
              score: result.scan.securityScore,
              implemented: result.scan.implementedSecurityHeaders,
              total: result.scan.totalSecurityHeaders,
              grade: result.scan.securityGrade,
            }}
            performance={{
              score: result.scan.performanceScore,
              implemented: result.scan.implementedPerformanceHeaders,
              total: result.scan.totalPerformanceHeaders,
              grade: result.scan.performanceGrade,
            }}
            maintainability={{
              score: result.scan.maintainabilityScore,
              implemented: result.scan.implementedMaintainabilityHeaders,
              total: result.scan.totalMaintainabilityHeaders,
              grade: result.scan.maintainabilityGrade,
            }}
            summary={summary}
            securityHeaders={result.securityHeaders}
            performanceHeaders={result.performanceHeaders}
            maintainabilityHeaders={result.maintainabilityHeaders}
            scan={result.scan}
            httpProtocol={result.httpProtocol}
          />
          
          <div className="w-full mb-6">
            <HeaderAnalysisSection
              securityHeaders={result.securityHeaders}
              performanceHeaders={result.performanceHeaders}
              maintainabilityHeaders={result.maintainabilityHeaders}
            />
          </div>
          
          {/* Cloudflare Headers Section - Only show if site uses Cloudflare */}
          {result.isUsingCloudflare && result.cloudflareHeaders && result.cloudflareHeaders.length > 0 && (
            <CloudflareHeadersSection cloudflareHeaders={result.cloudflareHeaders} />
          )}
          
          <RawHeadersSection headers={result.scan.rawHeaders as Record<string, string>} />
        </>
      )}
      
      {/* About Section */}
      <section id="about" className="bg-white rounded-lg shadow-lg p-8 mb-8 mt-16">
        <h2 className="text-2xl font-bold gradient-heading mb-6">About HTTP Header Analyzer</h2>
        <div className="space-y-4">
          <p className="text-[#36382E] leading-relaxed">
            HTTP Header Analyzer is a comprehensive tool designed to help website owners and developers evaluate their implementation of HTTP headers. It analyzes headers across three critical dimensions:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[#36382E]">
            <li>
              <strong className="text-[#1D3354]">Security</strong>: Checks for headers that protect against common web vulnerabilities such as XSS attacks, clickjacking, and data breaches.
            </li>
            <li>
              <strong className="text-[#1D3354]">Performance</strong>: Evaluates headers that improve website loading speed through caching, compression, and resource optimization.
            </li>
            <li>
              <strong className="text-[#1D3354]">Maintainability</strong>: Assesses headers that facilitate troubleshooting, debugging, and infrastructure management.
            </li>
          </ul>
          <p className="text-[#36382E] leading-relaxed">
            Our analyzer provides detailed explanations for each header, highlighting their importance and offering recommendations for optimal implementation.
          </p>
          <p className="text-[#36382E] leading-relaxed">
            This tool is built following modern web security standards, including recommendations from OWASP, Mozilla Observatory, and SecurityHeaders.com.
          </p>
        </div>
      </section>
      
      {/* Documentation Section */}
      <section id="docs" className="bg-white rounded-lg shadow-lg p-8 mb-16">
        <h2 className="text-2xl font-bold gradient-heading mb-6">Documentation</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-[#1D3354] mb-3">How to Use</h3>
            <ol className="list-decimal pl-6 space-y-2 text-[#36382E]">
              <li>Enter a website URL in the input field at the top of the page</li>
              <li>Click "Analyze Headers" to start the analysis</li>
              <li>Review the overall score and category breakdowns</li>
              <li>Examine detailed information in each tab of the analysis section</li>
              <li>Use the export options to download your results as PDF or CSV</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-[#1D3354] mb-3">Important Headers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border p-4 rounded-md">
                <h4 className="font-medium text-[#1D3354] mb-2">Security Headers</h4>
                <ul className="list-disc pl-4 text-sm text-[#36382E]/80">
                  <li>Content-Security-Policy</li>
                  <li>X-XSS-Protection</li>
                  <li>X-Frame-Options</li>
                  <li>X-Content-Type-Options</li>
                  <li>Strict-Transport-Security</li>
                  <li>Referrer-Policy</li>
                </ul>
              </div>
              <div className="border p-4 rounded-md">
                <h4 className="font-medium text-[#1D3354] mb-2">Performance Headers</h4>
                <ul className="list-disc pl-4 text-sm text-[#36382E]/80">
                  <li>Cache-Control</li>
                  <li>ETag</li>
                  <li>Vary</li>
                  <li>Content-Encoding</li>
                  <li>Transfer-Encoding</li>
                </ul>
              </div>
              <div className="border p-4 rounded-md">
                <h4 className="font-medium text-[#1D3354] mb-2">Maintainability Headers</h4>
                <ul className="list-disc pl-4 text-sm text-[#36382E]/80">
                  <li>X-Powered-By</li>
                  <li>Server</li>
                  <li>X-Runtime</li>
                  <li>X-Request-ID</li>
                  <li>X-DNS-Prefetch-Control</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-[#1D3354] mb-3">Resources</h3>
            <ul className="list-disc pl-6 space-y-2 text-[#36382E]">
              <li>
                <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers" 
                   className="text-[#F06449] hover:underline" 
                   target="_blank" 
                   rel="noreferrer noopener">
                  Mozilla MDN: HTTP Headers Documentation
                </a>
              </li>
              <li>
                <a href="https://owasp.org/www-project-secure-headers/" 
                   className="text-[#F06449] hover:underline" 
                   target="_blank" 
                   rel="noreferrer noopener">
                  OWASP Secure Headers Project
                </a>
              </li>
              <li>
                <a href="https://securityheaders.com/" 
                   className="text-[#F06449] hover:underline" 
                   target="_blank" 
                   rel="noreferrer noopener">
                  SecurityHeaders.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
