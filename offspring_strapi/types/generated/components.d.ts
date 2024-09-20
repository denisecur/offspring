import type { Schema, Attribute } from '@strapi/strapi';

export interface BerechtigungenPermissions extends Schema.Component {
  collectionName: 'components_berechtigungen_permissions';
  info: {
    displayName: 'permissions';
    description: '';
  };
  attributes: {
    app: Attribute.String;
    full_access: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
  };
}

export interface AusbildungSchule extends Schema.Component {
  collectionName: 'components_ausbildung_schules';
  info: {
    displayName: 'Schule';
  };
  attributes: {
    schulname: Attribute.String;
    anschrift: Attribute.Text;
    tel: Attribute.String;
    ansprechpartner: Attribute.String;
  };
}

export interface AusbildungNoten extends Schema.Component {
  collectionName: 'components_ausbildung_notens';
  info: {
    displayName: 'note';
    description: '';
  };
  attributes: {
    datum: Attribute.Date & Attribute.Required;
    wert: Attribute.Decimal;
    art: Attribute.Enumeration<
      [
        'Schulaufgabe',
        'Kurzarbeit',
        'Stegreifaufgabe',
        'M\u00FCndliche Leistung'
      ]
    > &
      Attribute.Required;
    gewichtung: Attribute.Decimal;
    ausbildungsfach: Attribute.Relation<
      'ausbildung.noten',
      'oneToOne',
      'api::ausbildungsfach.ausbildungsfach'
    >;
    lernfeld: Attribute.Relation<
      'ausbildung.noten',
      'oneToOne',
      'api::lernfeld.lernfeld'
    >;
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

export interface AusbildungBerichtsheft extends Schema.Component {
  collectionName: 'components_ausbildung_berichtshefts';
  info: {
    displayName: 'berichtsheft';
  };
  attributes: {
    datum: Attribute.Date;
    beschreibung: Attribute.Text;
    datei: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface AusbildungAusbildung extends Schema.Component {
  collectionName: 'components_ausbildung_ausbildungs';
  info: {
    displayName: 'ausbildung';
    description: '';
  };
  attributes: {
    fachrichtung: Attribute.Enumeration<
      ['B\u00FCromanagement', 'Versicherungen- und Finanzanlagen']
    >;
    schule: Attribute.Component<'ausbildung.schule'>;
    noten: Attribute.Component<'ausbildung.noten', true>;
    berichtshefte: Attribute.Component<'ausbildung.berichtsheft', true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'berechtigungen.permissions': BerechtigungenPermissions;
      'ausbildung.schule': AusbildungSchule;
      'ausbildung.noten': AusbildungNoten;
      'ausbildung.leistungsnachweis': AusbildungLeistungsnachweis;
      'ausbildung.berichtsheft': AusbildungBerichtsheft;
      'ausbildung.ausbildung': AusbildungAusbildung;
    }
  }
}
