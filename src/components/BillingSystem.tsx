
import React, { useState, useRef } from 'react';
import { OrderItem } from '@/types/billing';
import Header from './Header';
import ItemEntryForm from './ItemEntryForm';
import BillSummary from './BillSummary';
import EstimateModal from './EstimateModal';
import { toast } from "@/components/ui/sonner";
import { Toaster } from '@/components/ui/sonner';
import { Check, Sparkles } from "lucide-react";

const BillingSystem = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const itemEntryFormRef = useRef<{ resetForm: () => void } | null>(null);

  const handleAddItem = (newItem: OrderItem) => {
    // Check if the item already exists in the order
    const existingItemIndex = orderItems.findIndex(item => 
      item.id === newItem.id && item.price === newItem.price
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity and total of the existing item
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
        total: updatedItems[existingItemIndex].total + newItem.total
      };
      setOrderItems(updatedItems);
    } else {
      // Add as a new item
      setOrderItems([...orderItems, newItem]);
    }
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
    toast.success("Item removed from bill");
  };

  const handleGenerateEstimate = () => {
    setIsEstimateModalOpen(true);
    
    // Show success animation
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 2000);
    
    // Show toast notification
    toast.success("Estimate generated successfully!", {
      description: "Ready for the next customer",
      icon: <Check className="h-4 w-4" />
    });
    
    // Reset the form after a slight delay to make it feel smooth
    setTimeout(() => {
      if (itemEntryFormRef.current) {
        itemEntryFormRef.current.resetForm();
      }
      setOrderItems([]);
    }, 300);
  };

  const handlePrintEstimate = () => {
    setIsEstimateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-restaurant-light-green/40 to-restaurant-cream/30 font-poppins">
      <Toaster position="top-center" />
      <div className="container mx-auto py-6 px-4">
        <Header />
        
        {/* Success Animation Overlay */}
        {showSuccessAnimation && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-restaurant-green text-white p-6 rounded-full animate-scale-in opacity-95 shadow-lg flex items-center justify-center">
              <Check className="h-12 w-12 animate-fade-in" />
              <Sparkles className="absolute -right-4 top-1 text-yellow-300 h-6 w-6 animate-pulse" />
              <Sparkles className="absolute -left-4 top-1 text-yellow-300 h-6 w-6 animate-pulse" style={{animationDelay: "0.5s"}} />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-restaurant-green flex items-center">
              <span className="bg-restaurant-green text-white h-6 w-6 inline-flex items-center justify-center rounded-full text-sm mr-2">1</span>
              Add Items to Bill
            </h2>
            <ItemEntryForm onAddItem={handleAddItem} ref={itemEntryFormRef} />
          </div>
          
          <div className="lg:col-span-5 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <h2 className="text-xl font-semibold mb-4 text-restaurant-green flex items-center">
              <span className="bg-restaurant-green text-white h-6 w-6 inline-flex items-center justify-center rounded-full text-sm mr-2">2</span>
              Order Summary
            </h2>
            <BillSummary 
              items={orderItems} 
              onRemoveItem={handleRemoveItem}
              onGenerateEstimate={handleGenerateEstimate}
              onPrintEstimate={handlePrintEstimate}
            />
          </div>
        </div>

        <EstimateModal 
          isOpen={isEstimateModalOpen} 
          onClose={() => setIsEstimateModalOpen(false)}
          items={orderItems}
        />
      </div>
    </div>
  );
};

export default BillingSystem;
