
import { useState } from "react";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Printer } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { format } from "date-fns";

// Mock transaction data for demonstration
const mockTransactions = [
  { 
    id: "T001", 
    date: new Date(), 
    time: "10:15 AM", 
    items: 4, 
    total: 560, 
    paymentMethod: "Cash",
    shift: "morning" 
  },
  { 
    id: "T002", 
    date: new Date(), 
    time: "11:30 AM", 
    items: 2, 
    total: 240, 
    paymentMethod: "Card",
    shift: "morning" 
  },
  { 
    id: "T003", 
    date: new Date(), 
    time: "12:45 PM", 
    items: 6, 
    total: 780, 
    paymentMethod: "Cash",
    shift: "afternoon" 
  },
  { 
    id: "T004", 
    date: new Date(), 
    time: "2:20 PM", 
    items: 3, 
    total: 420, 
    paymentMethod: "Cash",
    shift: "afternoon" 
  },
  { 
    id: "T005", 
    date: new Date(), 
    time: "4:05 PM", 
    items: 5, 
    total: 650, 
    paymentMethod: "Card",
    shift: "afternoon" 
  },
  { 
    id: "T006", 
    date: new Date(), 
    time: "7:30 PM", 
    items: 8, 
    total: 1150, 
    paymentMethod: "Cash",
    shift: "evening" 
  },
  { 
    id: "T007", 
    date: new Date(), 
    time: "8:45 PM", 
    items: 6, 
    total: 920, 
    paymentMethod: "Card",
    shift: "evening" 
  },
];

const AdminTransactions = () => {
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Filter transactions by shift
  const filteredTransactions = shiftFilter === "all" 
    ? mockTransactions 
    : mockTransactions.filter(t => t.shift === shiftFilter);

  // Calculate totals
  const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = filteredTransactions.length;
  
  const handleSelectAll = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(filteredTransactions.map(t => t.id));
    }
  };

  const handleSelectTransaction = (id: string) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(selectedTransactions.filter(t => t !== id));
    } else {
      setSelectedTransactions([...selectedTransactions, id]);
    }
  };

  const handlePrint = () => {
    setIsGeneratingReport(true);
    
    setTimeout(() => {
      toast.success("Report prepared for printing!");
      setIsGeneratingReport(false);
      // In a real app, this would trigger the print dialog or PDF generation
    }, 1000);
  };

  const handleDownload = () => {
    setIsGeneratingReport(true);
    
    setTimeout(() => {
      toast.success("Report downloaded successfully!");
      setIsGeneratingReport(false);
      // In a real app, this would generate and download a PDF
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-2">
          <Printer className="h-6 w-6 text-restaurant-green" />
          <h1 className="text-2xl font-bold">Daily Transactions</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-restaurant-green/10 shadow-md bg-restaurant-light-green/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">₹{totalSales.toLocaleString()}</CardTitle>
              <CardDescription>Total Sales Today</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-restaurant-green/10 shadow-md bg-restaurant-cream/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{totalTransactions}</CardTitle>
              <CardDescription>Total Transactions</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-restaurant-green/10 shadow-md bg-restaurant-orange/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{format(new Date(), 'dd MMM yyyy')}</CardTitle>
              <CardDescription>Current Date</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <Card className="border-restaurant-green/10 shadow-md">
          <CardHeader className="bg-restaurant-light-green/30 border-b flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle className="text-xl text-restaurant-green">Transaction List</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm font-normal text-muted-foreground whitespace-nowrap">Filter by Shift:</span>
              <Select value={shiftFilter} onValueChange={setShiftFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="morning">Morning (6AM-12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12-5PM)</SelectItem>
                  <SelectItem value="evening">Evening (5PM-Close)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0} 
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-24">Bill #</TableHead>
                    <TableHead className="w-32">Time</TableHead>
                    <TableHead className="w-24">Items</TableHead>
                    <TableHead className="w-32 text-right">Amount (₹)</TableHead>
                    <TableHead>Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center p-8 text-muted-foreground">
                        No transactions found for the selected shift.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-muted/30">
                        <TableCell>
                          <Checkbox 
                            checked={selectedTransactions.includes(transaction.id)} 
                            onCheckedChange={() => handleSelectTransaction(transaction.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.time}</TableCell>
                        <TableCell>{transaction.items}</TableCell>
                        <TableCell className="text-right">₹{transaction.total.toFixed(2)}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <Button 
            className="bg-restaurant-cream text-restaurant-green border border-restaurant-green hover:bg-restaurant-green hover:text-white"
            size="lg"
            onClick={handlePrint}
            disabled={selectedTransactions.length === 0 || isGeneratingReport}
          >
            <Printer className="mr-2 h-5 w-5" />
            Print {selectedTransactions.length > 0 ? `(${selectedTransactions.length})` : ''}
          </Button>
          <Button 
            className="bg-restaurant-green hover:bg-restaurant-green/90"
            size="lg"
            onClick={handleDownload}
            disabled={selectedTransactions.length === 0 || isGeneratingReport}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Report
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
