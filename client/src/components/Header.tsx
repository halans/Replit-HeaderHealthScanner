import { useState } from "react";
import { Link } from "wouter";
import { Menu, Shield, Info, Book, Github } from "lucide-react";
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
            <div className="header-icon mr-3">
              <Shield className="h-4 w-4" />
            </div>
            <Link href="/">
              <h1 className="text-xl font-semibold gradient-heading cursor-pointer">HTTP Header Analyzer</h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-4">
            <a href="#about" className="text-[#1D3354]/80 hover:text-[#1D3354] px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <Info className="mr-2 h-4 w-4" />
              About
            </a>
            <a href="#docs" className="text-[#1D3354]/80 hover:text-[#1D3354] px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <Book className="mr-2 h-4 w-4" />
              Documentation
            </a>
            <a 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </nav>
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-6 w-6 text-[#1D3354]/80" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <a 
                  href="#about" 
                  onClick={() => setOpen(false)}
                  className="text-[#1D3354]/80 hover:text-[#1D3354] px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Info className="mr-2 h-4 w-4" />
                  About
                </a>
                <a 
                  href="#docs" 
                  onClick={() => setOpen(false)}
                  className="text-[#1D3354]/80 hover:text-[#1D3354] px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Book className="mr-2 h-4 w-4" />
                  Documentation
                </a>
                <a 
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                >
                  <Github className="mr-2 h-4 w-4" />
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
