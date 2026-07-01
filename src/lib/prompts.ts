// Feature prompts kept separate from UI so providers can be swapped later.

export type FeatureId =
  | "email"
  | "summarizer"
  | "planner"
  | "research"
  | "drafting"
  | "contract"
  | "citations"
  | "strategy"
  | "timeline"
  | "court_prep"
  | "argument"
  | "writing_coach";

const SYSTEM_BASE = `You are Chambers OS, an AI assistant purpose-built for legal professionals in South Africa and comparable common-law jurisdictions.
Write in a precise, professional register. Use plain English, correct legal terminology, and neutral tone.
When generating deliverables, structure with clear headings and short paragraphs.
Never invent case citations, statutes, or authorities. If unsure, say so and recommend verification.
Always end substantive answers with a brief "Verification note" reminding the reader to confirm sources.`;

type PromptBuilder = (input: Record<string, unknown>) => { system: string; prompt: string };

export const PROMPTS: Record<FeatureId, PromptBuilder> = {
  email: (i) => ({
    system: SYSTEM_BASE,
    prompt: `Draft a professional legal email.

Recipient: ${i.recipient || "N/A"}
Matter: ${i.matter || "N/A"}
Purpose: ${i.purpose || "N/A"}
Tone: ${i.tone || "Formal"}
Additional context / attachments summary:
${i.context || "(none)"}

Return only the email body with subject line on the first line as "Subject: ...".`,
  }),

  summarizer: (i) => ({
    system: SYSTEM_BASE,
    prompt: `Summarize the following meeting notes / transcript.

Notes:
"""
${i.notes || ""}
"""

Return the summary using these exact sections in markdown:
## Executive Summary
## Key Decisions
## Action Items
## Deadlines
## Open Questions`,
  }),

  planner: (i) => ({
    system: SYSTEM_BASE,
    prompt: `Build a prioritised daily schedule for a legal professional.

Working hours: ${i.hours || "08:00 – 17:00"}
Tasks and deadlines:
${i.tasks || ""}

Return a schedule grouped as:
### Morning
### Afternoon
### Evening
For each entry include time-box, task, priority (High/Med/Low), and rationale.`,
  }),

  research: (i) => ({
    system: SYSTEM_BASE,
    prompt: `Perform a legal research brief.

Question: ${i.question || ""}
Jurisdiction: ${i.jurisdiction || "South Africa"}
Objective: ${i.objective || ""}
Supporting material:
${i.context || "(none)"}

Return with sections:
## Summary
## Applicable Authorities (statute + case law, mark uncertain items)
## Analysis
## Recommendations
## Important Points to Verify`,
  }),

  drafting: (i) => ({
    system: SYSTEM_BASE,
    prompt: `Draft the requested legal document.

Document type: ${i.docType || ""}
Parties: ${i.parties || ""}
Governing law: ${i.governingLaw || "South Africa"}
Key terms / instructions:
${i.instructions || ""}

Produce a complete draft with numbered clauses and clear defined terms.`,
  }),

  contract: (i) => ({
    system: SYSTEM_BASE,
    prompt: `Review the following contract. Identify risks, ambiguities, missing protections, and unusual clauses.

Contract:
"""
${i.contract || ""}
"""

Return sections:
## Overview
## Red Flags (with clause references)
## Suggested Redlines (before → after)
## Missing Provisions
## Overall Risk Rating (Low/Medium/High) with reasoning`,
  }),

  citations: (i) => ({
    system: SYSTEM_BASE,
    prompt: `Format the following raw references as a clean citation list in ${i.style || "SA neutral citation"} style. If a reference is malformed or unverifiable, mark it "[VERIFY]" instead of guessing.

References:
${i.references || ""}`,
  }),

  strategy: (i) => ({
    system: SYSTEM_BASE,
    prompt: `Develop a case strategy memo.

Matter summary: ${i.matter || ""}
Client objective: ${i.objective || ""}
Known facts:
${i.facts || ""}
Opposing position:
${i.opposing || "(unknown)"}

Return sections:
## Theory of the Case
## Strengths
## Weaknesses / Risks
## Recommended Actions (with sequencing)
## Evidence to Gather
## Alternative Scenarios`,
  }),

  timeline: (i) => ({
    system: SYSTEM_BASE,
    prompt: `Build a chronological case timeline from the following material. Return a markdown table with columns: Date | Event | Source | Significance.

Material:
"""
${i.material || ""}
"""`,
  }),

  court_prep: (i) => ({
    system: SYSTEM_BASE,
    prompt: `Prepare a court appearance brief.

Matter: ${i.matter || ""}
Court / hearing type: ${i.court || ""}
Objective for the appearance: ${i.objective || ""}
Facts / documents:
${i.context || ""}

Return sections:
## Opening Statement (draft)
## Key Points to Argue
## Likely Questions from the Bench
## Suggested Answers
## Documents to Bring`,
  }),

  argument: (i) => ({
    system: SYSTEM_BASE,
    prompt: `Construct a persuasive legal argument.

Position: ${i.position || ""}
Supporting facts:
${i.facts || ""}

Return sections:
## Thesis
## Premises (numbered)
## Supporting Authorities (mark uncertain ones)
## Counter-arguments and Rebuttals
## Conclusion`,
  }),

  writing_coach: (i) => ({
    system: SYSTEM_BASE,
    prompt: `Act as a legal writing coach. Improve the following text for clarity, precision, plain language, and professional tone. Preserve legal meaning.

Text:
"""
${i.text || ""}
"""

Return:
## Improved Version
## Notes on Changes (bullet list)`,
  }),
};

export const CHAT_SYSTEM = `${SYSTEM_BASE}
You are the interactive Chambers OS assistant. Answer conversationally, cite when possible, ask clarifying questions when needed, and remind the user that AI-generated legal content should be verified before use.`;
