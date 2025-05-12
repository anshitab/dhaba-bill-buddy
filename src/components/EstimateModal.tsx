
import React, { forwardRef, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { OrderItem } from '@/types/billing';
import { Separator } from "@/components/ui/separator";
import { Download, Printer } from "lucide-react";

interface EstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
}

const EstimateModal = forwardRef<HTMLDivElement, EstimateModalProps>(
  ({ isOpen, onClose, items }, ref) => {
    const estimateRef = useRef<HTMLDivElement>(null);

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.05; // 5% tax
    const grandTotal = subtotal + tax;
    const currentDate = new Date().toLocaleDateString('en-IN');
    const currentTime = new Date().toLocaleTimeString('en-IN');

    const handlePrint = () => {
      const content = estimateRef.current;
      if (!content) return;

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const printDocument = printWindow.document;
      printDocument.write(`
        <html>
        <head>
          <title>Estimate - AARKAY VAISHNO DHABA</title>
          <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; }
            .estimate { max-width: 800px; margin: 0 auto; }
            h1, h2 { text-align: center; margin-bottom: 5px; }
            .subtitle { text-align: center; color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8f8f8; }
            .total-section { margin-top: 20px; text-align: right; }
            .grand-total { font-size: 18px; font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <div class="footer">
            <p>Thank you for dining with us!</p>
            <p>AARKAY VAISHNO DHABA</p>
          </div>
        </body>
        </html>
      `);
      
      printDocument.close();
      printWindow.focus();
      printWindow.print();
    };

    const handleDownload = () => {
      const content = estimateRef.current;
      if (!content) return;
      
      // Create a hidden anchor element and trigger download
      const element = document.createElement('a');
      element.setAttribute('href', 
        'data:text/plain;charset=utf-8,' + 
        encodeURIComponent(`
AARKAY VAISHNO DHABA
ESTIMATE
Date: ${currentDate} Time: ${currentTime}

ITEMS:
${items.map(item => `${item.name} - ${item.quantity} x ₹${item.price} = ₹${item.total}`).join('\n')}

Subtotal: ₹${subtotal.toFixed(2)}
Tax (5%): ₹${tax.toFixed(2)}
Grand Total: ₹${grandTotal.toFixed(2)}

Thank you for dining with us!
        `)
      );
      element.setAttribute('download', `AARKAY-ESTIMATE-${currentDate.replace(/\//g, '-')}.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center font-poppins">ESTIMATE</DialogTitle>
          </DialogHeader>
          
          <div ref={estimateRef} className="estimate">
            <h1 className="text-xl font-bold mb-1 font-poppins">AARKAY VAISHNO DHABA</h1>
            <div className="text-center text-muted-foreground mb-4 font-poppins">
              <p>Date: {currentDate} | Time: {currentTime}</p>
            </div>

            <Separator className="my-2" />
            
            <div className="my-4">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="font-poppins">
                    <th className="text-left font-medium">Item</th>
                    <th className="text-center font-medium">Price</th>
                    <th className="text-center font-medium">Qty</th>
                    <th className="text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="font-poppins">
                      <td className="py-2 text-left">{item.name}</td>
                      <td className="py-2 text-center">₹{item.price}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <Separator className="my-2" />
            
            <div className="space-y-2 text-right font-poppins">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (5%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="flex-1 border-restaurant-green text-restaurant-green hover:bg-restaurant-green/10 font-poppins"
            >
              <Printer size={18} className="mr-2" />
              Print Estimate
            </Button>
            <Button
              onClick={handleDownload}
              className="flex-1 bg-restaurant-green hover:bg-restaurant-green/90 text-white font-poppins"
            >
              <Download size={18} className="mr-2" />
              Download Estimate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

EstimateModal.displayName = 'EstimateModal';

export default EstimateModal;
