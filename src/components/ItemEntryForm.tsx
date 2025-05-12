
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner"; 
import { MenuItem, OrderItem } from '@/types/billing';
import { menuItems } from '@/data/menu-items';
import { Plus, Sparkles } from "lucide-react";

interface ItemEntryFormProps {
  onAddItem: (item: OrderItem) => void;
}

const ItemEntryForm = ({ onAddItem }: ItemEntryFormProps) => {
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [customPrice, setCustomPrice] = useState<number | "">("");
  const [itemTotal, setItemTotal] = useState<number>(0);
  const [isAnimatingTotal, setIsAnimatingTotal] = useState(false);

  // Find item when itemId changes
  useEffect(() => {
    const foundItem = menuItems.find(item => item.id.toLowerCase() === itemId.toLowerCase());
    setSelectedItem(foundItem || null);
    if (foundItem) {
      setItemName(foundItem.name);
      setCustomPrice(foundItem.price);
    }
  }, [itemId]);

  // Calculate item total and animate
  useEffect(() => {
    if (typeof customPrice === 'number' && customPrice > 0) {
      setItemTotal(customPrice * quantity);
      setIsAnimatingTotal(true);
      const timer = setTimeout(() => setIsAnimatingTotal(false), 600);
      return () => clearTimeout(timer);
    } else {
      setItemTotal(0);
    }
  }, [customPrice, quantity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!selectedItem && !customPrice) || !itemName.trim()) {
      toast.error("Please enter a valid item name and price");
      return;
    }
    
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero");
      return;
    }

    const price = typeof customPrice === 'number' ? customPrice : (selectedItem?.price || 0);
    
    const newItem: OrderItem = {
      id: selectedItem?.id || `Custom-${Date.now().toString().slice(-4)}`,
      name: itemName.trim(),
      price: price,
      quantity: quantity,
      total: price * quantity
    };
    
    onAddItem(newItem);
    
    // Reset form except itemName to improve UX for multiple entries
    setItemId("");
    setQuantity(1);
    setSelectedItem(null);
    setCustomPrice("");
    setItemTotal(0);
    
    toast.success("Item added to bill", {
      description: `${newItem.name} (${newItem.quantity}x) - ₹${newItem.total.toFixed(2)}`
    });
  };

  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-restaurant-orange/20">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 relative">
              <Label htmlFor="itemId" className="flex items-center">
                Item ID
                {selectedItem && <span className="ml-2 inline-flex items-center text-xs bg-restaurant-green/10 text-restaurant-green px-2 py-0.5 rounded-full animate-fade-in">Found</span>}
              </Label>
              <Input
                id="itemId"
                placeholder="Enter item ID (e.g., C001)"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="border-restaurant-orange/40 focus:border-restaurant-orange transform transition-all duration-200 hover:scale-[1.01] focus:scale-[1.02] focus:ring-restaurant-green/30"
              />
              {selectedItem && (
                <div className="text-sm text-restaurant-green font-medium mt-1 animate-fade-in">
                  {selectedItem.name} - ₹{selectedItem.price}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="border-restaurant-orange/40 focus:border-restaurant-orange transform transition-all duration-200 hover:scale-[1.01] focus:scale-[1.02] focus:ring-restaurant-green/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="border-restaurant-orange/40 focus:border-restaurant-orange transform transition-all duration-200 hover:scale-[1.01] focus:scale-[1.02] focus:ring-restaurant-green/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border-restaurant-orange/40 focus:border-restaurant-orange transform transition-all duration-200 hover:scale-[1.01] focus:scale-[1.02] focus:ring-restaurant-green/30"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="total">Item Total</Label>
              <div className={`h-14 px-4 py-2 flex items-center justify-center text-xl border rounded-md ${isAnimatingTotal ? "bg-restaurant-green text-white scale-105" : "bg-restaurant-light-green/70"} border-restaurant-green/30 text-restaurant-green font-semibold transition-all duration-300`}>
                ₹{itemTotal.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4 bg-restaurant-light-green/50">
          <Button 
            type="submit" 
            className="w-full bg-restaurant-green text-white hover:bg-restaurant-green/90 transition-all duration-300 font-poppins py-6 hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:scale-100 group"
            disabled={!itemName.trim() || !(typeof customPrice === 'number' && customPrice > 0)}
          >
            <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            <Sparkles size={16} className="absolute left-6 bottom-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-[-15px] transition-all duration-500" />
            Add Item to Bill
            <Sparkles size={16} className="absolute right-6 bottom-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-[-15px] transition-all duration-700" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ItemEntryForm;
