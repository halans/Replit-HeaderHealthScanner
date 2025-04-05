import { Clock, ArrowRight } from "lucide-react";

interface ServerTimingEntry {
  name: string;
  duration: number;
  description?: string;
}

interface ServerTimingSectionProps {
  serverTiming?: string;
}

export default function ServerTimingSection({ serverTiming }: ServerTimingSectionProps) {
  if (!serverTiming) {
    return null;
  }

  // Parse Server-Timing header to extract metrics
  const parseServerTimingHeader = (header: string): ServerTimingEntry[] => {
    return header.split(',').map(entry => {
      const trimmed = entry.trim();
      const parts = trimmed.split(';');
      const name = parts[0].trim();
      
      // Extract duration if available
      const durationMatch = trimmed.match(/dur=(\d+)/);
      const duration = durationMatch ? parseInt(durationMatch[1]) : 0;
      
      // Extract description if available
      const descMatch = trimmed.match(/desc="([^"]+)"/);
      const description = descMatch ? descMatch[1] : name;
      
      return { name, duration, description };
    });
  };

  const timingEntries = parseServerTimingHeader(serverTiming);
  
  // Calculate total processing time (sum of all durations)
  const totalTime = timingEntries.reduce((sum, entry) => sum + entry.duration, 0);
  
  // Include all entries even if duration is 0
  const validEntries = timingEntries;
  
  // Sort by duration (descending)
  const sortedEntries = [...validEntries].sort((a, b) => b.duration - a.duration);
  
  // Find the maximum duration for scaling the bars
  const maxDuration = sortedEntries.length > 0 ? sortedEntries[0].duration : 1; // Use 1 as minimum to avoid division by zero

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8 border-b-4 border-[#1D3354] card-hover">
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold gradient-heading">Server Performance Metrics</h2>
        <p className="text-[#36382E]/70 mt-1">
          Detailed server-side timing metrics from the Server-Timing header
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gradient-to-r from-[#1D3354] to-[#9ED8DB] text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-semibold">Total Server Processing Time: {totalTime}ms</h3>
          </div>
          <p className="text-sm opacity-80">
            Time spent on the server processing your request, broken down by operation
          </p>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-md font-semibold mb-4 text-[#1D3354]">Timing Breakdown</h3>
          
          <div className="space-y-3">
            {sortedEntries.map((entry, index) => {
              // Calculate percentage of total time
              const percentage = Math.round((entry.duration / maxDuration) * 100);
              
              return (
                <div key={index} className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <ArrowRight className="h-3 w-3 mr-1 text-[#9ED8DB]" />
                      <span className="font-medium text-[#36382E]">{entry.description}</span>
                    </div>
                    <span className="text-sm font-bold text-[#1D3354]">{entry.duration}ms</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1D3354] to-[#9ED8DB] rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-right mt-1 text-gray-500">
                    {Math.round((entry.duration / totalTime) * 100)}% of total time
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-[#36382E]/60 flex items-center">
        <div className="w-2 h-2 bg-[#9ED8DB] rounded-full mr-2"></div>
        <span>Server-Timing metrics help identify performance bottlenecks on the server side.</span>
      </div>
    </div>
  );
}