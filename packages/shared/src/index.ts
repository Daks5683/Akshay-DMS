export type Role = "owner" | "admin" | "sales" | "service" | "accountant";

export type VehicleStatus = "available" | "reserved" | "sold";

export interface Vehicle {
  id: string;
  chassisNumber: string;
  registrationNumber?: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  color: string;
  costPrice: number;
  sellingPrice: number;
  status: VehicleStatus;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface Sale {
  id: string;
  vehicleId: string;
  customerId: string;
  staffId: string;
  amount: number;
  status: "draft" | "confirmed" | "delivered" | "cancelled";
  createdAt: string;
}

export function validateVehicle(vehicle: Partial<Vehicle>): string[] {
  const errors: string[] = [];
  if (!vehicle.chassisNumber?.trim()) errors.push("Chassis number is required");
  if (!vehicle.brand?.trim()) errors.push("Brand is required");
  if (!vehicle.model?.trim()) errors.push("Model is required");
  if (!vehicle.variant?.trim()) errors.push("Variant is required");
  if (!vehicle.year || vehicle.year < 1900) errors.push("Valid year is required");
  if (typeof vehicle.costPrice !== "number" || vehicle.costPrice < 0) errors.push("Cost price is required");
  if (typeof vehicle.sellingPrice !== "number" || vehicle.sellingPrice < 0) errors.push("Selling price is required");
  return errors;
}

export function validateCustomer(customer: Partial<Customer>): string[] {
  const errors: string[] = [];
  if (!customer.name?.trim()) errors.push("Customer name is required");
  if (!/^\+?[0-9]{7,15}$/.test(customer.phone ?? "")) errors.push("Valid phone number is required");
  return errors;
}
