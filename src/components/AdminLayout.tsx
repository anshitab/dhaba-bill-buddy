import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { Database, FilePlus, Printer, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";

interface AdminLayoutProps {
  children: ReactNode;
}

// Navigation items configuration
const navItems = [
  { to: "/admin", icon: Database, label: "Menu Database", end: true },
  { to: "/admin/add-item", icon: FilePlus, label: "Add New Item" },
  { to: "/admin/transactions", icon: Printer, label: "Transactions" },
];

// Header component
const Header = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  return (
    <header className="bg-restaurant-green text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="font-poppins font-bold text-2xl tracking-tight">
          AARKAY VAISHNO DHABA – Admin Panel
        </h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="border-restaurant-green text-restaurant-green hover:bg-restaurant-green hover:text-white transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

// Sidebar component
const Sidebar = () => (
  <aside className="w-64 bg-sidebar border-r border-border">
    <div className="h-full flex flex-col">
      <nav className="flex-1 p-4">
        <h2 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">
          Management
        </h2>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink 
                to={item.to}
                end={item.end}
                className={({ isActive }) => 
                  `flex items-center gap-2 px-4 py-3 rounded-md text-sm transition-all duration-200
                  ${isActive 
                    ? 'bg-restaurant-green text-white shadow-sm' 
                    : 'hover:bg-muted hover:text-foreground text-muted-foreground'}`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <Separator className="mb-4" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-restaurant-green/20 flex items-center justify-center text-restaurant-green">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">Restaurant Manager</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
);

// Main Layout component
const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
