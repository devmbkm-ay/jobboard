import { Candidature, CONTRAT_CANDIDATURE } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadges } from "./PriorityBadges";
import { formatDate } from "@/lib/date";

export function DetailDrawer({ candidature, onClose }: { candidature: Candidature | null; onClose: () => void }) {
    if (!candidature) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="ml-auto w-full max-w-md bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Détails de la candidature</h2>
                <p><strong>Entreprise:</strong> {candidature.entreprise}</p>
                <p><strong>Poste visé:</strong> {candidature.posteVise}</p>
                <p><strong>Contrat:</strong> {CONTRAT_CANDIDATURE[candidature.contrat]}</p>
                <p><strong>Statut:</strong> <StatusBadge statut={candidature.statut} /></p>
                <p><strong>Priorité:</strong> <PriorityBadges priorite={candidature.priorite} /></p>
                <p><strong>Créée le:</strong> {formatDate(candidature.dateCreation)}</p>
                <p><strong>Relance:</strong> {"dateRelance" in candidature && candidature.dateRelance ? formatDate(candidature.dateRelance) : "—"}</p>
                <button
                    className="mt-4 rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
                    onClick={onClose}
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}