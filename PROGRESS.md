# PROGRESS.md — Suivi de candidatures

> Dernière mise à jour : 15 juin 2026 — *à actualiser à chaque session.*

## En une phrase

Tracker personnel de candidatures (recherche d'alternance webmarketing), construit en apprentissage pas-à-pas pour comprendre chaque couche.

## Stack

Next.js (App Router) · TypeScript · Bun · Tailwind CSS · Framer Motion (plus tard) · déploiement Vercel.

## Étape courante

**Étape 3 — rendre l'app interactive** (state + ajout). Jusqu'ici, tout est statique ; objectif immédiat : faire vivre les données dans un état React.

## Déjà fait

- **`lib/types.ts`** — modèle complet. Union discriminée `Candidature = CandidatureSpontanee | CandidatureAnnonce` sur `mode`. Maps `as const` (`STATUT_CANDIDATURE`, `CONTRAT_CANDIDATURE`, `PRIORITE_CANDIDATURE`, `SOURCE_ANNONCE`, `CANAL_APPROCHE`) clé→label, types dérivés via `keyof typeof`. Type `ISODate`. Helper `formatDate()` (fr-FR, fallback `"—"`).
- **`data/candidatures.ts`** — 6 candidatures de test réalistes, typées `Candidature[]`.
- **`components/ApplicationTable.tsx`** — rendu statique : colonnes de triage, labels via les maps (zéro `if`), `key={candidature.id}`, wrapper `overflow-x-auto`.
- **`app/page.tsx`** — header + bouton « Ajouter une candidature » (encore inerte).

## Prochaine tâche (à raisonner par moi, pas à recevoir tout cuit)

1. **Lifting state up** — déterminer *et justifier* quel composant possède l'état (piste : un parent commun type `ApplicationsDashboard`). Comprendre data-down / actions-up, et la frontière Server/Client Component (`"use client"`) que le bouton interactif va imposer.
2. **Câbler l'ajout** — le formulaire demande au parent d'ajouter une candidature ; générer l'`id` avec `crypto.randomUUID()`.
3. **Sélection d'une ligne → tiroir latéral de détail** — état `selectedId`. C'est là que l'union discriminée paie (rendu conditionnel selon `mode`, narrowing TS).

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

## Décisions en suspens

- **Sens de `dateRelance`** : « date où j'ai relancé » (effectuée) *ou* « date où je compte relancer » (planifiée) ? Ne pas mélanger les deux dans un seul champ — trancher avant de coder le formulaire.
- **`urlAnnonce`** : laissée optionnelle pour l'instant — confirmer selon le flux de saisie réel.
- Quelle **date** mérite l'unique colonne-date du tableau (celle qui signale « cette ligne réclame une action »).

## Pièges déjà identifiés

- **Tailwind** : aucune classe construite dynamiquement (`bg-${x}-500`) — le scanner build-time ne la voit pas.
- **`new Date("AAAA-MM-JJ")`** : parse en UTC → décalage d'un jour hors de France.
- **`JSON.parse`** : renvoie du `any` non fiable — valider avant de typer.
- Un **type TS ne garantit rien au runtime** : les invariants métier se vérifient à la frontière des données, pas dans le type.