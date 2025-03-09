export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  export const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(value / 100);
  };
  
  // Function to get GM percentage color
  export const getGMPercentageColor = (value: number): string => {
    if (value >= 40) return '#4CAF50'; // Green
    if (value >= 10) return '#FFEB3B'; // Yellow
    if (value > 5) return '#FF9800';   // Orange
    return '#F44336';                  // Red
  };