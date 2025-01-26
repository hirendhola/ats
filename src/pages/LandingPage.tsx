import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Search, BarChart } from "lucide-react";
import { useNavigate } from "react-router";

export const LandingPage: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const navigate = useNavigate();

  const features = [
    {
      title: "Upload Resume",
      icon: Upload,
      description: "Easily submit your resume for analysis",
    },
    {
      title: "Job Matching",
      icon: Search,
      description: "Find the perfect job opportunities",
    },
    {
      title: "ATS Optimization",
      icon: BarChart,
      description: "Improve your resume's ATS score",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <header className="bg-navy-blue text-white py-4 p-6">
        <div className="container mx-auto px-4 flex justify-between items-center gap-8">
          <h1 className="text-2xl font-bold font-montserrat ">ATS</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-accent transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-accent transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="p-6">
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-0 sm:gap-16">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-6 leading-tight">
                Optimize Your Resume for ATS Success
              </h2>
              <p className="text-xl mb-8 text-gray-600 font-open-sans">
                Increase your chances of landing your dream job with our
                advanced ATS optimization tools.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/upload")}
                className="bg-accent text-black font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-accent-dark transition-colors duration-300"
              >
                Get Started
              </motion.button>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://cdn.shopify.com/s/files/1/0729/2652/7804/files/Ins-1-logo.png?height=400&pad_color=ffffff&v=1689142369&width=600"
                alt="ATS Optimization Illustration"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </section>

        <section className="py-20" id="features">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold font-montserrat text-center mb-12">
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 m-5">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 items-center"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(0)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <feature.icon
                    className="text-accent mb-4 w-12 h-12"
                    color="black"
                  />
                  <h4 className="text-xl font-bold font-montserrat mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 font-open-sans">
                    {feature.description}
                  </p>
                  {hoveredFeature === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 text-black text-accent font-semibold"
                    >
                      Learn More →
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-navy-blue text-white" id="pricing">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold font-montserrat mb-6">
              Ready to Optimize Your Resume?
            </h3>
            <p className="text-xl mb-8 font-open-sans">
              Join thousands of job seekers who have improved their chances with
              ATS Pro.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/upload")}
              className="bg-accent text-black font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-accent-dark transition-colors duration-300"
            >
              Start Free Trial
            </motion.button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 font-open-sans mb-4 md:mb-0">
            © 2024 ATS Pro. All rights reserved.
          </p>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-accent transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-accent transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-accent transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
};
