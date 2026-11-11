/**
 * Shared Platform Features Module
 * Centralized cross-cutting components, layouts, auth state, and session helpers.
 */

export interface SystemUser {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface EcosystemCardProps {
  title: string;
  badge: string;
  badgeVariant: "volunteer" | "ngo" | "csr";
  description: string;
  principles: string[];
}
