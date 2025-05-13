
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin routes
import AdminLogin from "./pages/AdminLogin";
import AdminAddItem from "./pages/AdminAddItem";
import AdminDatabase from "./pages/AdminDatabase";
import AdminTransactions from "./pages/AdminTransactions";
import AdminAuthGuard from "./components/AdminAuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminAuthGuard>
              <AdminAddItem />
            </AdminAuthGuard>
          } />
          <Route path="/admin/database" element={
            <AdminAuthGuard>
              <AdminDatabase />
            </AdminAuthGuard>
          } />
          <Route path="/admin/transactions" element={
            <AdminAuthGuard>
              <AdminTransactions />
            </AdminAuthGuard>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
