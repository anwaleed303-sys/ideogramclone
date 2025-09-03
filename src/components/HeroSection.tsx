// "use client";

// import React from "react";
// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   Stack,
//   useTheme,
//   useMediaQuery,
//   keyframes,
// } from "@mui/material";
// import {
//   AutoAwesome,
//   Create,
//   Image,
//   Psychology,
//   Brush,
//   Code,
// } from "@mui/icons-material";

// // Keyframes for animations
// const moveRightToLeft = keyframes`
//   0% {
//     transform: translateX(100vw);
//   }
//   100% {
//     transform: translateX(-100%);
//   }
// `;

// const moveLeftToRight = keyframes`
//   0% {
//     transform: translateX(-100vw);
//   }
//   100% {
//     transform: translateX(100%);
//   }
// `;

// const floatDot = keyframes`
//   0% {
//     transform: translateY(-10px);
//     opacity: 0;
//   }
//   50% {
//     opacity: 1;
//   }
//   100% {
//     transform: translateY(100vh);
//     opacity: 0;
//   }
// `;

// const pulse = keyframes`
//   0%, 100% {
//     opacity: 0.6;
//   }
//   50% {
//     opacity: 1;
//   }
// `;

// interface HeroSectionProps {
//   onGetStarted?: () => void;
// }

// export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   const scrollToGenerator = () => {
//     if (onGetStarted) {
//       onGetStarted();
//     }
//     const element = document.querySelector("#generator-section");
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   // Carousel items
//   const carouselItems = [
//     { icon: <Create />, text: "Generate Posts", color: "#667eea" },
//     { icon: <Image />, text: "AI Images", color: "#f093fb" },
//     { icon: <Psychology />, text: "Smart Templates", color: "#4facfe" },
//     { icon: <Brush />, text: "Creative Content", color: "#43e97b" },
//     { icon: <Code />, text: "Code Generation", color: "#fa709a" },
//     { icon: <AutoAwesome />, text: "AI Magic", color: "#ffecd2" },
//   ];

//   // Floating dots
//   const generateFloatingDots = () => {
//     return Array.from({ length: 20 }, (_, i) => (
//       <Box
//         key={i}
//         sx={{
//           position: "absolute",
//           left: `${Math.random() * 100}%`,
//           width: "4px",
//           height: "4px",
//           backgroundColor: theme.palette.primary.main,
//           borderRadius: "50%",
//           animation: `${floatDot} ${3 + Math.random() * 4}s linear infinite`,
//           animationDelay: `${Math.random() * 5}s`,
//           opacity: 0.7,
//         }}
//       />
//     ));
//   };

//   // Carousel component
//   const Carousel = ({
//     direction,
//     delay,
//   }: {
//     direction: "left" | "right";
//     delay?: string;
//   }) => (
//     <Box
//       sx={{
//         width: "100%",
//         overflow: "hidden",
//         py: 2,
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           gap: 4,
//           animation: `${
//             direction === "left" ? moveRightToLeft : moveLeftToRight
//           } 20s linear infinite`,
//           animationDelay: delay || "0s",
//           whiteSpace: "nowrap",
//         }}
//       >
//         {[
//           ...(direction === "left"
//             ? carouselItems
//             : carouselItems.slice().reverse()),
//           ...(direction === "left"
//             ? carouselItems
//             : carouselItems.slice().reverse()),
//         ].map((item, index) => (
//           <Box
//             key={index}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               px: 3,
//               py: 1,
//               borderRadius: 3,
//               minWidth: "150px",
//             }}
//           >
//             <Box sx={{ color: theme.palette.primary.main }}>{item.icon}</Box>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: theme.palette.primary.main,
//                 fontWeight: 600,
//                 fontSize: "0.9rem",
//               }}
//             >
//               {item.text}
//             </Typography>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );

//   return (
//     <Box
//       sx={{
//         background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
//         py: { xs: 8, md: 12 },
//         position: "relative",
//         overflow: "hidden",
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         flexDirection: "column",
//         justifyContent: "center",
//       }}
//     >
//       {/* Background decoration */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           opacity: 0.1,
//           background:
//             "radial-gradient(circle at 30% 20%, #667eea 0%, transparent 70%)",
//         }}
//       />

