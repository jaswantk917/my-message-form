// utils/csrf.js
import { baseUrl } from "../config.js";
const fetchCsrfToken = async () => {
  try {
    const response = await fetch(`${baseUrl}/messages/submit-message/`);
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    return null;
  }
};

export default fetchCsrfToken;
