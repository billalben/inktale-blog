const AVR_READ_WPM = 200;

export function getReadingTime(text: string): number {
  const words = text.split(" ").length;
  return Math.ceil(words / AVR_READ_WPM);
}
