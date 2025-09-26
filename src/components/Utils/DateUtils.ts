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

  // DateUtils.ts
export const formatToLocalDate = (utcDateString: string | Date, options?: Intl.DateTimeFormatOptions) => {
    if (!utcDateString) return "";
  
    // Convert input to Date object
    const date = typeof utcDateString === "string" ? new Date(utcDateString) : utcDateString;
  
    // Default formatting options if none provided
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
  
    return date.toLocaleString(undefined, options || defaultOptions);
  };

// DateUtils.ts
// Converts a UTC string or Date to a local string suitable for datetime-local input
export const toLocalInputDate = (utcDate: string | Date) => {
    const d = new Date(utcDate);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  // Converts a datetime-local string (local) to UTC ISO string
  export const toUtcDateString = (localDateStr: string) => {
    const [datePart, timePart] = localDateStr.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
  
    // Build a Date object in local timezone
    const localDate = new Date(year, month - 1, day, hours, minutes);
  
    // Convert to UTC ISO string
    return localDate.toISOString();
  };
  