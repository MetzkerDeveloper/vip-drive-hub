import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminVehicles from "./pages/AdminVehicles";
import AdminContacts from "./pages/AdminContacts";
import AdminUsers from "./pages/AdminUsers";
import VehicleDetail from "./pages/VehicleDetail";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/veiculo/:id" element={<VehicleDetail />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/vehicles" element={<AdminVehicles />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
