export interface InventoryOptimizationParams {
  /** 
   * Annual demand (should be a moving average of past year's invoice sums 
   * to handle seasonal spikes). 
   */
  annualDemand: number;
  /** Order cost including shipping and admin fees per order */
  orderCost: number;
  /** Holding cost (storage cost) per unit per year */
  holdingCost: number;
  /** Lead time in days it takes for the supplier to deliver */
  leadTimeDays: number;

  // --- Optional parameters for more accurate safety stock calculations ---
  /** Maximum expected daily demand (used for Max/Avg heuristic) */
  maxDailyDemand?: number;
  /** Maximum expected lead time in days (used for Max/Avg heuristic) */
  maxLeadTimeDays?: number;
  /** Standard deviation of daily demand (used for 95% service level statistical model) */
  standardDeviationDemand?: number;
}

export interface InventoryOptimizationResult {
  recommendedOrderQuantity: number;
  triggerReorderAt: number;
  safetyStock: number;
  costEfficiencyAnalysis: string;
}

export class InventoryOptimizationService {
  /**
   * Calculates the Economic Order Quantity (EOQ).
   * Formula: sqrt((2 * annualDemand * orderCost) / holdingCost)
   */
  static calculateEOQ(annualDemand: number, orderCost: number, holdingCost: number): number {
    if (holdingCost <= 0) {
      throw new Error('Holding cost must be greater than zero to calculate EOQ.');
    }
    const eoq = Math.sqrt((2 * annualDemand * orderCost) / holdingCost);
    return Math.round(eoq);
  }

  /**
   * Calculates Safety Stock for a 95% service level.
   * Uses Z-score of 1.645 for 95% service level if standard deviation is provided.
   * Otherwise falls back to Max - Avg method if max values are provided.
   * If only averages are provided, uses a default heuristic (20% buffer).
   */
  static calculateSafetyStock(
    averageDailyDemand: number,
    averageLeadTime: number,
    params: InventoryOptimizationParams
  ): number {
    // 95% Service Level Z-Score (approx 1.645)
    const zScore = 1.645;

    // Method 1: Statistical approach (if standard deviation of demand is known)
    // Assumes standard deviation of lead time is negligible for this formula
    if (params.standardDeviationDemand !== undefined) {
      return Math.round(
        zScore * Math.sqrt(averageLeadTime * Math.pow(params.standardDeviationDemand, 2))
      );
    }

    // Method 2: Max - Avg approach (if max daily demand and max lead time are provided)
    if (params.maxDailyDemand !== undefined && params.maxLeadTimeDays !== undefined) {
      const maxLeadTimeDemand = params.maxDailyDemand * params.maxLeadTimeDays;
      const avgLeadTimeDemand = averageDailyDemand * averageLeadTime;
      return Math.round(Math.max(0, maxLeadTimeDemand - avgLeadTimeDemand));
    }

    // Method 3: Fallback heuristic (20% of average lead time demand) if no variance data provided
    return Math.round(averageDailyDemand * averageLeadTime * 0.2);
  }

  /**
   * Calculates the Reorder Point (ROP).
   * Formula: (Daily Demand * Lead Time) + Safety Stock
   */
  static calculateROP(dailyDemand: number, leadTime: number, safetyStock: number): number {
    return Math.round(dailyDemand * leadTime + safetyStock);
  }

  /**
   * Main service method to get inventory recommendations.
   * @param params InventoryOptimizationParams containing demand, costs, and lead time.
   * @returns JSON object containing recommendedOrderQuantity, triggerReorderAt, and costEfficiencyAnalysis.
   */
  static getInventoryRecommendations(params: InventoryOptimizationParams): InventoryOptimizationResult {
    const { annualDemand, orderCost, holdingCost, leadTimeDays } = params;

    // Assuming 365 working days a year for daily demand calculations
    const workingDaysPerYear = 365;
    const averageDailyDemand = annualDemand / workingDaysPerYear;

    // Core Calculations
    const recommendedOrderQuantity = this.calculateEOQ(annualDemand, orderCost, holdingCost);
    const safetyStock = this.calculateSafetyStock(averageDailyDemand, leadTimeDays, params);
    const triggerReorderAt = this.calculateROP(averageDailyDemand, leadTimeDays, safetyStock);

    // Cost Efficiency Analysis Generation
    const totalOrdersPerYear = annualDemand / recommendedOrderQuantity;
    const annualOrderingCost = totalOrdersPerYear * orderCost;
    
    // Average inventory = (EOQ / 2) + Safety Stock
    const averageInventory = (recommendedOrderQuantity / 2) + safetyStock;
    const annualHoldingCost = averageInventory * holdingCost;
    const totalInventoryCost = annualOrderingCost + annualHoldingCost;

    const costEfficiencyAnalysis = `By ordering ${recommendedOrderQuantity} units at a time, you will place approximately ${totalOrdersPerYear.toFixed(1)} orders per year. Your estimated annual ordering cost is $${annualOrderingCost.toFixed(2)} and your annual holding cost is $${annualHoldingCost.toFixed(2)}, minimizing your total inventory costs to $${totalInventoryCost.toFixed(2)} based on your current inputs.`;

    return {
      recommendedOrderQuantity,
      triggerReorderAt,
      safetyStock,
      costEfficiencyAnalysis,
    };
  }
}
