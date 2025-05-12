
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner"; 
import { MenuItem, OrderItem } from '@/types/billing';
import { menuItems } from '@/data/menu-items';
import { Plus } from "lucide-react";

interface ItemEntryFormProps {
  onAddItem: (item: OrderItem) => void;
}

const ItemEntryForm = ({ onAddItem }: ItemEntryFormProps) => {
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [customPrice, setCustomPrice] = useState<number | "">("");
  const [itemTotal, setItemTotal] = useState<number>(0);

  // Find item when itemId changes
  useEffect(() => {
    const foundItem = menuItems.find(item => item.id.toLowerCase() === itemId.toLowerCase());
    setSelectedItem(foundItem || null);
    if (foundItem) {
      setCustomPrice(foundItem.price);
    } else {
      setCustomPrice("");
    }
  }, [itemId]);

  // Calculate item total
  useEffect(() => {
    if (typeof customPrice === 'number' && customPrice > 0) {
      setItemTotal(customPrice * quantity);
    } else {
      setItemTotal(0);
    }
  }, [customPrice, quantity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItem && !customPrice) {
      toast.error("Please enter a valid item ID or price");
      return;
    }
    
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero");
      return;
    }

    const price = typeof customPrice === 'number' ? customPrice : (selectedItem?.price || 0);
    
    const newItem: OrderItem = {
      id: selectedItem?.id || `Custom-${Date.now().toString().slice(-4)}`,
      name: selectedItem?.name || `Custom Item (${itemId})`,
      price: price,
      quantity: quantity,
      total: price * quantity
    };
    
    onAddItem(newItem);
    
    // Reset form
    setItemId("");
    setQuantity(1);
    setSelectedItem(null);
    setCustomPrice("");
    setItemTotal(0);
    
    toast.success("Item added to bill");
  };

  return (
    <Card className="bg-white shadow-md">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="itemId">Item ID</Label>
              <Input
                id="itemId"
                placeholder="Enter item ID (e.g., C001)"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="border-restaurant-orange/40 focus:border-restaurant-orange"
              />
              {selectedItem && (
                <div className="text-sm text-restaurant-green font-medium mt-1">
                  {selectedItem.name} - ₹{selectedItem.price}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="border-restaurant-orange/40 focus:border-restaurant-orange"
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
                className="border-restaurant-orange/40 focus:border-restaurant-orange"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total">Item Total</Label>
              <div className="h-10 px-4 py-2 flex items-center border rounded-md bg-restaurant-light-green border-restaurant-green/30 text-restaurant-green font-semibold">
                ₹{itemTotal.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4 bg-restaurant-light-green/50">
          <Button 
            type="submit" 
            className="w-full bg-restaurant-green text-white hover:bg-restaurant-green/90 transition-all font-poppins"
          >
            <Plus size={18} className="mr-2" />
            Add Item to Bill
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ItemEntryForm;
