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

const MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Executes a Gemini API call with primary & backup API keys, multi-model fallback, and retry for 503/429
async function callWithGeminiFallback<T>(
  callFn: (ai: GoogleGenAI, model: string) => Promise<T>
): Promise<T> {
  const availableKeys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY2].filter(
    (k): k is string => typeof k === 'string' && k.trim().length > 0
  );

  // If no keys configured in env, fallback to single attempt with empty key
  const keysToIterate = availableKeys.length > 0 ? availableKeys : [''];
  let lastError: any = null;

  for (let kIdx = 0; kIdx < keysToIterate.length; kIdx++) {
    const key = keysToIterate[kIdx];
    const aiClient = getAIClient(key);

    for (const model of MODELS_TO_TRY) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          return await callFn(aiClient, model);
        } catch (err: any) {
          lastError = err;
          const errMsg = String(err?.message || err);
          const isDemandOrRateLimit =
            errMsg.includes('503') ||
            errMsg.includes('UNAVAILABLE') ||
            errMsg.includes('high demand') ||
            errMsg.includes('429') ||
            errMsg.includes('RESOURCE_EXHAUSTED') ||
            errMsg.includes('overloaded');

          console.warn(
            `Gemini call attempt ${attempt + 1} with key #${kIdx + 1}, model [${model}] failed:`,
            err?.message || err
          );

          if (isDemandOrRateLimit && attempt === 0) {
            // Brief backoff before retrying
            await delay(800);
            continue;
          }
          // Break to next model on non-retryable error or second attempt
          break;
        }
      }
    }
  }

  throw lastError || new Error('All Gemini models and API keys are currently busy or unavailable.');
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

    const response = await callWithGeminiFallback((ai, model) =>
      ai.models.generateContent({
        model,
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
// API Endpoint 2: PDF Resume Parser
// ==========================================
app.post('/api/parse-pdf', async (req, res) => {
  try {
    const { fileBase64, mimeType = 'application/pdf', fileName } = req.body;

    if (!fileBase64 || typeof fileBase64 !== 'string') {
      return res.status(400).json({ error: 'No file data provided' });
    }

    // Clean base64 string if it contains data URL prefix
    const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');

    const prompt = `You are an expert AI Resume Analyst and Parser.
Analyze the attached resume document (${fileName || 'resume file'}).

Your tasks:
1. Extract and map all resume information accurately into standard resume sections:
   - name: Full candidate name
   - role: Target title, current headline, or primary discipline
   - email: Email address
   - phone: Phone number
   - location: City, State, or Country
   - linkedin: LinkedIn profile URL/handle or personal website link
   - summary: Professional objective, personal statement, or executive summary
   - education: Full educational background including school names, degrees, majors, graduation dates, honors/GPA
   - experience: Professional work history, internships, and key project bullets formatted clearly with action verbs
   - skills: List of technical tools, programming languages, design software, frameworks, and relevant competencies
   - activities: Leadership roles, student organizations, hackathons, awards, certifications, or volunteer work
2. Provide a clean, un-truncated, full-text markdown representation of the entire resume in rawResumeText.
3. Provide a friendly 1-sentence summaryMessage outlining key items extracted (e.g., "Extracted 3 work experiences, Stanford education, and 14 technical skills.").`;

    const contents: any = [
      {
        inlineData: {
          mimeType: mimeType || 'application/pdf',
          data: cleanBase64,
        },
      },
      {
        text: prompt,
      },
    ];

    const response = await callWithGeminiFallback((ai, model) =>
      ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summaryMessage: {
                type: Type.STRING,
                description: 'Short friendly summary of what was extracted from the PDF.',
              },
              rawResumeText: {
                type: Type.STRING,
                description: 'Full, clean text/markdown representation of the entire resume content.',
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
                  activities: { type: Type.STRING },
                },
              },
            },
            required: ['summaryMessage', 'rawResumeText', 'updatedFields'],
          },
        },
      })
    );

    const resultText = response.text || '{}';
    const parsed = JSON.parse(resultText);

    res.json({
      success: true,
      summaryMessage: parsed.summaryMessage || 'Extracted resume data successfully from PDF.',
      rawResumeText: parsed.rawResumeText || '',
      updatedFields: parsed.updatedFields || {},
    });
  } catch (error: any) {
    console.error('Error in /api/parse-pdf:', error);
    res.status(500).json({
      error: 'Failed to extract resume from PDF with Gemini AI',
      details: error?.message || String(error),
    });
  }
});

