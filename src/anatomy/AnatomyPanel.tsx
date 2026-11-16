"use client";

import { useState } from "react";
import { UNITS } from "./units";
import type { UnitKind } from "./units";
import { JOURNEYS } from "./journeys";
import type { Journey, JourneyState } from "./journeys";

const NOTES_KEY = "jobboard:anatomie:notes";

type Notes = Record<string, string>;

function readNotes(): Notes {
    if (typeof localStorage === "undefined") return {};
    try {
        const parsed: unknown = JSON.parse(localStorage.getItem(NOTES_KEY) ?? "{}");
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
        const notes: Notes = {};
        for (const [key, value] of Object.entries(parsed)) {
            if (typeof value === "string") notes[key] = value;
        }
        return notes;
    } catch {
        return {};
    }
}

function writeNotes(notes: Notes) {
    try {
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch {
        // Stockage indisponible : les notes restent en mémoire pour cette session.
    }
}

const GROUPS: { titre: string; genres: UnitKind[] }[] = [
    { titre: "Atomes", genres: ["état", "setter", "valeur dérivée", "store externe", "prop", "argument"] },
    { titre: "Fonctions", genres: ["fonction"] },
    { titre: "Référentiels", genres: ["référentiel"] },
    { titre: "Composants et éléments", genres: ["composant", "élément"] },
];

const linkClassName =
    "rounded-md bg-slate-100 px-2 py-1 text-left font-mono text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700";

const labelClassName = "text-[11px] font-medium uppercase tracking-wider text-slate-500";

const textareaClassName =
    "min-h-24 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none";

const primaryButtonClassName =
    "rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700";

const secondaryButtonClassName =
    "rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200";

export function AnatomyPanel({
    selected,
    chain,
    onSelect,
    onClose,
}: {
    selected: string | null;
    chain: string[];
    onSelect: (id: string | null) => void;
    onClose: () => void;
}) {
    // Le panneau n'est monté qu'après un clic, donc toujours côté navigateur :
    // lire localStorage dans l'initialisation paresseuse est sans risque ici.
    const [notes, setNotes] = useState<Notes>(readNotes);
    const [revealed, setRevealed] = useState<Record<string, boolean>>({});
    const [journeyId, setJourneyId] = useState<string | null>(null);

    const setNote = (key: string, value: string) => {
        const next = { ...notes, [key]: value };
        setNotes(next);
        writeNotes(next);
    };

    const select = (id: string | null) => {
        setJourneyId(null);
        onSelect(id);
    };

    const unit = selected ? UNITS[selected] : undefined;
    const journey = journeyId ? JOURNEYS[journeyId] : undefined;

    return (
        <aside className="fixed left-0 top-0 z-[60] flex h-full w-96 max-w-full flex-col border-r border-slate-200 bg-white text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                    <p className="text-sm font-bold">Inspecteur d&apos;anatomie</p>
                    <p className="text-xs text-slate-500">Les clics ouvrent des fiches au lieu d&apos;agir.</p>
                </div>
                <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Quitter le mode anatomie">
                    ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 pt-4">
                {journey && journeyId ? (
                    <JourneyView
                        key={journeyId}
                        journey={journey}
                        note={notes[`parcours:${journeyId}`] ?? ""}
                        onNote={(value) => setNote(`parcours:${journeyId}`, value)}
                        onSelect={select}
                        onBack={() => setJourneyId(null)}
                    />
                ) : unit && selected ? (
                    <div className="flex flex-col gap-4">
                        <button type="button" onClick={() => select(null)} className="w-fit text-xs text-blue-600 hover:underline">
                            ← Toutes les fiches
                        </button>

                        {chain.includes(selected) && chain.length > 1 && (
                            <div className="flex flex-col gap-1">
                                <p className={labelClassName}>Emboîtement à l&apos;écran</p>
                                <div className="flex flex-wrap items-center gap-1">
                                    {chain.map((id, index) => (
                                        <span key={id} className="flex items-center gap-1">
                                            {index > 0 && <span className="text-xs text-slate-400">›</span>}
                                            <button
                                                type="button"
                                                onClick={() => select(id)}
                                                className={
                                                    id === selected
                                                        ? "rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white"
                                                        : "rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 hover:bg-blue-50"
                                                }
                                            >
                                                {UNITS[id].nom}
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-100">
                                {unit.genre}
                            </span>
                            <h2 className="mt-2 break-words font-mono text-lg font-bold">{unit.nom}</h2>
                            <p className="mt-1 break-all font-mono text-xs text-slate-500">
                                {unit.fichier} · l.{unit.lignes}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="anatomy-note" className={labelClassName}>
                                Ta lecture, avant de comparer
                            </label>
                            <textarea
                                id="anatomy-note"
                                value={notes[`fiche:${selected}`] ?? ""}
                                onChange={(event) => setNote(`fiche:${selected}`, event.target.value)}
                                placeholder={`Ouvre le fichier à la ligne indiquée. Que demande la fiche ? ${unit.champs
                                    .map((champ) => champ.label)
                                    .join(" · ")}`}
                                className={textareaClassName}
                            />
                        </div>

                        {revealed[selected] ? (
                            <dl className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                {unit.champs.map((champ) => (
                                    <div key={champ.label} className="flex flex-col gap-0.5">
                                        <dt className={labelClassName}>{champ.label}</dt>
                                        <dd className="text-sm text-slate-900">{champ.valeur}</dd>
                                    </div>
                                ))}
                            </dl>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setRevealed({ ...revealed, [selected]: true })}
                                className={`w-fit ${primaryButtonClassName}`}
                            >
                                Comparer avec la fiche
                            </button>
                        )}

                        {unit.question && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-amber-800">Question</p>
                                <p className="mt-1 text-sm text-amber-950">{unit.question}</p>
                            </div>
                        )}

                        {unit.parcours && JOURNEYS[unit.parcours] && (
                            <button
                                type="button"
                                onClick={() => setJourneyId(unit.parcours ?? null)}
                                className={`w-fit ${secondaryButtonClassName}`}
                            >
                                Parcours : {JOURNEYS[unit.parcours].titre} →
                            </button>
                        )}

                        {unit.liens.length > 0 && (
                            <div className="flex flex-col gap-1">
                                <p className={labelClassName}>Pièces reliées</p>
                                <div className="flex flex-wrap gap-1">
                                    {unit.liens.map((id) => (
                                        <button key={id} type="button" onClick={() => select(id)} className={linkClassName}>
                                            {UNITS[id]?.nom ?? id}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-slate-600">
                            Clique sur une zone encadrée de l&apos;écran, ou choisis une pièce ci-dessous.
                        </p>
                        <div className="flex flex-col gap-1">
                            <p className={labelClassName}>Parcours</p>
                            {Object.entries(JOURNEYS).map(([id, item]) => (
                                <button key={id} type="button" onClick={() => setJourneyId(id)} className={`w-fit ${secondaryButtonClassName}`}>
                                    {item.titre} →
                                </button>
                            ))}
                        </div>
                        {GROUPS.map((group) => (
                            <div key={group.titre} className="flex flex-col gap-1">
                                <p className={labelClassName}>{group.titre}</p>
                                <div className="flex flex-wrap gap-1">
                                    {Object.entries(UNITS)
                                        .filter(([, item]) => group.genres.includes(item.genre))
                                        .map(([id, item]) => (
                                            <button key={id} type="button" onClick={() => select(id)} className={linkClassName}>
                                                {item.nom}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}

function StateTable({ etat, previous }: { etat: JourneyState; previous?: JourneyState }) {
    return (
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-lg bg-slate-900 p-3 font-mono text-xs">
            {etat.map((entry, index) => {
                const changed = previous !== undefined && previous[index]?.valeur !== entry.valeur;
                return (
                    <div key={entry.nom} className="contents">
                        <dt className="text-slate-400">{entry.nom}</dt>
                        <dd className={changed ? "font-bold text-emerald-300" : "text-slate-100"}>
                            {entry.valeur}
                            {changed && " ← a changé"}
                        </dd>
                    </div>
                );
            })}
        </dl>
    );
}

function JourneyView({
    journey,
    note,
    onNote,
    onSelect,
    onBack,
}: {
    journey: Journey;
    note: string;
    onNote: (value: string) => void;
    onSelect: (id: string) => void;
    onBack: () => void;
}) {
    // Nombre d'étapes révélées : 0 = seulement l'état initial.
    const [shown, setShown] = useState(0);
    const total = journey.etapes.length;

    return (
        <div className="flex flex-col gap-4">
            <button type="button" onClick={onBack} className="w-fit text-xs text-blue-600 hover:underline">
                ← Retour
            </button>
            <div>
                <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-100">
                    parcours scénarisé
                </span>
                <h2 className="mt-2 text-lg font-bold">{journey.titre}</h2>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="anatomy-prediction" className={labelClassName}>
                    Ta prédiction
                </label>
                <textarea
                    id="anatomy-prediction"
                    value={note}
                    onChange={(event) => onNote(event.target.value)}
                    placeholder={journey.consigne}
                    className={textareaClassName}
                />
            </div>

            <div className="flex flex-col gap-1">
                <p className={labelClassName}>État de départ</p>
                <StateTable etat={journey.etatInitial} />
            </div>

            <ol className="flex flex-col gap-3">
                {journey.etapes.slice(0, shown).map((etape, index) => (
                    <li key={etape.titre} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3">
                        <p className="text-sm font-bold">
                            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] text-white">
                                {index + 1}
                            </span>
                            {etape.titre}
                        </p>
                        <p className="break-all font-mono text-xs text-slate-500">
                            {etape.fichier} · l.{etape.lignes}
                        </p>
                        <p className="text-sm text-slate-700">{etape.detail}</p>
                        <StateTable
                            etat={etape.etat}
                            previous={index === 0 ? journey.etatInitial : journey.etapes[index - 1].etat}
                        />
                        <div className="flex flex-wrap gap-1">
                            {etape.liens.map((id) => (
                                <button key={id} type="button" onClick={() => onSelect(id)} className={linkClassName}>
                                    {UNITS[id]?.nom ?? id}
                                </button>
                            ))}
                        </div>
                    </li>
                ))}
            </ol>

            <div className="flex items-center gap-2">
                {shown < total && (
                    <button type="button" onClick={() => setShown(shown + 1)} className={primaryButtonClassName}>
                        Révéler l&apos;étape {shown + 1} sur {total}
                    </button>
                )}
                {shown > 0 && (
                    <button type="button" onClick={() => setShown(0)} className={secondaryButtonClassName}>
                        Tout masquer
                    </button>
                )}
            </div>

            {shown === total && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-amber-800">Question</p>
                    <p className="mt-1 text-sm text-amber-950">{journey.questionFinale}</p>
                </div>
            )}
        </div>
    );
}
