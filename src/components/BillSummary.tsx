import React from 'react';
import { OrderItem } from '@/types/billing';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { X, Download, Printer, Receipt } from "lucide-react";

interface BillSummaryProps {
  items: OrderItem[];
  onRemoveItem: (id: string) => void;
  onGenerateEstimate: () => void;
  onPrintEstimate: () => void;
  isSaving?: boolean;
}

const BillSummary = ({ items, onRemoveItem, onGenerateEstimate, onPrintEstimate, isSaving = false }: BillSummaryProps) => {
  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col border-restaurant-green/20 overflow-hidden">
      <CardHeader className="bg-restaurant-light-green/70 border-b">
        <CardTitle className="text-restaurant-green font-poppins flex items-center justify-between">
          Bill Summary
          <span className="text-sm bg-restaurant-green text-white px-3 py-1 rounded-full">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-0">
        {items.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground flex flex-col items-center space-y-4 h-40 justify-center">
            <div className="p-4 rounded-full bg-restaurant-light-green/50">
              <Download size={24} className="text-restaurant-green opacity-60" />
            </div>
            <p className="font-poppins">No items added to the bill yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-restaurant-light-green/30 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[40%] font-poppins">Item</TableHead>
                <TableHead className="text-center font-poppins">Price</TableHead>
                <TableHead className="text-center font-poppins">Qty</TableHead>
                <TableHead className="text-center font-poppins">Total</TableHead>
                <TableHead className="w-[5%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow 
                  key={item.id + Math.random().toString()} 
                  className="font-poppins hover:bg-restaurant-cream/30 transition-colors duration-150 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">₹{item.price}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-center font-medium text-restaurant-green">₹{item.total}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onRemoveItem(item.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors"
                    >
                      <X size={16} className="transition-transform hover:rotate-90 duration-300" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col p-4 border-t bg-restaurant-cream/70">
        <div className="w-full space-y-2 mb-4">
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            className={`flex-1 bg-restaurant-orange hover:bg-restaurant-orange/90 text-black font-medium font-poppins transition-all duration-300 hover:scale-[1.02] ${items.length > 0 ? "hover:shadow-lg" : "opacity-50"}`}
            onClick={onGenerateEstimate}
            disabled={items.length === 0 || isSaving}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Generate Estimate
              </span>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className={`flex-1 border-restaurant-green text-restaurant-green hover:bg-restaurant-green/10 font-poppins transition-all duration-300 hover:scale-[1.02] ${items.length > 0 ? "hover:shadow-md" : "opacity-50"}`}
            onClick={onPrintEstimate}
            disabled={items.length === 0}
          >
            <Printer size={18} className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Print
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BillSummary;
