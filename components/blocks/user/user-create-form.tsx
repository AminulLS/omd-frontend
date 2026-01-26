"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel, FieldContent, FieldGroup } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, PhoneIcon, BuildingIcon, MapPinIcon, UserIcon, ShieldIcon, BellIcon, PaletteIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { User, UserWithRoles, ExtendedUserFormData, UserStatus, UserType } from "@/lib/types/users";
import { getDefaultUserFormData } from "@/lib/types/users";
import { adaptUserToFormData, validateUserForm } from "@/lib/utils/user-form-adapter";
import { useQuery } from "@tanstack/react-query";
import { getAllRoles } from "@/lib/services/roles-api";

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | UserWithRoles | null;
  onSubmit: (data: ExtendedUserFormData) => Promise<void>;
  isSubmitting?: boolean;
  availableRoles?: Array<{ id: string; name: string }>;
}

// Internal component that holds the form state
function UserFormContent({ user, onSubmit, onCancel, isSubmitting = false }: { user?: User | UserWithRoles | null; onSubmit: (data: ExtendedUserFormData) => Promise<void>; onCancel: () => void; isSubmitting?: boolean }) {
  const isEditing = !!user;

  // Initialize form data directly - no useEffect needed!
  const [formData, setFormData] = useState<ExtendedUserFormData>(() => (user ? adaptUserToFormData(user) : getDefaultUserFormData()));
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    // Validate form
    const errors = validateUserForm(formData, isEditing);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getAllRoles({ per_page: 100 }), // Fetch all roles
  });

  const availableRoles = rolesData?.data || [];

  return (
    <>
      <SheetHeader>
        <SheetTitle>{isEditing ? "Edit User" : "Add New User"}</SheetTitle>
        <SheetDescription>{isEditing ? "Update user information below." : "Fill in the details to add a new user."}</SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium pb-2 border-b">
            <UserIcon className="size-4" />
            <span>Basic Information</span>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel>Name *</FieldLabel>
              <FieldContent>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                {formErrors.name && <p className="text-sm text-destructive mt-1">{formErrors.name}</p>}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Email *</FieldLabel>
              <FieldContent>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
                {formErrors.email && <p className="text-sm text-destructive mt-1">{formErrors.email}</p>}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Password {!isEditing && "*"}
                {isEditing && <span className="text-xs text-muted-foreground ml-2">(leave blank to keep current)</span>}
              </FieldLabel>
              <FieldContent>
                <Input type="password" value={formData.password || ""} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" />
                {formErrors.password && <p className="text-sm text-destructive mt-1">{formErrors.password}</p>}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Phone
                <Badge variant="outline" className="ml-2 text-[10px]">
                  Not sent to API yet
                </Badge>
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (555) 000-0000" className="pl-9" />
                </div>
                {formErrors.phone && <p className="text-sm text-destructive mt-1">{formErrors.phone}</p>}
              </FieldContent>
            </Field>

            <div className="flex flex-row gap-3">
              <Field className="flex-1">
                <FieldLabel>Status *</FieldLabel>
                <FieldContent>
                  <Select value={formData.status} onValueChange={(value: UserStatus) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="w-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <Field className="flex-1">
                <FieldLabel>User Type *</FieldLabel>
                <FieldContent>
                  <Select value={formData.type} onValueChange={(value: UserType) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="w-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            </div>
          </FieldGroup>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium pb-2 border-b">
            <ShieldIcon className="size-4" />
            <span>Roles & Permissions</span>
          </div>

          <Field>
            <FieldLabel>Assigned Roles *</FieldLabel>
            <FieldContent>
              {isLoadingRoles ? (
                <Skeleton className="h-4 w-62.5" />
              ) : (
                <Select value={formData.roles[0] || ""} onValueChange={(value: string) => setFormData({ ...formData, roles: [value] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {formErrors.roles && <p className="text-sm text-destructive mt-1">{formErrors.roles}</p>}
            </FieldContent>
          </Field>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium pb-2 border-b">
            <UserIcon className="size-4" />
            <span>Profile Details</span>
            <Badge variant="outline" className="ml-auto text-[10px]">
              Not sent to API yet
            </Badge>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel>Department</FieldLabel>
              <FieldContent>
                <div className="relative">
                  <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="Engineering" className="pl-9" />
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Location</FieldLabel>
              <FieldContent>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="San Francisco, CA" className="pl-9" />
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Avatar URL</FieldLabel>
              <FieldContent>
                <Input value={formData.avatarUrl} onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })} placeholder="https://example.com/avatar.jpg" />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Bio</FieldLabel>
              <FieldContent>
                <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Brief description about the user..." rows={3} />
              </FieldContent>
            </Field>
          </FieldGroup>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium pb-2 border-b">
            <ShieldIcon className="size-4" />
            <span>Security Settings</span>
            <Badge variant="outline" className="ml-auto text-[10px]">
              Not sent to API yet
            </Badge>
          </div>

          <Field>
            <FieldLabel>Two-Factor Authentication</FieldLabel>
            <FieldContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm">Enable 2FA</div>
                  <div className="text-xs text-muted-foreground">Require authentication code for login</div>
                </div>
                <Switch checked={formData.twoFactorEnabled} onCheckedChange={(checked) => setFormData({ ...formData, twoFactorEnabled: checked })} />
              </div>
            </FieldContent>
          </Field>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium pb-2 border-b">
            <BellIcon className="size-4" />
            <span>Notifications & Preferences</span>
            <Badge variant="outline" className="ml-auto text-[10px]">
              Not sent to API yet
            </Badge>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel>Email Notifications</FieldLabel>
              <FieldContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm">Receive email updates</div>
                    <div className="text-xs text-muted-foreground">Get notified about important events</div>
                  </div>
                  <Switch checked={formData.emailNotifications} onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })} />
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Push Notifications</FieldLabel>
              <FieldContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm">Receive push notifications</div>
                    <div className="text-xs text-muted-foreground">Get instant alerts on your device</div>
                  </div>
                  <Switch checked={formData.pushNotifications} onCheckedChange={(checked) => setFormData({ ...formData, pushNotifications: checked })} />
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Theme Preference</FieldLabel>
              <FieldContent>
                <div className="relative">
                  <PaletteIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Select value={formData.theme} onValueChange={(value: "light" | "dark" | "system") => setFormData({ ...formData, theme: value })}>
                    <SelectTrigger className="pl-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FieldContent>
            </Field>
          </FieldGroup>
        </div>
      </div>

      <SheetFooter className="mt-6">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update User" : "Create User"}
        </Button>
      </SheetFooter>
    </>
  );
}

export function UserForm({ open, onOpenChange, user, onSubmit, isSubmitting = false }: UserFormProps) {
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button size="sm">
          <PlusIcon className="size-4" />
          Add User
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-4xl min-w-2xl xs:min-w-xl overflow-y-auto p-4">
        <UserFormContent key={user?.id || "new"} user={user} onSubmit={onSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
