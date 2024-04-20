// utils/csrf.js
import { baseUrl } from "../config.js";
const fetchCsrfToken = async () => {
  try {
    const response = await fetch(`${baseUrl}/messages/submit-message/`, {
      method: "GET",
      credentials: "include",
    });
    const csrfToken = await response.text();
    return csrfToken;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    return null;
  }
};

export default fetchCsrfToken;
