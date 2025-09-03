import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { LabDipsProvider } from "./stores/useLabDips";
import OpportunitiesList from "./pages/opportunities/OpportunitiesList";
import OpportunityDetail from "./pages/opportunities/OpportunityDetail";
import SelectionBuilder from "./pages/SelectionBuilder";
import QuoteEditor from "./pages/QuoteEditor";
import POReview from "./pages/POReview";
import LabDips from "./pages/LabDips";
import ClientPortal from "./pages/ClientPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main App Routes */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<OpportunitiesList />} />
            <Route path="opportunities" element={<OpportunitiesList />} />
            <Route path="opportunities/:id" element={<OpportunityDetail />} />
            <Route path="selection-builder" element={<SelectionBuilder />} />
            <Route path="quote-editor" element={<QuoteEditor />} />
            <Route path="po-review" element={<POReview />} />
            <Route path="lab-dips" element={<LabDips />} />
          </Route>
          
          {/* Client Portal - separate layout */}
          <Route path="client-portal/:token" element={<ClientPortal />} />
          
          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
