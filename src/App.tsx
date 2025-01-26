import "./App.css";
import { LandingPage } from "./pages/LandingPage";
import { ResumeUpload } from "./pages/ResumeUpload";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/upload",
    element: <ResumeUpload />,
  },
  {
    path: "/analysis",
    element: <ResumeAnalysis />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
