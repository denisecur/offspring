import type { Schema, Attribute } from '@strapi/strapi';

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

export interface AusbildungBerichtsheft extends Schema.Component {
  collectionName: 'components_ausbildung_berichtshefts';
  info: {
    displayName: 'berichtsheft';
  };
  attributes: {
    datum: Attribute.Date;
    beschreibung: Attribute.Text;
    datei: Attribute.Media;
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
        'Muendliche Leistung',
        'Projekt',
        'Praesentation'
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

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'ausbildung.ausbildung': AusbildungAusbildung;
      'ausbildung.berichtsheft': AusbildungBerichtsheft;
      'ausbildung.noten': AusbildungNoten;
      'ausbildung.schule': AusbildungSchule;
      'berechtigungen.permissions': BerechtigungenPermissions;
    }
  }
}
