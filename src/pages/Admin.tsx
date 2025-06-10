
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/LoginForm";
import AdminDashboard from "@/components/AdminDashboard";

const Admin = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard /> : <LoginForm />;
};

export default Admin;
