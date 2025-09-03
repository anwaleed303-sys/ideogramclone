"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
  useTheme,
  Skeleton,
} from "@mui/material";
import {
  Download,
  Share,
  Create,
  Image as ImageIcon,
  Psychology,
} from "@mui/icons-material";
import { GeneratedItem } from "../types";
import { formatDate } from "../utils/dateUtils";
import Image from "next/image";

interface GenerationResultProps {
  result: GeneratedItem;
}

export const GenerationResult: React.FC<GenerationResultProps> = ({
  result,
}) => {
  const [copied, setCopied] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const theme = useTheme();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // const handleDownload = () => {
  //   if (result.type === "image" && result.imageUrl) {
  //     const link = document.createElement("a");
  //     link.href = result.imageUrl;
  //     link.download = `generated-image-${result.id}.png`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } else {
  //     const element = document.createElement("a");
  //     const file = new Blob([result.content], { type: "text/plain" });
  //     element.href = URL.createObjectURL(file);
  //     element.download = `generated-${result.type}-${result.id}.txt`;
  //     document.body.appendChild(element);
  //     element.click();
  //     document.body.removeChild(element);
  //   }
  // };
  const handleDownload = async () => {
    if (result.type === "image" && result.imageUrl) {
      try {
        // Fetch the image as a blob
        const response = await fetch(result.imageUrl, { mode: "cors" });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Create link and trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = `generated-image-${result.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up object URL
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Image download failed:", error);
      }
    } else {
      // Handle text content download
      const file = new Blob([result.content], { type: "text/plain" });
      const url = URL.createObjectURL(file);

      const element = document.createElement("a");
      element.href = url;
      element.download = `generated-${result.type}-${result.id}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      URL.revokeObjectURL(url);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Generated ${result.type}`,
          text: result.content,
        });
      } catch (err) {
        console.error("Failed to share:", err);
      }
    }
  };

  const getTypeIcon = () => {
    switch (result.type) {
      case "post":
        return <Create />;
      case "template":
        return <Psychology />;
      case "image":
        return <ImageIcon />;
      default:
        return <Create />;
    }
  };

  const getTypeColor = () => {
    switch (result.type) {
      case "post":
        return "primary";
      case "template":
        return "secondary";
      case "image":
        return "success";
      default:
        return "primary";
    }
  };

  return (
    <Card sx={{ height: "fit-content" }}>
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              icon={getTypeIcon()}
              label={result.type.charAt(0).toUpperCase() + result.type.slice(1)}
              color={getTypeColor()}
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              {formatDate(result.createdAt)}
            </Typography>
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1}>
            {result.type !== "image" && (
              <IconButton
                size="small"
                onClick={handleCopy}
                sx={{ color: copied ? "success.main" : "text.secondary" }}
              >
                {/* {copied ? <CheckCircle /> : <Copy />} */}
              </IconButton>
            )}
            <IconButton
              size="small"
              onClick={handleDownload}
              sx={{ color: "text.secondary" }}
            >
              <Download />
            </IconButton>
            {typeof navigator !== "undefined" && (
              <IconButton
                size="small"
                onClick={handleShare}
                sx={{ color: "text.secondary" }}
              >
                <Share />
              </IconButton>
            )}
          </Stack>
        </Box>

        {/* Content */}
        {result.type === "image" ? (
          <Box sx={{ position: "relative", mb: 2 }}>
            {imageLoading && (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={300}
                sx={{ borderRadius: 2 }}
              />
            )}
            <Box
              sx={{
                position: imageLoading ? "absolute" : "relative",
                top: 0,
                left: 0,
                width: "100%",
                borderRadius: 2,
                overflow: "hidden",
                display: imageLoading ? "none" : "block",
              }}
            >
              <Image
                src={result.imageUrl || "/placeholder-image.png"}
                alt={result.prompt}
                width={400}
                height={300}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              p: 3,
              bgcolor: "background.default",
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              mb: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
                fontFamily:
                  result.type === "template" ? "monospace" : "inherit",
              }}
            >
              {result.content}
            </Typography>
          </Box>
        )}

        {/* Prompt */}
        <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Prompt:
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {result.prompt}
          </Typography>
        </Box>

        {/* Success Message */}
        {copied && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="success.main">
              Copied to clipboard!
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
