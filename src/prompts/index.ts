// ACKO MPOS — AI system prompts
// These are the real system prompts that would be passed to Claude via the
// Anthropic API for the three onboarding-automation features. They are stored
// here as template functions so the UI can preview, test, and (optionally)
// call Claude with the real text — no invention, no drift.

// ---------------------------------------------------------------------------
// Prompt 1 — Format Normalisation Agent (Feature 5A bulk onboarding)
// ---------------------------------------------------------------------------

export function formatNormalizerPrompt(validGroupNames: string[]): string {
  return `You are a data mapping assistant for ACKO's MPOS dealer onboarding system.

Your job is to map columns from a partner-supplied file to ACKO's canonical MPOS schema.

MPOS schema fields (all required unless marked optional):
- name: dealer/promoter full name
- phone: 10-digit mobile number, no country code, no spaces (primary identifier \u2014 must be unique)
- partner_id: the partner's internal ID for this user (e.g. XMIN4413 for Xiaomi) \u2014 optional
- parent_phone: 10-digit mobile number of this user's parent in the hierarchy \u2014 optional
- address: full street address
- pincode: 6-digit Indian postal code
- email: email address \u2014 optional
- group: the MPOS group this user belongs to. Valid values for this partner are: ${validGroupNames.join(', ')}

You will be given:
1. The column headers of the partner's file
2. The first 3 data rows as sample data

Your task:
1. Map each source column to the closest MPOS schema field
2. For each mapping, assign a confidence score: HIGH (>90% sure), MEDIUM (60\u201390%), LOW (<60%)
3. Flag any MPOS required field that has no clear source column
4. Flag any source column that maps to nothing (potential data loss)
5. For the 'group' field specifically: infer the group value from column names like 'ASC', 'PSC', 'Dealer', 'Sub-Dealer', 'Promoter', 'FSM' using the valid group list above

Return a JSON object in this exact format:
{
  "mappings": [
    {
      "source_column": "original column name",
      "target_field": "mpos field name or null if no match",
      "confidence": "HIGH | MEDIUM | LOW",
      "notes": "brief reason for the mapping or flag"
    }
  ],
  "missing_required_fields": ["list of required MPOS fields with no source column"],
  "unmapped_source_columns": ["source columns with no MPOS target"],
  "group_inference": "how you determined the group value and what value to use"
}

Do not guess phone numbers, names, or IDs. If you cannot map a required field, set target_field to null and explain in notes.`;
}

// ---------------------------------------------------------------------------
// Prompt 2 — Plan Config Generator (new partner onboarding)
// ---------------------------------------------------------------------------

export interface DealBrief {
  partner_name: string;
  product_category: 'mobile' | 'tv' | 'laptop' | 'wearable';
  purchase_type: 'opt-in' | 'mandatory';
  device_price_min: number;
  device_price_max: number;
  plan_duration: '12M' | '24M' | '36M';
  b2b_plan: 'yes' | 'no';
  master_sclip_policy_number: string;
  premium_structure: 'Acko GI' | 'Acko Tech' | 'split';
  premium_percent: number;
  partner_channel: 'LFR' | 'online' | 'offline' | 'mixed';
}

export function planConfigPrompt(brief: DealBrief, referenceConfig: Record<string, unknown>): string {
  return `You are a configuration assistant for ACKO's MPOS insurance platform.

A new partner is being onboarded. Here is their deal brief:
- Partner name: ${brief.partner_name}
- Product category: ${brief.product_category}
- Purchase type: ${brief.purchase_type}
- Device price range: \u20B9${brief.device_price_min} to \u20B9${brief.device_price_max}
- Plan duration: ${brief.plan_duration}
- B2B plan: ${brief.b2b_plan}
- Master SCLIP policy number: ${brief.master_sclip_policy_number}
- Premium structure: ${brief.premium_structure}
- Premium percent: ${brief.premium_percent}%
- Partner channel: ${brief.partner_channel}

Here is the closest existing partner config for reference:
${JSON.stringify(referenceConfig, null, 2)}

Your task:
Generate a pre-filled Plan Details config for this new partner using the reference config as a base.

Rules:
1. Keep all fields that are identical between partners (comms templates, refund type, standard depreciation JSON) \u2014 copy them exactly from the reference config
2. For fields that clearly differ based on the deal brief (dates, policy number, premium rates, device price range, plan name) \u2014 generate the correct value
3. For fields that are ambiguous or partner-specific (COI template name, program ID, review link) \u2014 leave blank and mark as "NEEDS_INPUT"
4. Never invent policy numbers, program IDs, or document links
5. The depreciation_logic JSON must follow this format exactly: {"90": 0.20, "180": 0.30, "270": 0.40, "365": 0.50} \u2014 do not change values unless the deal brief explicitly specifies different depreciation

Return a JSON object with all 42 Plan Details fields. For each field, include:
- "value": the pre-filled value or null
- "source": "copied_from_reference" | "generated_from_brief" | "NEEDS_INPUT"
- "confidence": "HIGH" | "MEDIUM" | "NEEDS_REVIEW"

Flag any field where you are less than 80% confident with confidence = "NEEDS_REVIEW" and explain why in a "note" field.`;
}

