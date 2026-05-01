export const radarCenter = { x: 110, y: 94 } as const;
export const radarRadius = 70;
export const radarGridLevels = [1, 0.75, 0.5, 0.25] as const;

export function getHexagonPoints(radius: number, values?: readonly number[]) {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / 6;
    const scale = values ? values[index] / 100 : 1;
    const x = radarCenter.x + Math.cos(angle) * radius * scale;
    const y = radarCenter.y + Math.sin(angle) * radius * scale;

    return `${x},${y}`;
  }).join(" ");
}
