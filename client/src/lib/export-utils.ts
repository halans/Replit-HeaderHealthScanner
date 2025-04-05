import { type HeaderDetail } from "@/components/HeaderAnalysisSection";
import { type HeaderScan } from "@shared/schema";
import { generateSummary } from "./score-calculator";

/**
 * Generate CSV content from analysis results
 */
export function generateCSV(
  scan: HeaderScan,
  securityHeaders: HeaderDetail[],
  performanceHeaders: HeaderDetail[],
  maintainabilityHeaders: HeaderDetail[]
): string {
  // Create CSV header
  let csv = "Category,Name,Key,Implemented,Value,Status,Importance,Description,Recommendation,Link\n";
  
  // Add security headers
  securityHeaders.forEach(header => {
    csv += `Security,${escapeCsvField(header.name)},${escapeCsvField(header.key)},${header.implemented},${escapeCsvField(header.value || '')},${header.status},${header.importance},${escapeCsvField(header.description)},${escapeCsvField(header.recommendation || '')},${escapeCsvField(header.link)}\n`;
  });
  
  // Add performance headers
  performanceHeaders.forEach(header => {
    csv += `Performance,${escapeCsvField(header.name)},${escapeCsvField(header.key)},${header.implemented},${escapeCsvField(header.value || '')},${header.status},${header.importance},${escapeCsvField(header.description)},${escapeCsvField(header.recommendation || '')},${escapeCsvField(header.link)}\n`;
  });
  
  // Add maintainability headers
  maintainabilityHeaders.forEach(header => {
    csv += `Maintainability,${escapeCsvField(header.name)},${escapeCsvField(header.key)},${header.implemented},${escapeCsvField(header.value || '')},${header.status},${header.importance},${escapeCsvField(header.description)},${escapeCsvField(header.recommendation || '')},${escapeCsvField(header.link)}\n`;
  });
  
  return csv;
}

/**
 * Escape CSV field to handle commas, quotes, and newlines
 */
function escapeCsvField(field: string): string {
  // If the field contains commas, quotes, or newlines, it needs to be quoted
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    // Double up any quotes
    const escapedField = field.replace(/"/g, '""');
    return `"${escapedField}"`;
  }
  return field;
}

/**
 * Download data as a file
 */
