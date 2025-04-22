import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";  
import Home from "./pages/Home/Home.jsx";
import Predict from "./pages/Predict/Predict.jsx";
import Guide from "./pages/Guide/Guide.jsx";
import Watchlist from "./pages/Watchlist/Watchlist.jsx";
import Navbar from "./Navbar/Navbar.jsx";
import { MarketDataProvider } from "./context/MarketDataContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MarketDataProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </Router>
    </MarketDataProvider>
  </StrictMode>
);