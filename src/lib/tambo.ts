/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 */

import { BadgeCheckResult, badgeCheckResultSchema } from "@/components/BadgeCheckResult";
import { RecentChecks, recentChecksSchema } from "@/components/RecentChecks";
import { checkVehicleBadge } from "@/services/badge-check";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

export const tools: TamboTool[] = [
  {
    name: "checkVehicleBadge",
    description:
      "Check whether a vehicle has a valid Israeli disability badge (תו נכה). Call this whenever the user provides a license plate number and asks to verify, check, or look up a badge.",
    tool: checkVehicleBadge,
    inputSchema: z.object({
      plate: z.string().describe("The Israeli license plate number to check (e.g. 12-345-67)"),
    }),
    outputSchema: z.object({
      plateNumber: z.string(),
      isVerified: z.boolean(),
      ownerName: z.string().optional().nullable(),
      expiryDate: z.string().optional().nullable(),
      badgeType: z.string().optional().nullable(),
      checkedAt: z.string(),
      errorMessage: z.string().optional().nullable(),
    }),
  },
];

export const components: TamboComponent[] = [
  {
    name: "BadgeCheckResult",
    description:
      "Displays the result of an Israeli disability badge (תו נכה) check for a vehicle. Shows the license plate, whether the badge is valid, owner name, expiry date, and badge type. Use this after calling checkVehicleBadge.",
    component: BadgeCheckResult,
    propsSchema: badgeCheckResultSchema,
  },
  {
    name: "RecentChecks",
    description:
      "Displays a list of recently checked license plates with their badge verification results. Use when the user asks to see recent checks or check history.",
    component: RecentChecks,
    propsSchema: recentChecksSchema,
  },
];
