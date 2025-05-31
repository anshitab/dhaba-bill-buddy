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
import { toast } from "@/components/ui/sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Printer } from "lucide-react";
import { format, isValid } from "date-fns";

interface Transaction {
  _id: string;
  timestamp: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total_amount: number;
  payment_method: string;
}

// Safe date formatting function
const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, "MMM dd, yyyy HH:mm");
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        timestamp: txn.timestamp || new Date().toISOString(), // Fallback to current time if missing
        total_amount: Number(txn.total_amount) || 0,
        items: Array.isArray(txn.items) ? txn.items : []
      }));
      setTransactions(validTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch transactions");
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Printer className="h-6 w-6 text-restaurant-green" />
        <h1 className="text-2xl font-bold">Transactions</h1>
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
            <CardTitle className="text-2xl">{formatDate(new Date().toISOString())}</CardTitle>
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
                      checked={transactions.length > 0} 
                      onCheckedChange={() => {}}
                    />
                  </TableHead>
                  <TableHead className="w-24">Date & Time</TableHead>
                  <TableHead className="w-32">Items</TableHead>
                  <TableHead className="w-32 text-right">Amount (₹)</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center p-8 text-muted-foreground">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction._id} className="hover:bg-muted/30">
                      <TableCell>
                        <Checkbox 
                          checked={true} 
                          onCheckedChange={() => {}}
                        />
                      </TableCell>
                      <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                      <TableCell>
                        {transaction.items.map((item) => (
                          <div key={item.name} className="text-sm">
                            {item.quantity}x {item.name} (₹{item.price})
                          </div>
                        ))}
                      </TableCell>
                      <TableCell className="text-right">₹{transaction.total_amount.toFixed(2)}</TableCell>
                      <TableCell>{transaction.payment_method}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-4">
        <Button 
          className="bg-restaurant-cream text-restaurant-green border border-restaurant-green hover:bg-restaurant-green hover:text-white"
          size="lg"
          onClick={() => {}}
          disabled={transactions.length === 0}
        >
          <Printer className="mr-2 h-5 w-5" />
          Print
        </Button>
        <Button 
          className="bg-restaurant-green hover:bg-restaurant-green/90"
          size="lg"
          onClick={() => {}}
          disabled={transactions.length === 0}
        >
          <Download className="mr-2 h-5 w-5" />
          Download Report
        </Button>
      </div>
    </div>
  );
};

export default AdminTransactions;
