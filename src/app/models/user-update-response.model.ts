export interface UserUpdateResponse {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  // Nouveau JWT retourné par le back après mise à jour
  // Nécessaire si l'email a changé : le token doit être rafraîchi car il contient l'email comme "sub"
  token: string;
}
