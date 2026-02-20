import {
  faqs as faqCollection,
  team as teamCollection,
} from "fumadocs-mdx:collections/server";

export type FaqItem = (typeof faqCollection)[number];
export type TeamSubmission = (typeof teamCollection)[number];
export type TeamMember = TeamSubmission;

function parseSubmittedAt(value?: string) {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : timestamp;
}

export const faqItems: FaqItem[] = [...faqCollection].sort((a, b) => {
  const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
  const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
  if (orderA !== orderB) return orderA - orderB;
  return a.question.localeCompare(b.question, "ko");
});

export const submittedTeams: TeamSubmission[] = [...teamCollection].sort((a, b) => {
  const submittedAtA = parseSubmittedAt(a.submittedAt);
  const submittedAtB = parseSubmittedAt(b.submittedAt);

  if (submittedAtA !== null && submittedAtB !== null && submittedAtA !== submittedAtB) {
    return submittedAtB - submittedAtA;
  }
  if (submittedAtA !== null && submittedAtB === null) return -1;
  if (submittedAtA === null && submittedAtB !== null) return 1;

  return a.name.localeCompare(b.name, "ko");
});

export const teamMembers: TeamMember[] = submittedTeams;
