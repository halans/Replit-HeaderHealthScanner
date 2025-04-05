import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RawHeadersSectionProps {
  headers: Record<string, string>;
}

export default function RawHeadersSection({ headers }: RawHeadersSectionProps) {
  const { toast } = useToast();

  // Format headers as string
  const formatHeaders = (headers: Record<string, string>): string => {
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  };

  const headerText = formatHeaders(headers);
  const headerCount = Object.keys(headers).length;

  // Copy headers to clipboard
  const copyHeaders = async () => {
    try {
      await navigator.clipboard.writeText(headerText);
      toast({
        title: "Success!",
        description: "Headers have been copied to clipboard",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy headers to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8 border-b-4 border-[#36382E] card-hover">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold gradient-heading">Raw HTTP Headers</h2>
          <p className="text-[#36382E]/70 mt-1">
            Complete list of all {headerCount} HTTP response headers
          </p>
        </div>
        <Button 
          onClick={copyHeaders}
          className="btn-secondary shadow-md"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy All Headers
        </Button>
      </div>
      
      <div className="bg-[#36382E] text-white p-5 rounded-md font-mono text-sm overflow-x-auto shadow-md">
        <div className="flex items-center justify-between mb-3 text-[#EDE6E3]/70 text-xs border-b border-[#EDE6E3]/20 pb-2">
          <span>HTTP RESPONSE HEADERS</span>
          <span>{headerCount} headers found</span>
        </div>
        <pre className="whitespace-pre-wrap break-all">{headerText}</pre>
      </div>
      
      <div className="mt-4 text-sm text-[#36382E]/60 flex items-center">
        <div className="w-2 h-2 bg-[#F06449] rounded-full mr-2"></div>
        <span>These headers were received when requesting the URL.</span>
      </div>
    </div>
  );
}
