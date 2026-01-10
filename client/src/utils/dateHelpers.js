export const isToday = (date) =>
  new Date(date).toDateString() === new Date().toDateString();

export const isWithinDays = (date, days) => {
  const target = new Date();
  target.setDate(target.getDate() - days);
  return new Date(date) >= target;
};
