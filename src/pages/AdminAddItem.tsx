import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { FilePlus } from "lucide-react";

const AdminAddItem = () => {
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!itemName || !itemPrice) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/menu/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          item_id: itemId || undefined, // Let backend generate if not provided
          name: itemName,
          price: parseFloat(itemPrice)
        })
      });
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          toast.error(errorData.message || "Failed to add item");
        } catch {
          toast.error(`Server error: ${response.status} ${response.statusText}`);
        }
        return;
      }

      // Try to parse the response as JSON
      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error("Error parsing response:", error);
        toast.error("Invalid response from server");
        return;
      }
      
      toast.success(`Added item: ${itemName}`);
      setItemId("");
      setItemName("");
      setItemPrice("");
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Error connecting to backend. Please check if the server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                  Item ID
                </label>
                <Input
                  id="itemId"
                  placeholder="e.g. ITEM001 (optional)"
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  className="h-12 text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to auto-generate
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
  );
};

export default AdminAddItem;
