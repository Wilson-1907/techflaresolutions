"use client";



import { useEffect, useState } from "react";

import { GlassCard } from "@/components/ui/GlassCard";

import { Button } from "@/components/ui/Button";

import { Loader2, MessageSquare, Send } from "lucide-react";

import { officeLabel } from "@/lib/company-offices";



type StaffMember = {

  id: string;

  firstName: string;

  lastName: string;

  role: string;

  employeeProfile?: {

    position?: string;

    office?: string | null;

    department?: { name: string } | null;

  } | null;

};



type Department = { id: string; name: string; slug: string };

type Office = { slug: string; city: string; label: string };



type Message = {

  id: string;

  subject: string;

  body: string;

  audience: string;

  office?: string | null;

  createdAt: string;

  sender: { firstName: string; lastName: string; role: string };

  recipient?: { firstName: string; lastName: string; role: string } | null;

  department?: { name: string } | null;

};



type Props = {

  userRole: string;

  isHod: boolean;

};



export function StaffMessagingPanel({ userRole, isHod }: Props) {

  const [messages, setMessages] = useState<Message[]>([]);

  const [staff, setStaff] = useState<StaffMember[]>([]);

  const [departments, setDepartments] = useState<Department[]>([]);

  const [offices, setOffices] = useState<Office[]>([]);

  const [loading, setLoading] = useState(true);

  const [busy, setBusy] = useState(false);

  const [subject, setSubject] = useState("");

  const [body, setBody] = useState("");

  const [recipientId, setRecipientId] = useState("");

  const [departmentId, setDepartmentId] = useState("");

  const [office, setOffice] = useState("");

  const [audience, setAudience] = useState<"direct" | "department" | "office" | "company">("direct");



  function load() {

    fetch("/api/me/staff-messages", { credentials: "include" })

      .then((r) => (r.ok ? r.json() : {}))

      .then(

        (d: {

          messages?: Message[];

          staff?: StaffMember[];

          departments?: Department[];

          offices?: Office[];

        }) => {

          setMessages(d.messages || []);

          setStaff(d.staff || []);

          setDepartments(d.departments || []);

          setOffices(d.offices || []);

        }

      )

      .finally(() => setLoading(false));

  }



  useEffect(() => {

    load();

  }, []);



  async function send() {

    if (!subject.trim() || !body.trim()) {

      alert("Subject and message are required.");

      return;

    }

    setBusy(true);

    try {

      const res = await fetch("/api/me/staff-messages", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        credentials: "include",

        body: JSON.stringify({

          subject,

          body,

          audience,

          recipientId: audience === "direct" ? recipientId || undefined : undefined,

          departmentId: audience === "department" ? departmentId || undefined : undefined,

          office: audience === "office" ? office || undefined : undefined,

        }),

      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Send failed");

      setSubject("");

      setBody("");

      load();

      alert("Message sent.");

    } catch (e) {

      alert(e instanceof Error ? e.message : "Could not send");

    } finally {

      setBusy(false);

    }

  }



  const canBroadcast = isHod || ["CIO", "ADMIN"].includes(userRole);



  if (loading) return null;



  return (

    <GlassCard className="mb-8 border-gold/20">

      <div className="flex items-center gap-2 mb-4">

        <MessageSquare className="h-5 w-5 text-gold" />

        <h2 className="text-lg font-bold">Company communication</h2>

      </div>

      <p className="text-sm text-muted-foreground mb-4">

        Message any colleague, department, or office across TechFlare — Karatina, Nyeri, or remote teams.

      </p>



      <div className="grid md:grid-cols-2 gap-6">

        <div className="space-y-3">

          <select

            value={audience}

            onChange={(e) => setAudience(e.target.value as typeof audience)}

            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"

          >

            <option value="direct">Direct message to a person</option>

            <option value="department">Message a department</option>

            <option value="office">Message an office</option>

            {canBroadcast && <option value="company">Company-wide broadcast</option>}

          </select>



          {audience === "direct" && (

            <select

              value={recipientId}

              onChange={(e) => setRecipientId(e.target.value)}

              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"

            >

              <option value="">Select recipient</option>

              {staff.map((s) => (

                <option key={s.id} value={s.id}>

                  {s.firstName} {s.lastName} ({s.role}

                  {s.employeeProfile?.department ? ` · ${s.employeeProfile.department.name}` : ""}

                  {s.employeeProfile?.office

                    ? ` · ${officeLabel(s.employeeProfile.office) ?? s.employeeProfile.office}`

                    : ""}

                  )

                </option>

              ))}

            </select>

          )}



          {audience === "department" && (

            <select

              value={departmentId}

              onChange={(e) => setDepartmentId(e.target.value)}

              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"

            >

              <option value="">Select department</option>

              {departments.map((d) => (

                <option key={d.id} value={d.id}>

                  {d.name}

                </option>

              ))}

            </select>

          )}



          {audience === "office" && (

            <select

              value={office}

              onChange={(e) => setOffice(e.target.value)}

              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"

            >

              <option value="">Select office</option>

              {offices.map((o) => (

                <option key={o.slug} value={o.slug}>

                  {o.label}

                </option>

              ))}

            </select>

          )}



          <input

            placeholder="Subject"

            value={subject}

            onChange={(e) => setSubject(e.target.value)}

            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"

          />

          <textarea

            placeholder="Your message"

            value={body}

            onChange={(e) => setBody(e.target.value)}

            rows={4}

            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"

          />

          <Button size="sm" disabled={busy} onClick={send} className="gap-1">

            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}

            Send message

          </Button>

        </div>



        <div className="space-y-2 max-h-80 overflow-y-auto">

          <p className="text-sm font-medium text-muted-foreground">Recent messages</p>

          {messages.length === 0 ? (

            <p className="text-sm text-muted-foreground">No messages yet.</p>

          ) : (

            messages.slice(0, 15).map((m) => (

              <div key={m.id} className="rounded-lg bg-white/5 p-3 text-sm">

                <p className="font-medium">{m.subject}</p>

                <p className="text-xs text-muted-foreground mt-0.5">

                  {m.sender.firstName} {m.sender.lastName} ({m.sender.role})

                  {m.audience === "department" && m.department ? ` → ${m.department.name}` : ""}

                  {m.audience === "office" && m.office

                    ? ` → ${officeLabel(m.office) ?? m.office}`

                    : ""}

                  {m.recipient ? ` → ${m.recipient.firstName}` : ""}

                  {m.audience === "company" ? " → company" : ""}

                </p>

                <p className="text-muted-foreground mt-1 line-clamp-2">{m.body}</p>

              </div>

            ))

          )}

        </div>

      </div>

    </GlassCard>

  );

}

