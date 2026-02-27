"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { User, ShieldCheck, Mail, Phone, Camera } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal information and security preferences.
        </p>
      </div>

      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Your account profile details and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Avatar Section (Mockup) */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted flex items-center justify-center text-2xl sm:text-3xl font-bold text-muted-foreground border-4 border-white shadow-lg overflow-hidden">
                {user?.name?.charAt(0) || user?.firstName?.charAt(0) || "U"}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg">
                {user?.name || `${user?.firstName} ${user?.lastName}`}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-[180px] sm:max-w-none">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                defaultValue={user?.firstName || user?.name?.split(" ")[0]}
                disabled
                className="h-11 rounded-xl bg-muted/50 border-transparent cursor-default"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="lastName"
                className="font-medium text-muted-foreground"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                defaultValue={user?.lastName || user?.name?.split(" ")[1]}
                disabled
                className="h-11 rounded-xl bg-muted/50 border-transparent cursor-default"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                defaultValue={user?.email}
                disabled
                className="h-11 rounded-xl bg-muted/50 pl-10 border-transparent"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground ml-1">
              Email address cannot be changed.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <Input
                id="phone"
                placeholder="+1 (555) 000-0000"
                defaultValue={user?.phone}
                disabled
                className="h-11 rounded-xl bg-muted/50 border-transparent cursor-default pl-10"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-400" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShieldCheck className="h-5 w-5 text-orange-500" />
            Security & Password
          </CardTitle>
          <CardDescription>
            Keep your account secure with a strong password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              className="h-11 rounded-xl bg-muted/30 border-muted-foreground/20"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                className="h-11 rounded-xl bg-muted/30 border-muted-foreground/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                className="h-11 rounded-xl bg-muted/30 border-muted-foreground/20"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-center sm:justify-end">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-full px-8 h-11 border-2 hover:bg-muted"
            >
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
