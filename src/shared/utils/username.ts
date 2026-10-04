export function generateUsername(name: string): string {
  const username = name.toLowerCase().replace(" ", "");
  return `${username}-${Date.now()}`;
}
