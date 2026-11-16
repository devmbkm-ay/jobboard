"use client";

import { useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { UNITS } from "./units";
import { AnatomyPanel } from "./AnatomyPanel";

/**
 * Couche d'inspection posée par-dessus l'application.
 * Mode normal : ne fait rien, l'application se comporte comme avant.
 * Mode anatomie : intercepte les clics (phase de capture) et, au lieu de
 * laisser l'application réagir, ouvre la fiche de l'élément cliqué.
 */
export function AnatomyLayer({ children }: { children: ReactNode }) {
    const [active, setActive] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [chain, setChain] = useState<string[]>([]);

    const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
        if (!active) return;
        // En mode anatomie, l'application ne doit pas réagir au clic.
        event.preventDefault();
        event.stopPropagation();

        // On remonte du point cliqué vers la racine en notant chaque zone annotée.
        const found: string[] = [];
        let element = (event.target as Element).closest<HTMLElement>("[data-anatomy]");
        while (element) {
            const id = element.dataset.anatomy;
            if (id && id in UNITS) found.unshift(id);
            element = element.parentElement?.closest<HTMLElement>("[data-anatomy]") ?? null;
        }
        if (found.length === 0) return;
        setChain(found);
        setSelected(found[found.length - 1]);
    };

    return (
        <>
            <button
                type="button"
                aria-pressed={active}
                onClick={() => setActive(!active)}
                className={
                    active
                        ? "fixed left-1/2 top-3 z-[70] -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-lg ring-1 ring-blue-700 hover:bg-blue-700"
                        : "fixed left-1/2 top-3 z-[70] -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-slate-700 shadow ring-1 ring-slate-200 hover:bg-slate-50"
                }
            >
                {active ? "Mode anatomie : activé" : "Mode anatomie"}
            </button>

            {active && selected && (
                <style>{`.anatomy-on [data-anatomy="${selected}"]{outline:3px solid #2563eb;outline-offset:2px;box-shadow:0 0 0 6px rgba(37,99,235,.2)}`}</style>
            )}

            <div className={active ? "anatomy-on lg:pl-96" : undefined} onClickCapture={handleClickCapture}>
                {children}
            </div>

            {active && (
                <AnatomyPanel
                    selected={selected}
                    chain={chain}
                    onSelect={setSelected}
                    onClose={() => setActive(false)}
                />
            )}
        </>
    );
}
