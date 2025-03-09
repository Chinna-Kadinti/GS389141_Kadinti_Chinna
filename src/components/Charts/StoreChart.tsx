import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { formatCurrency } from '../../utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { Store } from '../../types/store.types';

interface ChartData {
  week: string;
  gmDollars: number;
  gmPercentage: number;
}

const StoreChart: React.FC = () => {
  const { stores } = useAppSelector((state) => state.stores);
  const { skus } = useAppSelector((state) => state.skus);
  const { weeks, planningData } = useAppSelector((state) => state.planning);
  
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  
  useEffect(() => {
    // Set default selected store if none is selected and stores exist
    if (!selectedStore && stores.length > 0) {
      setSelectedStore(stores[0].id);
    }
  }, [stores, selectedStore]);
  
  useEffect(() => {
    if (selectedStore && skus.length > 0 && weeks.length > 0) {
      calculateChartData(selectedStore);
    }
  }, [selectedStore, skus, weeks, planningData]);
  
  const calculateChartData = (storeId: string) => {
    const data: ChartData[] = [];
    
    // Sort weeks by sequence number to ensure proper ordering
    const sortedWeeks = [...weeks].sort((a, b) => a.seqNo - b.seqNo);
    
    sortedWeeks.forEach(week => {
      // Get all planning data for this store and week
      const weekData = planningData.filter(
        item => item.store === storeId && item.week === week.id
      );
      
      // Calculate total sales dollars and GM dollars
      let totalSalesDollars = 0;
      let totalGMDollars = 0;
      
      weekData.forEach(item => {
        const sku = skus.find(s => s.id === item.sku);
        if (sku) {
          const salesDollars = item.salesUnits * sku.price;
          const gmDollars = salesDollars - (item.salesUnits * sku.cost);
          
          totalSalesDollars += salesDollars;
          totalGMDollars += gmDollars;
        }
      });
      
      // Calculate GM percentage
      const gmPercentage = totalSalesDollars > 0 
        ? (totalGMDollars / totalSalesDollars) * 100 
        : 0;
      
      data.push({
        week: week.label,
        gmDollars: totalGMDollars,
        gmPercentage: gmPercentage
      });
    });
    
    setChartData(data);
  };
  
  const handleStoreChange = (event: SelectChangeEvent) => {
    setSelectedStore(event.target.value);
  };
  
  return (
    <Box sx={{ height: 'calc(100vh - 170px)', width: '100%', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
        Store Performance Chart
      </Typography>
      
      <Box sx={{ mb: 4, maxWidth: 300 }}>
        <FormControl fullWidth>
          <InputLabel id="store-select-label">Select Store</InputLabel>
          <Select
            labelId="store-select-label"
            id="store-select"
            value={selectedStore}
            label="Select Store"
            onChange={handleStoreChange}
          >
            {stores.map((store: Store) => (
              <MenuItem key={store.id} value={store.id}>
                {store.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Paper sx={{ height: 'calc(100% - 100px)', width: '100%', p: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="week" 
              angle={-90}
              tickMargin={30}
              height={60}
            />
            <YAxis 
              yAxisId="left"
              orientation="left"
              tickFormatter={(value) => formatCurrency(value)}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'GM Dollars') {
                  return [formatCurrency(value as number), name];
                }
                return [`${(value as number).toFixed(1)}%`, name];
              }}
            />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="gmDollars" 
              name="GM Dollars" 
              fill="#8884d8" 
              barSize={30} 
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="gmPercentage"
              name="GM %"
              stroke="#82ca9d"
              strokeWidth={3}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default StoreChart;