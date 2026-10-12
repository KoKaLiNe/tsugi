import type { AiringSchedulesFragment } from "@/api/generated/graphql";

export interface AiringScheduleWithMedia extends AiringSchedulesFragment { media: NonNullable<AiringSchedulesFragment['media']> }