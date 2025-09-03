"use client";

import React from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  useTheme as useMuiTheme,
} from "@mui/material";
import { Brightness4, Brightness7, AutoAwesome } from "@mui/icons-material";
import { useTheme } from "../providers/ThemeProvider";

export const AppBar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}15 0%, ${muiTheme.palette.secondary.main}15 100%)`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${muiTheme.palette.divider}`,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AutoAwesome
              sx={{
                color: "primary.main",
                fontSize: 28,
              }}
            />
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
            >
              Ideogram Clone
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "primary",
            }}
          >
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: isDarkMode ? "yellow.500" : "#667eea",

                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
};
