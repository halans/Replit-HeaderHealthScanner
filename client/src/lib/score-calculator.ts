import { HeaderDetail } from "@/components/HeaderAnalysisSection";
import { formatDate } from "@/lib/utils";

/**
 * Calculate a letter grade based on a numerical score
 */
export function calculateGrade(score: number): string {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 63) return "D";
  if (score >= 60) return "D-";
  return "F";
}

/**
 * Generate a summary based on the analysis results
 */
export function generateSummary(
  securityImplemented: number,
  securityTotal: number,
  performanceImplemented: number,
  performanceTotal: number,
  maintainabilityImplemented: number,
  maintainabilityTotal: number,
  securityHeaders: HeaderDetail[]
): string {
  const totalImplemented = securityImplemented + performanceImplemented + maintainabilityImplemented;
  const totalHeaders = securityTotal + performanceTotal + maintainabilityTotal;
  
  let criticalMissingHeaders = securityHeaders
    .filter(header => !header.implemented && header.importance === 'critical')
    .map(header => header.name);
  
  let performanceIssue = "";
  if (performanceImplemented < performanceTotal) {
    performanceIssue = " Performance headers are " + 
      (performanceImplemented / performanceTotal > 0.7 ? "well implemented, but could benefit from adding additional optimizations." 
        : "missing several important optimizations.");
  }
  
  let summary = `Your site implements <span class="font-medium">${totalImplemented} out of ${totalHeaders}</span> recommended HTTP headers.`;
  
  if (criticalMissingHeaders.length > 0) {
    summary += ` Critical security headers like <span class="font-medium text-[#D64045]">${criticalMissingHeaders.join(", ")}</span> are missing, which may expose your site to security vulnerabilities.`;
  } else if (securityImplemented < securityTotal) {
    summary += ` Some security headers are missing but all critical ones are implemented.`;
  } else {
    summary += ` All security headers are properly implemented, great job!`;
  }
  
  summary += performanceIssue;
  
  if (maintainabilityImplemented === maintainabilityTotal) {
    summary += ` Maintainability headers are all properly implemented.`;
  }
  
  return summary;
}
