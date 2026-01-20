"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldContent } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

import type { UserStatus, UserType, ExtendedUserFormData, User, UserWithRoles } from "@/lib/types/users";
import { UsersTable } from "@/components/blocks/data-tables/users-table";
import { UserForm } from "@/components/blocks/user/user-create-form";
import { createUser, updateUser, deleteUser } from "@/lib/services/user-api";
import { adaptFormDataToApi } from "@/lib/utils/user-form-adapter";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | UserWithRoles | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<UserType | "all">("all");

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
      setSheetOpen(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create user");
    },
  });

  const updateMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
      setSheetOpen(false);
      setEditingUser(null);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update user");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    },
  });

  const handleEdit = (user: User | UserWithRoles) => {
    setEditingUser(user);
    setSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = async (formData: ExtendedUserFormData) => {
    const apiData = adaptFormDataToApi(formData);

    if (editingUser) {
      await updateMutation.mutateAsync({
        id: editingUser.id,
        data: apiData,
      });
    } else {
      await createMutation.mutateAsync(apiData);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <div>
            <h2 className="text-lg font-semibold">Users</h2>
            <p className="text-sm text-muted-foreground">Manage all user accounts and their access</p>
          </div>

          <UserForm open={sheetOpen} onOpenChange={setSheetOpen} user={editingUser} onSubmit={handleSubmit} isSubmitting={createMutation.isPending || updateMutation.isPending} />
        </div>

        <div>
          <FieldGroup className="mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Field className="flex-1">
                <FieldLabel>Search</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input placeholder="Search by name, email, or department..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                  </div>
                </FieldContent>
              </Field>

              <Field className="sm:w-37.5">
                <FieldLabel>Status</FieldLabel>
                <FieldContent>
                  <Select value={statusFilter} onValueChange={(value: UserStatus | "all") => setStatusFilter(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <Field className="sm:w-37.5">
                <FieldLabel>Type</FieldLabel>
                <FieldContent>
                  <Select value={typeFilter} onValueChange={(value: UserType | "all") => setTypeFilter(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            </div>
          </FieldGroup>

          <UsersTable searchQuery={searchQuery} statusFilter={statusFilter} typeFilter={typeFilter} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
