// src/utils/dateUtils.js
import { addWeeks, getISOWeek, startOfWeek } from "date-fns";

/**
 * Ermittelt den Wochenstart (Montag) für ein gegebenes Datum.
 * @param {Date} date - Das Basisdatum.
 * @returns {Date} - Das Datum des Montags dieser Woche.
 */
export const getStartOfWeekFromDate = (date) => {
  return startOfWeek(date, { weekStartsOn: 1 });
};

/**
 * Generiert einen eindeutigen Key für eine Kalenderwoche anhand eines Datums.
 * @param {Date} date - Das Datum, für das die Kalenderwoche berechnet werden soll.
 * @returns {string} - Der Week-Key als String.
 */
export const generateWeekKey = (date) => {
  return `${getISOWeek(date)}`;
};

/**
 * Berechnet das Datum einer bestimmten Kalenderwoche ab einem Startdatum.
 * @param {Date} startDate - Das Startdatum (in der Regel der Wochenstart des Basisdatums).
 * @param {number} weekNumber - Die Nummer der Woche (beginnend bei 1).
 * @returns {Date} - Das Datum des entsprechenden Wochenbeginns.
 */
export const calculateWeekDate = (startDate, weekNumber) => {
  return addWeeks(startDate, weekNumber - 1);
};
