export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume-1.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume-2.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume-3.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
];

export const AIResponseFormat = `
interface Feedback {
  overallScore: number; // max 100
  ATS: {
    score: number;
    tips: { type: "good" | "improve"; tip: string }[];
  };
  toneAndStyle: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  content: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  structure: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  skills: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
}
`;

export const prepareInstructions = ({
                                        jobTitle,
                                        jobDescription,
                                        AIResponseFormat,
                                    }: {
    jobTitle: string;
    jobDescription: string;
    AIResponseFormat: string;
}) => `
You are an expert in ATS (Applicant Tracking System) and resume analysis.

Analyze the provided resume against the following job information:
- Job Title: ${jobTitle}
- Job Description: ${jobDescription}

Scoring Rules:
- Give a numeric score between 0 and 100 for each category.
- Be strict: if the resume is weak in an area, give it a low score.
- Provide actionable, clear tips for improvement in each category.

Required Output:
Return ONLY a valid ${AIResponseFormat} object (no backticks, no explanations, no extra text) in exactly this format:

{
  "toneAndStyle": { "score": number, "tips": ["short tip 1", "short tip 2"] },
  "content": { "score": number, "tips": ["short tip 1", "short tip 2"] },
  "structure": { "score": number, "tips": ["short tip 1", "short tip 2"] },
  "skills": { "score": number, "tips": ["short tip 1", "short tip 2"] },
  "ATS": { "score": number, "tips": ["short tip 1", "short tip 2"] },
  "overallScore": number
}

Notes:
- "score" must be a number (no strings, no percentages).
- "tips" must be an array of short, actionable improvement suggestions.
- "overallScore" must be the average of the five category scores (rounded to nearest whole number).
`;
