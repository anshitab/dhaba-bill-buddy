import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin routes
import AdminLogin from "./pages/AdminLogin";
import AdminAddItem from "./pages/AdminAddItem";
import AdminDatabase from "./pages/AdminDatabase";
import AdminTransactions from "./pages/AdminTransactions";
import AdminAuthGuard from "./components/AdminAuthGuard";
import AdminLayout from "./components/AdminLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Combined wrapper component for admin routes
const AdminRouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <AdminAuthGuard>
    <AdminLayout>{children}</AdminLayout>
  </AdminAuthGuard>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route element={<AdminRouteWrapper><Outlet /></AdminRouteWrapper>}>
            <Route path="/admin" element={<AdminDatabase />} />
            <Route path="/admin/add-item" element={<AdminAddItem />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
