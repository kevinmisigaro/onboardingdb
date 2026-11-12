/* Form definitions for the DataBalk onboarding portal (MVP, frontend-only).
   Transcribed from the Dutch inventory documents provided by the client,
   with a parallel English translation for the language switcher. */

import type { Lang } from "./i18n";

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "yesno"
  | "yesno-conditional"
  | "repeater";

export interface RepeaterSubField {
  id: string;
  type: "text" | "number" | "textarea" | "yesno";
  label: string;
}

export interface BaseField {
  id: string;
  label: string;
  hint?: string;
}

export interface SimpleField extends BaseField {
  type: "text" | "number" | "textarea" | "yesno";
}

export interface SelectField extends BaseField {
  type: "select";
  options: string[];
}

export interface RepeaterField extends BaseField {
  type: "repeater";
  itemLabel?: string;
  fields: RepeaterSubField[];
}

export interface YesNoConditionalField extends BaseField {
  type: "yesno-conditional";
  showOn: "yes" | "no";
  condLabel: string;
  condType: "text" | "textarea" | "repeater";
  condFields?: RepeaterSubField[];
  condItemLabel?: string;
}

export type Field = SimpleField | SelectField | RepeaterField | YesNoConditionalField;

export interface Section {
  title: string;
  fields: Field[];
}

export type FormId = "reparatieonderhoud" | "mutatieonderhoud" | "inkoopregister";

export interface Schema {
  id: FormId;
  menuLabel: string;
  icon: string;
  title: string;
  intro: string;
  infoBox?: string;
  sections: Section[];
}

