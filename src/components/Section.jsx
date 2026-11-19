import { secTitle, useI18n } from "../i18n";
import { flagify, hasFlag, inline, md } from "../lib/markdown";
import { speak } from "../lib/speech";
import Cards from "./Cards";

export default function Section({ s }) {
  const { t, lang } = useI18n();
  let body;
  if (s.type === "ex") {
    body = s.pairs.map((p, j) => (
      <div
        key={j}
        className="flex gap-3.5 border-b border-line px-1 py-3.5 last:border-0"
      >
        <span className="w-8 flex-none text-center text-[22px]">
          {hasFlag(p.ic) ? "💬" : p.ic}
        </span>
        <div className="flex-1">
          <div
            className="text-[17px] font-medium [unicode-bidi:plaintext]"
            dangerouslySetInnerHTML={{ __html: flagify("🇩🇪 ") + inline(p.de) }}
          />
          {p.fa && (
            <div
              dir="rtl"
              className="fa-line mt-0.5 text-right font-naskh text-[18px] leading-loose text-mute"
            >
              <span
                className="flag flag-ir me-2"
                role="img"
                aria-label="فارسی"
              />{" "}
              {p.fa}
            </div>
          )}
        </div>
        <button
          className="mt-0.5 size-8 flex-none rounded-full bg-panel2 hover:bg-accsoft"
          onClick={() => speak(p.de)}
          aria-label={t("listen")}
        >
          🔊
        </button>
      </div>
    ));
  } else if (s.type === "cards") body = <Cards cards={s.cards} />;
  else
    body = (
      <div className="md" dangerouslySetInnerHTML={{ __html: md(s.md) }} />
    );
  return (
    <section className={`sec sec-${s.cls}`}>
      <h2>{secTitle(s, lang, t)}</h2>
      {body}
    </section>
  );
}
