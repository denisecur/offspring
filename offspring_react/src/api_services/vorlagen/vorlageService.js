import { getToken } from "../../helpers";
import { API } from "../../constant";

export const fetchVorlage = async () => {
  // Mit populate=* (oder gezielt populate=pdf), damit alle relevanten Felder geladen werden
  const url = `${API}/vorlagen?populate=*`;
  const token = getToken();
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Fehler beim Abrufen der Vorlage");
  }

  const data = await response.json();
  return data;
};