// ==========================================
// API Endpoint 3: Full Job Description Resume Tailor
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

    const response = await callWithGeminiFallback((ai, model) =>
      ai.models.generateContent({
        model,
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

// ==========================================
// API Endpoint 4: Interview & Outreach Prep Generator
// ==========================================
app.post('/api/generate-prep', async (req, res) => {
  try {
    const { resumeText, targetRole, targetCompany } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || !resumeText.trim()) {
      return res.status(400).json({ error: 'Resume text is required to generate interview prep materials.' });
    }

    const roleTarget = targetRole ? `Target Role: ${targetRole}` : 'Target Role: Entry-Level / Internship / New Grad Position';
    const companyTarget = targetCompany ? `Target Company: ${targetCompany}` : 'General Tech / Corporate Hiring';

    const prompt = `You are a premier executive interview coach and career mentor for university students and early-career job seekers.
Analyze the candidate's resume below:

---
${resumeText.slice(0, 8000)}
---
Context:
${roleTarget}
${companyTarget}

Generate a comprehensive Interview & Outreach Prep Package:
1. 60-Second "Tell Me About Yourself" Pitch:
   - hook: 1-2 punchy opening sentences (spark of passion + background)
   - proofPoints: 2 distinct quantifiable accomplishments directly from their resume
   - pivot: 1-2 sentences tying back to why they are excited about this next step
   - fullScript: Complete natural conversational script (~120-160 words, speakable in 45-60 seconds, no robotic jargon)
   - estimatedSeconds: ~55
   - deliveryTips: 2-3 practical tips for cadence, body language, and pauses.

2. STAR Behavioral Story Bank:
   Extract 3 distinct standout experiences or projects from the resume and structure each using the STAR method:
   - title: Punchy title (e.g. "Student Portal Scalability", "User Research Overhaul")
   - contextRole: The exact company or project name
   - coreQuestion: The common behavioral interview question this story answers (e.g. "Tell me about a time you solved a complex technical bug under time pressure.")
   - situation: Clear context and constraint (1-2 sentences)
   - task: Specific challenge or goal assigned to the candidate
   - action: Concrete actions, technical tools, and problem-solving steps taken by the candidate
   - result: Quantifiable outcome or lesson learned
   - metricHighlight: Short badge string (e.g. "+35% speedup", "15 student interviews")
   - recruiterFollowUp: The tough follow-up drill-down question recruiters love to ask
   - followUpAnswerTip: Strategic advice on how to answer that follow-up confidently

3. High-Converting Recruiter & Alumni Outreach Pack:
   - linkedinNote: A connection note for LinkedIn strictly UNDER 280 characters (free LinkedIn limit is 300 chars)
   - hiringManagerEmail: { subject: string, body: string } - 3-4 sentence warm, high-converting direct outreach pitch
   - alumniCoffeeChat: { subject: string, body: string } - 3-4 sentence humble, polite note to school alumni asking for a 15-minute phone chat

4. 4 Recommended Interview Questions tailored specifically to their resume bullets:
   - Each with question, category ('Technical' | 'Project Deep-Dive' | 'Behavioral' | 'Culture & Motivation'), difficulty ('Warmup' | 'Technical' | 'Behavioral' | 'Curveball'), and whyRecruitersAsk.`;

    const response = await callWithGeminiFallback((ai, model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              elevatorPitch: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  proofPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  pivot: { type: Type.STRING },
                  fullScript: { type: Type.STRING },
                  estimatedSeconds: { type: Type.NUMBER },
                  deliveryTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ['hook', 'proofPoints', 'pivot', 'fullScript', 'estimatedSeconds', 'deliveryTips']
              },
              starStories: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    contextRole: { type: Type.STRING },
                    coreQuestion: { type: Type.STRING },
                    situation: { type: Type.STRING },
                    task: { type: Type.STRING },
                    action: { type: Type.STRING },
                    result: { type: Type.STRING },
                    metricHighlight: { type: Type.STRING },
                    recruiterFollowUp: { type: Type.STRING },
                    followUpAnswerTip: { type: Type.STRING }
                  },
                  required: ['title', 'contextRole', 'coreQuestion', 'situation', 'task', 'action', 'result', 'metricHighlight', 'recruiterFollowUp', 'followUpAnswerTip']
                }
              },
              outreachPack: {
                type: Type.OBJECT,
                properties: {
                  linkedinNote: { type: Type.STRING },
                  hiringManagerEmail: {
                    type: Type.OBJECT,
                    properties: {
                      subject: { type: Type.STRING },
                      body: { type: Type.STRING }
                    },
                    required: ['subject', 'body']
                  },
                  alumniCoffeeChat: {
                    type: Type.OBJECT,
                    properties: {
                      subject: { type: Type.STRING },
                      body: { type: Type.STRING }
                    },
                    required: ['subject', 'body']
                  }
                },
                required: ['linkedinNote', 'hiringManagerEmail', 'alumniCoffeeChat']
              },
              recommendedQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    category: { type: Type.STRING },
                    difficulty: { type: Type.STRING },
                    whyRecruitersAsk: { type: Type.STRING }
                  },
                  required: ['question', 'category', 'difficulty', 'whyRecruitersAsk']
                }
              }
            },
            required: ['elevatorPitch', 'starStories', 'outreachPack', 'recommendedQuestions']
          }
        }
      })
    );

    const resultText = response.text || '{}';
    const parsed = JSON.parse(resultText);

    res.json({
      success: true,
      data: parsed
    });
  } catch (error: any) {
    console.error('Error in /api/generate-prep:', error);
    res.status(500).json({
      error: 'Failed to generate interview prep with Gemini AI',
      details: error?.message || String(error)
    });
  }
});

