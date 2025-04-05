import { CircularProgress } from "@/components/ui/circular-progress";
import { formatDate } from "@/lib/utils";

interface ScoreCardProps {
  title: string;
  score: number;
  color: string;
  implemented: number;
  total: number;
  status: string;
  icon: string;
}

import { Shield, Zap, Wrench } from "lucide-react";

function ScoreCard({ title, score, color, implemented, total, status, icon }: ScoreCardProps) {
  const getIcon = () => {
    switch(icon) {
      case "security": return <Shield className="h-5 w-5" />;
      case "speed": return <Zap className="h-5 w-5" />;
      case "build": return <Wrench className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };
  
  const getColorClass = () => {
    if (score >= 90) return "bg-gradient-to-r from-green-400 to-green-500";
    if (score >= 70) return "bg-gradient-to-r from-yellow-400 to-yellow-500";
    return "bg-gradient-to-r from-red-400 to-red-500";
  };

  const getBorderColor = () => {
    if (score >= 90) return "border-green-200";
    if (score >= 70) return "border-yellow-200";
    return "border-red-200";
  };
  
  return (
    <div className={`bg-white p-5 rounded-md border ${getBorderColor()} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center mb-3">
        <div className={`${getColorClass()} p-2 rounded-full text-white mr-3`}>
          {getIcon()}
        </div>
        <h4 className="font-bold text-[#36382E] text-lg">{title}</h4>
      </div>
      <div className="flex items-center">
        <CircularProgress 
          value={score} 
          size="sm" 
          color={score >= 90 ? "#10B981" : score >= 70 ? "#F59E0B" : "#EF4444"} 
          showPercentage={false}
          showGrade
          thickness={3}
        />
        <div className="ml-4">
          <div className="text-sm font-medium text-[#36382E]/70">
            {implemented}/{total} headers
          </div>
          <div className="text-sm font-semibold text-[#36382E]">{status}</div>
        </div>
      </div>
    </div>
  );
}

interface OverallScoreProps {
  url: string;
  timestamp: Date;
  overallScore: number;
  overallGrade: string;
  security: {
    score: number;
    implemented: number;
    total: number;
    grade: string;
  };
  performance: {
    score: number;
    implemented: number;
    total: number;
    grade: string;
  };
  maintainability: {
    score: number;
    implemented: number;
    total: number;
    grade: string;
  };
  summary: string;
}

export default function OverallScore({
  url,
  timestamp,
  overallScore,
  overallGrade,
  security,
  performance,
  maintainability,
  summary
}: OverallScoreProps) {
  const getStatusText = (score: number): string => {
    if (score >= 90) return "Excellent implementation";
    if (score >= 80) return "Good implementation";
    if (score >= 70) return "Some improvements needed";
    if (score >= 60) return "Significant issues found";
    return "Critical issues found";
  };

  const getScoreCardColor = (score: number): string => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  // Calculate the color for overall score
  const getOverallScoreColor = () => {
    if (overallScore >= 90) return "#10B981";
    if (overallScore >= 70) return "#F59E0B";
    return "#EF4444";
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-b-4 border-[#F06449] card-hover">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold gradient-heading mb-2">Results</h2>
          <div className="text-[#36382E]/80 mb-6 flex items-center space-x-2">
            <span className="inline-block h-4 w-4 bg-[#F06449] rounded-full"></span>
            <span>Analyzed {formatDate(timestamp)}</span>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="bg-white p-5 rounded-full shadow-md">
              <CircularProgress 
                value={overallScore} 
                size="md" 
                color={getOverallScoreColor()} 
                showPercentage 
                showGrade
                thickness={4}
              />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-bold text-[#36382E]">
              {url}
            </h3>
            <p className="text-[#36382E]/70 text-sm">
              {getStatusText(overallScore)}
            </p>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#36382E]">Category Scores</h3>
            <div className="text-[#36382E]/70 text-sm">
              Scores reflect header implementation
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ScoreCard
              title="Security"
              score={security.score}
              color={getScoreCardColor(security.score)}
              implemented={security.implemented}
              total={security.total}
              status={getStatusText(security.score)}
              icon="security"
            />
            
            <ScoreCard
              title="Performance"
              score={performance.score}
              color={getScoreCardColor(performance.score)}
              implemented={performance.implemented}
              total={performance.total}
              status={getStatusText(performance.score)}
              icon="speed"
            />
            
            <ScoreCard
              title="Maintainability"
              score={maintainability.score}
              color={getScoreCardColor(maintainability.score)}
              implemented={maintainability.implemented}
              total={maintainability.total}
              status={getStatusText(maintainability.score)}
              icon="build"
            />
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold text-[#36382E] mb-4">Summary</h3>
            <div className="bg-[#EDE6E3] p-6 rounded-md border-l-4 border-[#5BC3EB] shadow-sm">
              <p className="text-[#36382E] leading-relaxed">{summary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
