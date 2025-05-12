
import React from 'react';
import { OrderItem } from '@/types/billing';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { X, Download, Printer } from "lucide-react";

interface BillSummaryProps {
  items: OrderItem[];
  onRemoveItem: (id: string) => void;
  onGenerateEstimate: () => void;
  onPrintEstimate: () => void;
}

const BillSummary = ({ items, onRemoveItem, onGenerateEstimate, onPrintEstimate }: BillSummaryProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.05; // 5% tax
  const grandTotal = subtotal + tax;

  return (
    <Card className="bg-white shadow-md h-full flex flex-col">
      <CardHeader className="bg-restaurant-light-green/70 border-b">
        <CardTitle className="text-restaurant-green font-poppins">Bill Summary</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow p-0 overflow-auto">
        {items.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No items added to the bill yet.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-restaurant-light-green/30">
              <TableRow>
                <TableHead className="w-[40%] font-poppins">Item</TableHead>
                <TableHead className="text-center font-poppins">Price</TableHead>
                <TableHead className="text-center font-poppins">Qty</TableHead>
                <TableHead className="text-center font-poppins">Total</TableHead>
                <TableHead className="w-[5%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id + Math.random().toString()} className="font-poppins">
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-center">₹{item.price}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-center font-medium">₹{item.total}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onRemoveItem(item.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <X size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col p-4 border-t bg-restaurant-cream/50">
        <div className="w-full space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-poppins">Subtotal:</span>
            <span className="font-medium font-poppins">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-poppins">Tax (5%):</span>
            <span className="font-medium font-poppins">₹{tax.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between">
            <span className="font-semibold text-lg font-poppins">Grand Total:</span>
            <span className="font-bold text-lg text-restaurant-green font-poppins">₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button 
            className="flex-1 bg-restaurant-orange hover:bg-restaurant-orange/90 text-black font-medium font-poppins"
            onClick={onGenerateEstimate}
            disabled={items.length === 0}
          >
            Generate Estimate
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1 border-restaurant-green text-restaurant-green hover:bg-restaurant-green/10 font-poppins"
            onClick={onPrintEstimate}
            disabled={items.length === 0}
          >
            <Printer size={18} className="mr-2" />
            Print
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BillSummary;