export function downloadFile(data: string, filename: string, mimeType: string): void {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format date for filename
 */
export function formatDateForFilename(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Generate PDF-ready HTML content
 */
export function generatePdfHtml(
  scan: HeaderScan,
  securityHeaders: HeaderDetail[],
  performanceHeaders: HeaderDetail[],
  maintainabilityHeaders: HeaderDetail[]
): string {
  const timestamp = new Date(scan.timestamp).toLocaleString();
  const summary = generateSummary(
    scan.implementedSecurityHeaders,
    scan.totalSecurityHeaders,
    scan.implementedPerformanceHeaders,
    scan.totalPerformanceHeaders,
    scan.implementedMaintainabilityHeaders,
    scan.totalMaintainabilityHeaders,
    securityHeaders
  );

  // Helper function to create a table for headers
  const createHeaderTable = (title: string, headers: HeaderDetail[]): string => {
    return `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #1D3354;">${title} Headers</h3>
        <p>
          <strong>Score:</strong> ${getScore(title, scan)}% (Grade ${getGrade(title, scan)}) - 
          <strong>Implementation:</strong> ${getImplemented(title, scan)}/${getTotal(title, scan)} headers
        </p>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th>Header</th>
              <th>Status</th>
              <th>Importance</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            ${headers.map(header => `
              <tr>
                <td>${header.name}</td>
                <td>${header.status.charAt(0).toUpperCase() + header.status.slice(1)}</td>
                <td>${header.importance.charAt(0).toUpperCase() + header.importance.slice(1)}</td>
                <td>${header.value || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  // Helper function to get the correct score for each category
  function getScore(category: string, scan: HeaderScan): number {
    if (category === 'Security') return scan.securityScore;
    if (category === 'Performance') return scan.performanceScore;
    if (category === 'Maintainability') return scan.maintainabilityScore;
    return 0;
  }

  // Helper function to get the correct grade for each category
  function getGrade(category: string, scan: HeaderScan): string {
    if (category === 'Security') return scan.securityGrade;
    if (category === 'Performance') return scan.performanceGrade;
    if (category === 'Maintainability') return scan.maintainabilityGrade;
    return 'N/A';
  }

  // Helper function to get the implemented headers count for each category
  function getImplemented(category: string, scan: HeaderScan): number {
    if (category === 'Security') return scan.implementedSecurityHeaders;
    if (category === 'Performance') return scan.implementedPerformanceHeaders;
    if (category === 'Maintainability') return scan.implementedMaintainabilityHeaders;
    return 0;
  }

  // Helper function to get the total headers count for each category
  function getTotal(category: string, scan: HeaderScan): number {
    if (category === 'Security') return scan.totalSecurityHeaders;
    if (category === 'Performance') return scan.totalPerformanceHeaders;
    if (category === 'Maintainability') return scan.totalMaintainabilityHeaders;
    return 0;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>HTTP Header Analysis - ${scan.url}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        h1, h2, h3 {
          color: #1D3354;
        }
        .header {
          border-bottom: 1px solid #ddd;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .overall-score {
          display: flex;
          justify-content: space-between;
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .score-card {
          text-align: center;
          padding: 15px;
          border-radius: 8px;
        }
        .table-container {
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border: 1px solid #ddd;
        }
        th {
          background-color: #f3f4f6;
        }
        .summary {
          background-color: #f0f9ff;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>HTTP Header Analysis Report</h1>
        <p>URL: <strong>${scan.url}</strong></p>
        <p>Analyzed on: ${timestamp}</p>
      </div>

      <div class="overall-score">
        <div class="score-card">
          <h3>Overall Score</h3>
          <h2>${scan.overallScore}% (${scan.overallGrade})</h2>
        </div>
        <div class="score-card">
          <h3>Security</h3>
          <h2>${scan.securityScore}% (${scan.securityGrade})</h2>
          <p>${scan.implementedSecurityHeaders}/${scan.totalSecurityHeaders} implemented</p>
        </div>
        <div class="score-card">
          <h3>Performance</h3>
          <h2>${scan.performanceScore}% (${scan.performanceGrade})</h2>
          <p>${scan.implementedPerformanceHeaders}/${scan.totalPerformanceHeaders} implemented</p>
        </div>
        <div class="score-card">
          <h3>Maintainability</h3>
          <h2>${scan.maintainabilityScore}% (${scan.maintainabilityGrade})</h2>
          <p>${scan.implementedMaintainabilityHeaders}/${scan.totalMaintainabilityHeaders} implemented</p>
        </div>
      </div>

      <div class="summary">
        <h2>Summary</h2>
        <p>${summary}</p>
      </div>

      <div class="table-container">
        ${createHeaderTable('Security', securityHeaders)}
        ${createHeaderTable('Performance', performanceHeaders)}
        ${createHeaderTable('Maintainability', maintainabilityHeaders)}
      </div>
      
      <div class="raw-headers">
        <h2>Raw Headers</h2>
        <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; font-size: 12px;">
${Object.entries(scan.rawHeaders as Record<string, string>)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}
        </pre>
      </div>

      <div class="footer">
        <p>Generated by HTTP Header Analyzer on ${timestamp}</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Helper function to generate PDF using html2pdf library
 */
export async function generateAndDownloadPdf(htmlContent: string, filename: string): Promise<void> {
  // Use dynamic import to load html2pdf.js only when needed
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    document.body.appendChild(element);
    
    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' }
    };
    
    await html2pdf().from(element).set(opt).save();
    
    // Clean up the temporary element
    document.body.removeChild(element);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
}