//       {/* Floating AI Dots */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           pointerEvents: "none",
//           zIndex: 1,
//         }}
//       >
//         {generateFloatingDots()}
//       </Box>

//       <Container maxWidth="lg" sx={{ position: "relative", zIndex: 3 }}>
//         {/* Carousel on top */}
//         <Carousel direction="left" />

//         <Box
//           sx={{
//             textAlign: "center",
//             maxWidth: "800px",
//             mx: "auto",
//             mt: 4,
//           }}
//         >
//           {/* Title */}
//           <Typography
//             variant={isMobile ? "h3" : "h1"}
//             component="h1"
//             sx={{
//               fontWeight: 700,
//               mb: 3,
//               background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//               backgroundClip: "text",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               lineHeight: 1.2,
//               textAlign: "center",
//               fontSize: { xs: "1.8rem", md: "2.7rem" },
//               animation: `${pulse} 3s ease-in-out infinite`,
//             }}
//           >
//             AI-Powered Content Generator ✨
//           </Typography>

//           <Typography
//             variant="h5"
//             component="h2"
//             sx={{
//               color: "text.secondary",
//               mb: 4,
//               fontWeight: 400,
//               lineHeight: 1.4,
//               fontSize: { xs: "1.2rem", md: "1.5rem" },
//               textAlign: "center",
//             }}
//           >
//             Experience the future of content creation with AI
//           </Typography>

//           <Stack
//             direction={{ xs: "column", sm: "row" }}
//             spacing={2}
//             justifyContent="center"
//             alignItems="center"
//             sx={{ mb: 4 }}
//           >
//             <Button
//               variant="contained"
//               size="large"
//               startIcon={<AutoAwesome />}
//               onClick={scrollToGenerator}
//               sx={{
//                 py: 1.5,
//                 px: 4,
//                 fontSize: "1.1rem",
//                 background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//                 "&:hover": {
//                   background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
//                   transform: "translateY(-2px)",
//                   boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
//                 },
//                 transition: "all 0.3s ease",
//                 boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
//               }}
//             >
//               Get Started
//             </Button>
//           </Stack>
//           {/* Features */}
//           <Stack
//             direction={{ xs: "column", md: "row" }}
//             spacing={3}
//             justifyContent="center"
//             alignItems="stretch"
//             sx={{ maxWidth: "600px", mx: "auto", mt: 4 }}
//           >
//             {[
//               {
//                 icon: <Create />,
//                 title: "Generate Posts",
//                 description: "Create engaging social media posts with AI",
//               },
//               {
//                 icon: <Psychology />,
//                 title: "Custom Templates",
//                 description: "Build reusable templates for your need content",
//               },
//               {
//                 icon: <Image />,
//                 title: "AI Images",
//                 description: "Generate stunning images from text prompts",
//               },
//             ].map((feature, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   p: 4,
//                   background: "background.paper",
//                   borderRadius: 2,
//                   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
//                   minWidth: 260,
//                   minHeight: 260,
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   textAlign: "center",
//                   flex: 1,
//                   transition: "transform 0.3s ease",
//                   "&:hover": {
//                     transform: "translateY(-4px)",
//                   },
//                 }}
//               >
//                 <Box
//                   sx={{
//                     color: "primary.main",
//                     mb: 2,
//                     "& svg": {
//                       fontSize: 32,
//                     },
//                   }}
//                 >
//                   {feature.icon}
//                 </Box>
//                 <Typography
//                   variant="h6"
//                   sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}
//                 >
//                   {feature.title}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {feature.description}
//                 </Typography>
//               </Box>
//             ))}
//           </Stack>
//           {/* Carousel below Get Started button */}
//           <Carousel direction="right" delay="3s" />
//         </Box>
//       </Container>
//     </Box>
//   );
// };

"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  keyframes,
} from "@mui/material";
import {
  AutoAwesome,
  Create,
  Image,
  Psychology,
  Brush,
  Code,
} from "@mui/icons-material";

// Keyframes for animations
const moveRightToLeft = keyframes`
  0% {
    transform: translateX(100vw);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const moveLeftToRight = keyframes`
  0% {
    transform: translateX(-100vw);
  }
  100% {
    transform: translateX(100%);
  }
