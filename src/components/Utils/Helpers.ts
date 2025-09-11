export function shortenAddress(full: string, maxParts: number = 2): string {
    const parts = full.split(",");
    if (parts.length > maxParts) return parts.slice(0, maxParts).join(","); 
    return full;
  }
  