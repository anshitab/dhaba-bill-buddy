import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast, Toaster } from "@/components/ui/sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Printer } from "lucide-react";
import { format, isValid } from "date-fns";
import ThermalPrintReport from "@/components/ThermalPrintReport";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";

interface Transaction {
  _id: string;
  timestamp: string;
  items: Array<{
    item_id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total_amount: number;
  transaction_id?: string;
}

// Safe date formatting function
const formatDate = (dateString: string | undefined | null | { $date: string }) => {
  if (!dateString) return 'N/A';
  try {
    // Handle MongoDB date format
    const dateValue = typeof dateString === 'object' && '$date' in dateString 
      ? dateString.$date 
      : dateString;
    
    // Create date object from UTC timestamp
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      return 'Invalid Date';
    }

    // Format the date in Indian format with IST timezone
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error, 'for date:', dateString);
    return 'Invalid Date';
  }
};

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [showPrintReport, setShowPrintReport] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:5000/transactions",
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch transactions");
      }

      const data = await response.json();
      // Validate and transform the data
      const validTransactions = data.map((txn: any) => ({
        ...txn,
        timestamp: txn.timestamp || new Date().toISOString(), // Ensure timestamp is in ISO format
        total_amount: Number(txn.total_amount) || 0,
        items: Array.isArray(txn.items) ? txn.items : []
      }));
      console.log('Processed transactions:', validTransactions); // Debug log
      setTransactions(validTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch transactions");
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  // Handle select all transactions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(transactions.map(t => t._id));
      setSelectedTransactions(allIds);
    } else {
      setSelectedTransactions(new Set());
    }
  };

  // Handle select individual transaction
  const handleSelectTransaction = (transactionId: string, checked: boolean) => {
    const newSelected = new Set(selectedTransactions);
    if (checked) {
      newSelected.add(transactionId);
    } else {
      newSelected.delete(transactionId);
    }
    setSelectedTransactions(newSelected);
  };

  const handlePrintSelected = () => {
    setShowPrintReport(true);
  };

  const selectedTransactionsList = transactions.filter(t => selectedTransactions.has(t._id));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-restaurant-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-restaurant-light-green/40 to-restaurant-cream/30 font-poppins">
      <Toaster position="top-center" />
      <div className="container mx-auto py-6 px-4">
        <Header />
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-restaurant-green">Transactions</h1>
              <Badge variant="outline" className="bg-restaurant-light-green/50 text-restaurant-green border-restaurant-green/30">
                {transactions.length} total
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[300px]"
              />
              <Button 
                onClick={handlePrintSelected}
                disabled={selectedTransactions.size === 0}
                className="bg-restaurant-green text-white hover:bg-restaurant-green/90"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Selected
              </Button>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-restaurant-green/10 shadow-md bg-restaurant-light-green/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">₹{transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0).toLocaleString()}</CardTitle>
                <CardDescription>Total Sales</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-restaurant-green/10 shadow-md bg-restaurant-cream/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{transactions.length}</CardTitle>
                <CardDescription>Total Transactions</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-restaurant-green/10 shadow-md bg-restaurant-orange/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">
                  {new Intl.DateTimeFormat('en-IN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    timeZone: 'Asia/Kolkata'
                  }).format(new Date())}
                </CardTitle>
                <CardDescription>Current Date</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="bg-restaurant-light-green/30 border-b">
              <CardTitle className="text-xl text-restaurant-green">Transaction List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={transactions.length > 0 && selectedTransactions.size === transactions.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="w-32">Date & Time</TableHead>
                      <TableHead className="w-32">Transaction ID</TableHead>
                      <TableHead className="w-32">Items</TableHead>
                      <TableHead className="w-32 text-right">Amount (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center p-8 text-muted-foreground">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={`row-${transaction._id}`} className="hover:bg-muted/30">
                          <TableCell>
                            <Checkbox 
                              checked={selectedTransactions.has(transaction._id)}
                              onCheckedChange={(checked) => handleSelectTransaction(transaction._id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                          <TableCell className="text-restaurant-green font-medium">
                            {typeof transaction.transaction_id === 'object' && '$oid' in transaction.transaction_id 
                              ? transaction.transaction_id.$oid 
                              : transaction.transaction_id || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {transaction.items.map((item) => (
                              <div key={`item-${transaction._id}-${item.item_id}`} className="text-sm">
                                {item.quantity}x {item.name} (₹{item.price})
                              </div>
                            ))}
                          </TableCell>
                          <TableCell className="text-right">₹{transaction.total_amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {showPrintReport && (
          <ThermalPrintReport
            transactions={selectedTransactionsList}
            onClose={() => setShowPrintReport(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminTransactions;
