import {
    type Candidature,
    CONTRAT_CANDIDATURE,
    PRIORITE_CANDIDATURE,
    STATUT_CANDIDATURE,
} from "@/lib/types";

const headerCellClassName =
    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500";

const cellClassName = "whitespace-nowrap px-6 py-4 text-sm text-slate-500";

const columns = [

    {
        key: "entreprise",
        label: "Entreprise",
        render: (candidature: Candidature) => candidature.entreprise,
    },
    {
        key: "posteVise",
        label: "Poste visé",
        render: (candidature: Candidature) => candidature.posteVise,
    },
    {
        key: "contrat",
        label: "Contrat",
        render: (candidature: Candidature) =>
            CONTRAT_CANDIDATURE[candidature.contrat],
    },
    {
        key: "statut",
        label: "Statut",
        render: (candidature: Candidature) =>
            STATUT_CANDIDATURE[candidature.statut],
    },
    {
        key: "priorite",
        label: "Priorité",
        render: (candidature: Candidature) =>
            PRIORITE_CANDIDATURE[candidature.priorite],
    },
    {
        key: "dateCreation",
        label: "Créée le",
        render: (candidature: Candidature) => candidature.dateCreation,
    },
    {
        key: "dateRelance",
        label: "Relance",
        render: (candidature: Candidature) =>
            "dateRelance" in candidature && candidature.dateRelance
                ? candidature.dateRelance
                : "—",
    },
    {
        key: "actions",
        label: "Actions",
        render: (candidature: Candidature) => (
            <button className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
                Voir détails
            </button>
        ),
    },
] as const;

export function ApplicationTable({
    candidatures,
}: {
    candidatures: Candidature[];
}) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                className={headerCellClassName}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                    {candidatures.map((candidature) => (
                        <tr key={candidature.id} className="transition hover:bg-slate-50">
                            {columns.map((column) => (
                                <td key={column.key} className={cellClassName}>
                                    {column.render(candidature)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}