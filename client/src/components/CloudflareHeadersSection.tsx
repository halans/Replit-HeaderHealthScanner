import { useState } from "react";
import { HeaderDetail } from "./HeaderAnalysisSection";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { LuCloudLightning } from "react-icons/lu";
import { ExternalLink } from "lucide-react";

interface CloudflareHeadersSectionProps {
  cloudflareHeaders: HeaderDetail[];
}

export default function CloudflareHeadersSection({ cloudflareHeaders }: CloudflareHeadersSectionProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (itemKey: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const implementedHeaders = cloudflareHeaders.filter((header) => header.implemented);
  
  if (implementedHeaders.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-b-4 border-[#5BC3EB] card-hover">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-gradient-to-br from-[#F06449]/10 to-[#5BC3EB]/20 mr-4">
          <LuCloudLightning className="text-[#F06449] h-7 w-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold gradient-heading">Cloudflare Headers</h2>
          <p className="text-[#36382E]/70 mt-1">
            This website is served through Cloudflare's CDN and security services
          </p>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-[#5BC3EB]/10 rounded-lg border border-[#5BC3EB]/20">
        <p className="text-[#36382E]/80">
          Cloudflare adds several special headers to the response that provide information about 
          its caching, security, and optimization features. These headers help improve 
          performance, security, and reliability of your website.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-[#DADAD9] shadow-sm">
          <h3 className="font-semibold text-[#36382E] mb-1">Headers Detected</h3>
          <p className="text-[#36382E]/70 text-2xl font-bold">{implementedHeaders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#DADAD9] shadow-sm">
          <h3 className="font-semibold text-[#36382E] mb-1">Features Enabled</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className="bg-[#5BC3EB] hover:bg-[#5BC3EB]/90 text-white">CDN</Badge>
            <Badge className="bg-[#5BC3EB] hover:bg-[#5BC3EB]/90 text-white">Caching</Badge>
            <Badge className="bg-[#5BC3EB] hover:bg-[#5BC3EB]/90 text-white">Security</Badge>
          </div>
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        {implementedHeaders.map((header) => (
          <AccordionItem 
            key={header.key} 
            value={header.key}
            className="border border-[#DADAD9] rounded-lg mb-3 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <AccordionTrigger 
              onClick={() => toggleItem(header.key)}
              className="hover:no-underline py-4 px-4 bg-gradient-to-r from-white to-[#EDE6E3]/30 data-[state=open]:from-[#5BC3EB]/5 data-[state=open]:to-white"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left">
                <div className="font-bold text-[#36382E] text-base flex items-center">
                  <div className="w-2 h-2 bg-[#5BC3EB] rounded-full mr-2"></div>
                  {header.name}
                </div>
                <div className="flex items-center mt-1 sm:mt-0">
                  <Badge className="bg-gradient-to-r from-[#5BC3EB] to-[#5BC3EB]/80 hover:from-[#5BC3EB]/90 hover:to-[#5BC3EB]/70 text-white">
                    Cloudflare
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3 pb-5 px-5 border-t border-[#DADAD9] bg-white">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#36382E] mb-2">Description:</h4>
                  <p className="text-[#36382E]/80">{header.description}</p>
                  {header.recommendation && (
                    <div className="mt-3 p-3 bg-[#5BC3EB]/10 border border-[#5BC3EB]/20 rounded-md text-[#36382E]/80 italic">
                      {header.recommendation}
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#36382E] mb-2">Current Value:</h4>
                  <div className="bg-[#36382E] text-white p-4 rounded-md font-mono text-sm break-all shadow-sm">
                    {header.name}: {header.value}
                  </div>
                </div>
                
                <div>
                  <a 
                    href={header.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-4 py-2 rounded-md bg-[#5BC3EB] text-white font-medium hover:bg-[#5BC3EB]/90 transition-colors shadow-sm"
                  >
                    <span>Cloudflare Documentation</span>
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}