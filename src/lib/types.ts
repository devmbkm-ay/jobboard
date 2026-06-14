import type { StatutCandidature } from "@/lib/status";
import type { PrioriteCandidature } from "@/lib/priority";

export type ISODate = `${number}-${number}-${number}`;

export const CONTRAT_CANDIDATURE = {
    alternance: "Alternance",
    cdd: "CDD",
    cdi: "CDI",
    stage: "Stage",
    freelance: "Freelance",
} as const;

export type ContratCandidature = keyof typeof CONTRAT_CANDIDATURE;

export const SOURCE_ANNONCE = {
    linkedin: "LinkedIn",
    indeed: "Indeed",
    welcome_to_the_jungle: "Welcome to the Jungle",
    france_travail: "France Travail",
    site_entreprise: "Site entreprise",
    autre: "Autre",
} as const;

export type SourceAnnonce = keyof typeof SOURCE_ANNONCE;


export const CANAL_APPROCHE = {
    email: "Email",
    linkedin: "LinkedIn",
    site_entreprise: "Site entreprise",
    reseau: "Réseau",
    autre: "Autre",
} as const;

export type CanalApproche = keyof typeof CANAL_APPROCHE;


export interface BaseCandidature {
    id: string;
    entreprise: string;
    posteVise: string;
    contrat: ContratCandidature;
    statut: StatutCandidature;
    dateCreation: ISODate;
    dateEnvoi?: ISODate;
    dateRelance?: ISODate;
    dateReponse?: ISODate;
    contact?: string;
    notes?: string;
    priorite: PrioriteCandidature;
}

export interface CandidatureSpontanee extends BaseCandidature {
    mode: "spontanee";
    raisonCiblage?: string;
    canalApproche?: CanalApproche;
}

export interface CandidatureAnnonce extends BaseCandidature {
    mode: "annonce";
    sourceAnnonce: SourceAnnonce;
    urlAnnonce?: string;
    referenceAnnonce?: string;
}

export type Candidature =
    | CandidatureSpontanee
    | CandidatureAnnonce;