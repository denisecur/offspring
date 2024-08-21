import { getToken } from "../../helpers";
import { API } from "../../constant";


export const fetchOrder = async () => {
    const url = `${API}/orders?populate=products`;
    const token = getToken();
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Fehler beim Abrufen der Daten");
    }
  
    const data = await response.json();
    return data;
  };