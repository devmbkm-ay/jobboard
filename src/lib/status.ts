type StatutConfig = {
    label: string;
    description: string;
    badgeClassName: string;
    dotClassName: string;
    order: number;
};

export const STATUT_CANDIDATURE = {
    a_preparer: {
        label: "À préparer",
        description: "Candidature à finaliser avant envoi",
        badgeClassName: "bg-yellow-100 text-yellow-800 ring-yellow-200",
        dotClassName: "bg-yellow-500",
        order: 1,
    },
    envoyee: {
        label: "Envoyée",
        description: "Candidature envoyée, en attente de retour",
        badgeClassName: "bg-blue-100 text-blue-800 ring-blue-200",
        dotClassName: "bg-blue-500",
        order: 2,
    },
    relancee: {
        label: "Relancée",
        description: "Une relance a déjà été effectuée",
        badgeClassName: "bg-orange-100 text-orange-800 ring-orange-200",
        dotClassName: "bg-orange-500",
        order: 3,
    },
    entretien: {
        label: "Entretien",
        description: "Un entretien est prévu ou en cours",
        badgeClassName: "bg-purple-100 text-purple-800 ring-purple-200",
        dotClassName: "bg-purple-500",
        order: 4,
    },
    acceptee: {
        label: "Acceptée",
        description: "Candidature acceptée",
        badgeClassName: "bg-green-100 text-green-800 ring-green-200",
        dotClassName: "bg-green-500",
        order: 5,
    },
    refusee: {
        label: "Refusée",
        description: "Candidature refusée",
        badgeClassName: "bg-red-100 text-red-800 ring-red-200",
        dotClassName: "bg-red-500",
        order: 6,
    },
    sans_reponse: {
        label: "Sans réponse",
        description: "Aucun retour obtenu après relance",
        badgeClassName: "bg-slate-100 text-slate-700 ring-slate-200",
        dotClassName: "bg-slate-400",
        order: 7,
    },
} as const satisfies Record<string, StatutConfig>;

export type StatutCandidature = keyof typeof STATUT_CANDIDATURE;

export const STATUT_CANDIDATURE_ORDER = [
    "a_preparer",
    "envoyee",
    "relancee",
    "entretien",
    "acceptee",
    "refusee",
    "sans_reponse",
] as const satisfies readonly StatutCandidature[];