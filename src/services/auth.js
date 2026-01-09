const ADMIN_TOKEN = "CULLERA_DIGITAL_SECRET";

export function login(password) {
  if (password === ADMIN_TOKEN) {
    localStorage.setItem("token", ADMIN_TOKEN);
    return true;
  }
  localStorage.removeItem("token");
  return false;
}

export function logout() {
  localStorage.removeItem("token");
}

export function isLoggedIn() {
  return localStorage.getItem("token") === ADMIN_TOKEN;
}

export function getToken() {
  return localStorage.getItem("token");
}
