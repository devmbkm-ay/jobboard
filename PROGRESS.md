# PROGRESS.md — Suivi de candidatures

> Dernière mise à jour : 8 juillet 2026 — *à actualiser à chaque session.*

## En une phrase

Tracker personnel de candidatures (recherche d'alternance webmarketing), construit en apprentissage pas-à-pas pour comprendre chaque couche.

## Stack

Next.js (App Router) · TypeScript · Bun · Tailwind CSS · Framer Motion (plus tard) · déploiement Vercel.

## Étape courante

**Étape 3 — rendre l'app interactive** (state + ajout). L'ajout de candidature fonctionne de bout en bout ; objectif immédiat : la sélection d'une ligne pour ouvrir le tiroir de détail.

## Déjà fait

- **`lib/types.ts`** — modèle complet. Union discriminée `Candidature = CandidatureSpontanee | CandidatureAnnonce` sur `mode`. Maps `as const` (`STATUT_CANDIDATURE`, `CONTRAT_CANDIDATURE`, `PRIORITE_CANDIDATURE`, `SOURCE_ANNONCE`, `CANAL_APPROCHE`) clé→label, types dérivés via `keyof typeof`. Type `ISODate`. Helper `formatDate()` (fr-FR, fallback `"—"`).
- **`data/candidatures.ts`** — 6 candidatures de test réalistes, typées `Candidature[]` (ne sert plus de state initial, voir ci-dessous).
- **`components/ApplicationTable.tsx`** — rendu statique : colonnes de triage, labels via les maps (zéro `if`), `key={candidature.id}`, wrapper `overflow-x-auto`.
- **`components/ApplicationsDashboard.tsx`** — possède l'état (`candidatures`, `showForm`) : lifting state up réalisé, data-down / actions-up en place (`addCandidature` descend en prop `onSubmit`). State initialisé à `[]` : l'app démarre vide et ne vit que des saisies utilisateur (`data/candidatures.ts` n'est plus importé ici).
- **`components/ApplicationForm.tsx`** — modal de formulaire, state local plat (`FormState`) distinct du modèle métier, bascule `annonce` / `spontanee`, aiguillage à la soumission pour reconstruire l'union discriminée `Candidature` propre (`id` généré via `` `cand_${Date.now()}` ``).

## Prochaine tâche (à raisonner par moi, pas à recevoir tout cuit)

1. **Sélection d'une ligne → tiroir latéral de détail** — état `selectedId` dans `ApplicationsDashboard`. C'est là que l'union discriminée paie (rendu conditionnel selon `mode`, narrowing TS).

## File d'attente (après l'étape 3)

- Persistance **`localStorage`** + **validation runtime** (`JSON.parse` → `any`). Valider l'invariant : statut au-delà de `a_preparer` ⇒ `dateEnvoi` présente.
- Édition / suppression au niveau de la ligne.
- Filtres (recherche texte + statut) et indicateurs = **valeurs dérivées**, sans nouveau state.
- `StatusBadge` / `PriorityBadge` + couleurs (classes Tailwind **statiques**).
- Framer Motion : apparition des lignes, entrée/sortie du tiroir via `AnimatePresence`.
- Déploiement Vercel ; éventuelle migration vers une vraie base de données.

## Décisions arrêtées

- Détail = **tiroir latéral**, pas modale.
- Dates : **stockage ISO triable / affichage localisé**.
- Clés techniques snake_case sans accent ; labels d'affichage propres et séparés (Single Source of Truth).
- État partagé porté par `ApplicationsDashboard` (parent commun) ; le formulaire reste un composant contrôlé sans état métier propre — juste un `FormState` de saisie, converti en `Candidature` à la soumission.

## Décisions en suspens

- **Sens de `dateRelance`** : « date où j'ai relancé » (effectuée) *ou* « date où je compte relancer » (planifiée) ? Ne pas mélanger les deux dans un seul champ — trancher avant de coder le formulaire. *(Le champ existe dans `FormState` mais n'a pas encore d'input dans le JSX — en attente de cette décision.)*
- **`urlAnnonce`** : laissée optionnelle pour l'instant — confirmer selon le flux de saisie réel.
- Quelle **date** mérite l'unique colonne-date du tableau (celle qui signale « cette ligne réclame une action »).
- **Génération de l'`id`** : le formulaire utilise `` `cand_${Date.now()}` `` plutôt que `crypto.randomUUID()` évoqué initialement — à trancher si ça reste ainsi ou si on harmonise.

## Pièges déjà identifiés

- **Tailwind** : aucune classe construite dynamiquement (`bg-${x}-500`) — le scanner build-time ne la voit pas.
- **`new Date("AAAA-MM-JJ")`** : parse en UTC → décalage d'un jour hors de France.
- **`JSON.parse`** : renvoie du `any` non fiable — valider avant de typer.
- Un **type TS ne garantit rien au runtime** : les invariants métier se vérifient à la frontière des données, pas dans le type.