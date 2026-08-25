import { setHours, setMinutes, format } from "date-fns";

export function generateDayTimeList(date: Date): string[] {
  const startTime = setMinutes(setHours(date, 9), 0); // 09:00
  const endTime = setMinutes(setHours(date, 18), 0); // 18:00
  const interval = 45; // 45 minutos
  const timeList: string[] = [];

  let currentTime = startTime;

  while (currentTime <= endTime) {
    timeList.push(format(currentTime, "HH:mm"));
    currentTime = setMinutes(currentTime, currentTime.getMinutes() + interval);
  }

  return timeList;
}
