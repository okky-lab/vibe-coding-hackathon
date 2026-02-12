import {
  faqs as faqCollection,
  team as teamCollection,
} from "fumadocs-mdx:collections/server";

export type FaqItem = (typeof faqCollection)[number];
export type TeamMember = (typeof teamCollection)[number];

export const faqItems: FaqItem[] = [...faqCollection].sort((a, b) => {
  const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
  const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
  if (orderA !== orderB) return orderA - orderB;
  return a.question.localeCompare(b.question, "ko");
});

const teamRoleOrder = [
  "프로그램 총괄",
  "운영 진행",
  "테크 지원",
  "커뮤니티/네트워킹",
];

export const teamMembers: TeamMember[] = [...teamCollection].sort((a, b) => {
  const aIndex = teamRoleOrder.indexOf(a.role);
  const bIndex = teamRoleOrder.indexOf(b.role);
  const safeA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
  const safeB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
  if (safeA !== safeB) return safeA - safeB;
  return a.role.localeCompare(b.role, "ko");
});
