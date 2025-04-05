import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  generateCSV, 
  downloadFile, 
  formatDateForFilename, 
  generatePdfHtml, 
  generateAndDownloadPdf 
} from "@/lib/export-utils";
import { type HeaderDetail } from "@/components/HeaderAnalysisSection";
import { type HeaderScan } from "@shared/schema";
import { Download } from "lucide-react";

interface ExportOptionsProps {
  scan: HeaderScan;
  securityHeaders: HeaderDetail[];
  performanceHeaders: HeaderDetail[];
  maintainabilityHeaders: HeaderDetail[];
  isDisabled?: boolean;
}

export default function ExportOptions({
  scan,
  securityHeaders,
  performanceHeaders,
  maintainabilityHeaders,
  isDisabled = false
}: ExportOptionsProps) {
  // Extract domain from URL for better filenames
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace(/^www\./, '');
    } catch (error) {
      return url.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
    }
  };

  const domain = getDomain(scan.url);
  const dateStr = formatDateForFilename(new Date(scan.timestamp));
  const baseFilename = `http-headers-${domain}-${dateStr}`;

  const handleExportCSV = () => {
    const csv = generateCSV(scan, securityHeaders, performanceHeaders, maintainabilityHeaders);
    downloadFile(csv, `${baseFilename}.csv`, 'text/csv');
  };

  const handleExportPDF = async () => {
    const htmlContent = generatePdfHtml(scan, securityHeaders, performanceHeaders, maintainabilityHeaders);
    await generateAndDownloadPdf(htmlContent, `${baseFilename}.pdf`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isDisabled}>
        <Button variant="outline" className="gap-2">
          <Download size={16} />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportCSV}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}