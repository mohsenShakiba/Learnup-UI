import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LearnupThemeProvider } from "./shared/theme/ThemeContext.tsx";


const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LearnupThemeProvider>
        <App />
      </LearnupThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
