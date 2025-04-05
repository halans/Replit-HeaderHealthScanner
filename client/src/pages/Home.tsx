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
    </>
  );
}
