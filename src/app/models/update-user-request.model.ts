export interface UpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  // requis par le back même si inchangé — envoyer chaîne vide si pas de changement de mot de passe
  oldPassword: string;
  password: string;
}
