import dashboardService from "../services/dashboard.service.js";

/**
 * GET /api/dashboard/kpis
 */
export const getDashboardKPIs = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const filters = req.query;

    const kpis = await dashboardService.getKPIs(userId, filters);

    res.status(200).json({
      success: true,
      data: kpis,
    });
  } catch (error) {
    console.error("DASHBOARD KPI ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/dashboard/income-expense
 * Graph ALWAYS works, AI optional
 */
export const getIncomeExpenseChart = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const filters = req.query;

    const chartData = await dashboardService.getIncomeExpenseChart(
      userId,
      filters
    );

    let aiInsights = null;

    // ✅ Lazy-load AI safely
    try {
      const { generateDashboardInsights } = await import(
        "../services/aiDashboard.service.js"
      );
      aiInsights = await generateDashboardInsights(chartData);
    } catch (aiError) {
      console.warn("AI skipped:", aiError.message);
    }

    res.status(200).json({
      success: true,
      data: chartData,
      ai: aiInsights,
    });
  } catch (error) {
    console.error("INCOME EXPENSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/dashboard/top-products
 */
export const getTopProducts = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const products = await dashboardService.getTopProducts(userId);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("TOP PRODUCTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/dashboard/alerts
 */
export const getDashboardAlerts = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const alerts = await dashboardService.getAlerts(userId);

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error("ALERT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
