/* Form definitions for the DataBalk onboarding portal (MVP, frontend-only).
   Transcribed from the Dutch inventory documents provided by the client,
   with a parallel English translation for the language switcher. */

import type { Lang } from "./i18n";

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "date"
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
  type: "text" | "number" | "textarea" | "date" | "yesno";
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

export type FormId = "reparatieonderhoud" | "mutatieonderhoud" | "inkoopregister" | "contactcenter";

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

  contactcenter: {
    id: "contactcenter",
    menuLabel: "Contact Center",
    icon: "🎧",
    title: "Intake Contact Center",
    intro:
      "Doel van deze intake is het in kaart brengen van de huidige telefonie- en contactcenteromgeving, zodat we de overstap naar het nieuwe contact center functioneel, technisch en organisatorisch kunnen voorbereiden. De antwoorden vormen de basis voor de inrichting van nummers, call flows, functionaliteit, netwerk en training.",
    sections: [
      {
        title: "Algemene informatie",
        fields: [
          { id: "huidige_provider", type: "text", label: "Huidige provider" },
          { id: "provider_uptime_sla", type: "text", label: "Uptime-SLA van de provider" },
          { id: "huidige_pbx", type: "text", label: "Huidige PBX" },
          { id: "beheerder_pbx", type: "text", label: "Beheerder PBX" },
          { id: "huidig_contact_center", type: "text", label: "Huidig contact center" },
          { id: "beheerder_contact_center", type: "text", label: "Beheerder contact center" },
          { id: "aantal_simultane_voicekanalen", type: "number", label: "Aantal simultane voicekanalen" },
          { id: "nummerblokken_overzicht", type: "textarea", label: "Overzicht nummerblokken", hint: "Bijvoorbeeld blokken van +31... tot +31.... Bij voorkeur als deliverable aanleveren." },
          { id: "hebben_alle_users_een_eigen_nummer", type: "yesno", label: "Hebben alle users een eigen nummer?" },
          { id: "nummertoewijzingen_overzicht", type: "textarea", label: "Overzicht nummertoewijzingen", hint: "Bijvoorbeeld: +31... is het hoofdnummer, +31... is het nummer van user A, enz. Bij voorkeur als deliverable aanleveren." },
          { id: "worden_verkorte_nummers_gebruikt", type: "yesno", label: "Worden verkorte nummers gebruikt?" },
          { id: "routering_vrije_nummers", type: "textarea", label: "Routering van vrije nummers", hint: "Bijvoorbeeld: vrije nummers geven een bezettoon, worden doorgeschakeld naar het hoofdnummer of krijgen een boodschap." },
          { id: "standaard_getoond_nummer_bij_outbound", type: "text", label: "Standaard getoond nummer bij uitgaande gesprekken" },
          { id: "maandelijks_inkomend_belvolume", type: "number", label: "Maandelijks inkomend belvolume", hint: "Bij voorkeur aan de hand van een factuur." },
          { id: "maandelijks_uitgaand_belvolume", type: "number", label: "Maandelijks uitgaand belvolume", hint: "Bij voorkeur aan de hand van een factuur." },
          { id: "internationaal_bellen_van_toepassing", type: "yesno", label: "Is internationaal bellen van toepassing?" },
          { id: "premium_nummers_toegelaten", type: "yesno", label: "Zijn premium nummers toegestaan?" },
          { id: "locaties_adressen", type: "textarea", label: "Adressen van de locaties" },
          { id: "emergency_routing_adres", type: "textarea", label: "Adres voor emergency routing", hint: "Het adres dat aan hulpdiensten wordt doorgegeven." },
          { id: "totaal_aantal_medewerkers", type: "number", label: "Totaal aantal medewerkers" },
          { id: "aantal_kcc_medewerkers", type: "number", label: "Aantal KCC-medewerkers" },
          { id: "hardware_telefoons", type: "textarea", label: "Hardware telefoons", hint: "Bijvoorbeeld bureautelefoons (model), DECT (model), enz." },
          { id: "special_devices", type: "textarea", label: "Speciale apparaten", hint: "Bijvoorbeeld fax, intercom, alarmsysteem (indien gekoppeld met de PBX), lift, enz." },
          { id: "mobiele_telefoons_managed_of_byod", type: "text", label: "Mobiele telefoons: managed of BYOD?" },
          { id: "microsoft_teams_reeds_in_gebruik", type: "yesno", label: "Is Microsoft Teams al in gebruik?" },
          { id: "huidige_microsoft_licenties", type: "textarea", label: "Huidige Microsoft-licenties", hint: "Bijvoorbeeld Microsoft E3, Microsoft E5, Dynamics 365 Customer Service Enterprise." },
        ],
      },
      {
        title: "Huidige call flow",
        fields: [
          { id: "call_flow_overzicht", type: "textarea", label: "Overzicht call flow", hint: "Bij voorkeur als deliverable aanleveren." },
          { id: "openingstijden", type: "textarea", label: "Openingstijden" },
          { id: "beschrijving_call_flow_tijdens_werkuren", type: "textarea", label: "Beschrijving call flow tijdens werkuren", hint: "Niet nodig als dit al in het call flow-overzicht staat." },
          { id: "beschrijving_call_flow_buiten_werkuren", type: "textarea", label: "Beschrijving call flow buiten werkuren", hint: "Niet nodig als dit al in het call flow-overzicht staat." },
          { id: "regeling_vakantiedagen", type: "textarea", label: "Regeling voor vakantiedagen" },
          { id: "regeling_uitzonderlijke_sluiting", type: "textarea", label: "Regeling bij uitzonderlijke sluiting" },
          { id: "disaster_routing", type: "textarea", label: "Disaster routing" },
          { id: "doorschakelingen_naar_ketenpartners", type: "textarea", label: "Doorschakelingen naar ketenpartners", hint: "Bijvoorbeeld via het KCC, automatisch, op basis van postcode, enz." },
        ],
      },
      {
        title: "Huidige functionaliteit",
        fields: [
          { id: "voicemail_op_userniveau_aan", type: "yesno", label: "Staat voicemail op userniveau aan?" },
          { id: "busy_on_busy_regeling", type: "textarea", label: "Busy-on-busy-regeling", hint: "Bijvoorbeeld voicemail als de user in gesprek is, of een tweede gesprek laten binnenkomen." },
          { id: "klassieke_dtmf_of_conversationele_menus", type: "text", label: "Klassieke DTMF- of conversationele menu's?" },
          { id: "type_koppeling_met_crm", type: "text", label: "Type koppeling met CRM" },
          { id: "is_er_nummerherkenning", type: "yesno", label: "Is er nummerherkenning?" },
          { id: "worden_gesprekken_opgenomen", type: "yesno", label: "Worden gesprekken opgenomen?" },
          { id: "worden_gesprekken_getranscribeerd", type: "yesno", label: "Worden gesprekken getranscribeerd?" },
          { id: "worden_gesprekken_samengevat", type: "yesno", label: "Worden gesprekken samengevat?" },
          { id: "is_er_sentimentanalyse", type: "yesno", label: "Is er sentimentanalyse?" },
          { id: "wordt_ai_toegepast_als_assistent_voor_kcc", type: "yesno", label: "Wordt AI toegepast als assistent voor het KCC?", hint: "Bijvoorbeeld suggesties of vergelijkbare gesprekken." },
          { id: "welke_bewaartermijnen_zijn_afgesproken", type: "textarea", label: "Welke bewaartermijnen zijn afgesproken?" },
          { id: "welke_kanalen_buiten_spraak_zijn_er_omnichannel", type: "textarea", label: "Welke kanalen buiten spraak zijn er (omnichannel)?" },
          { id: "rapportages_en_wallboarding", type: "textarea", label: "Rapportages en wallboarding", hint: "Bijvoorbeeld native, Effecta, CloudTalk of geen." },
          { id: "welke_groepen_userprofielen", type: "textarea", label: "Welke groepen userprofielen zijn er?", hint: "Bijvoorbeeld user, supervisor, admin." },
          { id: "overige_3rd_party_koppelingen_en_features", type: "textarea", label: "Overige third-party koppelingen en features" },
          { id: "waar_staat_de_kennisbank", type: "text", label: "Waar staat de kennisbank (KB)?", hint: "Bijvoorbeeld website, Dynamics-kennisartikelen, IRIS Beheer." },
        ],
      },
      {
        title: "Huidig netwerk",
        fields: [
          { id: "wie_beheert_het_netwerk", type: "text", label: "Wie beheert het netwerk?" },
          { id: "up_en_down_profiel_mbit", type: "text", label: "Up-/downprofiel (Mbit)" },
          { id: "netwerk_connectivity_check_ncc", type: "textarea", label: "Network Connectivity Check (NCC)", hint: "Aan te leveren als deliverable via een netwerkmeting op https://connectivity.office.com/." },
          { id: "type_firewall", type: "text", label: "Type firewall" },
          { id: "staan_sip_alg_helpers_uit", type: "yesno", label: "Staan SIP ALG/helpers uit?" },
          { id: "is_er_een_aparte_vlan_voor_voice", type: "yesno", label: "Is er een aparte VLAN voor voice?" },
          { id: "staat_dpi_uit_voor_voice", type: "yesno", label: "Staat DPI (Deep Packet Inspection) uit voor voice?" },
          { id: "is_qos_ingericht_op_netwerk", type: "yesno", label: "Is QoS ingericht op het netwerk?" },
          { id: "wordt_vpn_gebruikt", type: "yesno", label: "Wordt VPN gebruikt?" },
          { id: "indien_vpn_is_split_tunnel_ingericht_voor_voice", type: "yesno", label: "Indien VPN: is split-tunnel ingericht voor voice?" },
          { id: "wordt_gebruik_gemaakt_van_vds", type: "yesno", label: "Wordt gebruikgemaakt van VDS?" },
          { id: "is_er_redundantie_van_internetlijn", type: "yesno", label: "Is er redundantie van de internetlijn?" },
          { id: "is_er_een_sbc_en_zo_ja_welke", type: "text", label: "Is er een SBC, en zo ja, welke?" },
          { id: "beheerder_sbc", type: "text", label: "Beheerder SBC" },
        ],
      },
      {
        title: "Praktisch",
        fields: [
          { id: "einde_contractdatum_huidige_oplossing", type: "date", label: "Einddatum contract huidige oplossing" },
          { id: "hoeveelheid_afkoop_belminuten", type: "number", label: "Hoeveelheid afgekochte belminuten", hint: "Indien er belminuten zijn afgekocht: hoeveel?" },
          { id: "gewenste_datum_voor_livegang", type: "date", label: "Gewenste datum voor livegang" },
          { id: "trainingsmodel", type: "textarea", label: "Trainingsmodel", hint: "Gewenste trainingen, zoals usertraining KCC, usertraining Teams Calling, beheerderstraining, train-the-trainer, enz." },
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

  contactcenter: {
    id: "contactcenter",
    menuLabel: "Contact Center",
    icon: "🎧",
    title: "Contact Center Intake",
    intro:
      "The purpose of this intake is to map the current telephony and contact center environment, so that we can prepare the move to the new contact center functionally, technically, and organizationally. The answers form the basis for configuring numbers, call flows, functionality, network, and training.",
    sections: [
      {
        title: "General information",
        fields: [
          { id: "huidige_provider", type: "text", label: "Current provider" },
          { id: "provider_uptime_sla", type: "text", label: "Provider uptime SLA" },
          { id: "huidige_pbx", type: "text", label: "Current PBX" },
          { id: "beheerder_pbx", type: "text", label: "PBX administrator" },
          { id: "huidig_contact_center", type: "text", label: "Current contact center" },
          { id: "beheerder_contact_center", type: "text", label: "Contact center administrator" },
          { id: "aantal_simultane_voicekanalen", type: "number", label: "Number of simultaneous voice channels" },
          { id: "nummerblokken_overzicht", type: "textarea", label: "Number block overview", hint: "For example blocks from +31... to +31.... Preferably supplied as a deliverable." },
          { id: "hebben_alle_users_een_eigen_nummer", type: "yesno", label: "Do all users have their own number?" },
          { id: "nummertoewijzingen_overzicht", type: "textarea", label: "Number assignment overview", hint: "For example: +31... is the main number, +31... is user A's number, etc. Preferably supplied as a deliverable." },
          { id: "worden_verkorte_nummers_gebruikt", type: "yesno", label: "Are short (abbreviated) numbers used?" },
          { id: "routering_vrije_nummers", type: "textarea", label: "Routing of unassigned numbers", hint: "For example: unassigned numbers give a busy tone, are forwarded to the main number, or play a message." },
          { id: "standaard_getoond_nummer_bij_outbound", type: "text", label: "Default caller ID for outbound calls" },
          { id: "maandelijks_inkomend_belvolume", type: "number", label: "Monthly inbound call volume", hint: "Preferably based on an invoice." },
          { id: "maandelijks_uitgaand_belvolume", type: "number", label: "Monthly outbound call volume", hint: "Preferably based on an invoice." },
          { id: "internationaal_bellen_van_toepassing", type: "yesno", label: "Does international calling apply?" },
          { id: "premium_nummers_toegelaten", type: "yesno", label: "Are premium-rate numbers allowed?" },
          { id: "locaties_adressen", type: "textarea", label: "Location addresses" },
          { id: "emergency_routing_adres", type: "textarea", label: "Emergency routing address", hint: "The address shown to emergency services." },
          { id: "totaal_aantal_medewerkers", type: "number", label: "Total number of employees" },
          { id: "aantal_kcc_medewerkers", type: "number", label: "Number of customer contact centre (KCC) employees" },
          { id: "hardware_telefoons", type: "textarea", label: "Hardware phones", hint: "For example desk phones (model), DECT (model), etc." },
          { id: "special_devices", type: "textarea", label: "Special devices", hint: "For example fax, intercom, alarm system (if connected to the PBX), elevator, etc." },
          { id: "mobiele_telefoons_managed_of_byod", type: "text", label: "Mobile phones: managed or BYOD?" },
          { id: "microsoft_teams_reeds_in_gebruik", type: "yesno", label: "Is Microsoft Teams already in use?" },
          { id: "huidige_microsoft_licenties", type: "textarea", label: "Current Microsoft licences", hint: "For example Microsoft E3, Microsoft E5, Dynamics 365 Customer Service Enterprise." },
        ],
      },
      {
        title: "Current call flow",
        fields: [
          { id: "call_flow_overzicht", type: "textarea", label: "Call flow overview", hint: "Preferably supplied as a deliverable." },
          { id: "openingstijden", type: "textarea", label: "Opening hours" },
          { id: "beschrijving_call_flow_tijdens_werkuren", type: "textarea", label: "Description of the call flow during business hours", hint: "Not needed if already covered in the call flow overview." },
          { id: "beschrijving_call_flow_buiten_werkuren", type: "textarea", label: "Description of the call flow outside business hours", hint: "Not needed if already covered in the call flow overview." },
          { id: "regeling_vakantiedagen", type: "textarea", label: "Arrangement for holidays" },
          { id: "regeling_uitzonderlijke_sluiting", type: "textarea", label: "Arrangement for exceptional closures" },
          { id: "disaster_routing", type: "textarea", label: "Disaster routing" },
          { id: "doorschakelingen_naar_ketenpartners", type: "textarea", label: "Call transfers to chain partners", hint: "For example via the KCC, automatically, based on postcode, etc." },
        ],
      },
      {
        title: "Current functionality",
        fields: [
          { id: "voicemail_op_userniveau_aan", type: "yesno", label: "Is voicemail enabled at user level?" },
          { id: "busy_on_busy_regeling", type: "textarea", label: "Busy-on-busy arrangement", hint: "For example voicemail when the user is on a call, or letting a second call come in." },
          { id: "klassieke_dtmf_of_conversationele_menus", type: "text", label: "Classic DTMF or conversational menus?" },
          { id: "type_koppeling_met_crm", type: "text", label: "Type of CRM integration" },
          { id: "is_er_nummerherkenning", type: "yesno", label: "Is there caller identification?" },
          { id: "worden_gesprekken_opgenomen", type: "yesno", label: "Are calls recorded?" },
          { id: "worden_gesprekken_getranscribeerd", type: "yesno", label: "Are calls transcribed?" },
          { id: "worden_gesprekken_samengevat", type: "yesno", label: "Are calls summarised?" },
          { id: "is_er_sentimentanalyse", type: "yesno", label: "Is there sentiment analysis?" },
          { id: "wordt_ai_toegepast_als_assistent_voor_kcc", type: "yesno", label: "Is AI used as an assistant for the KCC?", hint: "For example suggestions or similar calls." },
          { id: "welke_bewaartermijnen_zijn_afgesproken", type: "textarea", label: "Which retention periods have been agreed?" },
          { id: "welke_kanalen_buiten_spraak_zijn_er_omnichannel", type: "textarea", label: "Which channels other than voice are there (omnichannel)?" },
          { id: "rapportages_en_wallboarding", type: "textarea", label: "Reporting and wallboarding", hint: "For example native, Effecta, CloudTalk, or none." },
          { id: "welke_groepen_userprofielen", type: "textarea", label: "Which groups of user profiles are there?", hint: "For example user, supervisor, admin." },
          { id: "overige_3rd_party_koppelingen_en_features", type: "textarea", label: "Other third-party integrations and features" },
          { id: "waar_staat_de_kennisbank", type: "text", label: "Where is the knowledge base (KB) located?", hint: "For example website, Dynamics knowledge articles, IRIS Beheer." },
        ],
      },
      {
        title: "Current network",
        fields: [
          { id: "wie_beheert_het_netwerk", type: "text", label: "Who manages the network?" },
          { id: "up_en_down_profiel_mbit", type: "text", label: "Up/down profile (Mbit)" },
          { id: "netwerk_connectivity_check_ncc", type: "textarea", label: "Network Connectivity Check (NCC)", hint: "To be supplied as a deliverable via a network measurement at https://connectivity.office.com/." },
          { id: "type_firewall", type: "text", label: "Firewall type" },
          { id: "staan_sip_alg_helpers_uit", type: "yesno", label: "Are SIP ALG/helpers disabled?" },
          { id: "is_er_een_aparte_vlan_voor_voice", type: "yesno", label: "Is there a separate VLAN for voice?" },
          { id: "staat_dpi_uit_voor_voice", type: "yesno", label: "Is DPI (Deep Packet Inspection) disabled for voice?" },
          { id: "is_qos_ingericht_op_netwerk", type: "yesno", label: "Is QoS configured on the network?" },
          { id: "wordt_vpn_gebruikt", type: "yesno", label: "Is a VPN used?" },
          { id: "indien_vpn_is_split_tunnel_ingericht_voor_voice", type: "yesno", label: "If VPN: is split tunnelling configured for voice?" },
          { id: "wordt_gebruik_gemaakt_van_vds", type: "yesno", label: "Is VDS used?" },
          { id: "is_er_redundantie_van_internetlijn", type: "yesno", label: "Is the internet connection redundant?" },
          { id: "is_er_een_sbc_en_zo_ja_welke", type: "text", label: "Is there an SBC, and if so, which one?" },
          { id: "beheerder_sbc", type: "text", label: "SBC administrator" },
        ],
      },
      {
        title: "Practical",
        fields: [
          { id: "einde_contractdatum_huidige_oplossing", type: "date", label: "Contract end date of the current solution" },
          { id: "hoeveelheid_afkoop_belminuten", type: "number", label: "Number of prepaid call minutes", hint: "If call minutes have been bought off: how many?" },
          { id: "gewenste_datum_voor_livegang", type: "date", label: "Desired go-live date" },
          { id: "trainingsmodel", type: "textarea", label: "Training model", hint: "Desired training, such as KCC user training, Teams Calling user training, administrator training, train-the-trainer, etc." },
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

export const FORM_ORDER: FormId[] = ["reparatieonderhoud", "mutatieonderhoud", "inkoopregister", "contactcenter"];
