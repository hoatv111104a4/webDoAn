import React from "react";
import ReactDOM from "react-dom/client";
import App from "./layouts/App";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Layout2 from "./layouts/Layout2";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Router>      
        <Routes>
          <Route path="/*" element={<App />} />
          <Route path="/website/*" element={<Layout2 />} />
          
        </Routes>      
    </Router>
  </QueryClientProvider>
);