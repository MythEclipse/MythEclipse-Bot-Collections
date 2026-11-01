import "@fontsource-variable/inter/wght.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { LocaleProvider } from "./i18n";
import { queryClient } from "./queryClient";
import { router } from "./router";
import "./styles.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("index.html is missing the #root element");
}

createRoot(container).render(
  <LocaleProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </LocaleProvider>
);