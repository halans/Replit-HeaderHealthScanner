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

  // Copy headers to clipboard
  const copyHeaders = async () => {
    try {
      await navigator.clipboard.writeText(headerText);
      toast({
        title: "Headers copied",
        description: "Headers have been copied to clipboard",
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
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Raw HTTP Response Headers</h2>
        <Button 
          variant="ghost" 
          onClick={copyHeaders}
          className="text-primary-600 hover:text-primary-800 text-sm p-0 h-auto"
        >
          <Copy className="h-4 w-4 mr-1" />
          Copy All Headers
        </Button>
      </div>
      
      <div className="bg-slate-800 text-slate-200 p-4 rounded-md font-mono text-sm overflow-x-auto">
        <pre>{headerText}</pre>
      </div>
    </div>
  );
}
