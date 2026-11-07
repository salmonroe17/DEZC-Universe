/** Reusable gradient recipes. Text belongs on the protected ink layer, not arbitrary bright stops. */
export const gradientRecipes = {
  azure: { label: 'Azure', colors: ['#06152e', '#1249eb', '#35dcf5'], paint: 'radial-gradient(ellipse at 102% 100%, #8bf8ff 0%, #35bbf5 20%, transparent 57%), radial-gradient(ellipse at 0% 88%, #154fff 0%, transparent 67%), linear-gradient(150deg, #06152e 12%, #051536 55%, #1559f5)' },
  iris: { label: 'Iris', colors: ['#16062f', '#7022ed', '#ff63c0'], paint: 'radial-gradient(ellipse at 85% 92%, #ff70b4 0%, transparent 42%), radial-gradient(ellipse at 8% 78%, #ad5dff 0%, transparent 58%), linear-gradient(140deg, #130624 8%, #5017a3 54%, #7018e9)' },
  solar: { label: 'Solar', colors: ['#153629', '#e8fa70', '#ff713a'], paint: 'radial-gradient(ellipse at 95% 5%, #ff7a32 0%, transparent 50%), radial-gradient(ellipse at 0% 100%, #f0fa83 0%, transparent 58%), linear-gradient(135deg, #183d2b 10%, #527c35 48%, #f6b252)' },
} as const
export type GradientRecipe = keyof typeof gradientRecipes
