const PUBLIC_LANDING_BASE_URL = "https://oportunidades.playbet.app.br";

export const getPublicLandingBaseUrl = () => PUBLIC_LANDING_BASE_URL;

export const buildPublicLandingUrl = (slug: string) => {
  return `${PUBLIC_LANDING_BASE_URL}/?ref=${encodeURIComponent(slug)}`;
};
