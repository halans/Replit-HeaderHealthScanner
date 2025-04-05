import { Copy, Clock, AlertTriangle, ShieldCheck, Zap, Info, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RawHeadersSectionProps {
  headers: Record<string, string>;
}

// Special header types for highlighting
const HEADER_TYPES = {
  SECURITY: [
    'content-security-policy', 'x-xss-protection', 'x-frame-options',
    'x-content-type-options', 'strict-transport-security', 'referrer-policy',
    'permissions-policy', 'cross-origin-embedder-policy', 'cross-origin-opener-policy',
    'cross-origin-resource-policy'
  ],
  PERFORMANCE: [
    'cache-control', 'etag', 'vary', 'content-encoding', 'transfer-encoding',
    'accept-ranges', 'server-timing', 'timing-allow-origin', 'content-length'
  ],
  MAINTAINABILITY: [
    'x-powered-by', 'x-request-id', 'x-robots-tag', 'alt-svc', 'link'
  ]
};

export default function RawHeadersSection({ headers }: RawHeadersSectionProps) {
  const { toast } = useToast();
  const headerCount = Object.keys(headers).length;

  // Categorize headers
  const categorizeHeader = (headerName: string): 'security' | 'performance' | 'maintainability' | 'other' => {
    const lowerName = headerName.toLowerCase();
    if (HEADER_TYPES.SECURITY.includes(lowerName)) return 'security';
    if (HEADER_TYPES.PERFORMANCE.includes(lowerName)) return 'performance';
    if (HEADER_TYPES.MAINTAINABILITY.includes(lowerName)) return 'maintainability';
    return 'other';
  };

  // Format Server-Timing header for display
  const formatServerTiming = (value: string): React.ReactNode => {
    const timings = value.split(',').map(t => t.trim());
    
    return (
      <div className="ml-4 mt-2 p-2 bg-slate-800 rounded-md">
        {timings.map((timing, index) => {
          const parts = timing.split(';');
          const name = parts[0];
          
          // Extract duration if available
          const durationMatch = timing.match(/dur=(\d+)/);
          const duration = durationMatch ? parseInt(durationMatch[1]) : null;
          
          // Extract description if available
          const descMatch = timing.match(/desc="([^"]+)"/);
          const description = descMatch ? descMatch[1] : name;
          
          return (
            <div key={index} className="mb-1 flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              <span className="font-medium text-blue-300">{description}:</span> 
              {duration !== null && (
                <span className="ml-2 text-white">{duration}ms</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Format headers for display
  const renderHeaders = () => {
    return Object.entries(headers).map(([key, value], index) => {
      const category = categorizeHeader(key);
      const isServerTiming = key.toLowerCase() === 'server-timing';
      
      // Badge color based on category
      let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
      let icon: React.ReactNode = <Info className="h-3 w-3 mr-1" />;
      let badgeClass = "bg-gray-600 text-white";
      
      if (category === 'security') {
        badgeVariant = "default";
        icon = <ShieldCheck className="h-3 w-3 mr-1" />;
        badgeClass = "";
      } else if (category === 'performance') {
        badgeVariant = "secondary";
        icon = <Zap className="h-3 w-3 mr-1" />;
        badgeClass = "";
      } else if (category === 'maintainability') {
        badgeVariant = "destructive";
        icon = <AlertTriangle className="h-3 w-3 mr-1" />;
        badgeClass = "";
      }
      
      return (
        <div 
          key={index} 
          className={`py-2 ${index !== 0 ? 'border-t border-[#EDE6E3]/20' : ''} ${
            isServerTiming ? 'bg-slate-900' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <span className="text-[#9ED8DB] font-medium">{key}:</span>
              <Badge variant={badgeVariant} className={`ml-2 text-xs ${badgeClass}`}>
                {icon}
                {category}
              </Badge>
            </div>
          </div>
          <div className={`${isServerTiming ? 'block' : 'text-[#EDE6E3]/80'} mt-1`}>
            {isServerTiming ? formatServerTiming(value) : value}
          </div>
        </div>
      );
    });
  };

  // Format headers as string for copy function and raw display
  const formatHeadersText = (): string => {
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  };
  
  // Render raw headers as plain text
  const renderRawHeaders = () => {
    return (
      <pre className="whitespace-pre-wrap font-mono text-[#EDE6E3]/80 break-all">
        {formatHeadersText()}
      </pre>
    );
  };

  // Copy headers to clipboard
  const copyHeaders = async () => {
    try {
      await navigator.clipboard.writeText(formatHeadersText());
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
      
      <Tabs defaultValue="formatted" className="w-full">
        <div className="flex items-center justify-between mb-3">
          <TabsList className="mb-2">
            <TabsTrigger value="formatted" className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Formatted
            </TabsTrigger>
            <TabsTrigger value="raw" className="flex items-center">
              <Code className="h-4 w-4 mr-2" />
              Raw Text
            </TabsTrigger>
          </TabsList>
          <span className="flex items-center text-[#36382E]/70 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {headerCount} headers found
          </span>
        </div>
        
        <div className="bg-[#36382E] text-white p-5 rounded-md font-mono text-sm overflow-x-auto shadow-md">
          <div className="flex items-center justify-between mb-3 text-[#EDE6E3]/70 text-xs border-b border-[#EDE6E3]/20 pb-2">
            <span>HTTP RESPONSE HEADERS</span>
          </div>
          
          <TabsContent value="formatted" className="whitespace-pre-wrap break-all m-0 p-0">
            {renderHeaders()}
          </TabsContent>
          
          <TabsContent value="raw" className="m-0 p-0">
            {renderRawHeaders()}
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
        <div className="flex items-center text-[#36382E]/80">
          <Badge variant="default" className="mr-2"><ShieldCheck className="h-3 w-3" /></Badge>
          <span>Security Headers</span>
        </div>
        <div className="flex items-center text-[#36382E]/80">
          <Badge variant="secondary" className="mr-2"><Zap className="h-3 w-3" /></Badge>
          <span>Performance Headers</span>
        </div>
        <div className="flex items-center text-[#36382E]/80">
          <Badge variant="destructive" className="mr-2"><AlertTriangle className="h-3 w-3" /></Badge>
          <span>Maintainability Headers</span>
        </div>
        <div className="flex items-center text-[#36382E]/80">
          <Badge variant="outline" className="mr-2 bg-gray-600 text-white"><Info className="h-3 w-3" /></Badge>
          <span>Other Headers</span>
        </div>
      </div>
    </div>
  );
}
