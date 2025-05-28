export function calculateStreak(
  dates: Date[],
  frequency: 'daily' | 'weekly' | 'monthly'
): { currentStreak: number; longestStreak: number } {
  if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const sorted = dates
    .map((d) => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  let longest = 1;
  let current = 1;
  let temp = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    let isConsecutive = false;

    if (frequency === 'daily') {
      const diff = Math.round(
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      );
      isConsecutive = diff === 1;
    } else if (frequency === 'weekly') {
      const prevWeek = getWeekYear(prev);
      const currWeek = getWeekYear(curr);
      isConsecutive =
        currWeek.week === prevWeek.week + 1 && currWeek.year === prevWeek.year;
    } else if (frequency === 'monthly') {
      isConsecutive =
        curr.getFullYear() === prev.getFullYear() &&
        curr.getMonth() === prev.getMonth() + 1;
    }

    if (isConsecutive) {
      temp++;
      longest = Math.max(longest, temp);
    } else {
      temp = 1;
    }
  }

  // Determine current streak
  const last = sorted[sorted.length - 1];
  const today = new Date();

  const diffDays = Math.floor(
    (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isCurrentStreakValid =
    (frequency === 'daily' && diffDays === 0) ||
    (frequency === 'weekly' &&
      getWeekYear(today).week === getWeekYear(last).week &&
      getWeekYear(today).year === getWeekYear(last).year) ||
    (frequency === 'monthly' &&
      today.getFullYear() === last.getFullYear() &&
      today.getMonth() === last.getMonth());

  current = isCurrentStreakValid ? temp : 0;

  return { currentStreak: current, longestStreak: longest };
}

// Helper to get ISO week number
function getWeekYear(date: Date): { week: number; year: number } {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return { week: weekNum, year: d.getUTCFullYear() };
}
