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
    const addCandidature = (newCandidature: Candidature) => {
        saveCandidatures([...candidatures, newCandidature]);
    };
    const selectedCandidature = candidatures.find(c => c.id === selectedId) ?? null;
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
                        setShowForm(true);
                    }}>
                    Ajouter une candidature
                </button>
            </div>
            {showForm && (
                <ApplicationForm
                    onClose={() => setShowForm(false)}
                    onSubmit={(newCandidature) => {
                        addCandidature(newCandidature);
                        setShowForm(false);
                    }}
                />
            )}
            {selectedCandidature && (
                <DetailDrawer
                    candidature={selectedCandidature}
                    onDelete={deleteCandidature}
                    onClose={() => setSelectedId(null)}
                // onEdit={() => {
                // Logique d'édition
                // }}
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

