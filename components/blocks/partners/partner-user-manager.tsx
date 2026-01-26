"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { SearchIcon, TrashIcon, UserIcon } from "lucide-react";
import { availableUsers, type User, type UserRole } from "@/lib/constants/partners";

interface PartnerUserManagerProps {
  users: User[];
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
  onUpdateUserRole: (userId: string, role: UserRole) => void;
}

export function PartnerUserManager({ users, onAddUser, onRemoveUser, onUpdateUserRole }: PartnerUserManagerProps) {
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const getAvailableUsersToAdd = () => {
    const assignedUserIds = users.map((u) => u.id);
    return availableUsers.filter((u) => !assignedUserIds.includes(u.id));
  };

  const availableUsersToAdd = getAvailableUsersToAdd();

  return (
    <Field>
      <FieldLabel>Users</FieldLabel>
      <FieldContent>
        <div className="space-y-2">
          {users.length === 0 ? (
            <div className="text-sm text-muted-foreground p-3 border rounded-md border-dashed flex items-center justify-center gap-2">
              <UserIcon className="size-4" />
              No users added yet
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center gap-2 p-3 border rounded-md bg-muted/20">
                <div className="flex-1">
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
                <Select value={user.role} onValueChange={(value: UserRole) => onUpdateUserRole(user.id, value)}>
                  <SelectTrigger className="h-8 w-30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main_user">Main User</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" variant="ghost" size="icon-xs" onClick={() => onRemoveUser(user.id)}>
                  <TrashIcon className="size-4" />
                </Button>
              </div>
            ))
          )}
          {availableUsersToAdd.length > 0 ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <SearchIcon className="size-4 mr-2" />
                  Add a user...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search users..." value={userSearchQuery} onValueChange={setUserSearchQuery} />
                  <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {availableUsersToAdd
                        .filter((user) => user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || user.email.toLowerCase().includes(userSearchQuery.toLowerCase()))
                        .map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.id}
                            onSelect={() => {
                              onAddUser(user.id);
                              setUserSearchQuery("");
                            }}
                          >
                            <UserIcon className="size-3 mr-2" />
                            <span>{user.name}</span>
                            <span className="text-muted-foreground text-xs ml-2">({user.email})</span>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-2">All users have been added</div>
          )}
        </div>
      </FieldContent>
    </Field>
  );
}
