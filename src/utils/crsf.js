// utils/csrf.js
const fetchCsrfToken = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/messages/submit-message/");
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    return null;
  }
};

export default fetchCsrfToken;
