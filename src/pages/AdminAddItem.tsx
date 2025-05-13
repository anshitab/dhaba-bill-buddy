
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { FilePlus } from "lucide-react";
import { menuItems } from "@/data/menu-items";
import AdminLayout from "@/components/AdminLayout";

const AdminAddItem = () => {
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!itemId || !itemName || !itemPrice) {
      toast.error("Please fill all fields");
      return;
    }
    
    if (menuItems.some(item => item.id === itemId)) {
      toast.error("Item ID already exists");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate adding to database
    setTimeout(() => {
      // In a real app, this would call an API to add the item
      menuItems.push({
        id: itemId,
        name: itemName,
        price: parseFloat(itemPrice)
      });
      
      toast.success(`Added item: ${itemName}`);
      setIsLoading(false);
      
      // Clear form
      setItemId("");
      setItemName("");
      setItemPrice("");
    }, 600);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-2">
          <FilePlus className="h-6 w-6 text-restaurant-green" />
          <h1 className="text-2xl font-bold">Add New Menu Item</h1>
        </div>
        
        <Card className="border-restaurant-green/10 shadow-md">
          <CardHeader className="bg-restaurant-light-green/30 border-b">
            <CardTitle className="text-xl text-restaurant-green">Item Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="itemId" className="text-sm font-medium">
                    Item ID <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="itemId"
                    placeholder="e.g. C005"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Unique identifier for the menu item
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="itemName" className="text-sm font-medium">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="itemName"
                    placeholder="e.g. Shahi Paneer"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="itemPrice" className="text-sm font-medium">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="itemPrice"
                  type="number"
                  placeholder="e.g. 180"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  className="h-12 text-base"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-restaurant-green hover:bg-restaurant-green/90 h-12 px-6 text-base transition-all hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Adding Item...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FilePlus className="h-5 w-5" />
                      Add to Menu
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card className="bg-restaurant-cream/30 border-restaurant-orange/20">
          <CardContent className="p-4">
            <p className="text-sm">
              <strong>Note:</strong> New items will be immediately available in the billing system.
              Make sure to set correct prices before adding items.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAddItem;
