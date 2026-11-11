/**
 * NGO & Implementing Organisations Feature Module
 * Scoped types, hooks, services, and components for NGO operations.
 * Note: Feature implementation pending approved product specifications.
 */

export interface NgoOrganisationPlaceholder {
  id: string;
  name: string;
  slug: string;
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
}
