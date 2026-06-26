"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { EmailLink } from "@/components/ui/EmailLink";
import { company } from "@/data/site";
import { ContactChannelWidgets } from "@/components/brand/ContactChannelWidgets";
import {
  buildEmailComposeLink,
  buildMailtoSubject,
  parseContactContext,
  type MailtoContext,
} from "@/lib/mailto";
import { formSelectClass, formInputClass, formTextareaClass } from "@/lib/form-styles";

const topicOptions: { value: string; label: string; context: MailtoContext }[] = [
  { value: "general", label: "General inquiry", context: { type: "contact" } },
  { value: "service", label: "Service / project", context: { type: "general", label: "Service inquiry" } },
  { value: "product", label: "Product order", context: { type: "general", label: "Product inquiry" } },
  { value: "solutions", label: "Solutions Center", context: { type: "solutions" } },
  { value: "innovation", label: "Innovation Hub", context: { type: "innovation" } },
  { value: "payment", label: "Payment / invoice", context: { type: "payment" } },
  { value: "careers", label: "Careers", context: { type: "careers" } },
  { value: "investor", label: "Investor relations", context: { type: "investor" } },
];

function topicFromUrlContext(context: MailtoContext): string {
  switch (context.type) {
    case "service":
      return "service";
    case "product":
    case "order":
      return "product";
    case "solutions":
      return "solutions";
    case "innovation":
      return "innovation";
    case "payment":
      return "payment";
    case "careers":
      return "careers";
    case "investor":
      return "investor";
    default:
      return "general";
  }
}

function detailFromUrlContext(context: MailtoContext): string {
  switch (context.type) {
    case "service":
      return context.service;
    case "product":
    case "order":
      return context.product;
    case "careers":
      return context.role ?? "";
    default:
      return "";
  }
}

function contextFromTopicAndDetail(topic: string, detail: string): MailtoContext {
  const option = topicOptions.find((t) => t.value === topic);
  if (!option) return { type: "contact" };
  if (topic === "service" && detail.trim()) {
    return { type: "service", service: detail.trim() };
  }
  if (topic === "product" && detail.trim()) {
    return { type: "product", product: detail.trim() };
  }
  if (topic === "careers" && detail.trim()) {
    return { type: "careers", role: detail.trim() };
  }
  return option.context;
}

export function ContactClient() {
  const searchParams = useSearchParams();
  const urlContext = useMemo(() => parseContactContext(searchParams), [searchParams]);

  const [form, setForm] = useState(() => {
    const topic = topicFromUrlContext(urlContext);
    const detail = detailFromUrlContext(urlContext);
    return { topic, detail, body: "" };
  });

  const [subject, setSubject] = useState(() =>
    buildMailtoSubject(contextFromTopicAndDetail(topicFromUrlContext(urlContext), detailFromUrlContext(urlContext)))
  );
  const [subjectEdited, setSubjectEdited] = useState(false);

  const activeContext = useMemo(
    () => contextFromTopicAndDetail(form.topic, form.detail),
    [form.topic, form.detail]
  );

  const suggestedSubject = useMemo(() => buildMailtoSubject(activeContext), [activeContext]);

  useEffect(() => {
    setSubjectEdited(false);
  }, [form.topic]);

  useEffect(() => {
    if (!subjectEdited) {
      setSubject(suggestedSubject);
    }
  }, [suggestedSubject, subjectEdited]);

  const mailtoHref = buildEmailComposeLink(activeContext, {
    subject: subject.trim() || suggestedSubject,
    body: form.body.trim(),
  });

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Choose a topic, write your message, then email us"
        badge="Get in Touch"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <GlassCard>
                <Mail className="h-6 w-6 text-gold mb-3" />
                <h3 className="font-semibold">Email (fastest)</h3>
                <p className="text-sm text-muted-foreground mt-1">{company.email}</p>
                <EmailLink context={urlContext.type !== "contact" ? urlContext : { type: "contact" }} className="mt-3 w-full justify-center">
                  <Mail className="h-4 w-4" /> Email us
                </EmailLink>
              </GlassCard>

              <GlassCard>
                <ContactChannelWidgets variant="contact" />
              </GlassCard>

              {company.offices.map((office) => (
                <GlassCard key={office.city}>
                  <MapPin className="h-6 w-6 text-gold mb-3" />
                  <h3 className="font-semibold">
                    {office.city}, {office.country}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{office.address}</p>
                </GlassCard>
              ))}
            </div>

            <GlassCard className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-2">Email TechFlare Solutions</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Pick what your message is about, write your message, then click{" "}
                <strong className="text-foreground">Email us</strong>.
              </p>

              <div className="space-y-5">
                <div>
                  <label htmlFor="contact-topic" className="block text-sm font-medium mb-1.5">
                    What is this about?
                  </label>
                  <select
                    id="contact-topic"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className={formSelectClass}
                  >
                    {topicOptions.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {(form.topic === "service" || form.topic === "product" || form.topic === "careers") && (
                  <div>
                    <label htmlFor="contact-detail" className="block text-sm font-medium mb-1.5">
                      {form.topic === "service"
                        ? "Which service?"
                        : form.topic === "product"
                          ? "Which product?"
                          : "Which role?"}
                    </label>
                    <input
                      id="contact-detail"
                      value={form.detail}
                      onChange={(e) => setForm({ ...form, detail: e.target.value })}
                      placeholder={
                        form.topic === "service"
                          ? "e.g. Software Development"
                          : form.topic === "product"
                            ? "e.g. Career Compass"
                            : "e.g. Software Engineer Intern"
                      }
                      className={formInputClass}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium mb-1.5">
                    Email subject
                  </label>
                  <input
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => {
                      setSubjectEdited(true);
                      setSubject(e.target.value);
                    }}
                    className={formInputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-body" className="block text-sm font-medium mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-body"
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    placeholder="Write your message here."
                    className={formTextareaClass}
                  />
                </div>

                <Button href={mailtoHref} className="w-full" size="lg">
                  <Mail className="h-5 w-5" />
                  Email us
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Sends to {company.email}
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </>
  );
}
