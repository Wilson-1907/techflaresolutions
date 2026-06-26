import { MessageSquare, Phone } from "lucide-react";
import { company } from "@/data/site";
import { contactChannels, socialProfileUrl } from "@/lib/contact-channels";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  WhatsAppIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/brand/social-icons";

const socialIconById = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
  x: XIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
} as const;

const iconButtonBase =
  "flex shrink-0 items-center justify-center rounded-full border shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50";

/** Scales up on larger screens — same round shape, touch-friendly on mobile */
const channelButton = `${iconButtonBase} h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12`;
const channelIconClass = "h-[18px] w-[18px] sm:h-5 sm:w-5 md:h-[22px] md:w-[22px]";
const widgetRowClass = "flex flex-wrap items-center gap-2.5 sm:gap-3 md:gap-3.5";

const iconButtonGold = `${channelButton} border-gold/25 bg-black/40 text-gold hover:border-gold/50 hover:bg-gold/10`;
const iconButtonBlue = `${channelButton} border-sky-400/30 bg-sky-500/10 text-sky-300 hover:border-sky-400/50 hover:bg-sky-500/20`;
const iconButtonGreen = `${channelButton} border-life-green/30 bg-life-green/10 text-life-green hover:border-life-green/50 hover:bg-life-green/20`;

function FooterWidgetBar({ className = "" }: { className?: string }) {
  const { social } = company;

  return (
    <div
      className={`rounded-2xl border border-gold/15 bg-black/30 px-4 py-4 shadow-inner backdrop-blur-sm sm:px-6 sm:py-5 md:px-8 md:py-6 ${className}`}
      aria-label="Contact and social links"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="min-w-0 flex-1">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-gold lg:text-left">
            Call &amp; message
          </p>
          <div className={`${widgetRowClass} justify-center lg:justify-start`}>
            <a
              href={contactChannels.phoneTel}
              className={iconButtonGold}
              title={`Call ${contactChannels.phoneDisplay}`}
              aria-label={`Open phone dialer to call ${contactChannels.phoneDisplay}`}
            >
              <Phone className={channelIconClass} />
            </a>

            <a
              href={contactChannels.sms}
              className={iconButtonBlue}
              title={`SMS ${contactChannels.phoneDisplay}`}
              aria-label={`Open SMS app to text ${contactChannels.phoneDisplay}`}
            >
              <MessageSquare className={channelIconClass} />
            </a>

            <a
              href={contactChannels.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={iconButtonGreen}
              title={`WhatsApp ${contactChannels.phoneDisplay}`}
              aria-label={`Open WhatsApp chat with ${contactChannels.phoneDisplay}`}
            >
              <WhatsAppIcon className={channelIconClass} />
            </a>
          </div>
        </div>

        <div className="hidden h-16 w-px shrink-0 bg-gold/15 md:h-[4.5rem] lg:block" aria-hidden />

        <div className="min-w-0 flex-1">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-gold lg:text-left">
            Follow @{social.handle}
          </p>
          <div className={`${widgetRowClass} justify-center lg:justify-start`}>
            {social.links.map((item) => {
              const Icon = socialIconById[item.id as keyof typeof socialIconById];
              if (!Icon) return null;
              return (
                <a
                  key={item.id}
                  href={socialHref(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={iconButtonGold}
                  title={`${item.name} @${item.handle}`}
                  aria-label={`Open ${item.name} profile @${item.handle}`}
                >
                  <Icon className={channelIconClass} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

type Variant = "footer" | "contact";

type Props = {
  variant: Variant;
  className?: string;
};

function socialHref(item: { id: string; handle: string; href: string }) {
  return item.href !== "#" ? item.href : socialProfileUrl(item.id, item.handle);
}

export function ContactChannelWidgets({ variant, className = "" }: Props) {
  const { social } = company;

  if (variant === "footer") {
    return <FooterWidgetBar className={className} />;
  }

  return (
    <div className={className}>
      <h3 className="font-semibold text-gold text-sm mb-3">Reach us instantly</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Tap to call, text, or message us on WhatsApp — or open our social profiles.
      </p>

      <div className={`${widgetRowClass} mb-5 sm:mb-6`}>
        <a
          href={contactChannels.phoneTel}
          className={iconButtonGold}
          title={`Call ${contactChannels.phoneDisplay}`}
          aria-label={`Open phone dialer to call ${contactChannels.phoneDisplay}`}
        >
          <Phone className={channelIconClass} />
        </a>
        <a
          href={contactChannels.sms}
          className={iconButtonBlue}
          title={`SMS ${contactChannels.phoneDisplay}`}
          aria-label={`Open SMS app to text ${contactChannels.phoneDisplay}`}
        >
          <MessageSquare className={channelIconClass} />
        </a>
        <a
          href={contactChannels.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={iconButtonGreen}
          title={`WhatsApp ${contactChannels.phoneDisplay}`}
          aria-label={`Open WhatsApp chat with ${contactChannels.phoneDisplay}`}
        >
          <WhatsAppIcon className={channelIconClass} />
        </a>
      </div>

      <p className="text-xs font-semibold text-gold mb-2.5 sm:text-sm">Follow @{social.handle}</p>
      <div className={widgetRowClass}>
        {social.links.map((item) => {
          const Icon = socialIconById[item.id as keyof typeof socialIconById];
          if (!Icon) return null;
          return (
            <a
              key={item.id}
              href={socialHref(item)}
              target="_blank"
              rel="noopener noreferrer"
              className={iconButtonGold}
              title={`${item.name} @${item.handle}`}
              aria-label={`Open ${item.name} profile @${item.handle}`}
            >
              <Icon className={channelIconClass} />
            </a>
          );
        })}
      </div>
    </div>
  );
}

/** Compact fixed strip for the contact page — quick access without scrolling. */
export function ContactPageFloat() {
  const { social } = company;

  return (
    <div
      className="fixed bottom-6 left-4 z-40 flex flex-col gap-2 sm:left-6 lg:hidden"
      aria-label="Quick contact shortcuts"
    >
      <a
        href={contactChannels.phoneTel}
        className={iconButtonGold}
        title="Phone call"
        aria-label={`Open phone dialer to call ${contactChannels.phoneDisplay}`}
      >
        <Phone className={channelIconClass} />
      </a>
      <a
        href={contactChannels.sms}
        className={iconButtonBlue}
        title="SMS"
        aria-label={`Open SMS app to text ${contactChannels.phoneDisplay}`}
      >
        <MessageSquare className={channelIconClass} />
      </a>
      <a
        href={contactChannels.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={iconButtonGreen}
        title="WhatsApp"
        aria-label="Open WhatsApp"
      >
        <WhatsAppIcon className={channelIconClass} />
      </a>
      <div className="my-0.5 h-px w-full bg-gold/20" aria-hidden />
      {social.links.slice(0, 3).map((item) => {
        const Icon = socialIconById[item.id as keyof typeof socialIconById];
        if (!Icon) return null;
        return (
          <a
            key={item.id}
            href={socialHref(item)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${channelButton} border-gold/20 bg-black/50 text-gold hover:border-gold/40`}
            title={item.name}
            aria-label={item.name}
          >
            <Icon className={channelIconClass} />
          </a>
        );
      })}
    </div>
  );
}
