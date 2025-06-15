import { Typography } from "@/components/ui/typography";

export function HelloWorld() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center space-y-4 p-8">
        <Typography 
          variant="h1" 
          className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent animate-pulse"
        >
          Hello World
        </Typography>
        <Typography 
          variant="muted" 
          className="max-w-md mx-auto opacity-70"
        >
          A modern, minimal approach to the classic greeting
        </Typography>
      </div>
    </div>
  );
}