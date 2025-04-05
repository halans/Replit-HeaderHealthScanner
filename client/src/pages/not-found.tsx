import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center">
      <div className="w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg p-8 border-b-4 border-[#1D3354]">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold gradient-heading">404 Not Found</h1>
          <p className="mt-4 text-[#36382E]/80 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex justify-center mt-6">
          <Link href="/">
            <Button 
              variant="default"
              className="bg-gradient-to-r from-[#1D3354] to-[#1D3354]/90 hover:from-[#1D3354] hover:to-[#1D3354]/80 text-white font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D3354] flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
