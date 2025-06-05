// Layout.jsx
// This component provides a consistent page layout, including background, navbar, footer, and optional loading state for all pages.

import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { devMode } from "../config";
// import OnboardingTour from "./OnboardingTour";

/**
 * Layout component.
 * Wraps page content with navbar, footer, background image, and optional loading skeleton.
 * @param {object} props
 * @param {React.ReactNode} props.children - The main content to display.
 * @param {string} [props.backgroundImage] - Optional background image URL.
 * @param {boolean} [props.centeredContent=true] - Whether to center content vertically.
 * @param {boolean} [props.loading=false] - Whether to show a loading skeleton.
 */
export default function Layout({ children, backgroundImage, centeredContent = true, loading = false }) {
  return (
    <Box
      minHeight="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      sx={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        px: 2,
      }}
      aria-label="Main Layout Container"
    >
      <Navbar />

      {/* Dev Mode Banner */}
      {devMode && (
        <Box
          p={1}
          bgcolor="warning.main"
          color="white"
          textAlign="center"
          fontWeight={500}
          aria-label="Dev Mode Banner"
        >
          <Typography variant="body2">
            ⚠️ Dev Mode is ON — Auth is currently bypassed for testing
          </Typography>
        </Box>
      )}

      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        justifyContent={centeredContent ? { xs: "flex-start", md: "center" } : "flex-start"}
        py={centeredContent ? { xs: 4, md: 0 } : 4}
        alignItems="center"
        aria-label="Layout Content Area"
      >
        <Box
          width="100%"
          maxWidth={centeredContent ? 450 : 900}
          mx="auto"
          sx={{
            bgcolor: 'transparent',
            background: 'linear-gradient(120deg, #e3f2fd 0%, #ede7f6 100%)',
            borderRadius: 2,
            boxShadow: 4,
            p: 4,
            my: centeredContent ? 0 : 4,
          }}
          aria-label="Layout Inner Content Box"
        >
          {/* <OnboardingTour /> */}
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2, my: 2 }} />
          ) : (
            children
          )}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
