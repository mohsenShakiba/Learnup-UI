import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SwipeableDrawerHost } from "./shared/swipeableDrawer";
import { LearnupThemeProvider } from "./shared/theme/ThemeContext.tsx";
import { ToastHost } from "./shared/toast";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LearnupThemeProvider>
        <App />
        <SwipeableDrawerHost />
        <ToastHost />
      </LearnupThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
