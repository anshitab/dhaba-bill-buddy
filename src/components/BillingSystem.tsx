
import React, { useState } from 'react';
import { OrderItem } from '@/types/billing';
import Header from './Header';
import ItemEntryForm from './ItemEntryForm';
import BillSummary from './BillSummary';
import EstimateModal from './EstimateModal';
import { toast } from "@/components/ui/sonner";

const BillingSystem = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);

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
  };

  const handlePrintEstimate = () => {
    setIsEstimateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-restaurant-light-green/30 font-poppins">
      <div className="container mx-auto py-6 px-4">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <h2 className="text-xl font-semibold mb-4 text-restaurant-green">Add Items to Bill</h2>
            <ItemEntryForm onAddItem={handleAddItem} />
          </div>
          
          <div className="lg:col-span-5">
            <h2 className="text-xl font-semibold mb-4 text-restaurant-green">Order Summary</h2>
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