`;

const floatDot = keyframes`
  0% {
    transform: translateY(-10px);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
`;

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const scrollToGenerator = () => {
    if (onGetStarted) {
      onGetStarted();
    }
    const element = document.querySelector("#generator-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Seeded random function for consistent server/client rendering
  const seededRandom = (seed: number) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Carousel items
  const carouselItems = [
    { icon: <Create />, text: "Generate Posts", color: "#667eea" },
    { icon: <Image />, text: "AI Images", color: "#f093fb" },
    { icon: <Psychology />, text: "Smart Templates", color: "#4facfe" },
    { icon: <Brush />, text: "Creative Content", color: "#43e97b" },
    { icon: <Code />, text: "Code Generation", color: "#fa709a" },
    { icon: <AutoAwesome />, text: "AI Magic", color: "#ffecd2" },
  ];

  // Floating dots with consistent positioning
  const generateFloatingDots = () => {
    const seed = 12345; // Fixed seed for consistency
    return Array.from({ length: 20 }, (_, i) => (
      <Box
        key={i}
        sx={{
          position: "absolute",
          left: `${seededRandom(seed + i * 3) * 100}%`,
          width: "4px",
          height: "4px",
          backgroundColor: theme.palette.primary.main,
          borderRadius: "50%",
          animation: `${floatDot} ${
            3 + seededRandom(seed + i * 3 + 1) * 4
          }s linear infinite`,
          animationDelay: `${seededRandom(seed + i * 3 + 2) * 5}s`,
          opacity: 0.7,
        }}
      />
    ));
  };

  // Carousel component
  const Carousel = ({
    direction,
    delay,
  }: {
    direction: "left" | "right";
    delay?: string;
  }) => (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        py: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 4,
          animation: `${
            direction === "left" ? moveRightToLeft : moveLeftToRight
          } 20s linear infinite`,
          animationDelay: delay || "0s",
          whiteSpace: "nowrap",
        }}
      >
        {[
          ...(direction === "left"
            ? carouselItems
            : carouselItems.slice().reverse()),
          ...(direction === "left"
            ? carouselItems
            : carouselItems.slice().reverse()),
        ].map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 3,
              py: 1,
              borderRadius: 3,
              minWidth: "150px",
            }}
          >
            <Box sx={{ color: theme.palette.primary.main }}>{item.icon}</Box>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              {item.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background:
            "radial-gradient(circle at 30% 20%, #667eea 0%, transparent 70%)",
        }}
      />

      {/* Floating AI Dots */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {generateFloatingDots()}
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 3 }}>
        {/* Carousel on top */}
        <Carousel direction="left" />

        <Box
          sx={{
            textAlign: "center",
            maxWidth: "800px",
            mx: "auto",
            mt: 4,
          }}
        >
          {/* Title */}
          <Typography
            variant={isMobile ? "h3" : "h1"}
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
              textAlign: "center",
              fontSize: { xs: "1.8rem", md: "2.7rem" },
              animation: `${pulse} 3s ease-in-out infinite`,
            }}
          >
            AI-Powered Content Generator ✨
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            sx={{
              color: "text.secondary",
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.4,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              textAlign: "center",
            }}
          >
            Experience the future of content creation with AI
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<AutoAwesome />}
              onClick={scrollToGenerator}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: "1.1rem",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                },
                transition: "all 0.3s ease",

                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              }}
            >
              Get Started
            </Button>
          </Stack>
          {/* Features */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="stretch"
            sx={{ maxWidth: "600px", mx: "auto", mt: 4 }}
          >
            {[
              {
                icon: <Create />,
                title: "Generate Posts",
                description: "Create engaging social media posts with AI",
              },
              {
                icon: <Psychology />,
                title: "Custom Templates",
                description: "Build reusable templates for your need content",
              },
              {
                icon: <Image />,
                title: "AI Images",
                description: "Generate stunning images from text prompts",
              },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  p: 4,
                  background: "background.paper",
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  minWidth: 260,
                  minHeight: 260,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  flex: 1,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box
                  sx={{
                    color: "primary.main",
                    mb: 2,
                    "& svg": {
                      fontSize: 32,
                    },
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}
                >
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Stack>
          {/* Carousel below Get Started button */}
          <Carousel direction="right" delay="3s" />
        </Box>
      </Container>
    </Box>
  );
};
