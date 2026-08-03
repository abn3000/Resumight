import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to instantiate Gemini client safely with optional explicit API key
function getAIClient(apiKey?: string): GoogleGenAI {
  const key = apiKey || process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY2 || '';
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Executes a Gemini API call with primary GEMINI_API_KEY and falls back to GEMINI_API_KEY2
async function callWithGeminiFallback<T>(callFn: (ai: GoogleGenAI) => Promise<T>): Promise<T> {
  const primaryKey = process.env.GEMINI_API_KEY;
  const backupKey = process.env.GEMINI_API_KEY2;

  if (primaryKey) {
    try {
      const primaryClient = getAIClient(primaryKey);
      return await callFn(primaryClient);
    } catch (primaryErr: any) {
      console.warn('Primary GEMINI_API_KEY call failed. Attempting backup GEMINI_API_KEY2. Error:', primaryErr?.message || primaryErr);
      if (backupKey) {
        console.log('Using backup GEMINI_API_KEY2...');
        const backupClient = getAIClient(backupKey);
        return await callFn(backupClient);
      }
      throw primaryErr;
    }
  } else if (backupKey) {
    const backupClient = getAIClient(backupKey);
    return await callFn(backupClient);
  } else {
    const defaultClient = getAIClient();
    return await callFn(defaultClient);
  }
}

// ==========================================
// API Endpoint 1: Speech to Resume Category Parser
// ==========================================
app.post('/api/parse-speech', async (req, res) => {
  try {
    const { spokenText, currentFormData, defaultFields } = req.body;

    if (!spokenText || typeof spokenText !== 'string' || !spokenText.trim()) {
      return res.status(400).json({ error: 'No spoken text provided' });
    }

    const defaultFieldsList = Array.isArray(defaultFields) ? defaultFields : [];

    const prompt = `You are an AI Resume Assistant for students and job seekers.
The user spoke or typed the following input describing their background:
"${spokenText}"

Current Resume Data context:
${JSON.stringify(currentFormData || {}, null, 2)}

Default Placeholder Fields (fields that currently contain default sample template data like "Alex Morgan"):
${JSON.stringify(defaultFieldsList)}

Your task:
1. Intelligently extract and map information into appropriate resume section fields (name, role, email, phone, location, linkedin, summary, education, experience, skills, activities).
2. Formulate clean, professional, ATS-friendly phrasing with action verbs.
3. CRITICAL OVERWRITE RULE FOR DEFAULT PLACEHOLDERS:
   - For any field listed in "Default Placeholder Fields", if the user speaks new information for that section (e.g. their name, target role, email, degree, etc.), COMPLETELY REPLACE / OVERWRITE the default placeholder text. Do NOT keep or append "Alex Morgan", "alex.morgan@berkeley.edu", or other sample placeholder text!
   - For fields NOT listed in "Default Placeholder Fields" (because the user manually entered custom data), smoothly merge new details into experience/skills or update without erasing user-typed content.
4. Provide a friendly 1-sentence summary message explaining what was updated.`;

    const response = await callWithGeminiFallback((ai) =>
      ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summaryMessage: {
                type: Type.STRING,
                description: 'Short friendly summary of what was updated (e.g., "Updated Experience and added 3 new Technical Skills").'
              },
              updatedFields: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  location: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  education: { type: Type.STRING },
                  experience: { type: Type.STRING },
                  skills: { type: Type.STRING },
                  activities: { type: Type.STRING }
                }
              }
            },
            required: ['summaryMessage', 'updatedFields']
          }
        }
      })
    );

    const resultText = response.text || '{}';
    const parsed = JSON.parse(resultText);

    res.json({
      success: true,
      summaryMessage: parsed.summaryMessage || 'Updated resume fields successfully.',
      updatedFields: parsed.updatedFields || {}
    });
  } catch (error: any) {
    console.error('Error in /api/parse-speech:', error);
    res.status(500).json({
      error: 'Failed to process speech with Gemini AI',
      details: error?.message || String(error)
    });
  }
});

// ==========================================
// API Endpoint 2: Full Job Description Resume Tailor
// ==========================================
app.post('/api/tailor-resume', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Both resumeText and jobDescription are required.' });
    }

    const prompt = `You are a top-tier executive career coach and ATS resume optimizer.
Compare the user's original resume against the target job posting below.

--- ORIGINAL RESUME ---
${resumeText}

--- TARGET JOB DESCRIPTION ---
${jobDescription}

Your goals:
1. Calculate a realistic ATS Keyword Match Score (0 to 100%).
2. Extract key matching keywords already present in the resume.
3. Extract missing high-impact job posting keywords (technical buzzwords, soft skills, domain tools).
4. Re-write and output a FULL, COMPLETE TAILORED RESUME incorporating all missing buzzwords naturally, improving action verbs, quantifying results where relevant, and reordering skills for maximum ATS impact. Do NOT summarize or truncate sections! Provide the entire clean formatted text of the tailored resume!
5. Provide 2-3 specific bullet point Before/After comparisons with reasoning.
6. Provide short strategic feedback tips for applying to this position.`;

    const response = await callWithGeminiFallback((ai) =>
      ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchScore: { type: Type.NUMBER, description: 'ATS match percentage between 0 and 100' },
              matchedKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of matching keywords found in both resume and job description'
              },
              missingKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of essential keywords missing from original resume'
              },
              tailoredResumeText: {
                type: Type.STRING,
                description: 'The COMPLETE fully rewritten and tailored resume text with incorporated buzzwords, ready to copy or download'
              },
              bulletRewrites: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    original: { type: Type.STRING },
                    tailored: { type: Type.STRING },
                    reasoning: { type: Type.STRING }
                  },
                  required: ['original', 'tailored', 'reasoning']
                },
                description: 'Key bullet points transformed with added keywords and impact'
              },
              summaryFeedback: {
                type: Type.STRING,
                description: 'Overall strategic guidance for applying to this role'
              }
            },
            required: ['matchScore', 'matchedKeywords', 'missingKeywords', 'tailoredResumeText', 'bulletRewrites', 'summaryFeedback']
          }
        }
      })
    );

    const resultText = response.text || '{}';
    const parsed = JSON.parse(resultText);

    res.json({
      success: true,
      matchScore: parsed.matchScore || 85,
      matchedKeywords: parsed.matchedKeywords || [],
      missingKeywords: parsed.missingKeywords || [],
      tailoredResumeText: parsed.tailoredResumeText || '',
      bulletRewrites: parsed.bulletRewrites || [],
      summaryFeedback: parsed.summaryFeedback || ''
    });
  } catch (error: any) {
    console.error('Error in /api/tailor-resume:', error);
    res.status(500).json({
      error: 'Failed to tailor resume with Gemini AI',
      details: error?.message || String(error)
    });
  }
});

// Setup Vite Development Middleware or Production Static Serve
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Resumight full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
