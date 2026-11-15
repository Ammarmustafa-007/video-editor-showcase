import { QueryClient } from "@tanstack/react-query";
import { createHashHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: false, // handled in __root (works with smooth scrolling): new pages open at the top, Back returns to where you were
    defaultPreloadStaleTime: 0,
    // preview builds (shared as a link before going live) use #/ routes so they work from any folder
    ...(import.meta.env.VITE_HASH_ROUTER ? { history: createHashHistory() } : {}),
  });

  return router;
};
