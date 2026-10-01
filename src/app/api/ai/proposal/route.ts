import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-guard";
import { rateLimit, validateOrigin } from "@/lib/security";

function generateProposal(problem: string, industry: string, budget: string) {
  const industrySolutions: Record<string, string[]> = {
    education: ["Learning Management System", "AI-powered assessment platform", "Student analytics dashboard"],
    healthcare: ["Telemedicine platform", "Patient management system", "Health data analytics"],
    agriculture: ["IoT crop monitoring", "Smart irrigation system", "Supply chain tracking"],
    government: ["E-governance portal", "Citizen service platform", "Secure document management"],
    finance: ["Payment gateway integration", "Fraud detection system", "Digital banking platform"],
    logistics: ["Fleet management system", "Route optimization engine", "Warehouse automation"],
    manufacturing: ["Predictive maintenance IoT", "Quality control automation", "Production analytics"],
  };

  const solutions = industrySolutions[industry] || [
    "Custom software development",
    "AI-powered automation",
    "Cloud infrastructure migration",
  ];

  const proposal = `Based on your challenge, TechFlare Solutions recommends the following approach:

**Recommended Solutions:**
${solutions.map((s, i) => `${i + 1}. ${s}`).join("\n")}

**Proposed Phases:**
1. Discovery & Requirements (2 weeks)
2. Research & Architecture Design (3 weeks)
3. Development & Iteration (8-12 weeks)
4. Testing, Deployment & Training (2 weeks)

**Why TechFlare Solutions:**
Our Innovation Hub methodology ensures your solution is researched, validated, and built to world-class standards — not just coded to spec.

A detailed proposal with technical specifications will be sent to your email within 48 hours.`;

  const budgetEstimates: Record<string, string> = {
    "under-10k": "$8,000 - $10,000",
    "10k-50k": "$15,000 - $45,000",
    "50k-100k": "$55,000 - $95,000",
    "100k-plus": "$100,000 - $250,000+",
  };

  return {
    proposal,
    estimatedCost: budgetEstimates[budget] || "$25,000 - $75,000",
  };
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 15, 60_000);
  if (limited) return limited;
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const { problem, industry, budget } = await req.json();
    if (!problem) {
      return NextResponse.json({ error: "Problem description required" }, { status: 400 });
    }

    if (process.env.OPENAI_API_KEY) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a solutions architect at TechFlare Solutions. Generate a concise project proposal with recommended solutions, phases, and estimated cost range. Be professional and specific.",
              },
              {
                role: "user",
                content: `Problem: ${problem}\nIndustry: ${industry}\nBudget: ${budget}`,
              },
            ],
            max_tokens: 500,
          }),
        });
        const data = await res.json();
        const aiProposal = data.choices?.[0]?.message?.content;
        if (aiProposal) {
          return NextResponse.json({
            proposal: aiProposal,
            estimatedCost: generateProposal(problem, industry, budget).estimatedCost,
          });
        }
      } catch {
        // fall through to rule-based
      }
    }

    return NextResponse.json(generateProposal(problem, industry, budget));
  } catch {
    return NextResponse.json({ error: "Proposal generation failed" }, { status: 500 });
  }
}
