"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import {
  Delete,
  DeleteSweep,
  Search,
  Create,
  Image as ImageIcon,
  ContentCopy,
  Download,
  Psychology,
} from "@mui/icons-material";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { GeneratedItem, ContentType } from "../types";
import { formatDate } from "../utils/dateUtils";
import Image from "next/image";

export const SavedItems: React.FC = () => {
  const { items, removeItem, clearAllItems } = useLocalStorage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ContentType | "all">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteItem = (item: GeneratedItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteItem = () => {
    if (selectedItem) {
      removeItem(selectedItem.id);
    }
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const handleClearAll = () => {
    setClearAllDialogOpen(true);
  };

  const confirmClearAll = () => {
    clearAllItems();
    setClearAllDialogOpen(false);
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // const handleDownload = (item: GeneratedItem) => {
  //   if (item.type === "image" && item.imageUrl) {
  //     const link = document.createElement("a");
  //     link.href = item.imageUrl;
  //     link.download = `generated-image-${item.id}.png`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } else {
  //     const element = document.createElement("a");
  //     const file = new Blob([item.content], { type: "text/plain" });
  //     element.href = URL.createObjectURL(file);
  //     element.download = `generated-${item.type}-${item.id}.txt`;
  //     document.body.appendChild(element);
  //     element.click();
  //     document.body.removeChild(element);
  //   }
  // };
  const handleDownload = async (item: GeneratedItem) => {
    if (item.type === "image" && item.imageUrl) {
      try {
        const response = await fetch(item.imageUrl, { mode: "cors" });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `generated-image-${item.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url); // cleanup
      } catch (error) {
        console.error("Image download failed:", error);
      }
    } else {
      const element = document.createElement("a");
      const file = new Blob([item.content], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `generated-${item.type}-${item.id}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case "post":
        return <Create />;
      case "template":
        return <Psychology />;
      case "image":
        return <ImageIcon />;
    }
  };

  const getTypeColor = (type: ContentType) => {
    switch (type) {
      case "post":
        return "primary";
      case "template":
        return "secondary";
      case "image":
        return "success";
    }
  };

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          No saved items yet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your generated content will appear here after you create something
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with filters and actions */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          mb: 4,
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Saved Items ({filteredItems.length})
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ minWidth: { xs: "auto", md: "400px" } }}
        >
          <TextField
            size="small"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ color: "text.secondary", mr: 1 }} />
              ),
            }}
            sx={{ flex: 1 }}
          />

          <TextField
            select
            size="small"
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as ContentType | "all")
            }
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="post">Posts</MenuItem>
            <MenuItem value="template">Templates</MenuItem>
            <MenuItem value="image">Images</MenuItem>
          </TextField>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweep />}
            onClick={handleClearAll}
            size="small"
          >
            Clear All
          </Button>
        </Stack>
      </Box>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <Alert severity="info" sx={{ mt: 4 }}>
          No items match your search criteria
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                {item.type === "image" && item.imageUrl && (
                  <CardMedia sx={{ position: "relative", height: 200 }}>
                    <Image
                      src={item.imageUrl}
                      alt={item.prompt}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </CardMedia>
                )}

                <CardContent
                  sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Chip
                      icon={getTypeIcon(item.type)}
                      label={
                        item.type.charAt(0).toUpperCase() + item.type.slice(1)
                      }
                      color={getTypeColor(item.type)}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(item.createdAt)}
                    </Typography>
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, mb: 2 }}>
                    {item.type !== "image" && (
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 2,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.content}
                      </Typography>
                    )}

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontStyle: "italic",
                      }}
                    >
                      "{item.prompt}"
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1}>
                      {item.type !== "image" && (
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(item.content)}
                          title="Copy content"
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(item)}
                        title="Download"
                      >
                        <Download fontSize="small" />
                      </IconButton>
                    </Stack>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteItem(item)}
                      title="Delete item"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Item Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this {selectedItem?.type}? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteItem} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear All Dialog */}
      <Dialog
        open={clearAllDialogOpen}
        onClose={() => setClearAllDialogOpen(false)}
      >
        <DialogTitle>Clear All Items</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all saved items? This will remove
            all your generated posts, templates, and images. This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearAllDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmClearAll} color="error" autoFocus>
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
