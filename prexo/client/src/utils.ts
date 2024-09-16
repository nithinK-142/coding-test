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
