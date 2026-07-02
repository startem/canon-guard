import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

interface AuditFinding {
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  category: string;
  recommendation: string;
}

const AUDIT_LABELS: Record<string, string> = {
  "brand-consistency": "Brand Consistency Audit",
  "content": "Content Audit",
  "visual-identity": "Visual Identity Audit",
  "brand-perception": "Brand Perception Audit",
  "social-media": "Social Media Audit",
  "legal-compliance": "Legal Compliance Audit",
  "competitor-analysis": "Competitor Analysis Audit",
  "customer-experience": "Customer Experience Audit",
  "digital-asset": "Digital Asset Audit",
  "employee-brand": "Employee Brand Alignment Audit",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const clientId: string | undefined = body.clientId;
    const auditType: string = body.auditType ?? "brand-consistency";
    const content: string = (body.content ?? "").toString().slice(0, 12000);
    const url: string | undefined = body.url;

    if (!clientId) {
      return new Response(JSON.stringify({ error: "clientId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load client (RLS enforces access)
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .select("id, name, agency_id, industry, website")
      .eq("id", clientId)
      .maybeSingle();
    if (clientErr || !client) {
      return new Response(JSON.stringify({ error: "Client not found or access denied" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load brand canon
    const [colors, pillars, boilerplate, legal] = await Promise.all([
      supabase.from("color_tokens").select("name, hex, category, usage").eq("client_id", clientId),
      supabase.from("messaging_pillars").select("name, definition, keywords, priority").eq("client_id", clientId),
      supabase.from("boilerplate_items").select("name, type, content").eq("client_id", clientId),
      supabase.from("legal_items").select("name, type, content, mandatory, risk_level").eq("client_id", clientId),
    ]);

    const canon = {
      client: { name: client.name, industry: client.industry, website: client.website },
      colorTokens: colors.data ?? [],
      messagingPillars: pillars.data ?? [],
      boilerplate: boilerplate.data ?? [],
      legalItems: legal.data ?? [],
    };

    const auditLabel = AUDIT_LABELS[auditType] ?? "Brand Audit";

    const systemPrompt = `You are an expert brand governance auditor. You compare submitted material against a brand's defined "Brand Canon" (its approved colors, messaging pillars, boilerplate, and legal requirements) and produce a rigorous, specific ${auditLabel}.
Rules:
- Score 0-100 reflecting how well the material aligns with the Brand Canon (100 = perfect alignment).
- Findings must be concrete and reference the actual canon and submitted material. Do not invent facts.
- If little or no material was submitted, return a low-confidence audit noting the missing input as a finding.
- Severity: critical (legal/serious brand risk), high, medium, low.
- Always return via the provided tool.`;

    const userPrompt = `BRAND CANON (source of truth):
${JSON.stringify(canon, null, 2)}

AUDIT TYPE: ${auditLabel}
${url ? `TARGET URL: ${url}\n` : ""}SUBMITTED MATERIAL TO AUDIT:
"""
${content || "(no material submitted)"}
"""

Analyze the submitted material against the Brand Canon and return the structured audit.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_audit",
              description: "Return the structured brand audit result.",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "integer", description: "0-100 alignment score" },
                  summary: { type: "string", description: "2-3 sentence executive summary" },
                  findings: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
                        category: { type: "string" },
                        recommendation: { type: "string" },
                      },
                      required: ["title", "description", "severity", "category", "recommendation"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["score", "summary", "findings"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_audit" } },
      }),
    });

    if (aiResp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiResp.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResp.ok) {
      const errText = await aiResp.text();
      return new Response(JSON.stringify({ error: "AI request failed", detail: errText }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "AI returned no structured result" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed: { score: number; summary: string; findings: AuditFinding[] };
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch {
      return new Response(JSON.stringify({ error: "Failed to parse AI result" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const score = Math.max(0, Math.min(100, Math.round(parsed.score ?? 0)));
    const findings = Array.isArray(parsed.findings) ? parsed.findings : [];

    // Persist audit
    const { data: audit, error: auditErr } = await supabase
      .from("audits")
      .insert({
        client_id: clientId,
        type: auditType,
        title: auditLabel,
        score,
        status: "completed",
        summary: parsed.summary ?? "",
        input_context: { content: content.slice(0, 2000), url: url ?? null },
        created_by: userData.user.id,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (auditErr || !audit) {
      return new Response(JSON.stringify({ error: "Failed to save audit", detail: auditErr?.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (findings.length > 0) {
      await supabase.from("audit_findings").insert(
        findings.map((f) => ({
          audit_id: audit.id,
          title: f.title,
          description: f.description,
          severity: f.severity,
          category: f.category,
          recommendation: f.recommendation,
          status: "open",
        }))
      );

      // Create issues for high/critical findings
      const serious = findings.filter((f) => f.severity === "high" || f.severity === "critical");
      if (serious.length > 0) {
        await supabase.from("issues").insert(
          serious.map((f) => ({
            client_id: clientId,
            audit_id: audit.id,
            title: f.title,
            description: f.description,
            severity: f.severity,
            status: "open",
            category: f.category,
          }))
        );
      }
    }

    // Notify the agency
    const notifSeverity = score < 60 ? "high" : score < 80 ? "medium" : "low";
    await supabase.from("notifications").insert({
      agency_id: client.agency_id,
      client_id: clientId,
      title: `${auditLabel} completed for ${client.name}`,
      message: `Score: ${score}%. ${findings.length} finding(s) detected. ${parsed.summary ?? ""}`.slice(0, 500),
      severity: notifSeverity,
      category: "audit",
      read: false,
    });

    return new Response(
      JSON.stringify({ audit, score, summary: parsed.summary, findings }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: "Unexpected error", detail: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
