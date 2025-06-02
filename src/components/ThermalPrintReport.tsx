import React from 'react';
import { Transaction } from '@/types/transaction';

interface ThermalPrintReportProps {
  transactions: Transaction[];
  onClose: () => void;
}

const ThermalPrintReport: React.FC<ThermalPrintReportProps> = ({ transactions, onClose }) => {
  const formatDate = (dateString: string | { $date: string } | undefined | null) => {
    if (!dateString) return 'N/A';
    try {
      // Handle MongoDB date format
      const dateValue = typeof dateString === 'object' && '$date' in dateString 
        ? dateString.$date 
        : dateString;
      
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateString);
        return 'N/A';
      }

      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (error) {
      console.error('Error printing:', error);
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-[384px]">
          <div className="text-center">
            <p className="text-red-500">No transactions selected for printing</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 text-sm bg-restaurant-green text-white rounded hover:bg-restaurant-green/90"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[384px] max-h-[80vh] overflow-y-auto">
        {/* Print Content */}
        <div className="print:block print:overflow-visible print:max-h-none">
          <style>
            {`
              @media print {
                @page {
                  size: 384px auto;
                  margin: 0;
                }
                body * {
                  visibility: hidden;
                }
                .print\\:block, .print\\:block * {
                  visibility: visible;
                }
                .print\\:block {
                  position: absolute;
                  left: 20px;
                  top: 0;
                  width: 384px;
                }
                .print\\:hidden {
                  display: none;
                }
                .transaction-group {
                  page-break-inside: avoid;
                }
                .transaction-group:last-child {
                  page-break-after: avoid;
                }
              }
            `}
          </style>
          
          {/* Print Header */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold">AARKAY VAISHNO DHABA</h1>
            <h3 className="text-xl font-bold">NAKODAR ROAD, JALANDHAR</h3>
            <p className="text-sm">Transaction Report</p>
            <p className="text-sm">{formatDate(new Date().toISOString())}</p>
          </div>

          {/* Transactions */}
          {transactions.map((transaction) => (
            <div key={transaction._id} className="transaction-group mb-6 border-b border-dashed border-gray-300 pb-4">
              <div className="text-center mb-2">
                <p className="text-sm font-semibold">
                  Transaction #{transaction.transaction_id || 'N/A'}
                </p>
                <p className="text-xs">{formatDate(transaction.timestamp)}</p>
              </div>
              
              <div className="space-y-1">
                {transaction.items.map((item) => (
                  <div key={`${transaction._id}-${item.item_id}`} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-2 pt-2 border-t border-dashed border-gray-300">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{transaction.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Print Footer */}
          <div className="text-center mt-4 text-sm">
            <p>Thank you for your business!</p>
            <p>------------------------</p>
          </div>
        </div>

        {/* Preview Controls */}
        <div className="print:hidden flex flex-col gap-4">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Print Preview</h2>
            <p className="text-sm text-gray-600">This will print {transactions.length} transactions</p>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-sm bg-restaurant-green text-white rounded hover:bg-restaurant-green/90"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermalPrintReport; 