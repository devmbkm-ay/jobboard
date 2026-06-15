"use client"

import { useState } from "react";
import { Candidature } from "@/lib/types";
import { ApplicationTable } from "./ApplicationTable";
import { candidatures as initialCandidatures } from "@/data/candidatures";


export default function ApplicationsDashboard() {
    const [candidatures, setCandidatures] = useState<Candidature[]>(initialCandidatures);

    return (
        <div>
            {/* On utilise flex et justify-between pour séparer le texte et le bouton */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    Tableau de bord
                </h1>
                {/* Le bouton est maintenant ici, aligné à droite sur grand écran */}
                <button className="flex h-fit w-fit rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium mb-4 text-white hover:bg-blue-700">
                    Ajouter une candidature
                </button>
            </div>
            <ApplicationTable candidatures={candidatures} />
        </div>
    );
}

