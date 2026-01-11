const AUTH_KEY = "isAdminLogged";

export function loginSuccess() {
  localStorage.setItem(AUTH_KEY, "true");
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn() {
  return localStorage.getItem(AUTH_KEY) === "true";
}

export async function login(password) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    }
  );

  if (res.ok) {
    loginSuccess();
    return true;
  }

  return false;
}
