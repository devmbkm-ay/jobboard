import React, { useState } from "react";
import type {
    Candidature,
    ContratCandidature,
    SourceAnnonce,
    CanalApproche,
    ISODate
} from "@/lib/types";
import type { StatutCandidature } from "@/lib/status";
import type { PrioriteCandidature } from "@/lib/priority";
import { CONTRAT_CANDIDATURE, SOURCE_ANNONCE, CANAL_APPROCHE } from "@/lib/types";

interface ApplicationFormProps {
    onClose: () => void;
    onSubmit: (candidature: Candidature) => void;
    candidatureToEdit?: Candidature; // Optionnel, pour l'édition
}

// 1. On crée un type spécifique pour l'état du formulaire (plat et tolérant)
interface FormState {
    entreprise: string;
    posteVise: string;
    contrat: ContratCandidature;
    statut: StatutCandidature;
    priorite: PrioriteCandidature;
    dateCreation: string; // string simple pour l'input type="date"
    dateEnvoi: string;
    dateRelance: string;
    contact: string;
    notes: string;
    mode: "annonce" | "spontanee";
    // Champs exclusifs cumulés
    sourceAnnonce: SourceAnnonce;
    urlAnnonce: string;
    referenceAnnonce: string;
    canalApproche: CanalApproche;
    raisonCiblage: string;
}
export function createInitialFormState(candidatureToEdit?: Candidature): FormState {
    return {
        entreprise: candidatureToEdit?.entreprise ?? "",
        posteVise: candidatureToEdit?.posteVise ?? "",
        contrat: candidatureToEdit?.contrat ?? "cdi",
        statut: candidatureToEdit?.statut ?? "a_preparer",
        priorite: candidatureToEdit?.priorite ?? "moyenne",
        dateCreation: candidatureToEdit?.dateCreation ?? new Date().toISOString().split("T")[0], // Format YYYY-MM-DD
        dateEnvoi: candidatureToEdit?.dateEnvoi ?? "",
        dateRelance: candidatureToEdit?.dateRelance ?? "",
        contact: candidatureToEdit?.contact ?? "",
        notes: candidatureToEdit?.notes ?? "",
        mode: candidatureToEdit?.mode ?? "annonce", // Mode initial par défaut
        sourceAnnonce: candidatureToEdit?.mode === "annonce" ? candidatureToEdit.sourceAnnonce : "linkedin",
        urlAnnonce: candidatureToEdit?.mode === "annonce" ? (candidatureToEdit.urlAnnonce ?? "") : "",
        referenceAnnonce: candidatureToEdit?.mode === "annonce" ? (candidatureToEdit.referenceAnnonce ?? "") : "",
        canalApproche: candidatureToEdit?.mode === "spontanee" ? (candidatureToEdit.canalApproche ?? "email") : "email",
        raisonCiblage: candidatureToEdit?.mode === "spontanee" ? (candidatureToEdit.raisonCiblage ?? "") : "",
    };
}

