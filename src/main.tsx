import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LearnupThemeProvider } from './shared/theme/ThemeContext.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LearnupThemeProvider>
        <App />
      </LearnupThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
