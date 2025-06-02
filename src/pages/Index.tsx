import BillingSystem from "../components/BillingSystem";
import { useEffect, useState } from "react";
import { MenuItem } from "@/types/billing";
import { menuAPI } from "@/services/api";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        const response = await menuAPI.getAll();
        setMenuItems(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError("Unable to connect to the server. Please make sure the backend server is running.");
        toast.error("Failed to load menu items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading menu items...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="flex items-center gap-2 text-red-500 mb-4">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          Please make sure the backend server is running on port 5000
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return <BillingSystem menuItems={menuItems} />;
};

export default Index;
