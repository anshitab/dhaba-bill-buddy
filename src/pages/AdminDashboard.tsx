import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-restaurant-light-green/20 p-4">
      <h1 className="text-3xl font-bold mb-8 text-restaurant-green">Admin Dashboard</h1>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Button asChild className="w-full">
          <Link to="/admin/add-item">Add Menu Item</Link>
        </Button>
        <Button asChild className="w-full">
          <Link to="/admin/database">Edit/View Menu</Link>
        </Button>
        <Button asChild className="w-full">
          <Link to="/admin/transactions">View/Print Transactions</Link>
        </Button>
      </div>
    </div>
  );
} 