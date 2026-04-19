'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  location: string;
}

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function VendorProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      location: '',
    },
    mode: "onChange",
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          // Set form default values after fetching user data
          form.reset({ name: data.user.name, location: data.user.location });
        } else if (response.status === 401) {
          // If unauthorized, redirect to login
          router.push('/auth/login');
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch user data');
          toast.error(errorData.error || 'Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('An unexpected error occurred.');
        toast.error('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router, form]);

  async function onSubmit(values: ProfileFormValues) {
    try {
      const response = await fetch('/api/user/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setUser((prevUser) => (prevUser ? { ...prevUser, ...values } : null));
        toast.success('Profile updated successfully!');
      } else {
        console.error('Profile update failed:', response.status, data);
        setError(data.error || data.details || 'Failed to update profile');
        toast.error(data.error || data.details || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An unexpected error occurred during update.');
      toast.error('An unexpected error occurred during update.');
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-6">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-6 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen py-6 text-red-500">
        <p>User data not found after loading.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Vendor Profile</h1>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Read-only Information */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email:</p>
            <p className="mt-1 text-base text-gray-900 dark:text-gray-100 font-mono">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Role:</p>
            <p className="mt-1 text-base text-gray-900 dark:text-gray-100 capitalize">{user.role}</p>
          </div>

          <Separator />

          {/* Editable Information Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 