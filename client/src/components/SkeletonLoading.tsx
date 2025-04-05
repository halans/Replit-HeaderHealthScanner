import { Shield, AlertTriangle, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Animated skeleton loading states for header analysis results
 */

export function SkeletonOverallScore() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border-b-4 border-[#36382E] animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        <div className="w-full lg:w-1/2">
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-6 w-4/5 mb-3" />
          <Skeleton className="h-6 w-3/4 mb-3" />
          <Skeleton className="h-6 w-5/6" />
          
          <div className="mt-6 space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Score cards */}
          <SkeletonScoreCard title="Security" icon={<Shield className="h-5 w-5" />} color="#6a4c93" />
          <SkeletonScoreCard title="Performance" icon={<Zap className="h-5 w-5" />} color="#1982c4" />
          <SkeletonScoreCard title="Maintainability" icon={<AlertTriangle className="h-5 w-5" />} color="#ffca3a" />
          <SkeletonScoreCard title="Overall" icon={<Shield className="h-5 w-5" />} color="#8ac926" />
        </div>
      </div>
      
      <Skeleton className="h-10 w-48 mx-auto" />
    </div>
  );
}

function SkeletonScoreCard({ title, icon, color }: { title: string, icon: React.ReactNode, color: string }) {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center">
          <div className="mr-2" style={{ color }}>
            {icon}
          </div>
          <div className="text-sm font-medium">{title}</div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="flex justify-between items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-10" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonHeaderAnalysis() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8 border-b-4 border-[#36382E] animate-pulse">
      <Skeleton className="h-8 w-1/3 mb-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SkeletonHeaderCategory />
        <SkeletonHeaderCategory />
        <SkeletonHeaderCategory />
      </div>
    </div>
  );
}

function SkeletonHeaderCategory() {
  return (
    <div className="border rounded-lg p-4">
      <Skeleton className="h-6 w-1/2 mb-3" />
      <Skeleton className="h-4 w-full mb-6" />
      
      <div className="space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-5 w-1/5" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonRawHeaders() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8 border-b-4 border-[#36382E] animate-pulse">
      <div className="flex justify-between mb-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-9 w-32" />
      </div>
      
      <Skeleton className="h-80 w-full" />
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    </div>
  );
}

export function SkeletonCloudflareHeaders() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8 border-b-4 border-[#36382E] animate-pulse">
      <Skeleton className="h-8 w-2/5 mb-3" />
      <Skeleton className="h-5 w-3/4 mb-6" />
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex justify-between mb-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

// SkeletonServerTiming component removed as requested