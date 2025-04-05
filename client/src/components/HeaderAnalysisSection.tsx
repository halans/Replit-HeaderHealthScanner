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
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Implemented</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Warning</Badge>;
      case 'missing':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Missing</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="text-green-500 h-5 w-5 align-text-bottom" />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500 h-5 w-5 align-text-bottom" />;
      case 'missing':
        return <AlertCircle className="text-red-500 h-5 w-5 align-text-bottom" />;
      default:
        return null;
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border border-slate-200 rounded-md mb-4 overflow-hidden"
    >
      <CollapsibleTrigger className="flex items-center justify-between bg-slate-50 px-4 py-3 w-full text-left">
        <div className="flex items-center">
          <h3 className="font-medium text-slate-800">{header.name}</h3>
          <div className="ml-3">{getStatusBadge(header.status)}</div>
        </div>
        {isOpen ? <ChevronUp className="text-slate-400 h-5 w-5" /> : <ChevronDown className="text-slate-400 h-5 w-5" />}
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-4 py-3 border-t border-slate-200">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-slate-700 mb-1">Description:</h4>
          <p className="text-sm text-slate-600">{header.description}</p>
        </div>
        
        <div className="mb-3">
          <h4 className="text-sm font-medium text-slate-700 mb-1">Current Status:</h4>
          {header.status === 'implemented' ? (
            <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm flex items-start">
              {getStatusIcon(header.status)}
              <span className="ml-1">
                {header.value ? (
                  <code className="font-mono">{header.name}: {header.value}</code>
                ) : (
                  'This header is properly implemented.'
                )}
              </span>
            </div>
          ) : header.status === 'warning' ? (
            <div className="bg-yellow-50 text-yellow-700 px-3 py-2 rounded-md text-sm flex items-start">
              {getStatusIcon(header.status)}
              <span className="ml-1">
                {header.value ? (
                  <span>
                    <code className="font-mono">{header.name}: {header.value}</code> is present but could be improved.
                  </span>
                ) : (
                  'This header is implemented but could be improved.'
                )}
              </span>
            </div>
          ) : (
            <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm flex items-start">
              {getStatusIcon(header.status)}
              <span className="ml-1">This header is not implemented on your site.</span>
            </div>
          )}
        </div>
        
        {header.recommendation && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-slate-700 mb-1">Recommendation:</h4>
            <p className="text-sm text-slate-600">{header.recommendation}</p>
            {header.status !== 'implemented' && (
              <pre className="mt-1 bg-slate-800 text-slate-200 p-3 rounded-md text-xs font-mono overflow-x-auto">
                {header.name}: {header.recommendation.includes(':') ? header.recommendation.split(': ')[1] : header.recommendation}
              </pre>
            )}
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-1">Learn More:</h4>
          <a 
            href={header.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-primary-600 hover:text-primary-800 inline-flex items-center"
          >
            <span>{header.name} documentation</span>
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function RecommendationItem({ icon, level, text }: { icon: string, level: string, text: string }) {
  const getIcon = () => {
    switch (icon) {
      case 'critical':
        return <AlertCircle className="text-red-500 h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />;
      case 'important':
        return <AlertTriangle className="text-yellow-500 h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />;
      default:
        return <span className="material-icons text-slate-400 mr-2 mt-0.5">info</span>;
    }
  };

  return (
    <li className="flex items-start">
      {getIcon()}
      <span className="text-sm text-slate-700">
        <span className="font-medium">{level}:</span> {text}
      </span>
    </li>
  );
}

function HeaderCategory({ title, description, headers }: HeaderCategoryProps) {
  // Filter headers for recommendations
  const criticalMissing = headers.filter(h => h.status === 'missing' && h.importance === 'critical');
  const importantWarnings = headers.filter(h => (h.status === 'missing' || h.status === 'warning') && h.importance === 'important');
  const recommendedMissing = headers.filter(h => h.status === 'missing' && h.importance === 'recommended');

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800 mb-4">{title} Headers Analysis</h2>
      <p className="text-slate-600 mb-6">{description}</p>
      
      {headers.map((header, index) => (
        <HeaderItem key={index} header={header} />
      ))}
      
      {(criticalMissing.length > 0 || importantWarnings.length > 0 || recommendedMissing.length > 0) && (
        <div className="mt-6">
          <h3 className="text-md font-medium text-slate-700 mb-3">{title} Recommendations</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
            <ul className="space-y-2">
              {criticalMissing.map((header, index) => (
                <RecommendationItem 
                  key={`critical-${index}`} 
                  icon="critical" 
                  level="Critical" 
                  text={`Implement ${header.name} to ${header.description.split(' helps ')[1] || 'improve security'}.`} 
                />
              ))}
              
              {importantWarnings.map((header, index) => (
                <RecommendationItem 
                  key={`important-${index}`} 
                  icon="important" 
                  level="Important" 
                  text={header.status === 'warning' 
                    ? `Improve your ${header.name} header: ${header.recommendation}`
                    : `Add ${header.name} header to your responses.`} 
                />
              ))}
              
              {recommendedMissing.map((header, index) => (
                <RecommendationItem 
                  key={`recommended-${index}`} 
                  icon="info" 
                  level="Consider" 
                  text={`Implementing ${header.name} to enhance your site.`} 
                />
              ))}
            </ul>
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
    <div className="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
      <Tabs defaultValue="security">
        <div className="border-b border-slate-200">
          <TabsList className="bg-transparent border-b-0">
            <TabsTrigger 
              value="security" 
              className="data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 data-[state=active]:border-b-2 py-4 px-6 text-sm font-medium rounded-none border-b-2 border-transparent"
            >
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 data-[state=active]:border-b-2 py-4 px-6 text-sm font-medium rounded-none border-b-2 border-transparent"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="maintainability" 
              className="data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 data-[state=active]:border-b-2 py-4 px-6 text-sm font-medium rounded-none border-b-2 border-transparent"
            >
              Maintainability
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value="security" className="m-0 p-0">
            <HeaderCategory 
              title="Security" 
              description="Security headers protect your site from various attacks and vulnerabilities. Below is the analysis based on SecurityHeaders.com and Mozilla Observatory guidelines."
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
