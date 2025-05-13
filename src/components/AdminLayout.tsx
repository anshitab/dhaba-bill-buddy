
import { useState, ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { Database, FilePlus, Menu, Printer, User } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="bg-restaurant-green text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white hover:bg-restaurant-green/80"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="font-poppins font-bold text-xl md:text-2xl tracking-tight">
              AARKAY VAISHNO DHABA – Admin Panel
            </h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="text-white border-white hover:bg-white hover:text-restaurant-green"
          >
            <User className="mr-1 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:block w-64 bg-sidebar border-r border-border">
          <div className="h-full flex flex-col">
            <nav className="flex-1 p-4">
              <h2 className="font-semibold text-sm text-muted-foreground mb-4 uppercase">
                Management
              </h2>
              <ul className="space-y-2">
                <li>
                  <NavLink 
                    to="/admin" 
                    end
                    className={({ isActive }) => 
                      `flex items-center gap-2 px-4 py-3 rounded-md text-sm 
                      ${isActive ? 'bg-restaurant-green text-white' : 'hover:bg-muted transition-colors'}`
                    }
                  >
                    <FilePlus className="h-4 w-4" />
                    Add Item
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/admin/database" 
                    className={({ isActive }) => 
                      `flex items-center gap-2 px-4 py-3 rounded-md text-sm 
                      ${isActive ? 'bg-restaurant-green text-white' : 'hover:bg-muted transition-colors'}`
                    }
                  >
                    <Database className="h-4 w-4" />
                    Edit Database
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/admin/transactions" 
                    className={({ isActive }) => 
                      `flex items-center gap-2 px-4 py-3 rounded-md text-sm 
                      ${isActive ? 'bg-restaurant-green text-white' : 'hover:bg-muted transition-colors'}`
                    }
                  >
                    <Printer className="h-4 w-4" />
                    Print Transactions
                  </NavLink>
                </li>
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

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <>
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-20 animate-fade-in"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <aside className="lg:hidden fixed left-0 top-0 h-full w-64 bg-background border-r border-border z-30 animate-slide-in-right">
              <div className="h-full flex flex-col">
                <div className="p-4 bg-restaurant-green text-white">
                  <h1 className="font-poppins font-bold text-lg">AARKAY Admin</h1>
                </div>
                <nav className="flex-1 p-4">
                  <ul className="space-y-2">
                    <li>
                      <NavLink 
                        to="/admin" 
                        end
                        className={({ isActive }) => 
                          `flex items-center gap-2 px-4 py-3 rounded-md text-sm 
                          ${isActive ? 'bg-restaurant-green text-white' : 'hover:bg-muted transition-colors'}`
                        }
                        onClick={() => setIsMobileSidebarOpen(false)}
                      >
                        <FilePlus className="h-4 w-4" />
                        Add Item
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        to="/admin/database" 
                        className={({ isActive }) => 
                          `flex items-center gap-2 px-4 py-3 rounded-md text-sm 
                          ${isActive ? 'bg-restaurant-green text-white' : 'hover:bg-muted transition-colors'}`
                        }
                        onClick={() => setIsMobileSidebarOpen(false)}
                      >
                        <Database className="h-4 w-4" />
                        Edit Database
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        to="/admin/transactions" 
                        className={({ isActive }) => 
                          `flex items-center gap-2 px-4 py-3 rounded-md text-sm 
                          ${isActive ? 'bg-restaurant-green text-white' : 'hover:bg-muted transition-colors'}`
                        }
                        onClick={() => setIsMobileSidebarOpen(false)}
                      >
                        <Printer className="h-4 w-4" />
                        Print Transactions
                      </NavLink>
                    </li>
                  </ul>
                </nav>
                <div className="p-4">
                  <Separator className="mb-4" />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    <User className="mr-1 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
