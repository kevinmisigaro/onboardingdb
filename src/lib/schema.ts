/* Form definitions for the DataBalk onboarding portal (MVP, frontend-only).
   Transcribed from the Dutch inventory documents provided by the client. */

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

export const DB_SCHEMAS: Record<FormId, Schema> = {
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

export const FORM_ORDER: FormId[] = ["reparatieonderhoud", "mutatieonderhoud", "inkoopregister"];
