"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const formSchema = z.object({
  weight: z.coerce.number().min(0, {
    message: "Weight must be a positive number.",
  }),
});

function ContainerUpdateForm({ container, onSubmit }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: container.currentWeight,
    },
  });

  function handleFormSubmit(values) {
    setIsLoading(true);
    onSubmit(values.weight);
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Update Container Weight</h3>
          <p className="text-sm text-muted-foreground">
            Enter the current weight of {container.name}
          </p>
        </div>

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Weight ({container.unit})</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Weight"}
        </Button>
      </form>
    </Form>
  );
}

export default ContainerUpdateForm;
