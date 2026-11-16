// Fiches anatomiques écrites à la main à partir du code du 16/11/2026.
// Les numéros de ligne ne se mettent pas à jour tout seuls : si le code bouge,
// corrige la fiche (c'est aussi un bon exercice de relecture).

export type UnitKind =
    | "état"
    | "setter"
    | "valeur dérivée"
    | "store externe"
    | "prop"
    | "argument"
    | "fonction"
    | "référentiel"
    | "composant"
    | "élément";

export type Unit = {
    nom: string;
    genre: UnitKind;
    fichier: string;
    lignes: string;
    /** Ce que la fiche révèle après ta propre lecture. */
    champs: { label: string; valeur: string }[];
    /** Identifiants d'autres fiches à explorer depuis celle-ci. */
    liens: string[];
    /** Question ouverte, sans réponse fournie. */
    question?: string;
    /** Identifiant d'un parcours rejouable (voir journeys.ts). */
    parcours?: string;
};

const DASHBOARD = "src/components/ApplicationsDashboard.tsx";
const TABLE = "src/components/ApplicationTable.tsx";
const DRAWER = "src/components/DetailDrawer.tsx";

export const UNITS: Record<string, Unit> = {
    // ───────────── Atomes : états ─────────────
    selectedId: {
        nom: "selectedId",
        genre: "état",
        fichier: DASHBOARD,
        lignes: "21",
        champs: [
            { label: "Type", valeur: "string | null" },
            { label: "Rôle", valeur: "Identifie la candidature dont le tiroir est ouvert. null = aucun tiroir." },
            { label: "Source", valeur: "useState<string | null>(null)" },
            { label: "Lu par", valeur: "selectedCandidature (l.27) · deleteCandidature (l.59)" },
            {
                label: "Modifié par",
                valeur: "clic sur une ligne via onRowClick (l.107) · onClose du tiroir (l.99) · editCandidature (l.50) · deleteCandidature (l.60)",
            },
        ],
        liens: ["setSelectedId", "selectedCandidature", "onRowClick", "tiroir"],
        question: "Pourquoi stocker l'id plutôt que l'objet Candidature entier ?",
        parcours: "clic-ligne",
    },
    setSelectedId: {
        nom: "setSelectedId",
        genre: "setter",
        fichier: DASHBOARD,
        lignes: "21",
        champs: [
            { label: "Type", valeur: "Dispatch<SetStateAction<string | null>>" },
            { label: "Entrée", valeur: "la prochaine valeur de selectedId" },
            { label: "Sortie", valeur: "aucune (void)" },
            {
                label: "Effet",
                valeur: "Demande à React un nouveau rendu avec la nouvelle valeur. La variable selectedId du rendu en cours ne change pas.",
            },
            {
                label: "Appelé par",
                valeur: "le <tr> via la prop onRowClick (l.107) · onClose du tiroir (l.99) · editCandidature (l.50) · deleteCandidature (l.60)",
            },
        ],
        liens: ["selectedId", "onRowClick", "ligne"],
        question: "Juste après setSelectedId(id), que vaut selectedId sur la ligne suivante de la même fonction ?",
    },
    showForm: {
        nom: "showForm",
        genre: "état",
        fichier: DASHBOARD,
        lignes: "22",
        champs: [
            { label: "Type", valeur: "boolean" },
            { label: "Rôle", valeur: "Dit si le formulaire (création ou édition) est affiché." },
            { label: "Source", valeur: "useState(false)" },
            { label: "Lu par", valeur: "le rendu conditionnel de ApplicationForm (l.82)" },
            { label: "Modifié par", valeur: "bouton Ajouter (l.77) · closeForm (l.37) · editCandidature (l.51)" },
        ],
        liens: ["editingId", "closeForm", "editCandidature", "bouton-ajouter"],
    },
    editingId: {
        nom: "editingId",
        genre: "état",
        fichier: DASHBOARD,
        lignes: "23",
        champs: [
            { label: "Type", valeur: "string | null" },
            { label: "Rôle", valeur: "Distingue création (null) et édition (id de la candidature à modifier)." },
            { label: "Source", valeur: "useState<string | null>(null)" },
            { label: "Lu par", valeur: "editingCandidature (l.28)" },
            { label: "Modifié par", valeur: "bouton Ajouter, remis à null (l.76) · closeForm (l.38) · editCandidature (l.49)" },
        ],
        liens: ["editingCandidature", "showForm", "editCandidature", "closeForm"],
        question: "showForm vaut true et editingId vaut null : dans quel état est l'interface ?",
    },

    // ───────────── Atomes : store et valeurs dérivées ─────────────
    candidatures: {
        nom: "candidatures",
        genre: "store externe",
        fichier: DASHBOARD,
        lignes: "16-20",
        champs: [
            { label: "Type", valeur: "Candidature[]" },
            { label: "Rôle", valeur: "La collection complète, lue depuis le store de src/lib/storage.ts." },
            { label: "Source", valeur: "useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)" },
            {
                label: "Lu par",
                valeur: "selectedCandidature (l.27) · editingCandidature (l.28) · addCandidature (l.25) · updateCandidature (l.30) · editCandidature (l.44) · deleteCandidature (l.55) · prop de ApplicationTable (l.106)",
            },
            {
                label: "Modifié par",
                valeur: "jamais directement. saveCandidatures remplace le cache puis notifie React, qui relit le snapshot.",
            },
        ],
        liens: ["saveCandidatures", "selectedCandidature", "table"],
        question: "Pourquoi n'y a-t-il pas de setCandidatures ?",
    },
    selectedCandidature: {
        nom: "selectedCandidature",
        genre: "valeur dérivée",
        fichier: DASHBOARD,
        lignes: "27",
        champs: [
            { label: "Type", valeur: "Candidature | null" },
            { label: "Rôle", valeur: "L'objet complet à afficher dans le tiroir." },
            { label: "Source", valeur: "candidatures.find(c => c.id === selectedId) ?? null, recalculé à chaque rendu" },
            { label: "Lu par", valeur: "la condition d'affichage du tiroir (l.96) · la prop candidature de DetailDrawer (l.98)" },
            { label: "Modifié par", valeur: "rien : elle change quand selectedId ou candidatures change." },
        ],
        liens: ["selectedId", "candidatures", "tiroir"],
        question: "Que vaut-elle si selectedId pointe vers une candidature supprimée dans un autre onglet ?",
        parcours: "clic-ligne",
    },
    editingCandidature: {
        nom: "editingCandidature",
        genre: "valeur dérivée",
        fichier: DASHBOARD,
        lignes: "28",
        champs: [
            { label: "Type", valeur: "Candidature | null" },
            { label: "Rôle", valeur: "La candidature à pré-remplir dans le formulaire en mode édition." },
            { label: "Source", valeur: "candidatures.find(c => c.id === editingId) ?? null" },
            { label: "Lu par", valeur: "l'aiguillage du onSubmit (l.86) · la prop candidatureToEdit (l.93)" },
            { label: "Modifié par", valeur: "rien : elle suit editingId et candidatures." },
        ],
        liens: ["editingId", "candidatures", "editCandidature"],
    },

    // ───────────── Atomes : prop et argument ─────────────
    onRowClick: {
        nom: "onRowClick",
        genre: "prop",
        fichier: TABLE,
        lignes: "70-73",
        champs: [
            { label: "Type", valeur: "(id: string) => void" },
            { label: "Rôle", valeur: "Callback remontant : la table signale au parent quelle ligne a été cliquée." },
            { label: "Valeur reçue", valeur: "setSelectedId lui-même, passé tel quel par le dashboard (l.107)" },
            { label: "Appelé par", valeur: "le onClick de chaque <tr> (l.97)" },
            { label: "Paramètre", valeur: "id : le nom utilisé dans la signature, sans valeur tant que la fonction n'est pas appelée" },
        ],
        liens: ["arg-id", "setSelectedId", "ligne", "table"],
        question: "La table sait-elle ce que le parent fait de l'id ? Qu'est-ce que ça permet ?",
        parcours: "clic-ligne",
    },
    "arg-id": {
        nom: "candidature.id (argument)",
        genre: "argument",
        fichier: TABLE,
        lignes: "97",
        champs: [
            { label: "Type", valeur: "string" },
            { label: "Rôle", valeur: "La valeur concrète injectée dans onRowClick au moment du clic." },
            { label: "Source", valeur: "la candidature de l'itération en cours du map (l.93), capturée par la fonction fléchée" },
            { label: "Reçu par", valeur: "le paramètre id de onRowClick" },
        ],
        liens: ["onRowClick", "ligne"],
        question: "Trois lignes, trois fonctions fléchées : comment chacune connaît-elle le bon id ?",
    },

    // ───────────── Fonctions ─────────────
    closeForm: {
        nom: "closeForm",
        genre: "fonction",
        fichier: DASHBOARD,
        lignes: "36-39",
        champs: [
            { label: "Entrée", valeur: "aucune" },
            { label: "Sortie", valeur: "aucune (void)" },
            { label: "Effets", valeur: "setShowForm(false) puis setEditingId(null)" },
            { label: "Appelée par", valeur: "onClose du formulaire (l.84) · fin du onSubmit (l.91)" },
        ],
        liens: ["showForm", "editingId"],
        question: "Que se passerait-il à la prochaine ouverture si on oubliait setEditingId(null) ?",
    },
    addCandidature: {
        nom: "addCandidature",
        genre: "fonction",
        fichier: DASHBOARD,
        lignes: "24-26",
        champs: [
            { label: "Entrée", valeur: "newCandidature : Candidature" },
            { label: "Sortie", valeur: "aucune (void)" },
            { label: "Mécanisme", valeur: "[...candidatures, newCandidature] : un nouveau tableau, l'ancien reste intact" },
            { label: "Effet", valeur: "saveCandidatures(nouveau tableau)" },
            { label: "Appelée par", valeur: "onSubmit quand editingCandidature est null (l.89)" },
        ],
        liens: ["candidatures", "saveCandidatures"],
    },
    updateCandidature: {
        nom: "updateCandidature",
        genre: "fonction",
        fichier: DASHBOARD,
        lignes: "29-34",
        champs: [
            { label: "Entrée", valeur: "updatedCandidature : Candidature (même id que l'ancienne)" },
            { label: "Sortie", valeur: "aucune (void)" },
            { label: "Mécanisme", valeur: "map : chaque élément est recopié, sauf celui dont l'id correspond, qui est remplacé" },
            { label: "Effet", valeur: "saveCandidatures(updatedCandidatures)" },
            { label: "Appelée par", valeur: "onSubmit quand editingCandidature existe (l.87)" },
        ],
        liens: ["candidatures", "saveCandidatures", "editingCandidature"],
    },
    editCandidature: {
        nom: "editCandidature",
        genre: "fonction",
        fichier: DASHBOARD,
        lignes: "42-53",
        champs: [
            { label: "Entrée", valeur: "id : string" },
            { label: "Sortie", valeur: "aucune (void)" },
            { label: "Garde", valeur: "si aucune candidature ne porte cet id : console.error puis return (l.45-48)" },
            { label: "Effets", valeur: "setEditingId(id) · setSelectedId(null) · setShowForm(true)" },
            { label: "Appelée par", valeur: "le bouton Editer du tiroir, via la prop onEdit (l.101)" },
        ],
        liens: ["editingId", "selectedId", "showForm", "tiroir-editer"],
        question: "Trois setters d'affilée : combien de rendus React déclenche cet appel ?",
    },
    deleteCandidature: {
        nom: "deleteCandidature",
        genre: "fonction",
        fichier: DASHBOARD,
        lignes: "54-62",
        champs: [
            { label: "Entrée", valeur: "id : string" },
            { label: "Sortie", valeur: "aucune (void)" },
            { label: "Mécanisme", valeur: "filter : garde tout sauf l'élément dont l'id correspond" },
            { label: "Effets", valeur: "saveCandidatures(remainingCandidatures), puis setSelectedId(null) si c'était la candidature affichée" },
            { label: "Appelée par", valeur: "handleDeleteClick du tiroir, via la prop onDelete (l.100)" },
        ],
        liens: ["candidatures", "saveCandidatures", "selectedId", "handleDeleteClick"],
        question: "Sans le if de la ligne 59, que verrait l'utilisateur après la suppression ?",
    },
    handleDeleteClick: {
        nom: "handleDeleteClick",
        genre: "fonction",
        fichier: DRAWER,
        lignes: "24-31",
        champs: [
            { label: "Entrée", valeur: "aucune (lit candidature par fermeture)" },
            { label: "Sortie", valeur: "aucune (void)" },
            { label: "Garde", valeur: "window.confirm : sans confirmation, rien ne se passe" },
            { label: "Effet", valeur: "onDelete(candidature.id)" },
            { label: "Appelée par", valeur: "le bouton Supprimer (l.154)" },
        ],
        liens: ["deleteCandidature", "tiroir-supprimer"],
    },
    formatDate: {
        nom: "formatDate",
        genre: "fonction",
        fichier: "src/lib/date.ts",
        lignes: "1-10",
        champs: [
            { label: "Entrée", valeur: "date?: string (format de stockage AAAA-MM-JJ)" },
            { label: "Sortie", valeur: "string : la date en JJ/MM/AAAA, ou le tiret long si l'entrée est vide" },
            { label: "Effets", valeur: "aucun : même entrée, même sortie" },
            { label: "Appelée par", valeur: "les colonnes de date de la table (l.48, l.55) · le tiroir (l.71, 75, 79)" },
        ],
        liens: ["cellule-dateCreation", "cellule-dateRelance"],
        question: "Que renvoie formatDate(\"pas une date\") ? Fais l'essai dans la console avant de répondre.",
    },
    saveCandidatures: {
        nom: "saveCandidatures",
        genre: "fonction",
        fichier: "src/lib/storage.ts",
        lignes: "104-112",
        champs: [
            { label: "Entrée", valeur: "next : Candidature[]" },
            { label: "Sortie", valeur: "aucune (void)" },
            { label: "Effets", valeur: "cache = next · localStorage.setItem (dans un try/catch) · appel de chaque listener" },
            { label: "Appelée par", valeur: "addCandidature · updateCandidature · deleteCandidature" },
        ],
        liens: ["candidatures", "addCandidature", "updateCandidature", "deleteCandidature"],
        question: "Si localStorage.setItem échoue, l'écran affiche-t-il quand même la nouvelle liste ?",
    },

    // ───────────── Référentiels ─────────────
    STATUT_CANDIDATURE: {
        nom: "STATUT_CANDIDATURE",
        genre: "référentiel",
        fichier: "src/lib/status.ts",
        lignes: "9-59",
        champs: [
            { label: "Type", valeur: "objet as const : clé technique → { label, description, badgeClassName, dotClassName, order }" },
            { label: "Rôle", valeur: "Source unique de tout ce qui concerne un statut : texte affiché, couleurs, ordre." },
            { label: "Type dérivé", valeur: "StatutCandidature = keyof typeof STATUT_CANDIDATURE (l.61)" },
            { label: "Lu par", valeur: "StatusBadge (l.10) · isCandidature dans storage.ts (l.20)" },
        ],
        liens: ["badge-statut"],
        question: "Tu ajoutes un statut « en_attente » dans cet objet : quels fichiers faut-il toucher ensuite ?",
    },
    PRIORITE_CANDIDATURE: {
        nom: "PRIORITE_CANDIDATURE",
        genre: "référentiel",
        fichier: "src/lib/priority.ts",
        lignes: "9-31",
        champs: [
            { label: "Type", valeur: "objet as const : clé technique → { label, description, badgeClassName, dotClassName, order }" },
            { label: "Rôle", valeur: "Source unique de tout ce qui concerne une priorité." },
            { label: "Type dérivé", valeur: "PrioriteCandidature = keyof typeof PRIORITE_CANDIDATURE (l.33)" },
            { label: "Lu par", valeur: "PriorityBadges (l.11) · isCandidature dans storage.ts (l.23)" },
        ],
        liens: ["badge-priorite"],
    },
    CONTRAT_CANDIDATURE: {
        nom: "CONTRAT_CANDIDATURE",
        genre: "référentiel",
        fichier: "src/lib/types.ts",
        lignes: "6-12",
        champs: [
            { label: "Type", valeur: "objet as const : clé technique → label (une simple chaîne)" },
            { label: "Rôle", valeur: "Traduit la clé stockée (cdi, alternance…) en texte affiché." },
            { label: "Type dérivé", valeur: "ContratCandidature = keyof typeof CONTRAT_CANDIDATURE (l.14)" },
            { label: "Lu par", valeur: "la colonne Contrat de la table (l.31) · le tiroir (l.56) · isCandidature (l.18)" },
        ],
        liens: ["cellule-contrat"],
        question: "Pourquoi ce référentiel a-t-il une forme plus simple que celui des statuts ?",
    },

    // ───────────── Éléments visibles à l'écran ─────────────
    "bouton-ajouter": {
        nom: "Bouton « Ajouter une candidature »",
        genre: "élément",
        fichier: DASHBOARD,
        lignes: "73-80",
        champs: [
            { label: "Événement", valeur: "onClick" },
            { label: "Effets", valeur: "setEditingId(null) puis setShowForm(true)" },
            { label: "Résultat", valeur: "ApplicationForm est monté en mode création (candidatureToEdit = undefined)" },
            { label: "Ne touche pas", valeur: "selectedId" },
        ],
        liens: ["showForm", "editingId", "closeForm", "addCandidature"],
    },
    table: {
        nom: "ApplicationTable",
        genre: "composant",
        fichier: TABLE,
        lignes: "69-110",
        champs: [
            { label: "Props reçues", valeur: "candidatures : Candidature[] · onRowClick : (id: string) => void" },
            { label: "État propre", valeur: "aucun" },
            { label: "Rendu", valeur: "un <th> par entrée de columns, un <tr> par candidature, un <td> par colonne" },
            { label: "Remonte", valeur: "l'id de la ligne cliquée, via onRowClick" },
        ],
        liens: ["candidatures", "onRowClick", "ligne"],
        question: "Ce fichier n'a pas de \"use client\" et pourtant il a un onClick. Pourquoi ça fonctionne ?",
    },
    ligne: {
        nom: "Ligne <tr>",
        genre: "élément",
        fichier: TABLE,
        lignes: "94-104",
        champs: [
            { label: "Clé React", valeur: "key={candidature.id}" },
            { label: "Événement", valeur: "onClick={() => onRowClick(candidature.id)}" },
            { label: "Donnée", valeur: "une Candidature, fournie par le map de la ligne 93" },
            { label: "Contenu", valeur: "une cellule par colonne : column.render(candidature)" },
        ],
        liens: ["onRowClick", "arg-id", "setSelectedId", "selectedId", "table"],
        parcours: "clic-ligne",
    },
    "cellule-contrat": {
        nom: "Cellule Contrat",
        genre: "élément",
        fichier: TABLE,
        lignes: "27-32",
        champs: [
            { label: "Donnée lue", valeur: "candidature.contrat, de type ContratCandidature" },
            { label: "Transformation", valeur: "CONTRAT_CANDIDATURE[candidature.contrat] : clé technique → label" },
            { label: "Aucun", valeur: "if, switch ou ternaire" },
        ],
        liens: ["CONTRAT_CANDIDATURE", "ligne"],
    },
    "cellule-dateCreation": {
        nom: "Cellule Créée le",
        genre: "élément",
        fichier: TABLE,
        lignes: "45-49",
        champs: [
            { label: "Donnée lue", valeur: "candidature.dateCreation, de type ISODate" },
            { label: "Transformation", valeur: "formatDate(...) : format de stockage → format d'affichage" },
        ],
        liens: ["formatDate", "ligne"],
    },
    "cellule-dateRelance": {
        nom: "Cellule Relance",
        genre: "élément",
        fichier: TABLE,
        lignes: "50-57",
        champs: [
            { label: "Donnée lue", valeur: "candidature.dateRelance, de type ISODate | undefined" },
            { label: "Transformation", valeur: "formatDate si la date existe, sinon le tiret long" },
            { label: "Test", valeur: "\"dateRelance\" in candidature && candidature.dateRelance" },
        ],
        liens: ["formatDate", "ligne"],
        question: "dateRelance est déclarée dans BaseCandidature. Que t'apporte le test « in » ici ? Compare avec la ligne 79 du tiroir.",
    },
    "badge-statut": {
        nom: "StatusBadge",
        genre: "composant",
        fichier: "src/components/StatusBadge.tsx",
        lignes: "9-17",
        champs: [
            { label: "Prop reçue", valeur: "statut : StatutCandidature (une clé, par exemple a_preparer)" },
            { label: "Transformation", valeur: "config = STATUT_CANDIDATURE[statut]" },
            { label: "Rendu", valeur: "config.label pour le texte, config.badgeClassName pour les couleurs" },
            { label: "État propre", valeur: "aucun" },
        ],
        liens: ["STATUT_CANDIDATURE"],
    },
    "badge-priorite": {
        nom: "PriorityBadges",
        genre: "composant",
        fichier: "src/components/PriorityBadges.tsx",
        lignes: "10-18",
        champs: [
            { label: "Prop reçue", valeur: "priorite : PrioriteCandidature (une clé, par exemple haute)" },
            { label: "Transformation", valeur: "config = PRIORITE_CANDIDATURE[priorite]" },
            { label: "Rendu", valeur: "config.label pour le texte, config.badgeClassName pour les couleurs" },
            { label: "État propre", valeur: "aucun" },
        ],
        liens: ["PRIORITE_CANDIDATURE"],
    },
    tiroir: {
        nom: "DetailDrawer",
        genre: "composant",
        fichier: DRAWER,
        lignes: "11-173",
        champs: [
            { label: "Props reçues", valeur: "candidature : Candidature | null · onClose · onDelete(id) · onEdit(id)" },
            { label: "État propre", valeur: "aucun" },
            { label: "Garde", valeur: "if (!candidature) return null (l.22)" },
            { label: "Monté quand", valeur: "selectedCandidature existe, côté dashboard (l.96)" },
            { label: "Narrowing", valeur: "candidature.mode === \"annonce\" choisit le bloc affiché (l.91)" },
        ],
        liens: ["selectedCandidature", "selectedId", "tiroir-supprimer", "tiroir-editer"],
        question: "Le dashboard teste déjà selectedCandidature avant de monter le tiroir. À quoi sert alors la garde de la ligne 22 ?",
        parcours: "clic-ligne",
    },
    "tiroir-supprimer": {
        nom: "Bouton Supprimer",
        genre: "élément",
        fichier: DRAWER,
        lignes: "152-158",
        champs: [
            { label: "Événement", valeur: "onClick={handleDeleteClick}" },
            { label: "Chaîne", valeur: "handleDeleteClick → window.confirm → onDelete(candidature.id) → deleteCandidature dans le dashboard" },
        ],
        liens: ["handleDeleteClick", "deleteCandidature"],
    },
    "tiroir-editer": {
        nom: "Bouton Editer",
        genre: "élément",
        fichier: DRAWER,
        lignes: "159-165",
        champs: [
            { label: "Événement", valeur: "onClick={() => onEdit(candidature.id)}" },
            { label: "Chaîne", valeur: "onEdit → editCandidature dans le dashboard → tiroir fermé, formulaire ouvert pré-rempli" },
        ],
        liens: ["editCandidature", "editingId", "showForm"],
    },
};
