import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import Loading from "@/components/Loading";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Setores from "./pages/admin/Setores";
import Usuarios from "./pages/admin/Usuarios";
import Tutoriais from "./pages/admin/Tutoriais";
import NovoTutorial from "./pages/admin/NovoTutorial";
import UserDashboard from "./pages/user/UserDashboard";
import Concluidos from "./pages/user/Concluidos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'admin' | 'user' }) {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/app'} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/setores" element={
        <ProtectedRoute requiredRole="admin">
          <Setores />
        </ProtectedRoute>
      } />
      <Route path="/admin/usuarios" element={
        <ProtectedRoute requiredRole="admin">
          <Usuarios />
        </ProtectedRoute>
      } />
      <Route path="/admin/tutoriais" element={
        <ProtectedRoute requiredRole="admin">
          <Tutoriais />
        </ProtectedRoute>
      } />
      <Route path="/admin/tutoriais/novo" element={
        <ProtectedRoute requiredRole="admin">
          <NovoTutorial />
        </ProtectedRoute>
      } />
      
      {/* User Routes */}
      <Route path="/app" element={
        <ProtectedRoute requiredRole="user">
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/app/concluidos" element={
        <ProtectedRoute requiredRole="user">
          <Concluidos />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <BrowserRouter>
          <Loading />
          <Toaster />
          <Sonner />
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
