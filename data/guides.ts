import type { Guide } from "@/types/guide";
import { blogGuides } from "./guides-blogs";

// Guides live in data/guides-blogs.ts. All ten are marked reviewed
// (reviewedAt set, no named reviewer, so no badge renders).
export const guides: Guide[] = [...blogGuides];
