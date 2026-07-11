# PROGRESS.md — Suivi de candidatures

> Dernière mise à jour : 12 juillet 2026 — *à actualiser à chaque session.*

## En une phrase

Tracker personnel de candidatures (recherche d'alternance webmarketing), construit en apprentissage pas-à-pas pour comprendre chaque couche.

## Stack

Next.js (App Router) · TypeScript · Bun · Tailwind CSS · Framer Motion (plus tard) · déploiement Vercel.

## Étape courante

**Étape 4 — persistance et fiabilité des données : localStorage fait.** Prochaine tâche suggérée : édition/suppression d'une candidature existante (voir « File d'attente »).

## Déjà fait

- **`lib/types.ts`** — modèle complet. Union discriminée `Candidature = CandidatureSpontanee | CandidatureAnnonce` sur `mode`. Maps `as const` (`STATUT_CANDIDATURE`, `CONTRAT_CANDIDATURE`, `PRIORITE_CANDIDATURE`, `SOURCE_ANNONCE`, `CANAL_APPROCHE`) clé→label, types dérivés via `keyof typeof`. Type `ISODate`. Helper `formatDate()` (fr-FR, fallback `"—"`).
- **`data/candidatures.ts`** — 6 candidatures de test réalistes, typées `Candidature[]` (ne sert plus de state initial, voir ci-dessous).
- **`components/StatusBadge.tsx` / `components/PriorityBadges.tsx`** — badges colorés pilotés par `badgeClassName`/`dotClassName` dans les maps `as const` de `lib/status.ts`/`lib/priority.ts` — classes Tailwind statiques, aucune construite dynamiquement.
- **`components/ApplicationTable.tsx`** — colonnes de triage, labels via les maps (zéro `if`), `key={candidature.id}`, wrapper `overflow-x-auto`. Chaque ligne remonte son `id` au clic via `onRowClick` (data-down / actions-up).
- **`components/ApplicationForm.tsx`** — modal de formulaire, state local plat (`FormState`) distinct du modèle métier, bascule `annonce` / `spontanee`, aiguillage à la soumission pour reconstruire l'union discriminée `Candidature` propre. `id` généré via `crypto.randomUUID()`. Input `dateRelance` câblé (date planifiée).
- **`components/DetailDrawer.tsx`** — tiroir latéral (pas modale) affichant tous les champs communs + narrowing sur `mode` pour les champs exclusifs (`sourceAnnonce`/`urlAnnonce` vs `canalApproche`/`raisonCiblage`), labels via les maps. Style aligné sur `ApplicationForm` pour la lisibilité (`text-slate-700`, pas de petites majuscules).
- **`lib/storage.ts` + `components/ApplicationsDashboard.tsx`** — persistance `localStorage` via **`useSyncExternalStore`** (pas `useState` + `useEffect`) : `getCandidaturesSnapshot`/`getServerCandidaturesSnapshot`/`subscribeCandidatures` exposent `localStorage` comme source externe, `saveCandidatures` écrit + notifie les abonnés. Synchro multi-onglets via l'événement natif `"storage"`. `isCandidature` (garde de type, `unknown → Candidature`) valide la structure au chargement — **volontairement permissif** pour l'instant (voir Décisions en suspens). `ApplicationsDashboard` ne possède plus `candidatures` en `useState` local : c'est une valeur dérivée du store.

## File d'attente (prochaine étape à choisir)

- **Édition / suppression au niveau de la ligne** — candidat naturel pour la suite : sans ça, impossible de faire progresser le statut d'une candidature déjà créée (`a_preparer` → `envoyee` → `entretien`...), ce qui est pourtant le cœur de l'usage d'un tracker.
- Filtres (recherche texte + statut) et indicateurs = **valeurs dérivées**, sans nouveau state.
- Framer Motion : apparition des lignes, entrée/sortie du tiroir via `AnimatePresence`.
- Durcir `isCandidature` : valider l'invariant `statut`/`dateEnvoi`, et les champs obligatoires spécifiques au `mode` (`sourceAnnonce` pour une annonce) — repéré en revue de code comme laissant passer des données partiellement invalides.
- *(Brainstorm, non prioritaire)* Valeur par défaut de `dateRelance` calculée depuis `dateEnvoi` + N jours ouvrés, et indicateur visuel dérivé « relance en retard ». Décisions à trancher le moment venu : jours fériés ignorés ou non, nombre de jours par défaut, calcul continu vs simple pré-remplissage initial.
- Déploiement Vercel ; éventuelle migration vers une vraie base de données.

## Décisions arrêtées

- Détail = **tiroir latéral**, pas modale.
- Dates : **stockage ISO triable / affichage localisé**.
- Clés techniques snake_case sans accent ; labels d'affichage propres et séparés (Single Source of Truth).
- État partagé porté par `ApplicationsDashboard` (parent commun) ; le formulaire reste un composant contrôlé sans état métier propre — juste un `FormState` de saisie, converti en `Candidature` à la soumission.
- **`dateRelance`** = date **planifiée** de relance (pas la date où la relance a été effectuée).
- **Génération de l'`id`** : `crypto.randomUUID()` — évite les collisions qu'un id basé sur `Date.now()` pouvait produire.
- **Sélection** : on stocke uniquement `selectedId` (jamais l'objet `Candidature` sélectionné) ; la candidature affichée dans le tiroir est dérivée via `.find()`, pour ne pas dupliquer la source de vérité.
- **Persistance** : `useSyncExternalStore` plutôt que `useState` + `useEffect` pour lire/écrire `localStorage`. Choisi après un blocage concret : la règle ESLint `react-hooks/set-state-in-effect` (nouvelle dans `eslint-config-next` 16) interdit tout `setState` synchrone dans un effet et fait échouer `next build` ; `useSyncExternalStore` élimine aussi structurellement le risque de séquencement « sauvegarde avant chargement » qu'on gérait avant avec un flag `isStorageLoaded`.
- **Validation de la frontière `localStorage`** : volontairement **permissive** pour l'instant — `isCandidature` vérifie la structure et les clés des maps (`contrat`, `statut`, `priorite`, `mode`), mais pas encore l'invariant métier `statut`/`dateEnvoi` ni les champs obligatoires propres à chaque `mode`. À durcir plus tard (voir File d'attente).

## Décisions en suspens

- **`urlAnnonce`** : laissée optionnelle pour l'instant — confirmer selon le flux de saisie réel.
- Quelle **date** mérite l'unique colonne-date du tableau (celle qui signale « cette ligne réclame une action »).

## Pièges déjà identifiés

- **Tailwind** : aucune classe construite dynamiquement (`bg-${x}-500`) — le scanner build-time ne la voit pas.
- **`new Date("AAAA-MM-JJ")`** : parse en UTC → décalage d'un jour hors de France.
- **`JSON.parse`** : renvoie du `any` non fiable — valider avant de typer.
- Un **type TS ne garantit rien au runtime** : les invariants métier se vérifient à la frontière des données, pas dans le type.
- **`useSyncExternalStore`** : `getSnapshot` doit renvoyer la **même référence** tant que rien n'a changé (sinon boucle de re-render) ; `getServerSnapshot` doit renvoyer une valeur stable et identique à ce que le premier rendu client verra, sous peine de mismatch d'hydratation.
- Un composant `"use client"` n'est **pas** synonyme d'accès direct à `window`/`localStorage` : Next.js peut quand même le rendre une première fois côté serveur.