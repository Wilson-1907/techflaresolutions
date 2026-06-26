import { company } from "@/data/site";

const phoneDigits = company.phone.replace(/\s/g, "");

export const contactChannels = {
  phoneDisplay: company.phone,
  phoneTel: `tel:${phoneDigits}`,
  sms: `sms:${phoneDigits}`,
  whatsapp: company.whatsappLink,
} as const;

export function socialProfileUrl(id: string, handle: string): string {
  const h = handle.replace(/^@/, "");
  switch (id) {
    case "instagram":
      return `https://www.instagram.com/${h}/`;
    case "facebook":
      return `https://www.facebook.com/${h}`;
    case "tiktok":
      return `https://www.tiktok.com/@${h}`;
    case "x":
      return `https://x.com/${h}`;
    case "linkedin":
      return `https://www.linkedin.com/company/${h}`;
    case "youtube":
      return `https://www.youtube.com/@${h}`;
    default:
      return "#";
  }
}
