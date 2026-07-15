import {
    Candidature,
    CONTRAT_CANDIDATURE,
    SOURCE_ANNONCE,
    CANAL_APPROCHE,
} from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadges } from "./PriorityBadges";
import { formatDate } from "@/lib/date";

export function DetailDrawer({
    candidature,
    onClose,
    onDelete,
    onEdit
}: {
    candidature: Candidature | null;
    onClose: () => void;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
}) {
    if (!candidature) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 z-0 bg-slate-900/50" onClick={onClose}></div>

            <div className="relative z-10 ml-auto flex h-full w-full max-w-md flex-col gap-4 overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{candidature.entreprise}</h2>
                        <span className="mt-1 inline-block rounded-full bg-slate-700 border border-slate-500 px-2 py-0.5 text-xs font-medium text-slate-100">
                            {candidature.mode === "annonce" ? "Réponse à une annonce" : "Candidature spontanée"}
                        </span>
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-700">Poste visé</label>
                    <p className="text-sm text-slate-900">{candidature.posteVise}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-700">Contrat</label>
                        <p className="text-sm text-slate-900">{CONTRAT_CANDIDATURE[candidature.contrat]}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-700">Statut</label>
                        <StatusBadge statut={candidature.statut} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-700">Priorité</label>
                        <PriorityBadges priorite={candidature.priorite} />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-700">Créée le</label>
                        <p className="text-sm text-slate-900">{formatDate(candidature.dateCreation)}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-700">Envoyée le</label>
                        <p className="text-sm text-slate-900">{candidature.dateEnvoi ? formatDate(candidature.dateEnvoi) : "—"}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-700">Relance prévue</label>
                        <p className="text-sm text-slate-900">{candidature.dateRelance ? formatDate(candidature.dateRelance) : "—"}</p>
                    </div>
                </div>

                {candidature.contact && (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-700">Contact RH</label>
                        <p className="text-sm text-slate-900">{candidature.contact}</p>
                    </div>
                )}

                <div className="rounded-xl border bg-slate-50 p-4">
                    {candidature.mode === "annonce" ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-slate-700">Source</label>
                                <p className="text-sm text-slate-900">{SOURCE_ANNONCE[candidature.sourceAnnonce]}</p>
                            </div>
                            {candidature.referenceAnnonce && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-slate-700">Référence</label>
                                    <p className="text-sm text-slate-900">{candidature.referenceAnnonce}</p>
                                </div>
                            )}
                            {candidature.urlAnnonce && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-slate-700">Lien de l&apos;annonce</label>
                                    <a
                                        href={candidature.urlAnnonce}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="truncate text-sm text-blue-600 hover:underline"
                                    >
                                        {candidature.urlAnnonce}
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {candidature.canalApproche && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-slate-700">Canal d&apos;approche</label>
                                    <p className="text-sm text-slate-900">{CANAL_APPROCHE[candidature.canalApproche]}</p>
                                </div>
                            )}
                            {candidature.raisonCiblage && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-slate-700">Raison du ciblage</label>
                                    <p className="text-sm text-slate-900">{candidature.raisonCiblage}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {candidature.notes && (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-700">Notes</label>
                        <p className="whitespace-pre-wrap text-sm text-slate-900">{candidature.notes}</p>
                    </div>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-auto rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                    >
                        Fermer
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onDelete(candidature.id)}
                            className="mt-auto rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Supprimer
                        </button>
                        <button
                            type="button"
                            onClick={() => onEdit(candidature.id)}
                            // onClickCapture={onClose}
                            className="mt-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Editer
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
}
