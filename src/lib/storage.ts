import type { Candidature } from "@/lib/types";
import { CONTRAT_CANDIDATURE } from "@/lib/types";
import { PRIORITE_CANDIDATURE } from "@/lib/priority";
import { STATUT_CANDIDATURE } from "@/lib/status";

const STORAGE_KEY = "jobboard:candidatures";

function isCandidature(value: unknown): value is Candidature {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }
    const candidature = value as Record<string, unknown>;
    return (
        typeof candidature.id === "string" &&
        typeof candidature.entreprise === "string" &&
        typeof candidature.posteVise === "string" &&
        typeof candidature.contrat === "string" &&
        candidature.contrat in CONTRAT_CANDIDATURE &&
        typeof candidature.statut === "string" &&
        candidature.statut in STATUT_CANDIDATURE &&
        typeof candidature.dateCreation === "string" &&
        typeof candidature.priorite === "string" &&
        candidature.priorite in PRIORITE_CANDIDATURE &&
        (candidature.mode === "spontanee" || candidature.mode === "annonce")
    );
}

function readFromLocalStorage(): Candidature[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];

    try {
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            console.error("Stored candidatures is not an array:", parsed);
            return [];
        }
        return parsed.filter(isCandidature);
    } catch (error) {
        console.error("Error parsing stored candidatures:", error);
        return [];
    }
}

// Référence stable renvoyée côté serveur (localStorage n'existe pas là-bas) :
// toujours le même tableau vide, pour que useSyncExternalStore ne voie jamais
// de changement entre deux appels.
const EMPTY_CANDIDATURES: Candidature[] = [];

const listeners = new Set<() => void>();
let cache: Candidature[] = EMPTY_CANDIDATURES;
let hasHydrated = false;

/**
 * À appeler par useSyncExternalStore : lit localStorage une seule fois
 * (au premier appel côté client), puis renvoie toujours la même référence
 * tant que rien n'a changé.
 */
export function getCandidaturesSnapshot(): Candidature[] {
    if (!hasHydrated) {
        cache = readFromLocalStorage();
        hasHydrated = true;
    }
    return cache;
}

export function getServerCandidaturesSnapshot(): Candidature[] {
    return EMPTY_CANDIDATURES;
}

/**
 * S'abonne aux changements de la collection : les écritures faites par cet
 * onglet (via saveCandidatures) et celles faites par d'autres onglets
 * (événement natif "storage") déclenchent toutes deux `callback`.
 */
export function subscribeCandidatures(callback: () => void): () => void {
    listeners.add(callback);

    const handleStorageEvent = (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY) return;
        hasHydrated = false; // force une relecture au prochain getSnapshot
        callback();
    };
    window.addEventListener("storage", handleStorageEvent);

    return () => {
        listeners.delete(callback);
        window.removeEventListener("storage", handleStorageEvent);
    };
}

/**
 * Écrit la nouvelle collection : met à jour le cache, persiste dans
 * localStorage, puis notifie les abonnés (déclenche un re-render de tout
 * composant branché via useSyncExternalStore).
 */
export function saveCandidatures(next: Candidature[]): void {
    cache = next;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
        console.error("Impossible de sauvegarder les candidatures :", error);
    }
    listeners.forEach((listener) => listener());
}
