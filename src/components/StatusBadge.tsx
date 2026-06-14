import { STATUT_CANDIDATURE, StatutCandidature } from "@/lib/status";



interface StatusBadgeProps {
    statut: StatutCandidature;
}

export function StatusBadge({ statut }: StatusBadgeProps) {
    const config = STATUT_CANDIDATURE[statut];

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.badgeClassName}`}>
            {config.label}
        </span>
    );
}

