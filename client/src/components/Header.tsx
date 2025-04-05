import { useState } from "react";
import { Link } from "wouter";
import { Menu, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const [open, setOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="material-icons text-primary-600 mr-2">security</span>
            <Link href="/">
              <h1 className="text-xl font-semibold text-primary-800 cursor-pointer">HTTP Header Analyzer</h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-4">
            <a href="#about" className="text-slate-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              About
            </a>
            <a href="#docs" className="text-slate-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              Documentation
            </a>
            <a 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Github className="h-4 w-4 mr-1" />
              GitHub
            </a>
          </nav>
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-6 w-6 text-slate-500" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <a 
                  href="#about" 
                  onClick={() => setOpen(false)}
                  className="text-slate-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </a>
                <a 
                  href="#docs" 
                  onClick={() => setOpen(false)}
                  className="text-slate-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Documentation
                </a>
                <a 
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-600 text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                >
                  <Github className="h-4 w-4 mr-1" />
                  GitHub
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
