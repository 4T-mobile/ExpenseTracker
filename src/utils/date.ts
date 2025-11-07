/**
 * Date formatting and manipulation utilities.
 */

import {
  format,
  parseISO,
  formatDistanceToNow,
  isToday as isTodayFns,
  isYesterday as isYesterdayFns,
  isThisWeek as isThisWeekFns,
  isThisMonth as isThisMonthFns,
  isThisYear as isThisYearFns,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  subWeeks,
  subMonths,
  differenceInDays,
} from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format date in Vietnamese format (dd/MM/yyyy).
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: vi });
};

/**
 * Format date with month name (dd MMM yyyy).
 */
export const formatDateWithMonth = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd MMM yyyy', { locale: vi });
};

/**
 * Format date and time.
 */
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: vi });
};

/**
 * Format relative time (e.g., "2 giờ trước", "3 ngày trước").
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: vi,
  });
};

/**
 * Format date for API (YYYY-MM-DD).
 */
export const formatDateForAPI = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Format month and year (Tháng MM, yyyy).
 */
export const formatMonthYear = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMMM yyyy', { locale: vi });
};

/**
 * Check if date is today.
 */
export const isToday = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isTodayFns(dateObj);
};

/**
 * Check if date is yesterday.
 */
export const isYesterday = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isYesterdayFns(dateObj);
};

/**
 * Check if date is this week.
 */
export const isThisWeek = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isThisWeekFns(dateObj, { weekStartsOn: 1 });
};

/**
 * Check if date is this month.
 */
export const isThisMonth = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isThisMonthFns(dateObj);
};

/**
 * Check if date is this year.
 */
export const isThisYear = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isThisYearFns(dateObj);
};

/**
 * Get start of today.
 */
export const getStartOfToday = (): Date => {
  return startOfDay(new Date());
};

/**
 * Get end of today.
 */
export const getEndOfToday = (): Date => {
  return endOfDay(new Date());
};

/**
 * Get start of this week.
 */
export const getStartOfWeek = (): Date => {
  return startOfWeek(new Date(), { weekStartsOn: 1 });
};

/**
 * Get end of this week.
 */
export const getEndOfWeek = (): Date => {
  return endOfWeek(new Date(), { weekStartsOn: 1 });
};

/**
 * Get start of this month.
 */
export const getStartOfMonth = (): Date => {
  return startOfMonth(new Date());
};

/**
 * Get end of this month.
 */
export const getEndOfMonth = (): Date => {
  return endOfMonth(new Date());
};

/**
 * Get date range for last N days.
 */
export const getLastNDays = (days: number): { startDate: Date; endDate: Date } => {
  return {
    startDate: startOfDay(subDays(new Date(), days)),
    endDate: endOfDay(new Date()),
  };
};

/**
 * Get date range for last N weeks.
 */
export const getLastNWeeks = (weeks: number): { startDate: Date; endDate: Date } => {
  return {
    startDate: startOfWeek(subWeeks(new Date(), weeks), { weekStartsOn: 1 }),
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
  };
};

/**
 * Get date range for last N months.
 */
export const getLastNMonths = (months: number): { startDate: Date; endDate: Date } => {
  return {
    startDate: startOfMonth(subMonths(new Date(), months)),
    endDate: endOfMonth(new Date()),
  };
};

/**
 * Calculate days remaining until date.
 */
export const getDaysRemaining = (endDate: string | Date): number => {
  const dateObj = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInDays(dateObj, new Date());
};

/**
 * Get display label for date grouping.
 */
export const getDateGroupLabel = (date: string | Date): string => {
  if (isToday(date)) return 'Hôm nay';
  if (isYesterday(date)) return 'Hôm qua';
  if (isThisWeek(date)) return 'Tuần này';
  if (isThisMonth(date)) return 'Tháng này';
  return formatMonthYear(date);
};
