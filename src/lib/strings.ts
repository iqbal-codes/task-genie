import { addDays, format, isBefore, nextSunday } from "date-fns";

export const getRelativeDateTimeText = (
  value: Date | undefined | null,
  showTime: boolean
) => {
  if (!value) return undefined;

  const timeStr = showTime ? `, ${format(value, "hh:mm a").toUpperCase()}` : "";

  if (value.getDate() === new Date().getDate()) {
    return `Today${timeStr}`;
  } else if (value.getDate() === addDays(new Date(), 1).getDate()) {
    return `Tomorrow${timeStr}`;
  } else if (value.getDate() === addDays(new Date(), 7).getDate()) {
    return `Next week, ${format(value, "d MMM")}${timeStr}`;
  } else {
    const nextSundayDate = nextSunday(new Date());
    return isBefore(value, nextSundayDate)
      ? `${format(value, "EEEE")}${timeStr}`
      : `${format(value, "d MMM")}${timeStr}`;
  }
};

