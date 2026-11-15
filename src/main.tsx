import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

// hide the loading screen once the app has drawn its first frame
requestAnimationFrame(() => requestAnimationFrame(() => (window as unknown as { __bootDone?: () => void }).__bootDone?.()));
