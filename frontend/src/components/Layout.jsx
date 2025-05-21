import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { devMode } from "../config";

export default function Layout({ children, backgroundImage, centeredContent = true }) {
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
          bgcolor="white"
          borderRadius={2}
          boxShadow={4}
          p={4}
          my={centeredContent ? 0 : 4}
          aria-label="Layout Inner Content Box"
        >
          {children}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
