type PrioriteConfig = {
    label: string;
    description: string;
    badgeClassName: string;
    dotClassName: string;
    order: number;
};

export const PRIORITE_CANDIDATURE = {
    haute: {
        label: "Haute",
        description: "Candidature importante à traiter rapidement",
        badgeClassName: "bg-red-100 text-red-800 ring-red-200",
        dotClassName: "bg-red-500",
        order: 1,
    },
    moyenne: {
        label: "Moyenne",
        description: "Candidature intéressante mais non urgente",
        badgeClassName: "bg-orange-100 text-orange-800 ring-orange-200",
        dotClassName: "bg-orange-500",
        order: 2,
    },
    basse: {
        label: "Basse",
        description: "Candidature secondaire ou moins prioritaire",
        badgeClassName: "bg-emerald-100 text-emerald-800 ring-emerald-200",
        dotClassName: "bg-emerald-500",
        order: 3,
    },
} as const satisfies Record<string, PrioriteConfig>;

export type PrioriteCandidature = keyof typeof PRIORITE_CANDIDATURE;

export const PRIORITE_CANDIDATURE_ORDER = [
    "haute",
    "moyenne",
    "basse",
] as const satisfies readonly PrioriteCandidature[];