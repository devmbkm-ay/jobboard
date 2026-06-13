import { candidatures } from "@/data/candidatures";
import { ApplicationTable } from "@/components/ApplicationTable";

export default function App() {
    return (
        <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
            <section className="mx-auto max-w-7xl space-y-8">
                <header className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-blue-600">
                        Suivi candidatures
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight">
                        Tableau de bord
                    </h1>

                    <p className="max-w-2xl text-sm text-slate-500">
                        Une première version statique pour suivre les candidatures, les
                        statuts, les priorités et les prochaines actions.
                    </p>
                </header>
                <ApplicationTable candidatures={candidatures} />
            </section>
        </main>
    );
}