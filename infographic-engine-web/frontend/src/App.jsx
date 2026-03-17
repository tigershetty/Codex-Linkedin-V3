import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RunTimeline from "./pages/RunTimeline";
import RunDetail from "./pages/RunDetail";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import { SpiralAnimation } from "./components/SpiralAnimation";
import { BackgroundPaths } from "./components/BackgroundPaths";
import SplashScreen from "./components/SplashScreen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 10000,
      retry: 2,
    },
  },
});

// Nav — light teal theme matching the BackgroundPaths visual palette
const navStyle = {
  display:              "flex",
  gap:                  "1.5rem",
  padding:              "0 2rem",
  height:               "56px",
  background:           "rgba(232, 240, 240, 0.92)",
  alignItems:           "center",
  borderBottom:         "1px solid #cde0e2",
  position:             "sticky",
  top:                  0,
  zIndex:               100,
  backdropFilter:       "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const logoStyle = {
  color:          "#06858e",   // --primary
  fontWeight:     700,
  fontSize:       "1rem",
  textDecoration: "none",
  marginRight:    "auto",
};

const linkStyle = {
  color:          "#427a7e",   // --muted-foreground
  textDecoration: "none",
  fontSize:       "0.833rem",
};

const activeLinkStyle = {
  ...linkStyle,
  color:      "#06858e",       // --primary
  fontWeight: 600,
};

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>

      {/* ── Entry phase: SpiralAnimation (black canvas) behind splash ── */}
      {!hasEntered && (
        <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
          <SpiralAnimation />
        </div>
      )}

      {/* ── Splash gate — fades out on "Enter" click ── */}
      {!hasEntered && (
        <SplashScreen onEnter={() => setHasEntered(true)} />
      )}

      {/* ── Main app phase: BackgroundPaths (light teal SVG wave) ── */}
      {hasEntered && (
        <div
          style={{
            position:   "fixed",
            inset:      0,
            zIndex:     0,
            background: "#e8f0f0",   // --background
            overflow:   "hidden",
          }}
        >
          <BackgroundPaths />
        </div>
      )}

      {/* ── Main app — revealed after splash ── */}
      {hasEntered && (
        <BrowserRouter>
          <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
            <nav style={navStyle}>
              <Link to="/" style={logoStyle}>
                Shetty's Desk — Infographic Engine
              </Link>
              <NavLink
                to="/"
                end
                style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
              >
                Runs
              </NavLink>
              <NavLink
                to="/analytics"
                style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
              >
                Analytics
              </NavLink>
              <NavLink
                to="/settings"
                style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
              >
                Settings
              </NavLink>
            </nav>

            {/* BackgroundPaths shows through between cards */}
            <div style={{ minHeight: "calc(100vh - 56px)" }}>
              <Routes>
                <Route path="/"             element={<RunTimeline />} />
                <Route path="/runs/:runId"  element={<RunDetail />} />
                <Route path="/analytics"    element={<Analytics />} />
                <Route path="/settings"     element={<Settings />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      )}

    </QueryClientProvider>
  );
}
