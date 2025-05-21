'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { toast } from "sonner";


const formSchema = z.object({
    name: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
    }),
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    phone: z.string().min(10, {
      message: 'Please enter a valid phone number.',
    }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    household: z.string().min(2, {
      message: 'Household name must be at least 2 characters.',
    }),
    isHouseHead: z.boolean().default(false),
});


function RegisterForm(){
    const [isLoading, setIsLoading] = useState(false);
    const router =  useRouter();

    const form = useForm({
        resolver:zodResolver(formSchema),
        defaultValues:{
            name:'',
            email:'',
            phone:'',
            password:'',
            household:'',
            isHouseHead:true,
        },
    });

    async function onSubmit(values){
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/register',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(values),
            });
            
            const data = await response.json();
            if (!response.ok){
                throw new Error(data.message || 'Registration failed');
            }

            toast.success('Registration successfully! Please log in.');
            router.push('/login');
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed. Please try again.');
        }finally{
            setIsLoading(false);
        }
    }
    return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="household"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Household Name</FormLabel>
              <FormControl>
                <Input placeholder="Smith Family" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isHouseHead"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I am the head of this household
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  As the household head, you'll be able to manage members and settings.
                </p>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
    );
}

export default RegisterForm