import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { urlSchema } from "@shared/schema";

interface UrlInputFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInputForm({ onAnalyze, isLoading }: UrlInputFormProps) {
  const form = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  function onSubmit(values: z.infer<typeof urlSchema>) {
    onAnalyze(values.url);
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-slate-700 mb-1">
                    Enter website URL to analyze:
                  </FormLabel>
                  <FormControl>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                        https://
                      </span>
                      <Input
                        placeholder="example.com"
                        className="flex-1 block w-full rounded-none rounded-r-md border-slate-300 focus:ring-primary-500 focus:border-primary-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
            >
              <Search className="mr-1 h-5 w-5" />
              Analyze Headers
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
