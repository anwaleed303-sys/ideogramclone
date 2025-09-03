"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  Snackbar,
  Slide,
} from "@mui/material";
import {
  AutoAwesome,
  Create,
  Image,
  Psychology,
  Send,
} from "@mui/icons-material";
import { GenerationResult } from "./GenerationResult";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateContent } from "../services/api";
import { ContentType, GeneratedItem, ImageSize } from "../types";

import type { SlideProps } from "@mui/material";

// Slide animation from right to left
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export const GeneratorForm: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState<ContentType>("post");
  const [imageSize, setImageSize] = useState<ImageSize>("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedItem | null>(null);
  const [success, setSuccess] = useState(false);

  const { addItem } = useLocalStorage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedItem = await generateContent({
        prompt: prompt.trim(),
        type: contentType,
        imageSize: contentType === "image" ? imageSize : undefined,
      });

      setResult(generatedItem);
      addItem(generatedItem);

      // ✅ Show success snackbar
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const contentTypeOptions = [
    {
      value: "post",
      label: "Social Media Post",
      icon: <Create />,
      color: "secondary",
    },
    {
      value: "template",
      label: "Custom Template",
      color: "secondary",
      icon: <Psychology />,
    },
    { value: "image", label: "AI Image", icon: <Image />, color: "secondary" },
  ] as const;

  const imageSizeOptions = [
    {
      value: "small",
      label: "Small (512x512)",
      description: "Square - Quick generation",
    },
    {
      value: "medium",
      label: "Medium (768x768)",
      description: "Square - Balanced quality",
    },
    {
      value: "large",
      label: "Large (1024x1024)",
      description: "Square - High quality",
    },
    {
      value: "wide",
      label: "Wide (1024x576)",
      description: "Landscape - Good for headers",
    },
    {
      value: "tall",
      label: "Tall (576x1024)",
      description: "Portrait - Good for stories",
    },
    {
      value: "youtube",
      label: "YouTube Thumbnail (1280x720)",
      description: "16:9 aspect ratio - Perfect for YouTube thumbnails",
    },
  ] as const;

  return (
    <Box id="generator-section" sx={{ maxWidth: "1200px", mx: "auto" }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "fit-content" }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <AutoAwesome sx={{ color: "primary.main", mr: 1 }} />
                <Typography variant="h5" fontWeight={600}>
                  Generate Content
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* Content Type Selection */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: 500 }}
                    >
                      What would you like to create?
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {contentTypeOptions.map((option) => (
                        <Chip
                          key={option.value}
                          label={option.label}
                          clickable
                          color={
                            contentType === option.value
                              ? option.color
                              : "default"
                          }
                          variant={
                            contentType === option.value ? "filled" : "outlined"
                          }
                          onClick={() => setContentType(option.value)}
                          sx={{
                            py: 2,
                            px: 1,
                            height: "auto",
                            "& .MuiChip-label": {
                              fontSize: "0.9rem",
                              py: 0.5,
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  {/* Image Size Selection (only for images) */}
                  {contentType === "image" && (
                    <FormControl fullWidth>
                      <InputLabel>Image Size</InputLabel>
                      <Select
                        value={imageSize}
                        label="Image Size"
                        onChange={(e) =>
                          setImageSize(e.target.value as ImageSize)
                        }
                      >
                        {imageSizeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box>
                              <Typography variant="body1">
                                {option.label}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {option.description}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {/* Prompt Input */}
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label={`Describe your ${contentType}...`}
                    placeholder={
                      contentType === "post"
                        ? "e.g., Create a motivational post about productivity and time management"
                        : contentType === "template"
                        ? "e.g., Create a template for product announcements"
                        : "e.g., A futuristic cityscape with flying cars and neon lights"
                    }
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                  />

                  {/* Generate Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!prompt.trim() || isLoading}
                    startIcon={
                      isLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Send style={{}} />
                      )
                    }
                    sx={{
                      py: 1.5,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      "&:hover": {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                      },
                    }}
                  >
                    {isLoading ? "Generating..." : `Generate ${contentType}`}
                  </Button>
                </Stack>
              </form>

              {/* Error Display */}
              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {result ? (
            <GenerationResult result={result} />
          ) : (
            <Card sx={{ height: "fit-content" }}>
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <AutoAwesome
                  sx={{
                    fontSize: 64,
                    color: "text.secondary",
                    mb: 2,
                    ...(isLoading && {
                      animation: "spin 1.5s linear infinite",
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }),
                  }}
                />

                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Your generated content will appear here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter a prompt and click generate to get started
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* ✅ Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {`Your ${contentType} was generated successfully!`}
        </Alert>
      </Snackbar>
    </Box>
  );
};
