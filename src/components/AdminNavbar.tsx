import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, User, LogOut } from "lucide-react";
import { auth } from "../firebase";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.clear();
    navigate("/admin-login");
  };

  return (
    <div className="w-full border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Left Side */}
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-destructive" />
          <h1 className="text-lg font-bold text-foreground">
            Admin Panel
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Link to="/admin-profile">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-1" />
              Profile
            </Button>
          </Link>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;