// ==========================================
// API Endpoint 5: Mock Interview Answer Coaching Drill
// ==========================================
app.post('/api/practice-feedback', async (req, res) => {
  try {
    const { question, candidateAnswer, resumeContext } = req.body;

    if (!question || !candidateAnswer || typeof candidateAnswer !== 'string' || !candidateAnswer.trim()) {
      return res.status(400).json({ error: 'Both question and candidateAnswer are required.' });
    }

    const prompt = `You are an elite Tech/Business Interview Coach evaluating an early-career candidate's verbal response to an interview question.

Interview Question Asked:
"${question}"

Candidate's Answer:
"${candidateAnswer}"

${resumeContext ? `Candidate Resume Context:\n${resumeContext.slice(0, 3000)}` : ''}

Evaluate the response rigorously but constructively:
1. score: Integer between 1 and 10 based on clarity, structure (STAR), conciseness, and impact.
2. strengths: 2-3 specific positives about their answer.
3. areasToImprove: 2-3 specific constructive tips (e.g. pacing, filler words, missing metrics, rambling).
4. starAssessment:
   - situationCovered: boolean
   - taskCovered: boolean
   - actionCovered: boolean
   - resultCovered: boolean
   - note: 1 sentence assessing their STAR execution
5. proVersion: A rewritten, conversational, high-impact verbal version of their answer (~75-120 words) that sounds authentic and memorable.
6. coachSummary: 1 warm, motivational takeaway sentence.`;

    const response = await callWithGeminiFallback((ai, model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              areasToImprove: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              starAssessment: {
                type: Type.OBJECT,
                properties: {
                  situationCovered: { type: Type.BOOLEAN },
                  taskCovered: { type: Type.BOOLEAN },
                  actionCovered: { type: Type.BOOLEAN },
                  resultCovered: { type: Type.BOOLEAN },
                  note: { type: Type.STRING }
                },
                required: ['situationCovered', 'taskCovered', 'actionCovered', 'resultCovered', 'note']
              },
              proVersion: { type: Type.STRING },
              coachSummary: { type: Type.STRING }
            },
            required: ['score', 'strengths', 'areasToImprove', 'starAssessment', 'proVersion', 'coachSummary']
          }
        }
      })
    );

    const resultText = response.text || '{}';
    const parsed = JSON.parse(resultText);

    res.json({
      success: true,
      feedback: parsed
    });
  } catch (error: any) {
    console.error('Error in /api/practice-feedback:', error);
    res.status(500).json({
      error: 'Failed to analyze interview practice with Gemini AI',
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
