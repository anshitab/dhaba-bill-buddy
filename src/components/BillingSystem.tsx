import React, { useState, useRef } from 'react';
import { OrderItem, MenuItem } from '@/types/billing';
import Header from './Header';
import ItemEntryForm from './ItemEntryForm';
import BillSummary from './BillSummary';
import EstimateModal from './EstimateModal';
import { toast } from "@/components/ui/sonner";
import { Toaster } from '@/components/ui/sonner';
import { Check, Sparkles } from "lucide-react";
import api from '@/services/api';

interface BillingSystemProps {
  menuItems: MenuItem[];
}

const BillingSystem: React.FC<BillingSystemProps> = ({ menuItems }) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
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

  const saveTransaction = async () => {
    try {
      setIsSaving(true);
      
      // Calculate total amount
      const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);
      
      // Prepare transaction data
      const transactionData = {
        items: orderItems.map(item => ({
          item_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        })),
        total_amount: totalAmount,
        payment_method: "Cash", // Default payment method
        status: "completed",
        timestamp: new Date().toISOString()
      };

      console.log('Saving transaction:', transactionData);
      
      // Save to MongoDB using our API service
      const response = await api.post('/transactions', transactionData);
      
      if (response.data && response.data.transaction) {
        console.log("Transaction saved successfully:", response.data);
        // Store the transaction ID and data for the bill
        const transactionId = response.data.transaction.transaction_id;
        setCurrentTransaction(response.data.transaction);
        return { success: true, transactionId };
      } else {
        throw new Error(response.data?.message || "Failed to save transaction");
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save transaction");
      return { success: false };
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateEstimate = async () => {
    // Save transaction first
    const result = await saveTransaction();
    
    if (result.success) {
      setCurrentTransactionId(result.transactionId);
      setIsEstimateModalOpen(true);
      
      // Show success animation
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 2000);
      
      // Show toast notification
      toast.success("Transaction saved and estimate generated!", {
        description: `Transaction ID: ${result.transactionId}`,
        icon: <Check className="h-4 w-4" />
      });
      
      // Reset the form after a slight delay to make it feel smooth
      setTimeout(() => {
        if (itemEntryFormRef.current) {
          itemEntryFormRef.current.resetForm();
        }
        setOrderItems([]);
      }, 300);
    }
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
            <ItemEntryForm onAddItem={handleAddItem} ref={itemEntryFormRef} menuItems={menuItems} />
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
              isSaving={isSaving}
            />
          </div>
        </div>

        <EstimateModal 
          isOpen={isEstimateModalOpen} 
          onClose={() => {
            setIsEstimateModalOpen(false);
            setCurrentTransactionId(null);
            setCurrentTransaction(null);
          }}
          items={currentTransaction?.items || orderItems}
          transactionId={currentTransactionId || undefined}
          transaction={currentTransaction}
        />
      </div>
    </div>
  );
};

export default BillingSystem;
