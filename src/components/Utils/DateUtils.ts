// utils/dateUtils.ts
export function formatEventDate(isoString: string): string {
    const date = new Date(isoString);
  
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    const suffix = (d: number) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
  
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? "pm" : "am";
  
    // Show minutes only if not 0
    const minutesStr = minutes > 0 ? `:${String(minutes).padStart(2, "0")}` : "";
  
    return `${month} ${day}${suffix(day)}, ${hour12}${minutesStr}${ampm}`;
  }
  