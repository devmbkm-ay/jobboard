# PROGRESS.md — Suivi de candidatures

> Dernière mise à jour : 11 juillet 2026 — *à actualiser à chaque session.*

## En une phrase

Tracker personnel de candidatures (recherche d'alternance webmarketing), construit en apprentissage pas-à-pas pour comprendre chaque couche.

## Stack

Next.js (App Router) · TypeScript · Bun · Tailwind CSS · Framer Motion (plus tard) · déploiement Vercel.

## Étape courante

**Étape 3 — rendre l'app interactive (state + ajout + sélection) : terminée.** Ajout, sélection d'une ligne et tiroir de détail fonctionnent de bout en bout. Prochaine décision : quel chantier de la file d'attente attaquer en premier (localStorage suggéré, car c'est un pré-requis naturel avant d'aller plus loin sur l'édition).

## Déjà fait

- **`lib/types.ts`** — modèle complet. Union discriminée `Candidature = CandidatureSpontanee | CandidatureAnnonce` sur `mode`. Maps `as const` (`STATUT_CANDIDATURE`, `CONTRAT_CANDIDATURE`, `PRIORITE_CANDIDATURE`, `SOURCE_ANNONCE`, `CANAL_APPROCHE`) clé→label, types dérivés via `keyof typeof`. Type `ISODate`. Helper `formatDate()` (fr-FR, fallback `"—"`).
- **`data/candidatures.ts`** — 6 candidatures de test réalistes, typées `Candidature[]` (ne sert plus de state initial, voir ci-dessous).
- **`components/ApplicationTable.tsx`** — colonnes de triage, labels via les maps (zéro `if`), `key={candidature.id}`, wrapper `overflow-x-auto`. Chaque ligne remonte son `id` au clic via `onRowClick` (data-down / actions-up).
- **`components/ApplicationsDashboard.tsx`** — possède tout l'état partagé (`candidatures`, `showForm`, `selectedId`) : lifting state up, data-down / actions-up en place. `selectedCandidature` est une **valeur dérivée** (`candidatures.find(...)`), pas un state dupliqué. State `candidatures` initialisé à `[]` : l'app démarre vide et ne vit que des saisies utilisateur.
- **`components/ApplicationForm.tsx`** — modal de formulaire, state local plat (`FormState`) distinct du modèle métier, bascule `annonce` / `spontanee`, aiguillage à la soumission pour reconstruire l'union discriminée `Candidature` propre. `id` généré via `crypto.randomUUID()`. Input `dateRelance` câblé (date planifiée).
- **`components/DetailDrawer.tsx`** — tiroir latéral (pas modale) affichant tous les champs communs + narrowing sur `mode` pour les champs exclusifs (`sourceAnnonce`/`urlAnnonce` vs `canalApproche`/`raisonCiblage`), labels via les maps. Style aligné sur `ApplicationForm` pour la lisibilité (`text-slate-700`, pas de petites majuscules).

## File d'attente (prochaine étape à choisir)

- Persistance **`localStorage`** + **validation runtime** (`JSON.parse` → `any`). Valider l'invariant : statut au-delà de `a_preparer` ⇒ `dateEnvoi` présente.
- Édition / suppression au niveau de la ligne.
- Filtres (recherche texte + statut) et indicateurs = **valeurs dérivées**, sans nouveau state.
- `StatusBadge` / `PriorityBadge` + couleurs (classes Tailwind **statiques**).
- Framer Motion : apparition des lignes, entrée/sortie du tiroir via `AnimatePresence`.
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

## Décisions en suspens

- **`urlAnnonce`** : laissée optionnelle pour l'instant — confirmer selon le flux de saisie réel.
- Quelle **date** mérite l'unique colonne-date du tableau (celle qui signale « cette ligne réclame une action »).

## Pièges déjà identifiés

- **Tailwind** : aucune classe construite dynamiquement (`bg-${x}-500`) — le scanner build-time ne la voit pas.
- **`new Date("AAAA-MM-JJ")`** : parse en UTC → décalage d'un jour hors de France.
- **`JSON.parse`** : renvoie du `any` non fiable — valider avant de typer.
- Un **type TS ne garantit rien au runtime** : les invariants métier se vérifient à la frontière des données, pas dans le type.