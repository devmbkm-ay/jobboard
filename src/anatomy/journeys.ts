// Parcours scénarisés : la chronologie est écrite à la main d'après le code,
// ce n'est pas une trace d'exécution réelle.

export type JourneyState = { nom: string; valeur: string }[];

export type JourneyStep = {
    titre: string;
    fichier: string;
    lignes: string;
    detail: string;
    /** Valeurs des variables suivies, une fois cette étape terminée. */
    etat: JourneyState;
    /** Fiches à ouvrir pour creuser cette étape. */
    liens: string[];
};

export type Journey = {
    titre: string;
    consigne: string;
    etatInitial: JourneyState;
    etapes: JourneyStep[];
    questionFinale: string;
};

const etat = (
    selectedId: string,
    selectedCandidature: string,
    tiroir: string
): JourneyState => [
    { nom: "selectedId", valeur: selectedId },
    { nom: "selectedCandidature", valeur: selectedCandidature },
    { nom: "showForm", valeur: "false" },
    { nom: "editingId", valeur: "null" },
    { nom: "DetailDrawer", valeur: tiroir },
];

export const JOURNEYS: Record<string, Journey> = {
    "clic-ligne": {
        titre: "Clic sur une ligne du tableau",
        consigne:
            "Avant de révéler quoi que ce soit : écris les étapes qui séparent le clic de l'apparition du tiroir, et la valeur de chaque variable à la fin.",
        etatInitial: etat("null", "null", "absent"),
        etapes: [
            {
                titre: "Le navigateur signale un clic sur le <tr>",
                fichier: "src/components/ApplicationTable.tsx",
                lignes: "97",
                detail: "React appelle la fonction fléchée attachée à onClick. Rien n'a encore changé.",
                etat: etat("null", "null", "absent"),
                liens: ["ligne"],
            },
            {
                titre: "La fonction fléchée appelle onRowClick(candidature.id)",
                fichier: "src/components/ApplicationTable.tsx",
                lignes: "97",
                detail: "L'argument candidature.id (une valeur) est injecté dans le paramètre id (un nom). L'id est celui de la ligne, capturé au moment du map.",
                etat: etat("null", "null", "absent"),
                liens: ["arg-id", "onRowClick"],
            },
            {
                titre: "onRowClick est en réalité setSelectedId",
                fichier: "src/components/ApplicationsDashboard.tsx",
                lignes: "107",
                detail: "Le dashboard a passé setSelectedId tel quel comme prop. Il n'y a aucune fonction intermédiaire : la table appelle directement le setter du parent.",
                etat: etat("null", "null", "absent"),
                liens: ["setSelectedId", "onRowClick"],
            },
            {
                titre: "setSelectedId(id) planifie un nouveau rendu",
                fichier: "src/components/ApplicationsDashboard.tsx",
                lignes: "21",
                detail: "La variable selectedId du rendu en cours vaut toujours null. React note la nouvelle valeur et programme une ré-exécution du composant.",
                etat: etat("null (id en attente)", "null", "absent"),
                liens: ["setSelectedId", "selectedId"],
            },
            {
                titre: "React ré-exécute ApplicationsDashboard",
                fichier: "src/components/ApplicationsDashboard.tsx",
                lignes: "15-23",
                detail: "La fonction du composant repart de sa première ligne. Cette fois useState renvoie l'id pour selectedId. Les deux autres états reprennent leur valeur précédente.",
                etat: etat("id de la ligne", "null", "absent"),
                liens: ["selectedId", "showForm", "editingId"],
            },
            {
                titre: "selectedCandidature est recalculée",
                fichier: "src/components/ApplicationsDashboard.tsx",
                lignes: "27",
                detail: "find parcourt candidatures et renvoie l'objet dont l'id correspond. Ce n'est pas un état : la valeur est refabriquée à chaque rendu.",
                etat: etat("id de la ligne", "objet Candidature", "absent"),
                liens: ["selectedCandidature", "candidatures"],
            },
            {
                titre: "Le rendu conditionnel monte DetailDrawer",
                fichier: "src/components/ApplicationsDashboard.tsx",
                lignes: "96-103",
                detail: "selectedCandidature n'est plus null, donc l'expression à droite du && est rendue. Le tiroir reçoit l'objet et trois callbacks en props.",
                etat: etat("id de la ligne", "objet Candidature", "monté"),
                liens: ["tiroir", "selectedCandidature"],
            },
        ],
        questionFinale:
            "Pendant ce nouveau rendu, ApplicationTable est-il ré-exécuté lui aussi ? Ses props ont-elles changé ? Comment pourrais-tu le vérifier ?",
    },
};
