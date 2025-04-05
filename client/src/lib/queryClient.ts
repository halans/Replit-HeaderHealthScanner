import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorText = '';
    try {
      // Try to parse response as JSON first
      const errorData = await res.json();
      errorText = errorData.message || JSON.stringify(errorData);
    } catch (e) {
      // If not JSON, get text content
      try {
        errorText = await res.text();
      } catch (textError) {
        // Fallback to status text if text extraction fails
        errorText = res.statusText;
      }
    }
    
    // Map status codes to friendly error messages
    const statusMessages: Record<number, string> = {
      400: 'Bad request: The server could not understand your request.',
      401: 'Unauthorized: You need to be logged in to access this resource.',
      403: 'Forbidden: You don\'t have permission to access this resource.',
      404: 'Not found: The requested resource could not be found.',
      429: 'Too many requests: Please try again later.',
      500: 'Server error: Something went wrong on our end.',
      503: 'Service unavailable: The server is temporarily down.',
    };
    
    const friendlyMessage = statusMessages[res.status] || `Error ${res.status}`;
    throw new Error(`${friendlyMessage} ${errorText ? `- ${errorText}` : ''}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`Making API request: ${method} ${url}`, data);
  
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  console.log(`API response status: ${res.status}`);
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
