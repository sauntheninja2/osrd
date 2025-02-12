import type { SimulationReportSheetProps } from './types';

function generateRandomString(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

// TODO: The number must be calculated from a hash of stdcm inputs (to have a stable number). It is currently generated randomly, so there could be duplicates.
export function generateCodeNumber(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().substr(-2);
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const randomPart1 = generateRandomString(3);
  const randomPart2 = generateRandomString(3);
  return `${month}${year}-${randomPart1}-${randomPart2}`;
}

// TODO: This function is only used for V1, so it must be deleted when V1 is abandoned.
export function formatCreationDate(date: string) {
  const creationDate = new Date(date);
  const day = creationDate.getDate();
  const month = creationDate.getMonth() + 1;
  const year = creationDate.getFullYear();
  const hours = creationDate.getHours();
  const minutes = creationDate.getMinutes();

  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return {
    day: formattedDay,
    month: formattedMonth,
    year,
    hours: formattedHours,
    minutes: formattedMinutes,
  };
}

export function getStopDurationTime(sec: number) {
  const timeInMilliseconds = sec * 1000;
  const time = new Date(timeInMilliseconds);

  if (timeInMilliseconds < 60000) {
    return `${time.getUTCSeconds()} sec`;
  }
  return `${time.getUTCMinutes()} min`;
}

export function extractSpeedLimit(speedLimitByTag: string): string {
  const parts = speedLimitByTag.split(' - ');
  return parts[parts.length - 1];
}

function secondsToTimeString(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function timeStringToSeconds(time: string): number {
  const [minutes, seconds] = time.split(':').map(Number);
  return minutes * 60 + seconds;
}

/**
 * Based on a stop arrival time and a stop duration, calculate the departure time on this stop
 */
function computeStopDepartureTime(hhmm: string, mmss: string): string {
  const [hh, mm] = hhmm.split(':').map(Number);
  const totalSeconds1 = hh * 3600 + mm * 60;
  const totalSeconds2 = timeStringToSeconds(mmss);

  const totalSeconds = totalSeconds1 + totalSeconds2;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// Function to add minutes to the departure time
const addMinutesToTime = (baseHour: number, baseMinute: number, minutesToAdd: number): string => {
  const totalMinutes = baseHour * 60 + baseMinute + minutesToAdd;
  const finalHour = Math.floor(totalMinutes / 60) % 24;
  const finalMinutes = totalMinutes % 60;
  return `${String(finalHour).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`;
};

const getTimeAtPosition = (
  trainPosition: number,
  trainPositions: number[],
  trainTimes: number[],
  trainDepartureHour: number,
  trainDepartureMinute: number
): string => {
  const index = trainPositions.findIndex((pos) => pos >= trainPosition);
  const timeInMillis = trainTimes[index];
  const timeInMinutes = Math.floor(timeInMillis / 60000);
  return addMinutesToTime(trainDepartureHour, trainDepartureMinute, timeInMinutes);
};

const getStopDurationBetweenToPositions = (
  position: number,
  trainPositions: number[],
  trainTimes: number[]
): number | null => {
  const firstIndex = trainPositions.indexOf(position);
  const lastIndex = trainPositions.lastIndexOf(position);
  if (firstIndex !== -1 && lastIndex !== -1 && firstIndex !== lastIndex) {
    return trainTimes[lastIndex] - trainTimes[firstIndex];
  }
  return null;
};

export function getOperationalPointsWithTimes(simulationReport: SimulationReportSheetProps): {
  opId: string;
  positionOnPath: number;
  time: string | null;
  name: string | undefined;
  ch: string | undefined;
  stop: string | null | undefined;
  duration: number;
  departureTime: string;
  stopEndTime: string;
  trackName: string | undefined;
}[] {
  const operationalPoints = simulationReport.pathProperties?.suggestedOperationalPoints || [];
  const { simulation } = simulationReport.stdcmData;

  const { positions, times } = simulation.final_output;
  const departureTime = new Date(simulationReport.stdcmData.departure_time)
    .toLocaleTimeString()
    .substring(0, 5);

  // Parse departure time into hours and minutes
  const [departureHour, departureMinute] = departureTime.split(':').map(Number);

  // Map operational points with their positions, times, and stop durations
  const opResults = operationalPoints.map((op) => {
    const formattedTime = getTimeAtPosition(
      op.positionOnPath,
      positions,
      times,
      departureHour,
      departureMinute
    );

    const duration = getStopDurationBetweenToPositions(op.positionOnPath, positions, times);
    const durationInSeconds = duration !== null ? duration / 1000 : 0;
    const durationToString = secondsToTimeString(durationInSeconds);
    const stopEndTime = computeStopDepartureTime(formattedTime, durationToString);

    return {
      opId: op.opId,
      positionOnPath: op.positionOnPath,
      time: formattedTime,
      name: op.name,
      ch: op.ch,
      stop: op.stopFor,
      duration: durationInSeconds,
      departureTime,
      stopEndTime,
      trackName: op.metadata?.trackName,
    };
  });

  return opResults;
}
