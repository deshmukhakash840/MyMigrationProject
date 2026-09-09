export function formatLocator(template: string, ...values: string[]): string {
  let formatted = template;
  for (const value of values) {
    formatted = formatted.replace('%s', value);
  }
  return formatted;
}

export function cssNameLocator(name: string): string {
  return `[name="${name.replace(/"/g, '\\"')}"]`;
}
