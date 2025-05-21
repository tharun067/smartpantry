"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "@/components/ui/card";
import { Tabs,TabsContent,TabsList,TabsTrigger } from "@/components/ui/tabs";
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form";
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Finlandica } from "next/font/google";

const profileFormSchema = z.object({
    name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().min(10, {
    message: 'Please enter a valid phone number.',
  }),
});

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, {
    message: 'Please enter your current password.',
  }),
  newPassword: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  confirmPassword: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
}).refine((data)=>data.newPassword === data.confirmPassword,{
    message:'passwords do not match',
    path:['confirmPassword'],
});

function SettingsPage(){
    const {data:session,update}=useSession();
    const router = useRouter();
    const {theme,setTheme} = useTheme();
    const [isUpdatingProfile,setIsUpdatingProfile]=useState(false);
    const [isChangingPassword,setIsChangingPassword]=useState(false);
    const [isDeletingAccount,setIsDeletingAccount]=useState(false);


    const profileForm = useForm({
        resolver:zodResolver(profileFormSchema),
        defaultValues:{
            name:session?.user?.name || '',
            email:session?.user?.email || '',
            phone:'',
        },
    });

    const passwordForm = useForm({
        resolver: zodResolver(passwordFormSchema),
        defaultValues:{
            currentPassword:'',
            newPassword:'',
            confirmPassword:'',
        },
    });

    async function onProfileSubmit(values) {
        setIsUpdatingProfile(true);
        try {
            const response =await fetch('/api/user/profile',{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(values),
            });
            const data = await response.json();

            if (!response.ok){
                throw new Error(data.message || 'Failed to update profile');
            }

            // Update session with new user data
            await update({
                ...session,
                user:{
                    ...session?.user,
                    name:values.name,
                    email:values.email,
                },
            });

            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }finally{
            setIsUpdatingProfile(false);
        }
    }

    async function onPasswordSubmit(values) {
        setIsChangingPassword(true);

        try {
            const response = await fetch('/api/user/password',{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    currentPassword:values.currentPassword,
                    newPassword:values.newPassword
                }),
            });

            const data = await response.json();

            if (!response.ok){
                throw new Error(data.message || 'Failed to change password');
            }
            toast.success('Password changed successfully');
            passwordForm.reset();
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Failed to change password');
        }finally{
            setIsChangingPassword(false);
        }
    }

    async function deleteAccount() {
        setIsDeletingAccount(true);
        try {
            const response = await fetch('/api/user',{
                method:'DELETE',
            });

            const data = response.json()
            if (!response.ok){
                throw new Error(data.message || 'Failed to delete account');
            }
            toast.success('Account deleted successfully');
            router.push('/')
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('Failed to delte account');
        }finally{
            setIsDeletingAccount(false);
        }
    }
    return (
        <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form 
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)} 
                  className="space-y-6"
                >
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form 
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} 
                  className="space-y-6"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how SmartPantry looks and feels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Theme</h3>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                  >
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                  >
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    onClick={() => setTheme('system')}
                  >
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="danger">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanent actions that cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={deleteAccount}
                      disabled={isDeletingAccount}
                    >
                      {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    );
}
export default SettingsPage