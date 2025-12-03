import type { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
});

function extractTextFromResponse(resp: any): string {
  if (!resp) return "";

  const candidate = resp?.candidates?.[0];
  if (candidate) {
    const partsArr = candidate.content ?? candidate.output ?? candidate?.content?.parts ?? null;

    if (Array.isArray(partsArr) && partsArr.length > 0) {
      const textParts = partsArr
        .map((p: any) => {
          if (!p) return "";
          return p.text ?? p.content ?? p.displayText ?? (typeof p === "string" ? p : "");
        })
        .filter(Boolean);
      if (textParts.length) return textParts.join("\n\n");
    }

    if (typeof candidate.content === "object" && typeof candidate.content.text === "string") {
      return candidate.content.text;
    }

    if (typeof candidate.displayText === "string" && candidate.displayText.trim()) {
      return candidate.displayText;
    }
  }

  const out = resp?.output?.[0];
  if (out && Array.isArray(out.content)) {
    const textParts = out.content.map((p: any) => p?.text ?? p?.content ?? "").filter(Boolean);
    if (textParts.length) return textParts.join("\n\n");
  }

  if (typeof resp.text === "string" && resp.text.trim()) return resp.text;

  if (resp?.sdkHttpResponse || resp?.usageMetadata || resp?.modelVersion) {
    return "";
  }

  try { return JSON.stringify(resp); } catch { return ""; }
}

function extractJsonFromText(text?: string): any | null {
  if (!text) return null;
  const jsonMatch = text.match(/(\{[\s\S]*\})/);
  if (!jsonMatch) return null;
  try { return JSON.parse(jsonMatch[1]); } catch {
    try {
      const cleaned = jsonMatch[1].replace(/,\s*}$/, "}");
      return JSON.parse(cleaned);
    } catch { return null; }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userData = body?.userData;
    if (!userData) {
      return new Response(JSON.stringify({ error: "Missing userData" }), { status: 400 });
    }

    const selectedItemsText = (userData.selectedItems || [])
      .map((i: any) => `- ${i.name} (categoria: ${i.category}, preço: R$ ${Number(i.price).toFixed(2)})`)
      .join("\n") || "Nenhum item selecionado";

    const prompt = `
O usuário forneceu:
Tipo de imóvel: ${userData.propertyType}
Transação: ${userData.transactionType}
Local: ${userData.location}
Metragem: ${userData.squareMeters} m²
Itens:
${selectedItemsText}

Tarefas (responda em português):
1) Primeiro, um resumo humano **muito curto** (≤100 palavras).
2) Depois, um **único** bloco JSON válido (apenas JSON) contendo:
   { "property_estimate": number, "rent_monthly_estimate": number, "furnishing_cost": number, "total_upfront": number, "notes": string }
Se tiver que estimar, diga as suposições usadas. Seja conciso e gere JSON compacto (sem comentários).
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.2,
      }
    });

    const aiText = extractTextFromResponse(response);
    const aiJson = extractJsonFromText(aiText);

    const finishReason = response?.candidates?.[0]?.finishReason ?? null;
    const incomplete = finishReason === "MAX_TOKENS";

    const meta = {
      modelVersion: response?.modelVersion ?? null,
      responseId: response?.responseId ?? null,
      usage: response?.usageMetadata ?? null,
      finishReason
    };

    if (!aiText && !aiJson) {
      return new Response(JSON.stringify({
        aiText: aiText || null,
        aiJson: aiJson || null,
        meta,
        incomplete,
        error: incomplete ? "incomplete_response_max_tokens" : "no_text_returned"
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ aiText, aiJson, meta, incomplete }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    console.error("route /api/gemini error", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
