// "use client";

// import { useState } from "react";
// import {
//   Container,
//   Grid,
//   Box,
//   Typography,
//   Tab,
//   Tabs,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import { GeneratorForm } from "../components/GeneratorForm";
// import { SavedItems } from "../components/SavedItems";
// import { HeroSection } from "../components/HeroSection";
// import { TabPanel } from "../components/TabPanel";

// export default function Home() {
//   const [activeTab, setActiveTab] = useState(0);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setActiveTab(newValue);
//   };

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
//       <HeroSection />

//       <Container maxWidth="xl" sx={{ py: 4 }}>
//         <Box sx={{ width: "100%" }}>
//           <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
//             <Tabs
//               value={activeTab}
//               onChange={handleTabChange}
//               aria-label="content generator tabs"
//               variant={isMobile ? "fullWidth" : "standard"}
//               centered={!isMobile}
//               sx={{
//                 "& .MuiTab-root": {
//                   textTransform: "none",
//                   fontSize: "1rem",
//                   fontWeight: 500,
//                 },
//               }}
//             >
//               <Tab label="Generate Content" />
//               <Tab label="Saved Items" />
//             </Tabs>
//           </Box>

//           <TabPanel value={activeTab} index={0}>
//             <GeneratorForm />
//           </TabPanel>

//           <TabPanel value={activeTab} index={1}>
//             <SavedItems />
//           </TabPanel>
//         </Box>
//       </Container>
//     </Box>
//   );
// }
"use client";

import { useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
} from "@mui/material";
import { GeneratorForm } from "../components/GeneratorForm";
import { SavedItems } from "../components/SavedItems";
import { HeroSection } from "../components/HeroSection";
import { TabPanel } from "../components/TabPanel";

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleGetStarted = () => {
    setShowContent(true);
    setActiveTab(0); // Switch to Generate Content tab

    // Smooth scroll to content after a brief delay
    setTimeout(() => {
      const element = document.querySelector("#generator-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <HeroSection onGetStarted={handleGetStarted} />

      {/* Only show content sections after Get Started is clicked */}
      {showContent && (
        <Fade in={showContent} timeout={800}>
          <Container id="generator-section" maxWidth="xl" sx={{ py: 4 }}>
            <Slide direction="up" in={showContent} timeout={600}>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="content generator tabs"
                    variant={isMobile ? "fullWidth" : "standard"}
                    centered={!isMobile}
                    sx={{
                      "& .MuiTab-root": {
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 500,
                      },
                    }}
                  >
                    <Tab label="Generate Content" />
                    <Tab label="Saved Items" />
                  </Tabs>
                </Box>

                <TabPanel value={activeTab} index={0}>
                  <GeneratorForm />
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                  <SavedItems />
                </TabPanel>
              </Box>
            </Slide>
          </Container>
        </Fade>
      )}
    </Box>
  );
}
