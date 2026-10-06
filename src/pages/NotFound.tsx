import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    const prevTitle = document.title;
    document.title = "Page Not Found — Pellorn";

    const setMeta = (selector: string, attr: string, name: string, content: string) => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      const prev = el.getAttribute("content");
      el.setAttribute("content", content);
      return () => { if (prev !== null) el!.setAttribute("content", prev); };
    };

    const setLink = (rel: string, href: string) => {
      let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      const created = !el;
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      const prev = el.getAttribute("href");
      el.setAttribute("href", href);
      return () => {
        if (created) el!.remove();
        else if (prev !== null) el!.setAttribute("href", prev);
      };
    };

    const restoreDesc = setMeta('meta[name="description"]', "name", "description", "The page you are looking for does not exist on Pellorn.");
    const restoreOgTitle = setMeta('meta[property="og:title"]', "property", "og:title", "Page Not Found — Pellorn");
    const restoreOgDesc = setMeta('meta[property="og:description"]', "property", "og:description", "The page you are looking for does not exist on Pellorn.");
    const restoreOgUrl = setMeta('meta[property="og:url"]', "property", "og:url", location.pathname);
    const restoreCanonical = setLink("canonical", location.pathname);

    return () => {
      document.title = prevTitle;
      restoreDesc();
      restoreOgTitle();
      restoreOgDesc();
      restoreOgUrl();
      restoreCanonical();
    };
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
