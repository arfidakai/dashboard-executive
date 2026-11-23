import { useEffect, useState } from "react";
import type { Period } from "@/src/lib/dashboard-data";
import type { KeuanganData } from "@/src/lib/api/keuangan";
import { useDashboardData } from "@/src/lib/hooks/useDashboardData";
import { SectionLabel } from "./Primitives";

type Institution = KeuanganData["institutions"][number];
const parseRupiah = (value: string) => Number(value.replace(/[^0-9-]/g, "")) || 0;
const isAgniaCare = (name: string) => name === "Agnia Care";

function InstitutionBar({ item, active, onEnter, onLeave }: {
  item: Institution;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const [name, income, hpp, cost, profit, margin, positive] = item;
  const incomeNum = parseRupiah(income);
  const hppNum = parseRupiah(hpp);
  const costNum = parseRupiah(cost);
  const totalBiaya = hppNum + costNum;
  const maxVal = Math.max(incomeNum, totalBiaya, 1);

  return (
    <div
      className={`lembaga-bar-group${active ? " active" : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span className={`lembaga-laba-tag ${positive ? "pos" : "neg"}`}>{profit}</span>
      <div className="lembaga-bars">
        <div className="lembaga-bar income" style={{ height: `${(incomeNum / maxVal) * 100}%` }} />
        <div className="lembaga-bar cost" style={{ height: `${(totalBiaya / maxVal) * 100}%` }} />
      </div>
      <span className="lembaga-bar-group-label">{name}</span>

      {active && (
        <div className="lembaga-tooltip show">
          <div className="lembaga-tooltip-head">
            <div>
              <div className="lembaga-tooltip-name">{name}</div>
              <div className="lembaga-tooltip-sector">{isAgniaCare(name) ? "Zakat & Filantropi" : "Ekonomi"}</div>
            </div>
            <span className={`status-badge ${positive ? "profit" : "loss"}`}>{positive ? "Profit" : "Loss"}</span>
          </div>
          <div className="lembaga-tooltip-row">
            <span>{isAgniaCare(name) ? "Penerimaan Dana" : "Pendapatan"}</span>
            <span>{income}</span>
          </div>
          {isAgniaCare(name) ? (
            <>
              <div className="lembaga-tooltip-row"><span>Penyaluran Dana</span><span>{cost}</span></div>
              <div className="lembaga-tooltip-row"><span>Saldo Bersih</span><span>{profit}</span></div>
            </>
          ) : (
            <>
              <div className="lembaga-tooltip-row"><span>HPP</span><span>{hpp}</span></div>
              <div className="lembaga-tooltip-row"><span>Biaya</span><span>{cost}</span></div>
            </>
          )}
          <div className="lembaga-tooltip-laba">
            <span>{isAgniaCare(name) ? "Sisa Dana" : "Laba Bersih"}</span>
            <span className={`lembaga-tooltip-laba-value ${positive ? "pos" : "neg"}`}>
              {profit} &nbsp;({margin})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function InstitutionCard({ item }: { item: Institution }) {
  const [name, income, hpp, cost, profit, margin, positive] = item;
  const philanthropic = isAgniaCare(name);

  return (
    <article className={`institution${philanthropic ? " philanthropic" : ""}`}>
      <header>
        <div><h3>{name}</h3><span>{philanthropic ? "Zakat & Filantropi" : "Ekonomi"}</span></div>
        <b className={positive ? "profit" : "loss"}>{positive ? (philanthropic ? "Surplus" : "Profit") : "Loss"}</b>
      </header>
      <div className="stats">
        <div><span>{philanthropic ? "Penerimaan Dana" : "Pendapatan"}</span><strong>{income}</strong></div>
        {philanthropic ? (
          <>
            <div><span>Penyaluran Dana</span><strong>{cost}</strong></div>
            <div><span>Sisa Dana</span><strong>{profit}</strong></div>
          </>
        ) : (
          <>
            <div><span>HPP</span><strong>{hpp}</strong></div>
            <div><span>Biaya</span><strong>{cost}</strong></div>
          </>
        )}
      </div>
      {philanthropic ? (
        <footer className="philanthropic-footer">
          <div>
            <span>Surplus Bersih</span>
            <strong className={positive ? "positive" : "negative"}>{profit}</strong>
          </div>
          <div>
            <span>Persentase</span>
            <strong className={positive ? "positive" : "negative"}>{margin}</strong>
          </div>
        </footer>
      ) : (
        <footer>
          <div><span>Laba Bersih</span><strong className={positive ? "positive" : "negative"}>{profit}</strong></div>
          <strong className={positive ? "positive" : "negative"}>{margin}</strong>
        </footer>
      )}
    </article>
  );
}
//test
export function InstitutionSection({ period }: { period: Period }) {
  const { data, isFallback } = useDashboardData("keuangan", period);
  const institutions = data.institutions;
  const hasAgniaCare = institutions.some((item) => isAgniaCare(item[0]));
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const carousel = document.querySelector<HTMLElement>(".institutions");
    if (!carousel) return;

    const cards = Array.from(carousel.querySelectorAll<HTMLElement>(".institution"));
    let paused = false;

    const syncCardWidths = () => {
      const visibleCards = window.innerWidth <= 610 ? 1 : window.innerWidth <= 900 ? 2 : 3;
      cards.forEach((card) => {
        card.style.flex = `0 0 calc((100% - ${(visibleCards - 1) * 8}px) / ${visibleCards})`;
      });
    };

    const advance = () => {
      if (paused || cards.length <= 3) return;
      const step = (cards[0]?.offsetWidth ?? 0) + 8;
      const end = carousel.scrollWidth - carousel.clientWidth;
      carousel.scrollTo({
        left: carousel.scrollLeft + step >= end - 1 ? 0 : carousel.scrollLeft + step,
        behavior: "smooth",
      });
    };

    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    syncCardWidths();
    const timer = window.setInterval(advance, 3200);
    carousel.addEventListener("mouseenter", pause);
    carousel.addEventListener("mouseleave", resume);
    carousel.addEventListener("focusin", pause);
    carousel.addEventListener("focusout", resume);
    window.addEventListener("resize", syncCardWidths);

    return () => {
      window.clearInterval(timer);
      carousel.removeEventListener("mouseenter", pause);
      carousel.removeEventListener("mouseleave", resume);
      carousel.removeEventListener("focusin", pause);
      carousel.removeEventListener("focusout", resume);
      window.removeEventListener("resize", syncCardWidths);
    };
  }, []);

  return (
    <section>
      <SectionLabel isFallback={isFallback}>Kinerja Lembaga</SectionLabel>
      <h2>Performa keuangan tiap lembaga</h2>
      <p className="note">
        {hasAgniaCare
          ? "Penerimaan dana, penyaluran, dan surplus lembaga amil zakat."
          : "Pendapatan, HPP, biaya, dan laba bersih lintas unit usaha yayasan."}
      </p>
      <div className="institutions">
        {institutions.map((item) => <InstitutionCard item={item} key={item[0]} />)}
      </div>
      <div className="lembaga-chart-card">
        <div className="lembaga-chart-legend">
          <span><i className="income" />{hasAgniaCare ? "Penerimaan Dana" : "Pendapatan"}</span>
          <span><i className="cost" />{hasAgniaCare ? "Penyaluran Dana" : "Total Biaya (HPP + Operasional)"}</span>
        </div>
        <div className="lembaga-chart-plot">
          {institutions.map((item, index) => (
            <InstitutionBar
              item={item}
              key={item[0]}
              active={active === index}
              onEnter={() => setActive(index)}
              onLeave={() => setActive(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}