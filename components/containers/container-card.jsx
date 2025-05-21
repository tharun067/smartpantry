"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { toast } from "sonner";
import { Edit, Trash2, MoreVertical, History } from "lucide-react";
import ContainerUpdateForm from "./container-update-form";
import ContainerChart from "./container-chart";

function ContainerCard({ container, onEdit, onDelete }) {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);

  const calculatePercentage = () => {
    const usableWeight = container.maxWeight - container.minWeight;
    const currentUsableWeight = container.currentWeight - container.minWeight;

    if (usableWeight <= 0) return 0;
    const percentage = (currentUsableWeight / usableWeight) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const getStatusColor = () => {
    const percentage = calculatePercentage();

    if (percentage <= 25) return "bg-destructive";
    if (percentage <= 50) return "bg-warning";
    return "bg-success";
  };

  const handleUpdateWeight = async (newWeight) => {
    try {
        const response = await fetch(`/api/container/${container._id}/weight`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({weight:newWeight}),
        });

        if (!response.ok){
            throw new Error('Failed to update weight');
        }

        setOpenUpdateDialog(false);
        toast.success('Container weight updated');
    } catch (error) {
        console.error('Error updating weight:',error);
        toast.error('Failed to update weight');
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{container.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Container
              </DropdownMenuItem>
              <Dialog open={openHistoryDialog} onOpenChange={setOpenHistoryDialog}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <History className="mr-2 h-4 w-4" />
                    View History
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Weight History: {container.name}</h3>
                    <div className="h-80">
                      <ContainerChart container={container} />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Container
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Current</span>
            <span>Max</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>
              {container.currentWeight} {container.unit}
            </span>
            <span>
              {container.maxWeight} {container.unit}
            </span>
          </div>
          <Progress 
            value={calculatePercentage()} 
            className="h-2"
            indicatorClassName={getStatusColor()}
          />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Min Weight</p>
              <p>
                {container.minWeight} {container.unit}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Alert at</p>
              <p>
                {container.alertWeight} {container.unit}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
          <DialogTrigger asChild>
            <Button className="w-full">Update Weight</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <ContainerUpdateForm 
              container={container}
              onSubmit={handleUpdateWeight}
            />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

export default ContainerCard;