// ---------------------------------------------------------------------------
// Prompt 3 — Error Translator (Feature 15)
// ---------------------------------------------------------------------------

export interface ErrorContext {
  error_message: string;
  row_data: Record<string, unknown>;
  partner_name: string;
  group_name: string;
  total_rows: number;
  failed_row_number: number;
}

export function errorTranslatorPrompt(ctx: ErrorContext): string {
  return `You are a plain-English assistant for ACKO's MPOS dealer onboarding team.

A non-technical ops person (Suraj) has just tried to upload a dealer onboarding file and received an error. Your job is to explain the error in plain English and give one specific action to fix it.

Rules:
- Maximum 2 sentences
- No technical jargon (no "constraint violation", "foreign key", "null pointer")
- Be specific: include the row number, the field name, and the exact value that caused the problem if available
- If the error is clearly a system bug (not a data error), say so explicitly and tell Suraj to forward it to engineering with the error ID

Error received:
${ctx.error_message}

Row context (the row that triggered the error):
${JSON.stringify(ctx.row_data, null, 2)}

Partner context:
- Partner: ${ctx.partner_name}
- Group being onboarded: ${ctx.group_name}
- Total rows in file: ${ctx.total_rows}
- Row number that failed: ${ctx.failed_row_number}

Return a JSON object:
{
  "plain_english": "2-sentence explanation Suraj can read and act on immediately",
  "action": "one specific thing Suraj should do to fix this",
  "is_system_bug": true | false,
  "escalate_to_saroj": true | false,
  "escalation_reason": "only if escalate_to_saroj is true \u2014 brief reason"
}`;
}

// ---------------------------------------------------------------------------
// Mock responses for prototype mode (no API key)
// ---------------------------------------------------------------------------

export interface ColumnMapping {
  source_column: string;
  target_field: string | null;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  notes: string;
}

export interface NormalizerResponse {
  mappings: ColumnMapping[];
  missing_required_fields: string[];
  unmapped_source_columns: string[];
  group_inference: string;
}

export function mockNormalize(headers: string[]): NormalizerResponse {
  // Deterministic fuzzy mapping for the prototype — mirrors what the AI
  // would do against ACKO's canonical schema
  const rules: Record<string, { target: string; confidence: ColumnMapping['confidence']; notes: string }> = {
    name: { target: 'name', confidence: 'HIGH', notes: 'Direct match' },
    'full name': { target: 'name', confidence: 'HIGH', notes: 'Normalised from "Full Name"' },
    'dealer name': { target: 'name', confidence: 'HIGH', notes: 'Semantic match' },
    promoter: { target: 'name', confidence: 'MEDIUM', notes: 'Likely full name column' },
    mobile: { target: 'phone', confidence: 'HIGH', notes: 'Mobile number' },
    phone: { target: 'phone', confidence: 'HIGH', notes: 'Direct match' },
    'mobile no': { target: 'phone', confidence: 'HIGH', notes: 'Normalised' },
    'mobile no.': { target: 'phone', confidence: 'HIGH', notes: 'Normalised' },
    'contact number': { target: 'phone', confidence: 'HIGH', notes: 'Semantic match' },
    'partner id': { target: 'partner_id', confidence: 'HIGH', notes: 'Direct match' },
    'partner code': { target: 'partner_id', confidence: 'HIGH', notes: 'Semantic match' },
    empid: { target: 'partner_id', confidence: 'MEDIUM', notes: 'Employee ID \u2014 mapped to partner_id' },
    'parent mobile': { target: 'parent_phone', confidence: 'HIGH', notes: 'Parent reference' },
    manager: { target: 'parent_phone', confidence: 'MEDIUM', notes: 'Likely manager phone' },
    address: { target: 'address', confidence: 'HIGH', notes: 'Direct match' },
    location: { target: 'address', confidence: 'MEDIUM', notes: 'Possibly address or city' },
    pincode: { target: 'pincode', confidence: 'HIGH', notes: 'Direct match' },
    pin: { target: 'pincode', confidence: 'HIGH', notes: 'Normalised' },
    zip: { target: 'pincode', confidence: 'MEDIUM', notes: 'US-style zip \u2014 mapped to pincode' },
    email: { target: 'email', confidence: 'HIGH', notes: 'Direct match' },
    'email id': { target: 'email', confidence: 'HIGH', notes: 'Normalised' },
    designation: { target: 'group', confidence: 'MEDIUM', notes: 'Used to infer group' },
    role: { target: 'group', confidence: 'MEDIUM', notes: 'Used to infer group' },
    type: { target: 'group', confidence: 'LOW', notes: 'Ambiguous \u2014 may indicate group' },
  };

  const mappings: ColumnMapping[] = headers.map((h) => {
    const k = h.toLowerCase().trim();
    const rule = rules[k];
    if (rule) {
      return { source_column: h, target_field: rule.target, confidence: rule.confidence, notes: rule.notes };
    }
    // Fuzzy sub-match
    for (const [key, r] of Object.entries(rules)) {
      if (k.includes(key) || key.includes(k)) {
        return {
          source_column: h,
          target_field: r.target,
          confidence: 'LOW',
          notes: `Fuzzy match against "${key}" \u2014 review before import`,
        };
      }
    }
    return {
      source_column: h,
      target_field: null,
      confidence: 'LOW',
      notes: 'No match in MPOS schema \u2014 will be ignored on import',
    };
  });

  const required = ['name', 'phone', 'address', 'pincode', 'group'];
  const mappedTargets = new Set(mappings.map((m) => m.target_field).filter(Boolean));
  const missing_required_fields = required.filter((r) => !mappedTargets.has(r));
  const unmapped_source_columns = mappings.filter((m) => !m.target_field).map((m) => m.source_column);

  return {
    mappings,
    missing_required_fields,
    unmapped_source_columns,
    group_inference:
      'Inferred "Promoter" from the Designation/Role column. Applied to all rows where designation contains "promoter", "FSM", or "sales agent".',
  };
}

