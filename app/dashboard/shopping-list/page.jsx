"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Check, RotateCw, Printer, Copy } from "lucide-react";

function ShoppingListPage() {
  const { data: session } = useSession();
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set());

  const fetchShoppingList = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/containers?householdId=${session?.user?.householdId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch container");
      }

      const data = await response.json();
      setContainers(data);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
      toast.error("Failed to load shopping list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.householdId) {
      fetchShoppingList();
    }
  }, [session?.user?.householdId]);

  const lowStockContainers = containers.filter(
    (container) => container.currentWeight <= container.alertWeight
  );

  const toggleItemSelection = (id) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const selectAllItems = () => {
    if (selectedItems.size === lowStockContainers.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(
        new Set(lowStockContainers.map((container) => container._id))
      );
    }
  };

  const printList = () => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error("Pop-up blocked. Please allow pop-ups and try again.");
      return;
    }

    const items = lowStockContainers
      .filter(
        (container) =>
          selectedItems.has(container._id) || selectedItems.size === 0
      )
      .map(
        (container) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${container.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${container.currentWeight} ${container.unit}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${container.maxWeight} ${container.unit}</td>
        </tr>
      `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SmartPantry Shopping List</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; padding: 8px; border-bottom: 2px solid #ddd; }
        </style>
      </head>
      <body>
        <h1>SmartPantry Shopping List</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Current</th>
              <th>Max</th>
            </tr>
          </thead>
          <tbody>
            ${items}
          </tbody>
        </table>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const copyToClipboard = () => {
    const items = lowStockContainers
      .filter(
        (container) =>
          selectedItems.has(container._id) || selectedItems.size === 0
      )
      .map(
        (container) =>
          `${container.name} (${container.currentWeight}/${container.maxWeight} ${container.unit})`
      )
      .join("\n");

    const text = `SmartPantry Shopping List\n${new Date().toLocaleDateString()}\n\n${items}`;

    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Shopping list copied to clipboard"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Shopping List</h2>
          <p className="text-muted-foreground">
            Items that are running low and need to be restocked.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchShoppingList}>
            <RotateCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={printList}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>

      {!session?.user?.householdId && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <p>You are not currently part of a household.</p>
              <Button asChild>
                <Link href="/dashboard/household">
                  Create or Join Household
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardHeader>
            <div className="h-7 bg-muted animate-pulse rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-muted animate-pulse rounded"
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : lowStockContainers.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Items to Restock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              All your containers are above their alert thresholds. No shopping
              needed!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Items to Restock</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={
                        selectedItems.size === lowStockContainers.length &&
                        lowStockContainers.length > 0
                      }
                      onChange={selectAllItems}
                    />
                  </TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Alert</TableHead>
                  <TableHead>Max</TableHead>
                  <TableHead className="w-20">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockContainers.map((container) => {
                  const percentage =
                    ((container.currentWeight - container.minWeight) /
                      (container.maxWeight - container.minWeight)) *
                    100;

                  return (
                    <TableRow key={container._id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={selectedItems.has(container._id)}
                          onChange={() => toggleItemSelection(container._id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {container.name}
                      </TableCell>
                      <TableCell>
                        {container.currentWeight} {container.unit}
                      </TableCell>
                      <TableCell>
                        {container.alertWeight} {container.unit}
                      </TableCell>
                      <TableCell>
                        {container.maxWeight} {container.unit}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-full rounded-full ${
                              percentage <= 15
                                ? "bg-destructive"
                                : percentage <= 50
                                ? "bg-warning"
                                : "bg-success"
                            }`}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
export default ShoppingListPage;
