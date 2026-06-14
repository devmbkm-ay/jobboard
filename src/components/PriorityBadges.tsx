import {
    PRIORITE_CANDIDATURE,
    type PrioriteCandidature,
} from "@/lib/priority";

interface PriorityBadgesProps {
    priorite: PrioriteCandidature;
}

export function PriorityBadges({ priorite }: PriorityBadgesProps) {
    const config = PRIORITE_CANDIDATURE[priorite];

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.badgeClassName}`}>
            {config.label}
        </span>
    );
}