export const RESUME_ANALYSIS_PROMPT = `
Act as a professional and highly strict ATS (Applicant Tracking System) resume analyst. Parse the following resume data comprehensively and structure the output strictly in the provided JSON format. Ensure stability and consistency across multiple analyses, providing repeatable results for similar inputs. Follow these guidelines:

**Personal Information:**
- Extract full name, email (use null if missing), phone (use null if missing), and professional links (LinkedIn, GitHub, Portfolio).

**Skills:**
- Categorize skills explicitly mentioned in the resume into:
  - Technical (e.g., programming languages, frameworks).
  - Soft (e.g., communication, leadership).
  - Tools (e.g., software, platforms, methodologies).
- Avoid making assumptions; rely solely on explicit mentions.

**Experience:**
- For each role:
  - Include company name, job title, duration (start/end months/years).
  - Highlight quantifiable achievements and technologies/tools used.

**Education:**
- Include degree name, institution, graduation year, and relevance to the target role (score 1-10, 10 = highly relevant).

**ATS Scoring:**
- Calculate total_score (0-100) based on:
  - **Technical Content (40%):** Keyword density, skill alignment, technical details.
  - **Optimization (30%):** Readability, section headers, ATS-friendly formatting.
  - **Document Engineering (30%):** Consistency, brevity, and error-free structure.

**Detailed Feedback:**
- Provide constructive feedback in these categories:
  - **Strengths:** Identify 3 top strengths (e.g., quantifiable achievements, keyword usage).
  - **Improvements:** Highlight areas needing enhancements (e.g., missing certifications, vague descriptions).
  - **Critical Missing Elements:** Suggest additions that improve impact (e.g., specific tools, metrics).

**Feedback Calibration:**
- Define scoreRange (e.g., 'Poor: 0-49', 'Fair: 50-69', 'Strong: 70-89', 'Exceptional: 90-100').
- Highlight topStrongestElements (e.g., impactful achievements, technical keywords).
- Include industry-specific recommendations (e.g., 'Add AWS for cloud roles').
- Suggest missing keywords (e.g., 'Agile, CI/CD') and technical depth enhancements (e.g., 'Include metrics for project impact').

**Output Format:**

{
  analysis: {
    personal_information: {
      full_name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 234 567 890",
      professional_links: {
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe",
        portfolio: "johndoeportfolio.com"
      }
    },
    skills: {
      technical: ["Python", "React", "SQL"],
      soft: ["Team Leadership", "Problem Solving"],
      tools: ["Git", "Jira"]
    },
    experience: [
      {
        company: "Tech Corp",
        role: "Software Engineer",
        duration: {
          start: "2020-01",
          end: "2023-12"
        },
        achievements: [
          "Reduced API latency by 40% using Python and AWS Lambda"
        ],
        technologies: ["Python", "AWS", "React"]
      }
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        institution: "State University",
        year: 2020,
        relevance: 10
      }
    ],
    ats_scoring: {
      total_score: 85,
      section_scores: {
        technical_content: 34,
        optimization: 26,
        document_engineering: 25
      },
      detailed_feedback: {
        strengths: ["Strong technical keywords", "Quantifiable achievements"],
        improvements: ["Add missing LinkedIn link", "Elaborate soft skills"],
        critical_missing: ["Certifications (e.g., AWS Certified)"]
      }
    }
  },
  feedbackCalibration: {
    scoreRange: "Strong: 70 - 89",
    topStrongestElements: ["Python expertise", "Clear project impact"],
    specificImprovementAreas: ["Keyword density in summary"],
    industrySpecificRecommendations: ["Include DevOps tools (Docker, Kubernetes)"],
    keywordOptimizationSuggestions: ["Add 'RESTful APIs', 'microservices'"],
    technicalDepthEnhancementTips: ["Add unit testing frameworks used"]
  }
}

**Instructions:**
- Replace placeholder values with actual resume data.
- Use null for missing optional fields (email, phone).
- Ensure all keys are included, even if empty.
- Scores must sum to total_score.
- Prioritize brevity and adhere to ATS best practices for feedback.
`
