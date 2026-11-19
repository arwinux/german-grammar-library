import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { I18nContext, makeT } from "./i18n";
import { LESSONS, LEVELS } from "./lib/data";
import { store } from "./lib/store";
import { useHash } from "./lib/useHash";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Lesson from "./components/Lesson";
import Level from "./components/Level";
import Search from "./components/Search";
import Sidebar from "./components/Sidebar";
import Trainer from "./components/Trainer";

function initialLang() {
  const saved = store.get("dg-lang", null);
  if (saved) return saved;
  const n = (navigator.language || "").slice(0, 2);
  return n === "fa" ? "fa" : n === "de" ? "de" : "en";
}

export default function App() {
  const hash = useHash();
  const mainRef = useRef(null);
  const [lang, setLangState] = useState(initialLang);
  const [theme, setTheme] = useState(() => store.get("dg-theme", null));
  const [showFa, setShowFa] = useState(() => store.get("dg-fa", true));
  const [done, setDone] = useState(() => store.get("dg-done", []));
  const [menu, setMenu] = useState(false);
  const [searching, setSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const t = useMemo(() => makeT(lang), [lang]);

  const setLang = (l) => {
    setLangState(l);
    store.set("dg-lang", l);
  };
  useLayoutEffect(() => {
    const d = document.documentElement;
    d.lang = lang;
    d.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);
  useLayoutEffect(() => {
    theme
      ? document.documentElement.setAttribute("data-theme", theme)
      : document.documentElement.removeAttribute("data-theme");
  }, [theme]);
  useEffect(() => {
    setMenu(false);
    setProgress(0);
    mainRef.current?.scrollTo?.({ top: 0 });
    if (!LESSONS.some((l) => l.id === hash))
      document.title = "Grammatik-Bibliothek · Deutsch A1–B2";
  }, [hash]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMenu(false);
      if (
        ((e.metaKey || e.ctrlKey) && e.key === "k") ||
        (e.key === "/" && !["INPUT", "TEXTAREA"].includes(e.target.tagName))
      ) {
        e.preventDefault();
        setSearching(true);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const lesson = LESSONS.find((l) => l.id === hash);
  const view = lesson
    ? "lesson"
    : LEVELS.some((v) => v.id === hash)
      ? "level"
      : hash === "trainer"
        ? "trainer"
        : "home";
  const dark = theme
    ? theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  const toggleDone = (id) => {
    const n = done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
    setDone(n);
    store.set("dg-done", n);
  };

  return (
    <I18nContext.Provider value={{ lang, t }}>
      <div
        className={`h-full md:grid md:grid-cols-[300px_1fr] ${showFa ? "" : "hide-fa"}`}
      >
        <Sidebar
          open={menu}
          hash={hash}
          current={lesson}
          done={done}
          lang={lang}
          setLang={setLang}
          showFa={showFa}
          toggleFa={() => {
            setShowFa(!showFa);
            store.set("dg-fa", !showFa);
          }}
          dark={dark}
          toggleTheme={() => {
            const n = dark ? "light" : "dark";
            setTheme(n);
            store.set("dg-theme", n);
          }}
          openSearch={() => setSearching(true)}
        />
        {menu && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setMenu(false)}
            aria-hidden="true"
          />
        )}
        <main
          ref={mainRef}
          className="relative h-full min-w-0 overflow-auto scroll-smooth"
          onScroll={(e) => {
            const el = e.currentTarget;
            setProgress(
              (el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)) *
                100,
            );
          }}
        >
          <div className="sticky top-0 z-20 h-0.75">
            <div
              className="h-full bg-linear-to-r from-acc to-[#e9a23b]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="sticky top-0.75 z-18 hidden h-13 items-center gap-3 border-b border-line bg-bg px-4 max-md:flex">
            <button
              className="chip"
              onClick={() => setMenu(!menu)}
              aria-label={t("menu")}
            >
              ☰
            </button>
            <b className="font-display">Grammatik-Bibliothek</b>
            <button
              className="chip ms-auto"
              onClick={() => setSearching(true)}
              aria-label={t("search")}
            >
              🔍
            </button>
          </div>
          {view === "lesson" && (
            <Lesson
              key={lesson.id}
              lesson={lesson}
              done={done.includes(lesson.id)}
              toggle={() => toggleDone(lesson.id)}
            />
          )}
          {view === "level" && <Level id={hash} done={done} />}
          {view === "trainer" && <Trainer />}
          {view === "home" && <Home done={done} />}
          <Footer />
        </main>
        {searching && <Search close={() => setSearching(false)} />}
      </div>
    </I18nContext.Provider>
  );
}
