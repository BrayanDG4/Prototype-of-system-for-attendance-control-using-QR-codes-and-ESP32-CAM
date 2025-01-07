type TailwindColorPalette = {
  [key: string]: string | TailwindColorPalette;
};

// Función personalizada para aplanar la paleta de colores
function flattenColorPalette(
  colors: TailwindColorPalette,
  prefix = ""
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === "string") {
      result[prefix + key] = value;
    } else if (typeof value === "object") {
      Object.assign(result, flattenColorPalette(value, `${prefix}${key}-`));
    }
  }

  return result;
}

// Plugin para agregar variables CSS globales de colores
export function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors"));
  const cssVariables = Object.fromEntries(
    Object.entries(allColors).map(([key, value]) => [`--${key}`, value])
  );

  addBase({
    ":root": cssVariables,
  });
}