export function ApplicationForm({ onClose, onSubmit, candidatureToEdit }: ApplicationFormProps) {
    // 2. Initialisation complète et sans erreur TypeScript
    const [formData, setFormData] = useState(() => createInitialFormState(candidatureToEdit));

    // 3. Gestionnaire unique universel (gère input, select, textarea)
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 4. Changement de mode explicite
    const handleModeChange = (nouveauMode: "annonce" | "spontanee") => {
        setFormData((prev) => ({ ...prev, mode: nouveauMode }));
    };

    // 5. La soumission : Le point de passage de la souplesse vers la rigueur
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // On extrait et prépare la base commune
        const baseCandidature = {
            id: candidatureToEdit?.id ?? crypto.randomUUID(),
            entreprise: formData.entreprise,
            posteVise: formData.posteVise,
            contrat: formData.contrat,
            statut: formData.statut,
            priorite: formData.priorite,
            dateCreation: formData.dateCreation as ISODate, // On force le type de manière sûre ici
            ...(formData.dateEnvoi && { dateEnvoi: formData.dateEnvoi as ISODate }),
            ...(formData.dateRelance && { dateRelance: formData.dateRelance as ISODate }),
            ...(formData.contact && { contact: formData.contact }),
            ...(formData.notes && { notes: formData.notes }),
        };

        let donneesFinales: Candidature;

        // On aiguille dynamiquement selon le scénario choisi par l'utilisateur
        if (formData.mode === "annonce") {
            donneesFinales = {
                ...baseCandidature,
                mode: "annonce",
                sourceAnnonce: formData.sourceAnnonce,
                ...(formData.urlAnnonce && { urlAnnonce: formData.urlAnnonce }),
                ...(formData.referenceAnnonce && { referenceAnnonce: formData.referenceAnnonce }),
            };
        } else {
            donneesFinales = {
                ...baseCandidature,
                mode: "spontanee",
                canalApproche: formData.canalApproche,
                ...(formData.raisonCiblage && { raisonCiblage: formData.raisonCiblage }),
            };
        }
        onSubmit(donneesFinales);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl flex flex-col gap-4 my-8">

                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-slate-900">
                        {candidatureToEdit
                            ? "Modifier la candidature"
                            : "Nouvelle candidature"}
                    </h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">

                    {/* Boutons Bascule de Mode */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                        <button
                            type="button"
                            className={`py-1.5 text-center font-medium rounded-md transition-all ${formData.mode === "annonce" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"}`}
                            onClick={() => handleModeChange("annonce")}
                        >
                            Réponse à une annonce
                        </button>
                        <button
                            type="button"
                            className={`py-1.5 text-center font-medium rounded-md transition-all ${formData.mode === "spontanee" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"}`}
                            onClick={() => handleModeChange("spontanee")}
                        >
                            Candidature spontanée
                        </button>
                    </div>

                    {/* Champs Communs Obligatoires */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-700">Entreprise *</label>
                            <input required type="text" name="entreprise" value={formData.entreprise} onChange={handleChange} className="rounded-lg border p-2 focus:outline-blue-500" placeholder="Ex: Groupe Atlantic" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-700">Poste visé *</label>
                            <input required type="text" name="posteVise" value={formData.posteVise} onChange={handleChange} className="rounded-lg border p-2 focus:outline-blue-500" placeholder="Ex: Alternance Marketing" />
                        </div>
                    </div>

                    {/* Ligne Sélections */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-700">Contrat</label>
                            <select name="contrat" value={formData.contrat} onChange={handleChange} className="rounded-lg border p-2 bg-white">
                                {Object.entries(CONTRAT_CANDIDATURE).map(([key, val]) => (
                                    <option key={key} value={key}>{val}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-700">Priorité</label>
                            <select name="priorite" value={formData.priorite} onChange={handleChange} className="rounded-lg border p-2 bg-white">
                                <option value="haute">Haute</option>
                                <option value="moyenne">Moyenne</option>
                                <option value="basse">Basse</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-700">Statut</label>
                            <select name="statut" value={formData.statut} onChange={handleChange} className="rounded-lg border p-2 bg-white">
                                <option value="a_preparer">À préparer</option>
                                <option value="envoyee">Envoyée</option>
                                <option value="relancee">Relancée</option>
                                <option value="entretien">Entretien</option>
                                <option value="acceptee">Acceptée</option>
                                <option value="sans_reponse">Sans réponse</option>
                                <option value="refusee">Refusée</option>
                            </select>
                        </div>
                    </div>

                    {/* BLOC DYNAMIQUE CONDITIONNEL */}
                    <div className="p-4 bg-slate-50 border rounded-xl">
                        {formData.mode === "annonce" ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="font-medium text-slate-700">Source</label>
                                        <select name="sourceAnnonce" value={formData.sourceAnnonce} onChange={handleChange} className="rounded-lg border p-2 bg-white">
                                            {Object.entries(SOURCE_ANNONCE).map(([key, val]) => (
                                                <option key={key} value={key}>{val}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-medium text-slate-700">Référence</label>
                                        <input type="text" name="referenceAnnonce" value={formData.referenceAnnonce} onChange={handleChange} className="rounded-lg border p-2" placeholder="Ex: LINKEDIN-001" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-slate-700">Lien de l&apos;annonce</label>
                                    <input type="url" name="urlAnnonce" value={formData.urlAnnonce} onChange={handleChange} className="rounded-lg border p-2" placeholder="https://..." />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-slate-700">Canal d&apos;approche</label>
                                    <select name="canalApproche" value={formData.canalApproche} onChange={handleChange} className="rounded-lg border p-2 bg-white">
                                        {Object.entries(CANAL_APPROCHE).map(([key, val]) => (
                                            <option key={key} value={key}>{val}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-slate-700">Raison du ciblage</label>
                                    <textarea name="raisonCiblage" value={formData.raisonCiblage} onChange={handleChange} rows={2} className="rounded-lg border p-2 resize-none" placeholder="Pourquoi cette entreprise ?" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dates & Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-700">Créée le *</label>
                            <input required type="date" name="dateCreation" value={formData.dateCreation} onChange={handleChange} className="rounded-lg border p-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-700">Envoyée le</label>
                            <input type="date" name="dateEnvoi" value={formData.dateEnvoi} onChange={handleChange} className="rounded-lg border p-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-700">Relance prévue le</label>
                            <input type="date" name="dateRelance" value={formData.dateRelance} onChange={handleChange} className="rounded-lg border p-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-700">Contact RH</label>
                            <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="rounded-lg border p-2" placeholder="Nom ou service" />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-slate-700">Notes stratégiques</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="rounded-lg border p-2 resize-none" placeholder="Points clés à retenir..." />
                    </div>

                    {/* Actions de fin */}
                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200">
                            Annuler
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm">
                            {candidatureToEdit
                                ? "Mettre à jour"
                                : "Ajouter"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}