import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useEffect } from "react";
import { jumpToY, scrollToY, startSmoothScroll } from "@/lib/smoothScroll";
import { takePendingSection } from "@/lib/goToSection";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

/**
 * Opening a new page starts at its top. Back / Forward return to exactly where you were on that page.
 * (Positions are kept per address for this visit; the home page is long, so we retry until it has grown back.)
 */
function useScrollMemory() {
  const router = useRouter();
  useEffect(() => {
    const saved = new Map<string, number>();
    let pop = false;
    const onPop = () => { pop = true; };
    window.addEventListener("popstate", onPop);
    const key = (l: { pathname: string; searchStr?: string }) => l.pathname + (l.searchStr || "");
    const offBefore = router.subscribe("onBeforeNavigate", ({ fromLocation }) => {
      if (fromLocation) saved.set(key(fromLocation), window.scrollY);
    });
    const offResolved = router.subscribe("onResolved", ({ toLocation, fromLocation }) => {
      if (fromLocation && key(fromLocation) === key(toLocation)) { pop = false; return; } // same page (e.g. #section)
      const back = pop && saved.has(key(toLocation));
      pop = false;
      const target = back ? saved.get(key(toLocation))! : 0;
      // a header/footer link asked for a home-page section: open the page at the top, then glide to it
      const section = takePendingSection();
      if (section && !back) {
        jumpToY(0);
        let n = 0;
        const find = () => {
          const el = document.getElementById(section);
          if (el) setTimeout(() => scrollToY(el.getBoundingClientRect().top + window.scrollY - 80), 150);
          else if (n++ < 60) setTimeout(find, 50);
        };
        requestAnimationFrame(find);
        return;
      }
      const hash = !back && toLocation.hash ? document.getElementById(toLocation.hash) : null;
      let tries = 0;
      const go = () => {
        if (hash) { jumpToY(hash.getBoundingClientRect().top + window.scrollY - 80); return; }
        jumpToY(target);
        if (back && Math.abs(window.scrollY - target) > 4 && tries++ < 20) setTimeout(go, 60);
      };
      requestAnimationFrame(go);
    });
    return () => { window.removeEventListener("popstate", onPop); offBefore(); offResolved(); };
  }, [router]);
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => startSmoothScroll(), []);
  useScrollMemory();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
