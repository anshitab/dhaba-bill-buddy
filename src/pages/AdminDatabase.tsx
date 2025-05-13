
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { Database, Edit, Search, Trash2 } from "lucide-react";
import { menuItems } from "@/data/menu-items";
import { MenuItem } from "@/types/billing";
import AdminLayout from "@/components/AdminLayout";

const AdminDatabase = () => {
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  // Filter items based on search
  const filteredItems = items.filter(item => 
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (item: MenuItem) => {
    setEditingItem({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    setItems(currentItems => 
      currentItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      )
    );

    // Also update the menuItems array (which is the actual data source)
    const itemIndex = menuItems.findIndex(item => item.id === editingItem.id);
    if (itemIndex !== -1) {
      menuItems[itemIndex] = { ...editingItem };
    }

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
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
    
    // Also remove from the menuItems array
    const itemIndex = menuItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      menuItems.splice(itemIndex, 1);
    }
    
    toast.success("Item deleted successfully");
    setConfirmingDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmingDelete(null);
  };

  return (
    <AdminLayout>
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
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        {editingItem && editingItem.id === item.id ? (
                          // Editing mode
                          <>
                            <TableCell className="font-medium">
                              <Input 
                                value={editingItem.id} 
                                onChange={(e) => setEditingItem({...editingItem, id: e.target.value})}
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
                        ) : confirmingDelete === item.id ? (
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
                                  onClick={() => handleConfirmDelete(item.id)}
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
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleEditClick(item)}
                                  className="text-restaurant-green hover:bg-restaurant-green/10 hover:text-restaurant-green"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleDeleteClick(item.id)}
                                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
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
    </AdminLayout>
  );
};

export default AdminDatabase;
