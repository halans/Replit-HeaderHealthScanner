import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

// Define header detail object type
export interface HeaderDetail {
  name: string;
  key: string;
  implemented: boolean;
  value: string | null;
  status: 'missing' | 'implemented' | 'warning';
  importance: 'critical' | 'important' | 'recommended' | 'optional';
  description: string;
  recommendation?: string;
  link: string;
}

interface HeaderCategoryProps {
  title: string;
  description: string;
  headers: HeaderDetail[];
}

interface HeaderItemProps {
  header: HeaderDetail;
}

function HeaderItem({ header }: HeaderItemProps) {
  const [isOpen, setIsOpen] = useState(header.status === 'missing' && header.importance === 'critical');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'implemented':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Implemented</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">Warning</Badge>;
      case 'missing':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Missing</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500 h-5 w-5 flex-shrink-0" />;
      case 'missing':
        return <AlertCircle className="text-red-500 h-5 w-5 flex-shrink-0" />;
      default:
        return null;
    }
  };
  
  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'critical':
        return <Badge className="bg-red-50 text-red-800 border-red-200 hover:bg-red-50">Critical</Badge>;
      case 'important':
        return <Badge className="bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-50">Important</Badge>;
      case 'recommended':
        return <Badge className="bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-50">Recommended</Badge>;
      case 'optional':
        return <Badge className="bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-50">Optional</Badge>;
      default:
        return null;
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border border-[#DADAD9] rounded-lg mb-4 overflow-hidden transition-all shadow-sm hover:shadow-md"
    >
      <CollapsibleTrigger className="flex items-center justify-between bg-white px-5 py-4 w-full text-left">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            header.status === 'implemented' ? 'bg-green-100 text-green-700' : 
            header.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 
            'bg-red-100 text-red-700'
          }`}>
            {getStatusIcon(header.status)}
          </div>
          <div>
            <h3 className="font-bold text-[#36382E] text-base">{header.name}</h3>
            <div className="mt-1 flex space-x-2">
              {getStatusBadge(header.status)}
              {getImportanceBadge(header.importance)}
            </div>
          </div>
        </div>
        <div className={`p-2 rounded-full bg-[#EDE6E3] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="text-[#36382E] h-5 w-5" />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-5 py-4 border-t border-[#DADAD9] bg-white">
        <div className="mb-4">
          <h4 className="font-semibold text-[#36382E] mb-2">Description:</h4>
          <p className="text-[#36382E]/80">{header.description}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold text-[#36382E] mb-2">Current Status:</h4>
          {header.status === 'implemented' ? (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md flex items-start border border-green-200 shadow-sm">
              {getStatusIcon(header.status)}
              <div className="ml-2">
                <p className="font-medium">Successfully Implemented</p>
                {header.value && (
                  <code className="font-mono text-sm mt-2 block bg-white p-2 rounded border border-green-200">
                    {header.name}: {header.value}
                  </code>
                )}
              </div>
            </div>
          ) : header.status === 'warning' ? (
            <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-md flex items-start border border-yellow-200 shadow-sm">
              {getStatusIcon(header.status)}
              <div className="ml-2">
                <p className="font-medium">Needs Improvement</p>
                {header.value && (
                  <code className="font-mono text-sm mt-2 block bg-white p-2 rounded border border-yellow-200">
                    {header.name}: {header.value}
                  </code>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md flex items-start border border-red-200 shadow-sm">
              {getStatusIcon(header.status)}
              <div className="ml-2">
                <p className="font-medium">Missing Implementation</p>
                <p className="text-sm mt-1">This header is not implemented on your site.</p>
              </div>
            </div>
          )}
        </div>
        
        {header.recommendation && (
          <div className="mb-4">
            <h4 className="font-semibold text-[#36382E] mb-2">Recommendation:</h4>
            <p className="text-[#36382E]/80 mb-2">{header.recommendation}</p>
            {header.status !== 'implemented' && (
              <pre className="mt-2 bg-[#36382E] text-white p-4 rounded-md text-sm font-mono overflow-x-auto shadow-sm border border-[#36382E]/20">
                {header.name}: {header.recommendation.includes(':') ? header.recommendation.split(': ')[1] : header.recommendation}
              </pre>
            )}
          </div>
        )}
        
        <div>
          <h4 className="font-semibold text-[#36382E] mb-2">Learn More:</h4>
          <a 
            href={header.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-4 py-2 rounded-md bg-[#5BC3EB] text-white font-medium hover:bg-[#5BC3EB]/90 transition-colors shadow-sm"
          >
            <span>{header.name} documentation</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

import { Info } from "lucide-react";

function RecommendationItem({ icon, level, text }: { icon: string, level: string, text: string }) {
  const getIcon = () => {
    switch (icon) {
      case 'critical':
        return <AlertCircle className="text-red-500 h-5 w-5 flex-shrink-0" />;
      case 'important':
        return <AlertTriangle className="text-yellow-500 h-5 w-5 flex-shrink-0" />;
      default:
        return <Info className="text-blue-500 h-5 w-5 flex-shrink-0" />;
    }
  };
  
  const getBgColor = () => {
    switch (icon) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'important':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };
  
  const getTextColor = () => {
    switch (icon) {
      case 'critical':
        return 'text-red-800';
      case 'important':
        return 'text-yellow-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <li className={`flex items-start p-3 rounded-md border ${getBgColor()} shadow-sm mb-3`}>
      <div className={`p-2 rounded-full ${getBgColor()} mr-3`}>
        {getIcon()}
      </div>
      <div className={`${getTextColor()}`}>
        <p className="font-bold">{level}</p>
        <p className="text-sm mt-1">{text}</p>
      </div>
    </li>
  );
}

function HeaderCategory({ title, description, headers }: HeaderCategoryProps) {
  // Filter headers for recommendations
  const criticalMissing = headers.filter(h => h.status === 'missing' && h.importance === 'critical');
  const importantWarnings = headers.filter(h => (h.status === 'missing' || h.status === 'warning') && h.importance === 'important');
  const recommendedMissing = headers.filter(h => h.status === 'missing' && h.importance === 'recommended');
  
  // Calculate implementation stats
  const implemented = headers.filter(h => h.status === 'implemented').length;
  const warnings = headers.filter(h => h.status === 'warning').length;
  const missing = headers.filter(h => h.status === 'missing').length;
  const total = headers.length;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#36382E] mb-2 gradient-heading">{title} Headers</h2>
          <p className="text-[#36382E]/70">{description}</p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4 flex items-center space-x-4 p-3 bg-[#EDE6E3] rounded-md shadow-sm">
          <div className="text-center">
            <p className="text-sm text-[#36382E]/70">Implemented</p>
            <p className="text-xl font-bold text-green-600">{implemented}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-[#36382E]/70">Warnings</p>
            <p className="text-xl font-bold text-yellow-600">{warnings}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-[#36382E]/70">Missing</p>
            <p className="text-xl font-bold text-red-600">{missing}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-[#36382E]/70">Total</p>
            <p className="text-xl font-bold text-[#36382E]">{total}</p>
          </div>
        </div>
      </div>
      
      {headers.map((header, index) => (
        <HeaderItem key={index} header={header} />
      ))}
      
      {(criticalMissing.length > 0 || importantWarnings.length > 0 || recommendedMissing.length > 0) && (
        <div className="mt-8 bg-white p-6 rounded-lg border border-[#DADAD9] shadow-md">
          <h3 className="text-xl font-bold text-[#36382E] mb-4 flex items-center">
            <div className="p-2 bg-[#F06449] text-white rounded-full mr-3">
              <AlertCircle className="h-5 w-5" />
            </div>
            {title} Recommendations
          </h3>
          
          <div className="space-y-1">
            {criticalMissing.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-[#36382E] mb-3">Critical Issues</h4>
                <ul>
                  {criticalMissing.map((header, index) => (
                    <RecommendationItem 
                      key={`critical-${index}`} 
                      icon="critical" 
                      level="Critical Issue" 
                      text={`Implement ${header.name} to ${header.description.split(' helps ')[1] || 'improve security'}.`} 
                    />
                  ))}
                </ul>
              </div>
            )}
            
            {importantWarnings.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-[#36382E] mb-3">Important Improvements</h4>
                <ul>
                  {importantWarnings.map((header, index) => (
                    <RecommendationItem 
                      key={`important-${index}`} 
                      icon="important" 
                      level="Important Improvement" 
                      text={header.status === 'warning' 
                        ? `Improve your ${header.name} header: ${header.recommendation}`
                        : `Add ${header.name} header to your responses.`} 
                    />
                  ))}
                </ul>
              </div>
            )}
            
            {recommendedMissing.length > 0 && (
              <div>
                <h4 className="font-semibold text-[#36382E] mb-3">Recommendations</h4>
                <ul>
                  {recommendedMissing.map((header, index) => (
                    <RecommendationItem 
                      key={`recommended-${index}`} 
                      icon="info" 
                      level="Recommendation" 
                      text={`Consider implementing ${header.name} to enhance your site's ${title.toLowerCase()}.`} 
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface HeaderAnalysisSectionProps {
  securityHeaders: HeaderDetail[];
  performanceHeaders: HeaderDetail[];
  maintainabilityHeaders: HeaderDetail[];
}

export default function HeaderAnalysisSection({
  securityHeaders,
  performanceHeaders,
  maintainabilityHeaders
}: HeaderAnalysisSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-b-4 border-[#5BC3EB] card-hover">
      <Tabs defaultValue="security">
        <div className="border-b border-[#DADAD9] bg-gradient-to-r from-[#F06449]/5 to-[#5BC3EB]/5">
          <TabsList className="flex w-full bg-transparent p-0 justify-between">
            <TabsTrigger 
              value="security" 
              className="flex-1 data-[state=active]:border-[#1D3354] data-[state=active]:text-[#1D3354] data-[state=active]:font-bold
                data-[state=active]:border-b-2 data-[state=active]:bg-white py-3 text-center text-base font-medium 
                rounded-t-lg border-b-2 border-transparent"
            >
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="flex-1 data-[state=active]:border-[#1D3354] data-[state=active]:text-[#1D3354] data-[state=active]:font-bold
                data-[state=active]:border-b-2 data-[state=active]:bg-white py-3 text-center text-base font-medium 
                rounded-t-lg border-b-2 border-transparent"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="maintainability" 
              className="flex-1 data-[state=active]:border-[#1D3354] data-[state=active]:text-[#1D3354] data-[state=active]:font-bold
                data-[state=active]:border-b-2 data-[state=active]:bg-white py-3 text-center text-base font-medium 
                rounded-t-lg border-b-2 border-transparent"
            >
              <span className="w-full text-center whitespace-nowrap">Maintainability</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-8">
          <TabsContent value="security" className="m-0 p-0">
            <HeaderCategory 
              title="Security" 
              description="Security headers protect your site from various attacks and vulnerabilities. Analysis is based on SecurityHeaders.com and Mozilla Observatory guidelines."
              headers={securityHeaders}
            />
          </TabsContent>
          
          <TabsContent value="performance" className="m-0 p-0">
            <HeaderCategory 
              title="Performance" 
              description="Performance headers help optimize how browsers load and cache your content, improving loading times and user experience."
              headers={performanceHeaders}
            />
          </TabsContent>
          
          <TabsContent value="maintainability" className="m-0 p-0">
            <HeaderCategory 
              title="Maintainability" 
              description="Maintainability headers help developers understand and debug your site, as well as provide better interoperability with various clients."
              headers={maintainabilityHeaders}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
