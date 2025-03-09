export interface Week {
    seqNo: number;
    id: string;
    label: string;
    month: string;
    monthLabel: string;
  }
  
  export interface PlanningData {
    store: string;
    sku: string;
    week: string;
    salesUnits: number;
  }
  
  export interface CalculatedData extends PlanningData {
    salesDollars: number;
    gmDollars: number;
    gmPercentage: number;
  }