"use client"

import { useState, useSyncExternalStore } from "react";
import { Candidature } from "@/lib/types";
import { ApplicationTable } from "./ApplicationTable";
import { ApplicationForm } from "./ApplicationForm";
import { DetailDrawer } from "./DetailDrawer";
import {
    getCandidaturesSnapshot,
    getServerCandidaturesSnapshot,
    saveCandidatures,
    subscribeCandidatures,
} from "@/lib/storage";

export default function ApplicationsDashboard() {
    const candidatures = useSyncExternalStore(
        subscribeCandidatures,
        getCandidaturesSnapshot,
        getServerCandidaturesSnapshot
    );
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const addCandidature = (newCandidature: Candidature) => {
        saveCandidatures([...candidatures, newCandidature]);
    };
    const selectedCandidature = candidatures.find(candidature => candidature.id === selectedId) ?? null;
    const editingCandidature = candidatures.find(candidature => candidature.id === editingId) ?? null;
    const updateCandidature = (updatedCandidature: Candidature) => {
        const updatedCandidatures = candidatures.map(candidature =>
            candidature.id === updatedCandidature.id ? updatedCandidature : candidature
        );
        saveCandidatures(updatedCandidatures);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
    };

    // Fonction pour éditer une candidature
    const editCandidature = (id: string) => {
        // Logique pour éditer la candidature en filtrant l'ID de la candidature à partir de la liste des candidatures
        const candidatureToEdit = candidatures.find(candidature => candidature.id === id);
        if (!candidatureToEdit) {
            console.error("Candidature non trouvée pour l'ID :", id);
            return;
        }
        setEditingId(id);
        setSelectedId(null);
        setShowForm(true);

    };
    const deleteCandidature = (id: string) => {
        const remainingCandidatures = candidatures.filter(
            (candidature) => candidature.id !== id
        );
        saveCandidatures(remainingCandidatures);
        if (selectedId === id) {
            setSelectedId(null);
        }
    };


    return (
        <div>
            {/* On utilise flex et justify-between pour séparer le texte et le bouton */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    Tableau de bord
                </h1>
                {/* Le bouton est maintenant ici, aligné à droite sur grand écran */}
                <button
                    className="flex h-fit w-fit rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium mb-4 text-white hover:bg-blue-700"
                    onClick={() => {
                        setEditingId(null); // Réinitialiser l'édition si on ouvre le formulaire pour une nouvelle candidature
                        setShowForm(true);
                    }}>
                    Ajouter une candidature
                </button>
            </div>
            {showForm && (
                <ApplicationForm
                    onClose={closeForm}
                    onSubmit={(submittedCandidature) => {
                        if (editingCandidature) {
                            updateCandidature(submittedCandidature);
                        } else {
                            addCandidature(submittedCandidature);
                        }
                        closeForm();
                    }}
                    candidatureToEdit={editingCandidature ?? undefined}
                />
            )}
            {selectedCandidature && (
                <DetailDrawer
                    candidature={selectedCandidature}
                    onClose={() => setSelectedId(null)}
                    onDelete={deleteCandidature}
                    onEdit={editCandidature}
                />
            )}
            <div className="mt-6">
                <ApplicationTable
                    candidatures={candidatures}
                    onRowClick={setSelectedId} />

            </div>
        </div>
    );
}

