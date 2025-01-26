/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiFile, FiX, FiAlertCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { theme } from "@/theme/theme";
// import { analyzeResumeWithOpenAI } from "@/api/openai";
import { analyzeResumeWithGemini } from "@/api/gemini";
import { useNavigate } from "react-router";
import axios from "axios";
interface AnalysisResult {
  content: string;
  error?: string;
}

export const ResumeUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    handleUpload(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
  });

  const handleUpload = async (file: File) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      console.log(import.meta.env.BACKEND_URL);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to upload the file");
      }

      const fileContent = response.data;

      // console.log("File Content:", fileContent);
      const maxAttempts = 1;

      let attempts = 0;

      while (attempts < maxAttempts) {
        try {
          const analysis = await analyzeResumeWithGemini(fileContent);
          if (analysis) {
            console.log("Analysis result:", analysis);
            localStorage.setItem("resumeAnalysis", analysis);
            navigate("/analysis");
          }

          attempts++;
          if (attempts === maxAttempts) {
            throw new Error(
              "Failed to get valid response after multiple attempts"
            );
          }

          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, attempts))
          );
        } catch (apiError: any) {
          if (attempts === maxAttempts - 1) {
            throw apiError;
          }
          attempts++;
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, attempts))
          );
        }
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setError(
        error?.message ||
          "Failed to analyze resume. Please try again in a moment."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center p-4"
      style={{ fontFamily: theme.fonts.body }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
      >
        <h2
          className="text-3xl font-bold mb-6 text-center text-text"
          style={{ fontFamily: theme.fonts.heading }}
        >
          Upload Your Resume
        </h2>

        {!analysisResult && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-textLight hover:border-primary"
            }`}
          >
            <input {...getInputProps()} />
            <FiUpload size={48} className="mx-auto mb-4 text-primary" />
            <p className="text-xl text-textLight">
              {isDragActive ? (
                <span className="text-primary">Drop your resume here</span>
              ) : (
                "Drag & drop your resume here, or click to select"
              )}
            </p>
            <p className="text-sm text-textLight mt-2">
              Supported formats: PDF, DOC, DOCX
            </p>
          </div>
        )}

        <AnimatePresence>
          {file && !isAnalyzing && !analysisResult && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 p-4 bg-background rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center">
                <FiFile size={24} className="text-primary mr-3" />
                <span className="text-text font-medium">{file.name}</span>
              </div>
              <button
                onClick={resetUpload}
                className="text-error hover:text-error/80 transition-colors duration-300"
                aria-label="Remove file"
              >
                <FiX size={24} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <div className="animate-pulse text-primary">
              <p className="text-lg font-medium">Analyzing your resume...</p>
              <p className="text-sm text-textLight mt-2">
                This may take a few moments
              </p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-error/10 text-error rounded-lg flex items-center"
          >
            <FiAlertCircle className="mr-3" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        {/* {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className="p-4 bg-success/10 text-success rounded-lg flex items-center mb-4">
              <FiCheckCircle className="mr-3" />
              <span className="font-medium">
                Analysis completed successfully!
              </span>
            </div>
            <div className="bg-background rounded-lg p-4">
              <h3 className="font-bold mb-2">Analysis Results:</h3>
              <p className="text-textLight whitespace-pre-wrap">
                {analysisResult.content}
              </p>
            </div>
            <Button
              className="mt-4 w-full"
              onClick={resetUpload}
              variant="outline"
            >
              Analyze Another Resume
            </Button>
          </motion.div>
        )} */}

        {!analysisResult && (
          <Button
            className="mt-8 w-full"
            disabled={!file || isAnalyzing}
            onClick={() => file && handleUpload(file)}
          >
            {isAnalyzing
              ? "Analyzing..."
              : file
              ? "Analyze Resume"
              : "Upload Resume"}
          </Button>
        )}
      </motion.div>
    </div>
  );
};
