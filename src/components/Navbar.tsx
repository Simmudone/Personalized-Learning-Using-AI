import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Simulated auth state — replace with real auth later
// const useAuth = () => {
//   const location = useLocation();
//   const loggedInPages = ["/dashboard", "/admin-dashboard", "/profile", "/course", "/assignment", "/results", "/resources", "/courses"];
//   const isLoggedIn = loggedInPages.some((p) => location.pathname.startsWith(p));
//   const isAdmin = location.pathname.startsWith("/admin");
//   return { isLoggedIn, isAdmin, userName: isAdmin ? "Admin" : "John Doe" };
// };
const useAuth = () => {
  const role = localStorage.getItem("role");        // "student" or "admin"
  const userName = localStorage.getItem("userName"); // actual logged-in name

  return {
    isLoggedIn: !!role,
    isAdmin: role === "admin",
    userName: userName || "User",
  };
};

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn, isAdmin, userName } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const initials = userName.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to={isLoggedIn ? (isAdmin ? "/admin-dashboard" : "/dashboard") : "/"} className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground font-serif">Personalised Learning Path </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/courses" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/courses") ? "text-primary" : "text-muted-foreground"}`}>
            Courses
          </Link>
          <Link to={isAdmin ? "/admin-dashboard" : "/dashboard"} className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/dashboard") || isActive("/admin-dashboard") ? "text-primary" : "text-muted-foreground"}`}>
            Dashboard
          </Link>
          {/* <Link to="/resources" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/resources") ? "text-primary" : "text-muted-foreground"}`}>
            Resources
          </Link> */}
          {/* {isLoggedIn && (
            <Link to="/results" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/results") ? "text-primary" : "text-muted-foreground"}`}>
              Results
            </Link>
          )} */}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border p-1 pr-3 hover:bg-accent transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">{userName}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex items-center gap-2 cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4" /> Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/student-login">
                <Button variant="outline" size="sm">Student Login</Button>
              </Link>
              <Link to="/admin-login">
                <Button size="sm">Admin Login</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          <Link to="/courses" className="block text-sm font-medium text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>Courses</Link>
          <Link to={isAdmin ? "/admin-dashboard" : "/dashboard"} className="block text-sm font-medium text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>Dashboard</Link>
          <Link to="/resources" className="block text-sm font-medium text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>Resources</Link>
          {isLoggedIn && <Link to="/results" className="block text-sm font-medium text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>Results</Link>}
          <div className="flex gap-2 pt-2">
            {isLoggedIn ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm"><User className="h-4 w-4 mr-1" /> Profile</Button></Link>
                <Link to="/" onClick={() => setMobileOpen(false)}><Button size="sm" variant="destructive"><LogOut className="h-4 w-4 mr-1" /> Logout</Button></Link>
              </>
            ) : (
              <>
                <Link to="/student-login" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm">Student Login</Button></Link>
                <Link to="/admin-login" onClick={() => setMobileOpen(false)}><Button size="sm">Admin Login</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