export interface ErrorTranslation {
  plain_english: string;
  action: string;
  is_system_bug: boolean;
  escalate_to_saroj: boolean;
  escalation_reason?: string;
}

export function mockTranslateError(errorMessage: string, rowNumber: number, rowData: Record<string, unknown>): ErrorTranslation {
  const lower = errorMessage.toLowerCase();

  if (lower.includes('duplicate') || lower.includes('unique constraint')) {
    const phone = rowData.phone ?? rowData.mobile ?? 'unknown';
    return {
      plain_english: `Row ${rowNumber}: the phone number ${phone} is already registered to another user in MPOS. If this is the same person being re-onboarded, remove this row from the file.`,
      action: `Delete row ${rowNumber} from the CSV, or if this is a new person, double-check the phone number with the dealer.`,
      is_system_bug: false,
      escalate_to_saroj: false,
    };
  }

  if (lower.includes('group_not_found') || lower.includes('groupnotfoundexception')) {
    return {
      plain_english: `Row ${rowNumber}: the dealer group "${rowData.group ?? 'unspecified'}" doesn't exist yet in MPOS for this partner. Groups have to be created before you can add users to them.`,
      action: 'Go to Users & RBAC \u2192 Groups and create this group first, then re-run the import.',
      is_system_bug: false,
      escalate_to_saroj: false,
    };
  }

  if (lower.includes('invalid pincode') || lower.includes('pincode')) {
    return {
      plain_english: `Row ${rowNumber}: the pincode "${rowData.pincode ?? ''}" isn't a valid 6-digit Indian postal code. It may have a typo or extra spaces.`,
      action: `Fix the pincode in row ${rowNumber} to a 6-digit number and re-upload.`,
      is_system_bug: false,
      escalate_to_saroj: false,
    };
  }

  if (lower.includes('null pointer') || lower.includes('500') || lower.includes('internal server')) {
    return {
      plain_english: `This looks like a bug on our side, not something wrong with your file. Row ${rowNumber} hit an unexpected system error.`,
      action: 'Forward this error with the error ID to engineering via the #mpos-support Slack channel.',
      is_system_bug: true,
      escalate_to_saroj: true,
      escalation_reason: 'Unhandled system exception \u2014 engineering needs to look at the logs.',
    };
  }

  return {
    plain_english: `Row ${rowNumber} failed with an unfamiliar error. The data might have an unexpected format we haven't seen before.`,
    action: `Check row ${rowNumber} for anything unusual, or forward this to engineering if you can't spot the issue.`,
    is_system_bug: false,
    escalate_to_saroj: true,
    escalation_reason: 'Unknown error category \u2014 needs human review.',
  };
}
