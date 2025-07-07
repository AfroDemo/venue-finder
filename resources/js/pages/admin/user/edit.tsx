'use client';
import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';

interface BreadcrumbItem {
    title: string;
    href: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
    { title: 'Edit', href: '' },
];

interface EditUserProps {
    user: User;
}

export default function EditUser({ user }: EditUserProps) {
    const [editingUser, setEditingUser] = useState<User>({ ...user });

    useEffect(() => {
        setEditingUser({ ...user });
    }, [user]);

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await router.put(
                `/admin/users/${editingUser.id}`,
                {
                    name: editingUser.name,
                    email: editingUser.email,
                    role: editingUser.role,
                    password: editingUser.password || undefined,
                },
                {
                    onSuccess: () => {
                        alert('User updated successfully!');
                    },
                    onError: () => alert('Error updating user'),
                },
            );
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className="container mx-auto p-4 max-w-md">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
                    <Link href="/admin/users">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Users
                        </Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Update User</CardTitle>
                        <CardDescription>Update user information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div>
                                <Label htmlFor="edit-name">Name *</Label>
                                <Input
                                    id="edit-name"
                                    required
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    placeholder="Enter user name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-email">Email *</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    required
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    placeholder="Enter user email"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-password">Password</Label>
                                <Input
                                    id="edit-password"
                                    type="password"
                                    value={editingUser.password || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                                    placeholder="Enter new password (optional)"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-role">Role *</Label>
                                <Select
                                    value={editingUser.role}
                                    onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                                >
                                    <SelectTrigger id="edit-role">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                                    Update User
                                </Button>
                                <Link href="/admin/users">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