const DB_SCHEMAS_NL: Record<FormId, Schema> = {
  reparatieonderhoud: {
    id: "reparatieonderhoud",
    menuLabel: "Reparatieonderhoud",
    icon: "🔧",
    title: "Inventarisatie Inrichting Reparatieonderhoud",
    intro:
      "Doel van deze inventarisatie is het verkrijgen van informatie die nodig is ter voorbereiding van het reparatieproces, zodat we dit functioneel, organisatorisch, technisch en financieel kunnen inrichten. De beantwoording vormt de basis voor de inrichting van CRM, Field Service, Onderhoudsketen, DICO-berichtenverkeer en financiële afhandeling.",
    sections: [
      {
        title: "Eigen dienst",
        fields: [
          { id: "eigen_dienst_aanwezig", type: "yesno", label: "Is er sprake van een eigen dienst?" },
          { id: "eigen_dienst_aantal", type: "number", label: "Hoeveel medewerkers zijn werkzaam binnen de eigen dienst?" },
          {
            id: "eigen_dienst_functies",
            type: "repeater",
            label: "Welke functies en vakdisciplines zijn aanwezig binnen de eigen dienst?",
            hint: "Beschrijf per functie of vakdiscipline hoeveel medewerkers hiervoor beschikbaar zijn en welke werkzaamheden zij uitvoeren.",
            itemLabel: "Functie / vakdiscipline",
            fields: [
              { id: "functie", type: "text", label: "Functie / vakdiscipline" },
              { id: "aantal", type: "number", label: "Aantal medewerkers" },
              { id: "werkzaamheden", type: "textarea", label: "Werkzaamheden" },
            ],
          },
          { id: "eigen_dienst_werkzaamheden", type: "textarea", label: "Welke werkzaamheden voert de eigen dienst uit?" },
        ],
      },
      {
        title: "Ketenpartners",
        fields: [
          {
            id: "ketenpartners",
            type: "repeater",
            label: "Welke ketenpartners zijn betrokken bij het reparatieproces?",
            hint: "Beschrijf per ketenpartner de naam, de soorten werkzaamheden, de geografische dekking en of de partner is aangesloten op DICO.",
            itemLabel: "Ketenpartner",
            fields: [
              { id: "naam", type: "text", label: "Naam van de ketenpartner" },
              { id: "werkzaamheden", type: "textarea", label: "Welke soorten werkzaamheden voert de ketenpartner uit?" },
              { id: "dekking", type: "text", label: "Geografische dekking (indien van toepassing)" },
              { id: "dico", type: "yesno", label: "Is de ketenpartner aangesloten op DICO?" },
            ],
          },
          { id: "werk_altijd_ketenpartner", type: "textarea", label: "Welke werkzaamheden worden altijd uitgevoerd door ketenpartners?" },
          { id: "werk_altijd_corporatie", type: "textarea", label: "Welke werkzaamheden blijven altijd bij de corporatie of eigen dienst?" },
        ],
      },
      {
        title: "Opdrachtverstrekking",
        fields: [
          { id: "opdracht_wijze", type: "textarea", label: "Hoe worden opdrachten verstrekt aan ketenpartners?" },
          {
            id: "opdracht_gelijk",
            type: "yesno-conditional",
            label: "Ontvangen alle ketenpartners opdrachten op dezelfde wijze?",
            showOn: "no",
            condLabel: "Beschrijf per ketenpartner hoe opdrachten worden verstrekt.",
            condType: "textarea",
          },
          { id: "opdracht_standaard_gegevens", type: "textarea", label: "Welke gegevens moeten standaard onderdeel zijn van een werkopdracht?" },
        ],
      },
      {
        title: "DICO en systeemintegraties",
        fields: [
          { id: "dico_aangesloten", type: "yesno", label: "Zijn ketenpartners aangesloten op DICO?" },
          { id: "dico_welke_partners", type: "textarea", label: "Welke ketenpartners zijn aangesloten op DICO?" },
          { id: "dico_berichten_huidig", type: "textarea", label: "Welke DICO-berichten worden momenteel gebruikt?" },
          { id: "dico_berichten_toekomst", type: "textarea", label: "Welke aanvullende DICO-berichten wil men in de toekomst gebruiken?" },
          { id: "dico_aansluiting_gewenst", type: "yesno", label: "Is aansluiting op DICO gewenst voor ketenpartners die momenteel nog niet aangesloten zijn?" },
          {
            id: "leveranciersportalen",
            type: "yesno-conditional",
            label: "Zijn leveranciersportalen in gebruik?",
            showOn: "yes",
            condLabel: "Welke leveranciersportalen worden gebruikt?",
            condType: "textarea",
          },
          { id: "alternatieve_methoden", type: "textarea", label: "Welke alternatieve methoden worden gebruikt voor gegevensuitwisseling met ketenpartners?" },
        ],
      },
      {
        title: "Planning en afspraakbeheer",
        fields: [
          {
            id: "afspraak_wijze",
            type: "select",
            label:
              "Worden afspraken voor ketenpartners direct ingepland of neemt de ketenpartner eerst zelf contact op met de huurder voor het maken van een afspraak?",
            options: [
              "Afspraken worden direct ingepland door de corporatie",
              "De ketenpartner neemt zelf contact op met de huurder",
              "Dit verschilt per ketenpartner",
            ],
          },
          { id: "afspraak_toelichting", type: "textarea", label: "Toelichting op de planning en het afsprakenproces" },
        ],
      },
      {
        title: "Financiële afhandeling",
        fields: [
          {
            id: "prijzenboek",
            type: "yesno-conditional",
            label: "Is er sprake van een prijzenboek?",
            showOn: "yes",
            condLabel: "Welk prijzenboek wordt gebruikt?",
            condType: "text",
          },
          { id: "vergoeding_wijze", type: "textarea", label: "Op welke wijze worden werkzaamheden vergoed aan de verschillende ketenpartners?" },
          {
            id: "vergoeding_per_partner",
            type: "yesno-conditional",
            label: "Zijn er verschillende financiële afspraken per ketenpartner?",
            showOn: "yes",
            condLabel: "Beschrijf per ketenpartner de overeengekomen vergoedingsstructuur.",
            condType: "repeater",
            condFields: [
              { id: "naam", type: "text", label: "Naam ketenpartner" },
              { id: "vergoedingsstructuur", type: "textarea", label: "Overeengekomen vergoedingsstructuur" },
            ],
            condItemLabel: "Vergoedingsafspraak",
          },
          {
            id: "vergoeding_per_type",
            type: "yesno-conditional",
            label: "Zijn er verschillende vergoedingsafspraken per type reparatie?",
            showOn: "yes",
            condLabel: "Beschrijf de vergoedingsafspraken per type reparatie.",
            condType: "textarea",
          },
          { id: "materialen_verrekening", type: "textarea", label: "Hoe worden materialen verrekend?" },
          { id: "meerwerk_minderwerk", type: "textarea", label: "Hoe worden meerwerk en minderwerk afgehandeld?" },
          { id: "contractvormen", type: "textarea", label: "Welke contractvormen worden toegepast?" },
        ],
      },
      {
        title: "Factuurverwerking",
        fields: [
          { id: "facturen_ontvangst", type: "textarea", label: "Hoe worden facturen ontvangen?" },
          {
            id: "prijsafwijking",
            type: "textarea",
            label: "Hoe wordt omgegaan met afwijkingen tussen de verwachte prijs van een opdracht en de uiteindelijk gefactureerde prijs?",
          },
        ],
      },
    ],
  },

  mutatieonderhoud: {
    id: "mutatieonderhoud",
    menuLabel: "Mutatieonderhoud",
    icon: "🔄",
    title: "Inventarisatie Inrichting Mutatieonderhoud",
    intro:
      "Doel van deze inventarisatie is het verkrijgen van informatie die nodig is ter voorbereiding van het mutatieonderhoudsproces, zodat we dit functioneel, organisatorisch, technisch en financieel kunnen inrichten. De beantwoording vormt de basis voor de inrichting van CRM, Field Service, Onderhoudsketen, Inspectic, DICO-berichtenverkeer en financiële afhandeling.",
    sections: [
      {
        title: "Inspecteren",
        fields: [
          {
            id: "inspectie_uitvoerder",
            type: "select",
            label: "Wie voert de inspecties uit?",
            options: [
              "Alles zelf",
              "Alles door ketenpartner",
              "Gezamenlijk: de ketenpartner voert de technische inspectie uit en de medewerker inventariseert de activiteiten die de huurder zelf moet doen voor vertrek",
            ],
          },
          { id: "inspectie_gezamenlijk", type: "yesno", label: "Is dit een gezamenlijke inspectie?" },
          { id: "inspectie_proces", type: "textarea", label: "Hoe loopt het proces nu om tot een gezamenlijke inspectieafspraak te komen?" },
        ],
      },
      {
        title: "Ketenpartners",
        fields: [
          { id: "eigen_dienst_betrokken", type: "yesno", label: "Is de eigen dienst betrokken bij het mutatieproces?" },
          {
            id: "ketenpartners",
            type: "repeater",
            label: "Welke ketenpartners zijn betrokken bij het mutatieproces?",
            hint: "Beschrijf per ketenpartner de naam, de soorten werkzaamheden, de geografische dekking en of de partner is aangesloten op DICO.",
            itemLabel: "Ketenpartner",
            fields: [
              { id: "naam", type: "text", label: "Naam van de ketenpartner" },
              { id: "werkzaamheden", type: "textarea", label: "Welke soorten werkzaamheden voert de ketenpartner uit?" },
              { id: "dekking", type: "text", label: "Geografische dekking (indien van toepassing)" },
              { id: "dico", type: "yesno", label: "Is de ketenpartner aangesloten op DICO?" },
            ],
          },
        ],
      },
      {
        title: "Goedkeuring en opdrachtverstrekking",
        fields: [
          {
            id: "offerte_aanwezig",
            type: "yesno-conditional",
            label: "Is er sprake van een offerte?",
            showOn: "yes",
            condLabel: "Hoe verloopt de goedkeuring van de offerte?",
            condType: "textarea",
          },
          { id: "opdracht_wijze", type: "textarea", label: "Hoe worden opdrachten verstrekt aan ketenpartners?" },
          { id: "goedkeuringsproces", type: "textarea", label: "Hoe verloopt het goedkeuringsproces voor mutatieonderhoud?" },
          {
            id: "opdracht_gelijk",
            type: "yesno-conditional",
            label: "Ontvangen alle ketenpartners opdrachten op dezelfde wijze?",
            showOn: "no",
            condLabel: "Beschrijf per ketenpartner hoe opdrachten worden verstrekt.",
            condType: "textarea",
          },
        ],
      },
      {
        title: "DICO en systeemintegraties",
        fields: [
          { id: "dico_aangesloten", type: "yesno", label: "Zijn ketenpartners aangesloten op DICO?" },
          { id: "dico_welke_partners", type: "textarea", label: "Welke ketenpartners zijn aangesloten op DICO?" },
          { id: "dico_berichten_huidig", type: "textarea", label: "Welke DICO-berichten worden momenteel gebruikt?" },
          { id: "dico_berichten_toekomst", type: "textarea", label: "Welke aanvullende DICO-berichten wil men in de toekomst gebruiken?" },
          { id: "dico_aansluiting_gewenst", type: "yesno", label: "Is aansluiting op DICO gewenst voor ketenpartners die momenteel nog niet aangesloten zijn?" },
          {
            id: "leveranciersportalen",
            type: "yesno-conditional",
            label: "Zijn leveranciersportalen in gebruik?",
            showOn: "yes",
            condLabel: "Welke leveranciersportalen worden gebruikt?",
            condType: "textarea",
          },
          { id: "alternatieve_methoden", type: "textarea", label: "Welke alternatieve methoden worden gebruikt voor gegevensuitwisseling met ketenpartners?" },
        ],
      },
      {
        title: "Financiële afhandeling",
        fields: [
          {
            id: "prijzenboek",
            type: "yesno-conditional",
            label: "Is er sprake van een prijzenboek?",
            showOn: "yes",
            condLabel: "Welk prijzenboek wordt gebruikt?",
            condType: "text",
          },
          {
            id: "vergoeding_per_partner",
            type: "yesno-conditional",
            label: "Zijn er verschillende financiële afspraken per ketenpartner?",
            showOn: "yes",
            condLabel: "Beschrijf per ketenpartner de overeengekomen vergoedingsstructuur.",
            condType: "repeater",
            condFields: [
              { id: "naam", type: "text", label: "Naam ketenpartner" },
              { id: "vergoedingsstructuur", type: "textarea", label: "Overeengekomen vergoedingsstructuur" },
            ],
            condItemLabel: "Vergoedingsafspraak",
          },
          {
            id: "vergoeding_per_type",
            type: "yesno-conditional",
            label: "Zijn er verschillende vergoedingsafspraken per type reparatie?",
            showOn: "yes",
            condLabel: "Beschrijf de vergoedingsafspraken per type reparatie.",
            condType: "textarea",
          },
          { id: "meerwerk_minderwerk", type: "textarea", label: "Hoe worden meerwerk en minderwerk afgehandeld?" },
          { id: "contractvormen", type: "textarea", label: "Welke contractvormen worden toegepast?" },
        ],
      },
      {
        title: "Factuurverwerking",
        fields: [
          { id: "facturen_ontvangst", type: "textarea", label: "Hoe worden facturen ontvangen?" },
          {
            id: "prijsafwijking",
            type: "textarea",
            label: "Hoe wordt omgegaan met afwijkingen tussen de verwachte prijs van een opdracht en de uiteindelijk gefactureerde prijs?",
          },
        ],
      },
    ],
  },

  inkoopregister: {
    id: "inkoopregister",
    menuLabel: "Inkoopregister",
    icon: "📋",
    title: "Inventarisatie Inkoopregister",
    intro:
      "Het inkoopregister beschrijft de wijze waarop administratieve inkoop binnen de organisatie wordt vastgelegd, verwerkt en gecontroleerd. Het register vormt de basis voor een uniforme en controleerbare verwerking van verplichtingen en facturen en sluit aan op de financiële governance en auditbaarheid van de organisatie.",
    infoBox:
      "Binnen het inkoopregister wordt onderscheid gemaakt tussen facturen die gekoppeld zijn aan een inkooporder en facturen die zonder voorafgaande order worden verwerkt. Facturen die betrekking hebben op contracten, onderhoudsopdrachten of reguliere inkoopstromen worden vooraf vastgelegd via een inkooporder, zodat budget, verplichting en prestatie aantoonbaar zijn.\n\nDaarnaast zijn er factuurstromen waarvoor geen inkooporder vereist is, zoals periodieke lasten, vaste contracten (bijv. huur, energie) en declaraties. Deze worden op alternatieve wijze geborgd, bijvoorbeeld via vaste afspraken, autorisaties of specifieke declaratieprocessen.\n\nHet register beschrijft tevens hoe wordt omgegaan met afwijkingen, zoals facturen die zonder inkooporder worden aangeleverd terwijl dit wel vereist is. In dergelijke situaties wordt de factuur niet direct verwerkt, maar volgt een controle- en herstelproces waarbij alsnog een order wordt aangemaakt of de factuur wordt afgewezen.\n\nDoel van het inkoopregister is het waarborgen van: rechtmatigheid van uitgaven, juiste budgettoewijzing, een volledige audittrail en uniforme en efficiënte verwerking van facturen.",
    sections: [
      {
        title: "Vragen",
        fields: [
          { id: "q1", type: "textarea", label: "1. Welke categorieën facturen worden standaard vrijgesteld van een verplichte inkooporder?" },
          { id: "q2", type: "textarea", label: "2. Op basis van welke criteria wordt bepaald of een factuur gedeclareerd mag worden in plaats van via een inkooporder?" },
          { id: "q3", type: "textarea", label: "3. Welke soorten declaraties zijn toegestaan en welke autorisatie is hiervoor vereist?" },
          { id: "q4", type: "textarea", label: "4. Hoe worden periodieke of contractuele verplichtingen administratief geborgd zonder inkooporder?" },
          { id: "q5", type: "textarea", label: "5. Wat is de werkwijze bij ontvangst van een factuur zonder inkooporder terwijl deze wel verplicht is?" },
          {
            id: "q6",
            type: "select",
            label: "6. Wordt in dat geval altijd alsnog een inkooporder aangemaakt of kan de factuur worden afgekeurd?",
            options: [
              "Er wordt altijd alsnog een inkooporder aangemaakt",
              "De factuur kan worden afgekeurd",
              "Dit is afhankelijk van de situatie",
            ],
          },
          { id: "q6_toelichting", type: "textarea", label: "Toelichting op de werkwijze" },
          { id: "q7", type: "textarea", label: "7. Welke rollen en verantwoordelijkheden gelden bij controle, goedkeuring en verwerking van deze afwijkingen?" },
          { id: "q8", type: "textarea", label: "8. Hoe wordt geborgd dat budgetten vooraf worden gecontroleerd bij facturen zonder inkooporder?" },
          { id: "q9", type: "textarea", label: "9. Welke uitzonderingen zijn toegestaan en hoe worden deze gemotiveerd en vastgelegd?" },
          { id: "q10", type: "textarea", label: "10. Hoe wordt de audittrail van zowel ordergebonden als niet-ordergebonden facturen geborgd?" },
        ],
      },
    ],
  },
};

