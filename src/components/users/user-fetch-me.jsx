import config from "../../config";

const apiUrl = config.apiUrl;

const fetchUserData = async () => {
  const token = localStorage.getItem("token"); // Obtén el token del almacenamiento local

  try {
    const response = await fetch(`${apiUrl}/users/me?populate[role][fields][0]=name`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron obtener los datos del usuario");
    }

    const userData = await response.json(); // Datos del usuario autenticado

    return userData; // Devuelve los datos para utilizarlos
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
  }
};

export default fetchUserData;
