import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { Database, Edit, Search, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

// Update the interface to match MongoDB data structure
interface MenuItem {
  _id: string;
  item_id?: string;  // Make item_id optional
  name: string;
  price: number;
}

const AdminDatabase = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/menu");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (isMounted) {
          setItems(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching items:", error);
          setError(error instanceof Error ? error.message : "Failed to fetch items");
          toast.error("Failed to fetch menu items");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update filter to handle missing item_id
  const filteredItems = items.filter(item => 
    (item.item_id?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (item: MenuItem) => {
    setEditingItem({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    setItems(currentItems => 
      currentItems.map(item => 
        item._id === editingItem._id ? editingItem : item
      )
    );

    toast.success(`Updated: ${editingItem.name}`);
    setEditingItem(null);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleDeleteClick = (itemId: string) => {
    setConfirmingDelete(itemId);
  };

  const handleConfirmDelete = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item._id !== itemId));
    toast.success("Item deleted successfully");
    setConfirmingDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmingDelete(null);
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
        <Database className="h-6 w-6 text-restaurant-green" />
        <h1 className="text-2xl font-bold">Menu Database</h1>
      </div>
      
      <Card className="border-restaurant-green/10 shadow-md">
        <CardHeader className="bg-restaurant-light-green/30 border-b flex flex-col sm:flex-row justify-between gap-4">
          <CardTitle className="text-xl text-restaurant-green">All Menu Items</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-24">Item ID</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="w-32 text-right">Price (₹)</TableHead>
                  <TableHead className="w-28 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center p-8 text-muted-foreground">
                      No items found. Try a different search term.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map(item => (
                    <TableRow key={item._id} className="hover:bg-muted/30">
                      {editingItem && editingItem._id === item._id ? (
                        // Editing mode
                        <>
                          <TableCell className="font-medium">
                            <Input 
                              value={editingItem.item_id} 
                              onChange={(e) => setEditingItem({...editingItem, item_id: e.target.value})}
                              className="max-w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={editingItem.name} 
                              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input 
                              type="number" 
                              value={editingItem.price}
                              onChange={(e) => setEditingItem({
                                ...editingItem, 
                                price: parseFloat(e.target.value) || 0
                              })}
                              className="w-24 ml-auto text-right"
                              min="0"
                              step="0.01"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-2">
                              <Button 
                                size="sm" 
                                onClick={handleSaveEdit}
                                className="bg-restaurant-green hover:bg-restaurant-green/80"
                              >
                                Save
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : confirmingDelete === item._id ? (
                        // Delete confirmation mode
                        <>
                          <TableCell colSpan={2} className="font-medium text-destructive">
                            Are you sure you want to delete this item?
                          </TableCell>
                          <TableCell className="text-right">
                            {item.name}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-2">
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleConfirmDelete(item._id)}
                              >
                                Delete
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={handleCancelDelete}
                              >
                                Cancel
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        // Normal view mode
                        <>
                          <TableCell className="font-medium">{item.item_id || 'N/A'}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleEditClick(item)}
                                className="bg-restaurant-green hover:bg-restaurant-green/80"
                              >
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDeleteClick(item._id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDatabase;
