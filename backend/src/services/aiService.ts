import { GoogleGenerativeAI } from '@google/generative-ai';
import { CRMRecord } from '../types';

export async function extractCRMDataWithAI(batch: any[]): Promise<{ records: CRMRecord[], skipped: any[] }> {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured in environment variables.');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const systemPrompt = `
    You are an intelligent data extraction assistant. Your task is to extract CRM lead information from an array of raw CSV rows and map it into a precise structured JSON array format.

    CRM Target Schema:
    - created_at: String (must be parsable by JavaScript 'new Date()')
    - name: String (Lead name)
    - email: String (Primary email)
    - country_code: String
    - mobile_without_country_code: String
    - company: String
    - city: String
    - state: String
    - country: String
    - lead_owner: String
    - crm_status: String (MUST exactly match one of: "GOOD_LEAD_FOLLOW_UP", "DID_NOT_CONNECT", "BAD_LEAD", "SALE_DONE" or be empty "")
    - crm_note: String
    - data_source: String (MUST exactly match one of: "leads_on_demand", "meridian_tower", "eden_park", "varah_swamy", "sarjapur_plots" or be empty "")
    - possession_time: String
    - description: String

    Extraction Rules:
    1. If multiple emails exist in a row, use the first one in the 'email' field. Append the remaining emails into the 'crm_note' field (e.g. "Extra emails: x@x.com").
    2. If multiple mobile numbers exist, use the first in 'mobile_without_country_code', append the rest to 'crm_note'.
    3. Ensure the output is a JSON Array containing objects with the exact keys listed above.
    `;

    const prompt = `
    System Rules: ${systemPrompt}
    
    Here is the array of raw CSV records to process:
    ${JSON.stringify(batch)}
    
    Return ONLY a JSON array with the mapped records.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        let parsed: Partial<CRMRecord>[] = JSON.parse(text);
        
        // Filter out skipped records (missing both email and mobile)
        const records: CRMRecord[] = [];
        const skipped: any[] = [];
        
        for (let i = 0; i < parsed.length; i++) {
            const row = parsed[i];
            const originalRow = batch[i];
            
            const hasEmail = row.email && row.email.trim() !== '';
            const hasMobile = row.mobile_without_country_code && row.mobile_without_country_code.trim() !== '';
            
            if (!hasEmail && !hasMobile) {
                skipped.push({ original: originalRow, reason: "Missing both email and mobile" });
            } else {
                // Set default empty strings for missing fields to conform to type
                records.push({
                    created_at: row.created_at || '',
                    name: row.name || '',
                    email: row.email || '',
                    country_code: row.country_code || '',
                    mobile_without_country_code: row.mobile_without_country_code || '',
                    company: row.company || '',
                    city: row.city || '',
                    state: row.state || '',
                    country: row.country || '',
                    lead_owner: row.lead_owner || '',
                    crm_status: (row.crm_status as any) || '',
                    crm_note: row.crm_note || '',
                    data_source: (row.data_source as any) || '',
                    possession_time: row.possession_time || '',
                    description: row.description || '',
                });
            }
        }
        
        return { records, skipped };
        
    } catch (error) {
        console.error("Error in AI extraction:", error);
        throw error;
    }
}
