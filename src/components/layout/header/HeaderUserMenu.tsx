"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderUserMenuProps {
  user?: any;
  onLoginClick: () => void;
  onLogoutClick?: () => void;
}

export function HeaderUserMenu({ user, onLoginClick, onLogoutClick }: HeaderUserMenuProps) {
  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";
  };

  if (!user) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex hover:bg-transparent" onClick={onLoginClick}>
        <Avatar className="h-7 w-7">
          <AvatarFallback className="bg-muted text-muted-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex hover:bg-transparent">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-transparent text-slate-800 border border-slate-200 text-xs font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard">Admin Dashboard</Link>
          </DropdownMenuItem>
        )}
        {user.role === "LAB" && (
          <DropdownMenuItem asChild>
            <Link href="/lab/dashboard">Lab Dashboard</Link>
          </DropdownMenuItem>
        )}
        {(!user.role || user.role === "USER") && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders">My Orders</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/reports">Reports</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogoutClick} className="cursor-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
