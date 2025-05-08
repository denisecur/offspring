import type { Attribute, Schema } from '@strapi/strapi';

export interface AusbildungAusbildung extends Schema.Component {
  collectionName: 'components_ausbildung_ausbildungs';
  info: {
    description: '';
    displayName: 'ausbildung';
  };
  attributes: {
    berichtshefte: Attribute.Component<'ausbildung.berichtsheft', true>;
    fachrichtung: Attribute.Enumeration<
      ['B\u00FCromanagement', 'Versicherungen- und Finanzanlagen']
    >;
    noten: Attribute.Component<'ausbildung.noten', true>;
    schule: Attribute.Component<'ausbildung.schule'>;
  };
}

export interface AusbildungBerichtsheft extends Schema.Component {
  collectionName: 'components_ausbildung_berichtshefts';
  info: {
    displayName: 'berichtsheft';
  };
  attributes: {
    beschreibung: Attribute.Text;
    datei: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    datum: Attribute.Date;
  };
}

export interface AusbildungLeistungsnachweis extends Schema.Component {
  collectionName: 'components_ausbildung_leistungsnachweis';
  info: {
    displayName: 'leistungsnachweis';
  };
  attributes: {
    art: Attribute.String;
    gewichtung: Attribute.Decimal;
  };
}

export interface AusbildungNoten extends Schema.Component {
  collectionName: 'components_ausbildung_notens';
  info: {
    description: '';
    displayName: 'note';
  };
  attributes: {
    art: Attribute.Enumeration<
      [
        'Schulaufgabe',
        'Kurzarbeit',
        'M\u00FCndliche Leistung',
        'Stegreifaufgabe'
      ]
    > &
      Attribute.Required;
    ausbildungsfach: Attribute.Relation<
      'ausbildung.noten',
      'oneToOne',
      'api::ausbildungsfach.ausbildungsfach'
    >;
    datum: Attribute.Date & Attribute.Required;
    gewichtung: Attribute.Decimal;
    lernfeld: Attribute.Relation<
      'ausbildung.noten',
      'oneToOne',
      'api::lernfeld.lernfeld'
    >;
    wert: Attribute.Decimal;
  };
}

export interface AusbildungSchule extends Schema.Component {
  collectionName: 'components_ausbildung_schules';
  info: {
    displayName: 'Schule';
  };
  attributes: {
    anschrift: Attribute.Text;
    ansprechpartner: Attribute.String;
    schulname: Attribute.String;
    tel: Attribute.String;
  };
}

export interface BerechtigungenEigenschaften extends Schema.Component {
  collectionName: 'components_berechtigungen_eigenschaftens';
  info: {
    displayName: 'eigenschaften';
  };
  attributes: {
    ausbildungsstart: Attribute.Date;
  };
}

export interface BerechtigungenPermissions extends Schema.Component {
  collectionName: 'components_berechtigungen_permissions';
  info: {
    description: '';
    displayName: 'permissions';
  };
  attributes: {
    app: Attribute.String;
    full_access: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    individuelles: Attribute.Component<'berechtigungen.eigenschaften'>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'ausbildung.ausbildung': AusbildungAusbildung;
      'ausbildung.berichtsheft': AusbildungBerichtsheft;
      'ausbildung.leistungsnachweis': AusbildungLeistungsnachweis;
      'ausbildung.noten': AusbildungNoten;
      'ausbildung.schule': AusbildungSchule;
      'berechtigungen.eigenschaften': BerechtigungenEigenschaften;
      'berechtigungen.permissions': BerechtigungenPermissions;
    }
  }
}
