import { BrowserRouter } from "react-router-dom";

import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
} from "./components";
import { useEffect } from "react";
import { config } from "./constants/config";
import { ThemeProvider } from "./context/ThemeContext";
import CursorGlow from "./components/layout/CursorGlow";
import BackToTop from "./components/layout/BackToTop";
import GameModal from "./components/layout/GameModal";

const App = () => {
  useEffect(() => {
    if (document.title !== config.html.title) {
      document.title = config.html.title;
    }
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="bg-primary relative z-0 transition-colors duration-300">
          <CursorGlow />
          <BackToTop />
          <GameModal />
          <div>
            <Navbar />
            <Hero />
          </div>
          <About />
          <Experience />
          <Tech />
          <Works />
          <Feedbacks />
          <div className="relative z-0">
            <Contact />
            <StarsCanvas />
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
