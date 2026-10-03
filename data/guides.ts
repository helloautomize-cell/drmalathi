import type { Guide } from "@/types/guide";
import { blogGuides } from "./guides-blogs";

// Guides live in data/guides-blogs.ts. All ten are draft/pending so
// production shows nothing until a doctor review is recorded on a guide.
export const guides: Guide[] = [...blogGuides];
