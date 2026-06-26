import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v8h4v-8h3l1-4h-4V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.5 5.5c.8 1.1 2 1.9 3.5 2v3.4c-1.3 0-2.5-.4-3.5-1.1v6.6c0 3-2.4 5.4-5.4 5.4S5.7 19.9 5.7 17s2.4-5.4 5.4-5.4c.3 0 .6 0 .9.1v3.7a2 2 0 1 0 1.4 1.9V5.5h3.1z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.3 3h3.2l-7 8 8.2 10h-6.4l-5-6.2-5.7 6.2H1.4l7.5-8.1L1 3h6.6l4.5 5.5L17.3 3zm-1.1 16.2h1.8L7.1 4.8H5.2l11 14.4z" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M6.5 8.7H2.7v12.6h3.8V8.7zM4.6 2.7a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4zM20.3 8.7h-3.6v1.7c-.5-.9-1.7-1.9-3.5-1.9-2.7 0-4.8 2.2-4.8 5.5v6.3h3.8v-5.6c0-1.5.5-2.5 1.8-2.5 1.1 0 1.7.7 2 1.7.1.3.1.7.1 1.1v5.3h3.8V14c0-3.3-1.8-5.3-4.6-5.3z" />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C17.8 5 12 5 12 5s-5.8 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.9.3 7.7.3 7.7.3s5.8 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9 28 28 0 0 0 .4-4.8 28 28 0 0 0-.4-4.8zM10 15.5V8.5l6 3.5-6 3.5z" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2a10 10 0 0 0-8.7 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.2 1.1-1.7 1.2-.4.1-.9.2-3.1-.7-2.6-1-4.3-3.4-4.4-3.6-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.7.8 1.8.1.1.1.3 0 .5-.1.2-.2.3-.3.4-.1.1-.3.2-.4.4-.1.1-.2.3 0 .6.2.2 1 1.6 2.4 2.6 1.7 1.2 3.1 1.5 3.6 1.7.4.2.7.2.9.1.3-.1.9-.4 1-.8.1-.4.1-.8.1-.8s0-.6-.4-.9z" />
    </svg>
  );
}
