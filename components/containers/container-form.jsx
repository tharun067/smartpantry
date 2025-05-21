"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Container name must be at least 2 characters.",
  }),
  isNew: z.boolean().default(true),
  currentWeight: z.coerce.number().min(0, {
    message: "Current weight must be a positive number.",
  }),
  maxWeight: z.coerce.number().min(0, {
    message: "Maximum weight must be a positive number.",
  }),
  minWeight: z.coerce.number().min(0, {
    message: "Minimum weight must be a positive number.",
  }),
  alertWeight: z.coerce.number().min(0, {
    message: "Alert weight must be a positive number.",
  }),
  unit: z.string().min(1, {
    message: "Please select a unit.",
  }),
});

function ContainerForm({ container, isEdit = false, householdId, onSubmit }) {
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    name: container?.name || "",
    isNew: container?.isNew ?? true,
    currentWeight: container?.currentWeight || 0,
    maxWeight: container?.maxWeight || 0,
    minWeight: container?.minWeight || 0,
    alertWeight: container?.alertWeight || 0,
    unit: container?.unit || "g",
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function handleFormSubmit(values) {
    if (!householdId) {
      toast.error("You must be in a household to add containers");
      return;
    }

    setIsLoading(true);

    try {
      const url = isEdit
        ? `api/containers/${container._id}`
        : `/api/containers`;
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...values,
        householdId,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save container");
      }

      toast.success(
        isEdit
          ? "Container updated successfully"
          : "Container added successfully"
      );
      onSubmit();
    } catch (error) {
      console.error("Error saving container:", error);
      toast.error("Failed to save container");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Container Name</FormLabel>
              <FormControl>
                <Input placeholder="Rice Container" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isNew"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>New Container</FormLabel>
                <FormDescription>
                  Is this a new container or an existing one?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="currentWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Weight</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="g">Grams (g)</SelectItem>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="oz">Ounces (oz)</SelectItem>
                    <SelectItem value="lb">Pounds (lb)</SelectItem>
                    <SelectItem value="ml">Milliliters (ml)</SelectItem>
                    <SelectItem value="l">Liters (l)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="maxWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Weight</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.1" {...field} />
              </FormControl>
              <FormDescription>
                The maximum capacity of your container.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Weight</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.1" {...field} />
              </FormControl>
              <FormDescription>
                The empty weight of your container.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alertWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alert Weight</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.1" {...field} />
              </FormControl>
              <FormDescription>
                You'll receive alerts when the container drops below this
                weight.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : isEdit
            ? "Update Container"
            : "Add Container"}
        </Button>
      </form>
    </Form>
  );
}

export default ContainerForm;
