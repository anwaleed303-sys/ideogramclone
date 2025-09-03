import { ThemeOptions } from "@mui/material";

const commonTheme = {
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 500 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none" as const, // ✅ Fix
          fontWeight: 500,
          borderRadius: 8,
          padding: "8px 24px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
};

export const lightTheme: ThemeOptions = {
  ...commonTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#667eea",
      light: "#8fa4f3",
      dark: "#4c63d2",
    },
    secondary: {
      main: "#764ba2",
      light: "#9575cd",
      dark: "#512da8",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
};

export const darkTheme: ThemeOptions = {
  ...commonTheme,
  palette: {
    mode: "dark",
    primary: {
      main: "#8fa4f3",
      light: "#b3c6f6",
      dark: "#667eea",
    },
    secondary: {
      main: "#9575cd",
      light: "#b39ddb",
      dark: "#764ba2",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
    },
  },
};
