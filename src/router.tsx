import { QueryClient } from "@tanstack/react-query";
import { createHashHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // preview builds (shared as a link before going live) use #/ routes so they work from any folder
    ...(import.meta.env.VITE_HASH_ROUTER ? { history: createHashHistory() } : {}),
  });

  return router;
};
