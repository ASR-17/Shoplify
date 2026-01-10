/**
 * Build MongoDB date filter from query params
 * Supports: Today, This Week, This Month, Custom
 */
export const getDateRangeFilter = (filters = {}) => {
  const { dateFrom, dateTo, range } = filters;

  const now = new Date();
  let startDate;
  let endDate = now;

  switch (range) {
    case "Today":
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      break;

    case "This Week":
      startDate = new Date();
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
      break;

    case "This Month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;

    case "Custom":
      if (dateFrom && dateTo) {
        return {
          $gte: new Date(dateFrom),
          $lte: new Date(dateTo),
        };
      }
      return {};

    default:
      return {};
  }

  return {
    $gte: startDate,
    $lte: endDate,
  };
};
