"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Home, Building2, Phone } from "lucide-react";

export default function AddressesPage() {
  // Mock data
  const addresses = [
    {
      id: "1",
      fullName: "John Doe",
      phone: "+1 234 567 8900",
      addressLine1: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
      isDefault: true,
      type: "Home",
    },
    {
      id: "2",
      fullName: "John Doe Work",
      phone: "+1 234 567 8900",
      addressLine1: "456 Tech Park",
      city: "San Francisco",
      state: "CA",
      postalCode: "94016",
      country: "USA",
      isDefault: false,
      type: "Work",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Saved Addresses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your delivery locations.
          </p>
        </div>
        <Button className="rounded-full shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <Card
            key={address.id}
            className="border-none shadow-md hover:shadow-xl transition-all group bg-white relative overflow-hidden"
          >
            {address.isDefault && (
              <div className="absolute top-0 right-0 p-0">
                <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                  Default
                </div>
              </div>
            )}

            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted/50 rounded-full text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                    {address.type === "Work" ? (
                      <Building2 className="h-5 w-5" />
                    ) : (
                      <Home className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">
                        {address.type || "Address"}
                      </h3>
                    </div>
                    <p className="font-medium text-gray-900 mt-1">
                      {address.fullName}
                    </p>
                  </div>
                </div>

                <div className="pl-[3.25rem] space-y-2 text-sm text-muted-foreground">
                  <p className="leading-relaxed">
                    {address.addressLine1}
                    <br />
                    {address.city}, {address.state} {address.postalCode}
                    <br />
                    {address.country}
                  </p>
                  <div className="flex items-center gap-2 pt-1 font-medium text-gray-700">
                    <Phone className="h-3.5 w-3.5" />
                    {address.phone}
                  </div>
                </div>

                <div className="pt-4 flex gap-3 justify-end border-t border-dashed mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/5 hover:text-primary rounded-lg"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-50 hover:text-red-500 rounded-lg text-muted-foreground"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Address Placeholder Card */}
        <button className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all group h-full min-h-[250px]">
          <div className="p-4 rounded-full bg-muted group-hover:bg-white mb-4 shadow-sm transition-colors">
            <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          </div>
          <h3 className="font-semibold text-lg text-muted-foreground group-hover:text-primary">
            Add Address
          </h3>
        </button>
      </div>
    </div>
  );
}
