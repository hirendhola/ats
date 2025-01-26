import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  ChevronDown,
  type LucideIcon,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function transformApiResponse(apiString: string) {
  try {
    // Clean input more thoroughly
    const jsonString = apiString
      .replace(/^```json/gi, "") // Case-insensitive replacement
      .replace(/```/g, "")
      .trim();

    // Validate JSON structure
    if (!jsonString.startsWith("{") || !jsonString.endsWith("}")) {
      throw new Error(
        "Invalid JSON structure - missing opening/closing braces"
      );
    }

    const parsed = JSON.parse(jsonString);

    // Validate required fields
    if (!parsed.analysis || !parsed.feedbackCalibration) {
      throw new Error(
        "Invalid API response structure - missing required fields"
      );
    }

    // Recursive string processing for nested objects

    const processStrings = (obj: any): any => {
      if (typeof obj === "string") {
        return obj.replace(/\\"/g, '"');
      }
      if (Array.isArray(obj)) {
        return obj.map(processStrings);
      }
      if (obj && typeof obj === "object") {
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [
            key,
            processStrings(value),
          ])
        );
      }
      return obj;
    };

    return {
      resumeData: { analysis: processStrings(parsed.analysis) },
      feedbackCalibration: processStrings(parsed.feedbackCalibration),
    };
  } catch (error) {
    console.error("API Response Transformation Error:", error);
    throw new Error(
      "Failed to process resume analysis. Please ensure the input is valid JSON."
    );
  }
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ResumeAnalysis() {
  const [activeSection, setActiveSection] = useState("personal");
  const [resumeData, setResumeData] = useState<any>();
  const [feedbackCalibration, setFeedbackCalibration] = useState<any>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const loadData = async () => {
      try {
        const apiResponse = localStorage.getItem("resumeAnalysis");
        if (!apiResponse) {
          throw new Error("No analysis data found in storage");
        }

        const { resumeData, feedbackCalibration } =
          transformApiResponse(apiResponse);
        setResumeData(resumeData);
        setFeedbackCalibration(feedbackCalibration);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load analysis data"
        );
      }
    };

    loadData();
  }, []);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? "" : section);
  };

  const accordionVariants = {
    open: {
      height: "auto",
      opacity: 1,
      marginTop: 16,
      transition: {
        height: {
          duration: 0.8,
          ease: [0.04, 0.62, 0.23, 0.98],
        },
        opacity: { duration: 0.25, delay: 0.05 },
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      transition: {
        height: {
          duration: 0.8,
          ease: [0.04, 0.62, 0.23, 0.98],
        },
        opacity: { duration: 0.8 },
        marginTop: { duration: 0.8 },
      },
    },
  };

  const contentVariants = {
    open: {
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    closed: {
      y: -8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const chevronVariants = {
    open: { rotate: 180, transition: { duration: 0.2 } },
    closed: { rotate: 0, transition: { duration: 0.2 } },
  };

  const AccordionSection = ({
    section,
    title,
    icon: Icon,
    children,
  }: {
    section: string;
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
  }) => (
    <div className="mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full p-4 bg-gray-100 rounded-lg text-left font-semibold text-gray-800 hover:bg-gray-200 transition-colors duration-200"
      >
        <span className="flex items-center">
          <Icon className="mr-2" /> {title}
        </span>
        <motion.div
          variants={chevronVariants}
          animate={activeSection === section ? "open" : "closed"}
        >
          <ChevronDown />
        </motion.div>
      </button>
      <motion.div
        initial="closed"
        animate={activeSection === section ? "open" : "closed"}
        variants={accordionVariants}
        className="overflow-hidden"
      >
        <motion.div
          variants={contentVariants}
          className="bg-gray-50 rounded-lg p-4"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 p-8 rounded-lg max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Analysis
          </h2>
          <p className="mt-4 text-gray-600">
            Please try uploading your resume again or contact support.
          </p>
        </div>
      </div>
    );
  }
  if (!resumeData || !feedbackCalibration) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-300 rounded w-64"></div>
          <div className="h-4 bg-gray-300 rounded w-48"></div>
          <div className="h-4 bg-gray-300 rounded w-56"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 to-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Resume Analysis Results
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <AccordionSection
              section="personal"
              title="Personal Information"
              icon={User}
            >
              {Object.entries(resumeData.analysis.personal_information).map(
                ([key, value]) => (
                  <p key={key} className="mb-2">
                    <strong>
                      {key.replace(/_/g, " ").charAt(0).toUpperCase() +
                        key.slice(1)}
                      :
                    </strong>{" "}
                    {value && typeof value === "object"
                      ? Object.entries(value).map(([k, v]) => (
                          <span key={k} className="block ml-4">
                            <strong>{k}:</strong> {String(v)}
                          </span>
                        ))
                      : String(value) || "Not provided"}
                  </p>
                )
              )}
            </AccordionSection>

            <AccordionSection
              section="experience"
              title="Experience"
              icon={Briefcase}
            >
              <div className="space-y-4">
                {resumeData.analysis.experience.map(
                  //@ts-ignore
                  (exp, index) => (
                    <div key={index}>
                      <h4 className="font-semibold">
                        {exp.role} at {exp.company}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {exp.duration.start || "Start date not provided"} -{" "}
                        {exp.duration.end || "Present"}
                      </p>
                      <ul className="mt-2 list-disc list-inside">
                        {exp.achievements.map(
                          (
                            achievement:
                              | string
                              | number
                              | boolean
                              | ReactElement<
                                  any,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | ReactPortal
                              | null
                              | undefined,
                            i: Key | null | undefined
                          ) => (
                            <li key={i}>{achievement}</li>
                          )
                        )}
                      </ul>
                      <div className="mt-2">
                        <strong>Technologies:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {exp.technologies.map(
                            //@ts-ignore

                            (tech, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              >
                                {tech}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </AccordionSection>

            <AccordionSection
              section="education"
              title="Education"
              icon={GraduationCap}
            >
              {resumeData.analysis.education.map(
                //@ts-ignore

                (edu, index) => (
                  <div key={index}>
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <p>
                      {edu.institution}, {edu.year || "Year not provided"}
                    </p>
                    <p>Relevance: {edu.relevance}/10</p>
                  </div>
                )
              )}
            </AccordionSection>

            <h3 className="text-xl font-semibold mb-4">Detailed Feedback</h3>
            <AccordionSection
              section="strengths"
              title="Strengths"
              icon={CheckCircle}
            >
              <ul className="list-disc list-inside">
                {resumeData.analysis.ats_scoring.detailed_feedback.strengths.map(
                  //@ts-ignore
                  (strength, index) => (
                    <li key={index}>{strength}</li>
                  )
                )}
              </ul>
            </AccordionSection>
            <AccordionSection
              section="improvements"
              title="Improvements"
              icon={Zap}
            >
              <ul className="list-disc list-inside">
                {resumeData.analysis.ats_scoring.detailed_feedback.improvements.map(
                  //@ts-ignore
                  (improvement, index) => (
                    <li key={index}>{improvement}</li>
                  )
                )}
              </ul>
            </AccordionSection>
            <AccordionSection
              section="critical_missing"
              title="Critical Missing Elements"
              icon={AlertTriangle}
            >
              <ul className="list-disc list-inside">
                {resumeData.analysis.ats_scoring.detailed_feedback.critical_missing.map(
                  //@ts-ignore
                  (missing, index) => (
                    <li key={index}>{missing}</li>
                  )
                )}
              </ul>
            </AccordionSection>
          </div>

          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="mr-2" /> Skills
              </h3>
              {Object.entries(resumeData.analysis.skills).map(
                ([category, skills]) => (
                  <div key={category} className="mb-4">
                    <h4 className="font-medium mb-2 capitalize">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(skills) &&
                        skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                )
              )}
            </div>

            {resumeData.analysis.ats_scoring && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">ATS Score</h3>
                <div className="relative">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Score",
                            value: resumeData.analysis.ats_scoring.total_score,
                          },
                          {
                            name: "Remaining",
                            value:
                              100 - resumeData.analysis.ats_scoring.total_score,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[0, 1].map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-3xl font-bold">
                      {resumeData.analysis.ats_scoring.total_score}%
                    </p>
                    <p className="text-sm text-gray-600">ATS Score</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Section Scores</h4>
                  <ul>
                    {Object.entries(
                      resumeData.analysis.ats_scoring.section_scores
                    ).map(([key, value]) => (
                      <li
                        key={key}
                        className="flex justify-between items-center mb-2"
                      >
                        <span className="capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="font-semibold">{String(value)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Feedback Calibration</h3>
          <p className="mb-4">
            <strong>Score Range:</strong> {feedbackCalibration.scoreRange}
          </p>

          <AccordionSection
            section="top_elements"
            title="Top 3 Strongest Elements"
            icon={Award}
          >
            <ol className="list-decimal list-inside">
              {feedbackCalibration.topStrongestElements.map(
                //@ts-ignore
                (element, index) => (
                  <li key={index}>{element}</li>
                )
              )}
            </ol>
          </AccordionSection>

          <AccordionSection
            section="improvement_areas"
            title="Specific Improvement Areas"
            icon={Zap}
          >
            <ul className="list-disc list-inside">
              {feedbackCalibration.specificImprovementAreas.map(
                //@ts-ignore
                (area, index) => (
                  <li key={index}>{area}</li>
                )
              )}
            </ul>
          </AccordionSection>

          <AccordionSection
            section="industry_recommendations"
            title="Industry-Specific Recommendations"
            icon={Briefcase}
          >
            <ul className="list-disc list-inside">
              {feedbackCalibration.industrySpecificRecommendations.map(
                //@ts-ignore
                (rec, index) => (
                  <li key={index}>{rec}</li>
                )
              )}
            </ul>
          </AccordionSection>

          <AccordionSection
            section="keyword_optimization"
            title="Keyword Optimization Suggestions"
            icon={CheckCircle}
          >
            <ul className="list-disc list-inside">
              {feedbackCalibration.keywordOptimizationSuggestions.map(
                //@ts-ignore
                (suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                )
              )}
            </ul>
          </AccordionSection>

          <AccordionSection
            section="technical_depth"
            title="Technical Depth Enhancement Tips"
            icon={GraduationCap}
          >
            <ul className="list-disc list-inside">
              {feedbackCalibration.technicalDepthEnhancementTips.map(
                //@ts-ignore
                (tip, index) => (
                  <li key={index}>{tip}</li>
                )
              )}
            </ul>
          </AccordionSection>
        </div>

        <button className="mt-8 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300">
          Download Full Report
        </button>
      </motion.div>
    </div>
  );
}
