export function formatDateTime(): string {
  const date = new Date();
  return generateFormattedDateTime(date);
}

export function generateFormattedDateTime(date: Date): string {
  const formattedDate = date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/:/, ".");

  return formattedDate;
}

export function incrementString(input: string): string {
  // Split the string into non-numeric and numeric parts
  const [prefix, numericPart] = input.split(/(\d+)$/).filter(Boolean);

  if (!numericPart) {
    return input + "1"; // If no number at the end, append 1
  }

  // Parse the numeric part, increment it, and pad with zeros
  const incrementedNum = (parseInt(numericPart, 10) + 1)
    .toString()
    .padStart(numericPart.length, "0");

  return prefix + incrementedNum;
}
