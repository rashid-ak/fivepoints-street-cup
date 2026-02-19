import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EventListing from "./pages/EventListing";
import EventDetail from "./pages/EventDetail";
import EventRegister from "./pages/EventRegister";
import EventCheckout from "./pages/EventCheckout";
import EventConfirmation from "./pages/EventConfirmation";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegistrants from "./pages/AdminRegistrants";
import AdminTransactions from "./pages/AdminTransactions";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<EventListing />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/:id/register" element={<EventRegister />} />
            <Route path="/events/:id/checkout" element={<EventCheckout />} />
            <Route path="/events/:id/confirmation" element={<EventConfirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/events/:eventId" element={<AdminRoute><AdminRegistrants /></AdminRoute>} />
            <Route path="/admin/transactions" element={<AdminRoute><AdminTransactions /></AdminRoute>} />
            {/* Legacy admin */}
            <Route path="/admin-legacy" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
