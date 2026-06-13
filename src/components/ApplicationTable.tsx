import {
    Candidature,
    CONTRAT_CANDIDATURE,
    PRIORITE_CANDIDATURE,
    STATUT_CANDIDATURE
} from "@/lib/types";

export function ApplicationTable({ candidatures }: { candidatures: Candidature[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                        >
                            Entreprise
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                        >
                            Poste visé
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                        >
                            Contrat
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                        >
                            Statut
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                        >
                            Priorité
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                        >
                            Date de création
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                    {candidatures.map((candidature) => (
                        <tr key={candidature.id}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                                {candidature.entreprise}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                {candidature.posteVise}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                {CONTRAT_CANDIDATURE[candidature.contrat]}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                {STATUT_CANDIDATURE[candidature.statut]}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                {PRIORITE_CANDIDATURE[candidature.priorite]}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                {candidature.dateCreation}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}   