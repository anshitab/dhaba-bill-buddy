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
  transactionId?: string;
  transaction?: any;
}

const EstimateModal = forwardRef<HTMLDivElement, EstimateModalProps>(
  ({ isOpen, onClose, items, transactionId, transaction }, ref) => {
    const estimateRef = useRef<HTMLDivElement>(null);

    const totalAmount = transaction?.total_amount || items.reduce((sum, item) => sum + item.total, 0);
    
    // Format date and time from transaction timestamp
    const formatDateTime = (timestamp: string) => {
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        return {
          date: date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          time: date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        };
      } catch (error) {
        // Fallback to current date/time if timestamp is invalid
        const now = new Date();
        return {
          date: now.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          time: now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        };
      }
    };

    const { date: currentDate, time: currentTime } = transaction?.timestamp 
      ? formatDateTime(transaction.timestamp)
      : formatDateTime(new Date().toISOString());

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
            @page {
              size: 80mm 297mm;
              margin: 0;
            }
            body { 
              font-family: 'Courier New', monospace;
              margin: 0;
              padding: 5mm;
              width: 70mm;
              font-size: 12px;
            }
            .estimate { 
              width: 100%;
              margin: 0 auto;
            }
            h1, h2 { 
              text-align: center;
              margin: 5px 0;
              font-size: 14px;
              font-weight: bold;
            }
            .subtitle { 
              text-align: center;
              margin: 5px 0;
              font-size: 11px;
            }
            .transaction-id {
              text-align: center;
              margin: 5px 0;
              font-size: 11px;
              font-weight: bold;
              color: #22c55e;
            }
            table { 
              width: 100%;
              border-collapse: collapse;
              margin: 5px 0;
            }
            th, td { 
              padding: 2px 0;
              text-align: left;
              font-size: 11px;
            }
            th { 
              border-bottom: 1px dashed #000;
            }
            .total-section { 
              margin-top: 10px;
              text-align: right;
              border-top: 1px dashed #000;
              padding-top: 5px;
            }
            .grand-total { 
              font-size: 12px;
              font-weight: bold;
            }
            .footer { 
              margin-top: 15px;
              text-align: center;
              font-size: 11px;
              border-top: 1px dashed #000;
              padding-top: 5px;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <div class="footer">
            <p>Thank you for dining with us!</p>
            <p>AARKAY VAISHNO DHABA</p>
            <p>JALANDHAR, PUNJAB</p>
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
      
      const element = document.createElement('a');
      element.setAttribute('href', 
        'data:text/plain;charset=utf-8,' + 
        encodeURIComponent(`
AARKAY VAISHNO DHABA
JALANDHAR, PUNJAB
Date: ${currentDate} Time: ${currentTime}
${transactionId ? `Transaction ID: ${transactionId}` : ''}

ITEMS:
${items.map((item, i) => `${i + 1}. ${item.name} - ${item.quantity} x ₹${item.price} = ₹${item.total}`).join('\n')}

Total Amount: ₹${totalAmount.toFixed(2)}

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
              {transactionId && (
                <p className="text-restaurant-green font-semibold">Transaction ID: {transactionId}</p>
              )}
            </div>

            <Separator className="my-2" />
            
            <div className="my-4">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="font-poppins">
                    <th className="text-left font-medium">Sr. No.</th>
                    <th className="text-left font-medium">Item Name</th>
                    <th className="text-center font-medium">Quantity</th>
                    <th className="text-center font-medium">Price (₹)</th>
                    <th className="text-right font-medium">Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="font-poppins">
                      <td className="py-2 text-left">{i + 1}</td>
                      <td className="py-2 text-left">{item.name}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-center">{item.price}</td>
                      <td className="py-2 text-right">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <Separator className="my-2" />
            
            <div className="mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
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
