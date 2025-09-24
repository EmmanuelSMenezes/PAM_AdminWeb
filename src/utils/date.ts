import ptBrLocale, {
  format,
  formatDistanceToNow,
  formatDistanceToNowStrict,
  getTime,
} from 'date-fns';

export const getDateOnTimeZone = (date: Date | string | number, timezone: number): Date =>
  new Date(new Date(date).setHours(new Date(date).getHours() + timezone));

export const formatDistanceLocale: Record<string, string> = {
  lessThanXSeconds: '{{count}}s',
  xSeconds: '{{count}}s',
  halfAMinute: '30s',
  lessThanXMinutes: '{{count}}min',
  xMinutes: '{{count}}min',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}sem',
  xWeeks: '{{count}}sem',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
};

export function formatDistance(
  token: string,
  count: string,
  options: {
    addSuffix?: boolean;
    unit?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';
    roundingMethod?: 'floor' | 'ceil' | 'round';
    locale?: Locale;
    comparison: number;
  }
) {
  options = options || {};

  const result = formatDistanceLocale[token].replace('{{count}}', count);

  if (options.addSuffix) {
    if (options?.comparison > 0) {
      return `in ${result}`;
    }
    return `${result} ago`;
  }

  return result;
}

export const formatDistanceToNowStrictDate = (date: Date): string =>
  formatDistanceToNowStrict(getDateOnTimeZone(date, -3), {
    addSuffix: true,
    locale: { ...ptBrLocale, formatDistance },
  });

type InputValue = Date | string | number | null;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd/MM/yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(getDateOnTimeZone(date, -3), {
        addSuffix: true,
        locale: { ...ptBrLocale, formatDistance },
      })
    : '';
}
