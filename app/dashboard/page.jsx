"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContainerForm from "@/components/containers/container-form";
import ContainerCard from "@/components/containers/container-card";
import ContainerChart from "@/components/containers/container-chart";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {  Plus, RotateCw } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchContainers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/containers?householdId=${session?.user?.householdId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch containers");
      }

      const data = await response.json();
      setContainers(data);
    } catch (error) {
      console.error("Error fetching containers:", error);
      toast.error("Failed to load containers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.householdId) {
      fetchContainers();
    }
  }, [session?.user?.householdId]);

  const handleAddContainer = () => {
    setSelectedContainer(null);
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleEditContainer = (container) => {
    setSelectedContainer(container);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleFormSubmit = () => {
    setOpenDialog(true);
    fetchContainers();
  };

  const handleDeleteContainer = async (containerId) => {
    try {
      const response = await fetch(`/api/containers/${containerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete container");
      }
      toast.success("Container deleted successfully");
      fetchContainers();
    } catch (error) {
      console.error("Error deleting container:", error);
      toast.error("Failed to delete container");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Containers</h2>
          <p className="text-muted-foreground">
            Manage and monitor your household containers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchContainers}>
            <RotateCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={handleAddContainer}>
                <Plus className="h-4 w-4 mr-2" />
                Add Container
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <ContainerForm
                container={selectedContainer}
                isEdit={isEditMode}
                householdId={session?.user?.householdId}
                onSubmit={handleFormSubmit}
              />
            </DialogContent>
          </Dialog>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-32 bg-muted animate-pulse"></div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : containers.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <p>
                No containers found. Add your first container to get started!
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={handleAddContainer}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Container
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <ContainerForm
                    householdId={session?.user?.householdId}
                    onSubmit={handleFormSubmit}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {containers.map((container) => (
            <ContainerCard
              key={container._id}
              container={container}
              onEdit={() => handleEditContainer(container)}
              onDelete={() => handleDeleteContainer(container._id)}
            />
          ))}
        </div>
      )}

      {selectedContainer && (
        <Card>
          <CardHeader>
            <CardTitle>Container History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ContainerChart container={selectedContainer} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

