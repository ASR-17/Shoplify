export const getDateRanges = () => {
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const weekAgo = new Date(startOfToday);
  weekAgo.setDate(startOfToday.getDate() - 7);

  const monthAgo = new Date(startOfToday);
  monthAgo.setMonth(startOfToday.getMonth() - 1);

  return { startOfToday, weekAgo, monthAgo };
};