const DB_SCHEMAS_EN: Record<FormId, Schema> = {
  reparatieonderhoud: {
    id: "reparatieonderhoud",
    menuLabel: "Repair Maintenance",
    icon: "🔧",
    title: "Repair Maintenance Setup Inventory",
    intro:
      "The purpose of this inventory is to gather the information needed to prepare the repair process, so that we can configure it functionally, organizationally, technically, and financially. Your answers form the basis for setting up CRM, Field Service, the maintenance chain, DICO message traffic, and financial processing.",
    sections: [
      {
        title: "In-house service",
        fields: [
          { id: "eigen_dienst_aanwezig", type: "yesno", label: "Is there an in-house maintenance service?" },
          { id: "eigen_dienst_aantal", type: "number", label: "How many employees work within the in-house service?" },
          {
            id: "eigen_dienst_functies",
            type: "repeater",
            label: "Which roles and disciplines are present within the in-house service?",
            hint: "For each role or discipline, describe how many employees are available for it and which tasks they perform.",
            itemLabel: "Role / discipline",
            fields: [
              { id: "functie", type: "text", label: "Role / discipline" },
              { id: "aantal", type: "number", label: "Number of employees" },
              { id: "werkzaamheden", type: "textarea", label: "Tasks" },
            ],
          },
          { id: "eigen_dienst_werkzaamheden", type: "textarea", label: "Which tasks does the in-house service perform?" },
        ],
      },
      {
        title: "Chain partners",
        fields: [
          {
            id: "ketenpartners",
            type: "repeater",
            label: "Which chain partners are involved in the repair process?",
            hint: "For each chain partner, describe the name, the types of work performed, the geographic coverage, and whether the partner is connected to DICO.",
            itemLabel: "Chain partner",
            fields: [
              { id: "naam", type: "text", label: "Name of the chain partner" },
              { id: "werkzaamheden", type: "textarea", label: "What types of work does the chain partner perform?" },
              { id: "dekking", type: "text", label: "Geographic coverage (if applicable)" },
              { id: "dico", type: "yesno", label: "Is the chain partner connected to DICO?" },
            ],
          },
          { id: "werk_altijd_ketenpartner", type: "textarea", label: "Which tasks are always carried out by chain partners?" },
          { id: "werk_altijd_corporatie", type: "textarea", label: "Which tasks always remain with the housing association or the in-house service?" },
        ],
      },
      {
        title: "Work order issuance",
        fields: [
          { id: "opdracht_wijze", type: "textarea", label: "How are work orders issued to chain partners?" },
          {
            id: "opdracht_gelijk",
            type: "yesno-conditional",
            label: "Do all chain partners receive work orders in the same way?",
            showOn: "no",
            condLabel: "Describe, per chain partner, how work orders are issued.",
            condType: "textarea",
          },
          { id: "opdracht_standaard_gegevens", type: "textarea", label: "What information must be included as standard in a work order?" },
        ],
      },
      {
        title: "DICO and system integrations",
        fields: [
          { id: "dico_aangesloten", type: "yesno", label: "Are chain partners connected to DICO?" },
          { id: "dico_welke_partners", type: "textarea", label: "Which chain partners are connected to DICO?" },
          { id: "dico_berichten_huidig", type: "textarea", label: "Which DICO messages are currently used?" },
          { id: "dico_berichten_toekomst", type: "textarea", label: "Which additional DICO messages are planned for future use?" },
          { id: "dico_aansluiting_gewenst", type: "yesno", label: "Is a DICO connection desired for chain partners that are not currently connected?" },
          {
            id: "leveranciersportalen",
            type: "yesno-conditional",
            label: "Are supplier portals in use?",
            showOn: "yes",
            condLabel: "Which supplier portals are used?",
            condType: "textarea",
          },
          { id: "alternatieve_methoden", type: "textarea", label: "What alternative methods are used for exchanging data with chain partners?" },
        ],
      },
      {
        title: "Scheduling and appointment management",
        fields: [
          {
            id: "afspraak_wijze",
            type: "select",
            label:
              "Are appointments for chain partners scheduled directly, or does the chain partner first contact the tenant themselves to make an appointment?",
            options: [
              "Appointments are scheduled directly by the housing association",
              "The chain partner contacts the tenant directly",
              "This differs per chain partner",
            ],
          },
          { id: "afspraak_toelichting", type: "textarea", label: "Explanation of the scheduling and appointment process" },
        ],
      },
      {
        title: "Financial processing",
        fields: [
          {
            id: "prijzenboek",
            type: "yesno-conditional",
            label: "Is a price book in use?",
            showOn: "yes",
            condLabel: "Which price book is used?",
            condType: "text",
          },
          { id: "vergoeding_wijze", type: "textarea", label: "How is work compensated for the various chain partners?" },
          {
            id: "vergoeding_per_partner",
            type: "yesno-conditional",
            label: "Are there different financial agreements per chain partner?",
            showOn: "yes",
            condLabel: "Describe, per chain partner, the agreed compensation structure.",
            condType: "repeater",
            condFields: [
              { id: "naam", type: "text", label: "Chain partner name" },
              { id: "vergoedingsstructuur", type: "textarea", label: "Agreed compensation structure" },
            ],
            condItemLabel: "Compensation agreement",
          },
          {
            id: "vergoeding_per_type",
            type: "yesno-conditional",
            label: "Are there different compensation agreements per type of repair?",
            showOn: "yes",
            condLabel: "Describe the compensation agreements per type of repair.",
            condType: "textarea",
          },
          { id: "materialen_verrekening", type: "textarea", label: "How are materials settled?" },
          { id: "meerwerk_minderwerk", type: "textarea", label: "How are additional work and reduced-scope work handled?" },
          { id: "contractvormen", type: "textarea", label: "Which contract types are used?" },
        ],
      },
      {
        title: "Invoice processing",
        fields: [
          { id: "facturen_ontvangst", type: "textarea", label: "How are invoices received?" },
          {
            id: "prijsafwijking",
            type: "textarea",
            label: "How are discrepancies between the expected price of a work order and the final invoiced price handled?",
          },
        ],
      },
    ],
  },

  mutatieonderhoud: {
    id: "mutatieonderhoud",
    menuLabel: "Turnover Maintenance",
    icon: "🔄",
    title: "Turnover Maintenance Setup Inventory",
    intro:
      "The purpose of this inventory is to gather the information needed to prepare the turnover maintenance process, so that we can configure it functionally, organizationally, technically, and financially. Your answers form the basis for setting up CRM, Field Service, the maintenance chain, Inspectic, DICO message traffic, and financial processing.",
    sections: [
      {
        title: "Inspection",
        fields: [
          {
            id: "inspectie_uitvoerder",
            type: "select",
            label: "Who carries out the inspections?",
            options: [
              "Everything in-house",
              "Everything by the chain partner",
              "Joint: the chain partner carries out the technical inspection and the employee lists the tasks the tenant must complete themselves before leaving",
            ],
          },
          { id: "inspectie_gezamenlijk", type: "yesno", label: "Is this a joint inspection?" },
          { id: "inspectie_proces", type: "textarea", label: "What is the current process for arranging a joint inspection appointment?" },
        ],
      },
      {
        title: "Chain partners",
        fields: [
          { id: "eigen_dienst_betrokken", type: "yesno", label: "Is the in-house service involved in the turnover process?" },
          {
            id: "ketenpartners",
            type: "repeater",
            label: "Which chain partners are involved in the turnover process?",
            hint: "For each chain partner, describe the name, the types of work performed, the geographic coverage, and whether the partner is connected to DICO.",
            itemLabel: "Chain partner",
            fields: [
              { id: "naam", type: "text", label: "Name of the chain partner" },
              { id: "werkzaamheden", type: "textarea", label: "What types of work does the chain partner perform?" },
              { id: "dekking", type: "text", label: "Geographic coverage (if applicable)" },
              { id: "dico", type: "yesno", label: "Is the chain partner connected to DICO?" },
            ],
          },
        ],
      },
      {
        title: "Approval and work order issuance",
        fields: [
          {
            id: "offerte_aanwezig",
            type: "yesno-conditional",
            label: "Is a quotation involved?",
            showOn: "yes",
            condLabel: "How does the approval of the quotation take place?",
            condType: "textarea",
          },
          { id: "opdracht_wijze", type: "textarea", label: "How are work orders issued to chain partners?" },
          { id: "goedkeuringsproces", type: "textarea", label: "How does the approval process for turnover maintenance work?" },
          {
            id: "opdracht_gelijk",
            type: "yesno-conditional",
            label: "Do all chain partners receive work orders in the same way?",
            showOn: "no",
            condLabel: "Describe, per chain partner, how work orders are issued.",
            condType: "textarea",
          },
        ],
      },
      {
        title: "DICO and system integrations",
        fields: [
          { id: "dico_aangesloten", type: "yesno", label: "Are chain partners connected to DICO?" },
          { id: "dico_welke_partners", type: "textarea", label: "Which chain partners are connected to DICO?" },
          { id: "dico_berichten_huidig", type: "textarea", label: "Which DICO messages are currently used?" },
          { id: "dico_berichten_toekomst", type: "textarea", label: "Which additional DICO messages are planned for future use?" },
          { id: "dico_aansluiting_gewenst", type: "yesno", label: "Is a DICO connection desired for chain partners that are not currently connected?" },
          {
            id: "leveranciersportalen",
            type: "yesno-conditional",
            label: "Are supplier portals in use?",
            showOn: "yes",
            condLabel: "Which supplier portals are used?",
            condType: "textarea",
          },
          { id: "alternatieve_methoden", type: "textarea", label: "What alternative methods are used for exchanging data with chain partners?" },
        ],
      },
      {
        title: "Financial processing",
        fields: [
          {
            id: "prijzenboek",
            type: "yesno-conditional",
            label: "Is a price book in use?",
            showOn: "yes",
            condLabel: "Which price book is used?",
            condType: "text",
          },
          {
            id: "vergoeding_per_partner",
            type: "yesno-conditional",
            label: "Are there different financial agreements per chain partner?",
            showOn: "yes",
            condLabel: "Describe, per chain partner, the agreed compensation structure.",
            condType: "repeater",
            condFields: [
              { id: "naam", type: "text", label: "Chain partner name" },
              { id: "vergoedingsstructuur", type: "textarea", label: "Agreed compensation structure" },
            ],
            condItemLabel: "Compensation agreement",
          },
          {
            id: "vergoeding_per_type",
            type: "yesno-conditional",
            label: "Are there different compensation agreements per type of repair?",
            showOn: "yes",
            condLabel: "Describe the compensation agreements per type of repair.",
            condType: "textarea",
          },
          { id: "meerwerk_minderwerk", type: "textarea", label: "How are additional work and reduced-scope work handled?" },
          { id: "contractvormen", type: "textarea", label: "Which contract types are used?" },
        ],
      },
      {
        title: "Invoice processing",
        fields: [
          { id: "facturen_ontvangst", type: "textarea", label: "How are invoices received?" },
          {
            id: "prijsafwijking",
            type: "textarea",
            label: "How are discrepancies between the expected price of a work order and the final invoiced price handled?",
          },
        ],
      },
    ],
  },

  inkoopregister: {
    id: "inkoopregister",
    menuLabel: "Purchase Register",
    icon: "📋",
    title: "Purchase Register Inventory",
    intro:
      "The purchase register describes how administrative procurement within the organization is recorded, processed, and controlled. The register forms the basis for a uniform and verifiable processing of obligations and invoices, and aligns with the organization's financial governance and auditability.",
    infoBox:
      "The purchase register distinguishes between invoices linked to a purchase order and invoices processed without a prior order. Invoices relating to contracts, maintenance work orders, or regular procurement flows are recorded in advance via a purchase order, so that budget, obligation, and performance can be demonstrated.\n\nIn addition, there are invoice flows for which no purchase order is required, such as periodic charges, fixed contracts (e.g. rent, energy), and expense claims. These are safeguarded in alternative ways, for example through standing agreements, authorizations, or specific expense-claim processes.\n\nThe register also describes how exceptions are handled, such as invoices submitted without a purchase order when one is required. In such cases, the invoice is not processed immediately; instead, a review and correction process follows in which an order is still created or the invoice is rejected.\n\nThe purpose of the purchase register is to safeguard: the legitimacy of expenditure, correct budget allocation, a complete audit trail, and uniform, efficient invoice processing.",
    sections: [
      {
        title: "Questions",
        fields: [
          { id: "q1", type: "textarea", label: "1. Which categories of invoices are exempt by default from a mandatory purchase order?" },
          { id: "q2", type: "textarea", label: "2. Based on which criteria is it determined whether an invoice may be submitted as an expense claim instead of via a purchase order?" },
          { id: "q3", type: "textarea", label: "3. What types of expense claims are permitted, and what authorization is required for them?" },
          { id: "q4", type: "textarea", label: "4. How are periodic or contractual obligations administratively safeguarded without a purchase order?" },
          { id: "q5", type: "textarea", label: "5. What is the procedure when an invoice is received without a purchase order while one is required?" },
          {
            id: "q6",
            type: "select",
            label: "6. In that case, is a purchase order always created retroactively, or can the invoice be rejected?",
            options: [
              "A purchase order is always created retroactively",
              "The invoice can be rejected",
              "This depends on the situation",
            ],
          },
          { id: "q6_toelichting", type: "textarea", label: "Explanation of the procedure" },
          { id: "q7", type: "textarea", label: "7. What roles and responsibilities apply to the review, approval, and processing of these exceptions?" },
          { id: "q8", type: "textarea", label: "8. How is it ensured that budgets are checked in advance for invoices without a purchase order?" },
          { id: "q9", type: "textarea", label: "9. What exceptions are permitted, and how are they justified and recorded?" },
          { id: "q10", type: "textarea", label: "10. How is the audit trail safeguarded for both order-bound and non-order-bound invoices?" },
        ],
      },
    ],
  },
};

const DB_SCHEMAS_BY_LANG: Record<Lang, Record<FormId, Schema>> = {
  nl: DB_SCHEMAS_NL,
  en: DB_SCHEMAS_EN,
};

export function getSchemas(lang: Lang): Record<FormId, Schema> {
  return DB_SCHEMAS_BY_LANG[lang];
}

// Used where the numeric result (not the label text) is all that matters,
// e.g. progress computation — identical fields/ids in every language.
export const DB_SCHEMAS = DB_SCHEMAS_NL;

export const FORM_ORDER: FormId[] = ["reparatieonderhoud", "mutatieonderhoud", "inkoopregister"];
