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

function ScoreCard({ title, score, color, implemented, total, status, icon }: ScoreCardProps) {
  return (
    <div className="bg-slate-50 p-4 rounded-md">
      <div className="flex items-center mb-2">
        <span className={`material-icons ${color} mr-2`}>{icon}</span>
        <h4 className="font-medium text-slate-800">{title}</h4>
      </div>
      <div className="flex items-center">
        <CircularProgress 
          value={score} 
          size="sm" 
          color={`stroke-${color.replace('text-', '')}`} 
          showPercentage={false}
          showGrade
        />
        <div className="ml-3">
          <div className="text-sm text-slate-500">{implemented}/{total} headers</div>
          <div className="text-sm text-slate-700">{status}</div>
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Overall Score</h2>
          <p className="text-sm text-slate-600 mb-4">
            Analyzed <span className="font-medium">{formatDate(timestamp)}</span>
          </p>
          
          <div className="flex justify-center">
            <CircularProgress 
              value={overallScore} 
              size="md" 
              showPercentage 
              showGrade
            />
          </div>
        </div>
        
        <div className="md:col-span-3">
          <h3 className="text-md font-medium text-slate-700 mb-3">Category Scores</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          
          <div className="mt-6">
            <h3 className="text-md font-medium text-slate-700 mb-3">Summary</h3>
            <div className="bg-slate-50 p-4 rounded-md">
              <p className="text-slate-700">{summary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
