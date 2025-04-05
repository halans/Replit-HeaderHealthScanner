import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
    console.log("Form submitted with values:", values);
    
    // At this point, the URL has been validated and transformed by the schema
    const analyzedUrl = values.url;
    console.log("Analyze button clicked with URL:", analyzedUrl);
    
    // Pass the validated URL to the parent component
    onAnalyze(analyzedUrl);
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-t-4 border-[#1D3354] card-hover">
      <h2 className="text-2xl font-bold mb-6 gradient-heading">HTTP Header Analysis</h2>
      <p className="text-[#1D3354]/80 mb-6">
        Check if your website follows security, performance, and maintainability best practices for HTTP headers.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="url-input" className="block text-base font-medium text-[#1D3354] mb-2">
                    Enter website URL to analyze:
                  </FormLabel>
                  <div className="space-y-2">
                    <FormControl>
                      <div className="mt-1 flex rounded-md shadow-md">
                        <span 
                          className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-[#1D3354] bg-[#E9FFF9] text-[#1D3354]/70 text-sm font-medium"
                          aria-hidden="true"
                        >
                          https://
                        </span>
                        <Input
                          id="url-input"
                          placeholder="example.com"
                          className="flex-1 block w-full rounded-none rounded-r-md bg-white border-[#1D3354] focus:ring-[#1D3354] focus:border-[#1D3354] py-2 px-4 text-[#1D3354]"
                          onChange={(e) => {
                            // We'll just pass the raw value and let the schema handle validation
                            field.onChange(e.target.value);
                          }}
                          onPaste={(e) => {
                            // Intercept the paste event to remove http:// or https:// prefix
                            e.preventDefault();
                            const pastedText = e.clipboardData.getData('text');
                            const cleanedText = pastedText.replace(/^https?:\/\//i, '');
                            field.onChange(cleanedText);
                          }}
                          value={field.value}
                          onBlur={field.onBlur}
                          name={field.name}
                          aria-describedby={form.formState.errors.url ? "url-error" : undefined}
                          aria-invalid={form.formState.errors.url ? "true" : "false"}
                        />
                      </div>
                    </FormControl>
                    <FormMessage id="url-error" className="text-sm text-red-600" />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-end justify-start md:justify-end">
            <Button 
              type="submit" 
              variant="default"
              disabled={isLoading}
              className="w-full md:w-auto bg-gradient-to-r from-[#1D3354] to-[#1D3354]/90 hover:from-[#1D3354] hover:to-[#1D3354]/80 text-white font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D3354] flex items-center justify-center shadow-md hover:shadow-lg transition-all"
              aria-label="Analyze header security"
            >
              <Search className="mr-2 h-5 w-5" aria-hidden="true" />
              Analyze Headers
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}