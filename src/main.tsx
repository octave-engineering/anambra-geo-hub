import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "ol/ol.css"; // OpenLayers CSS for map components

createRoot(document.getElementById("root")!).render(<App />);
