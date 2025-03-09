// src/components/Planning/PlanningGrid.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { updatePlanningData } from '../../redux/slices/planningSlice';
import { savePlanningData } from '../../services/localStorage.service';
import { formatCurrency, formatPercentage, getGMPercentageColor } from '../../utils/formatters';

// Import AG Grid
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { Box, Typography, Paper } from '@mui/material';

interface PlanningTableRow {
  store: string;
  storeLabel: string;
  sku: string;
  skuLabel: string;
  [key: string]: any;
}

const PlanningGrid: React.FC = () => {
  const { stores } = useAppSelector((state) => state.stores);
  const { skus } = useAppSelector((state) => state.skus);
  const { weeks, planningData } = useAppSelector((state) => state.planning);
  const dispatch = useAppDispatch();
  
  const [rowData, setRowData] = useState<PlanningTableRow[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);
  
  // Helper to calculate GM data
  const calculateGMData = (salesUnits: number, price: number, cost: number) => {
    const salesDollars = salesUnits * price;
    const gmDollars = salesDollars - (salesUnits * cost);
    const gmPercentage = salesDollars > 0 ? (gmDollars / salesDollars) * 100 : 0;
    
    return {
      salesDollars,
      gmDollars,
      gmPercentage
    };
  };
  
  // Prepare column definitions
  const columnDefs = useMemo(() => {
    // Base columns for Store and SKU
    const baseColumns = [
      { 
        field: 'store',
        headerName: 'Store', 
        pinned: 'left',
        width: 120,
        filter: true,
        cellRenderer: (params: any) => {
          const store = stores.find(s => s.id === params.value);
          return store ? store.label : params.value;
        }
      },
      { 
        field: 'sku',
        headerName: 'SKU', 
        pinned: 'left',
        width: 120,
        filter: true,
        cellRenderer: (params: any) => {
          const sku = skus.find(s => s.id === params.value);
          return sku ? sku.label : params.value;
        }
      }
    ];
    
    // Group weeks by month
    const monthGroups: { [key: string]: any[] } = {};
    weeks.forEach(week => {
      const monthKey = `${week.month} - ${week.monthLabel}`;
      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = [];
      }
      monthGroups[monthKey].push(week);
    });
    
    // Create columns for each month and week
    const monthColumns = Object.entries(monthGroups).map(([monthName, monthWeeks]) => {
      return {
        headerName: monthName,
        children: monthWeeks.map(week => {
          return {
            headerName: week.label,
            children: [
              {
                field: `${week.id}_salesUnits`,
                headerName: 'Sales Units',
                editable: true,
                width: 120,
                valueParser: (params: any) => {
                  return Number(params.newValue);
                },
                cellStyle: { backgroundColor: '#f5f5f5' },
              },
              {
                field: `${week.id}_salesDollars`,
                headerName: 'Sales Dollars',
                editable: false,
                width: 120,
                valueFormatter: (params: any) => {
                  return formatCurrency(params.value || 0);
                }
              },
              {
                field: `${week.id}_gmDollars`,
                headerName: 'GM Dollars',
                editable: false,
                width: 120,
                valueFormatter: (params: any) => {
                  return formatCurrency(params.value || 0);
                }
              },
              {
                field: `${week.id}_gmPercentage`,
                headerName: 'GM %',
                editable: false,
                width: 120,
                valueFormatter: (params: any) => {
                  return formatPercentage(params.value || 0);
                },
                cellStyle: (params: any) => {
                  const value = params.value || 0;
                  return { backgroundColor: getGMPercentageColor(value) };
                }
              }
            ]
          };
        })
      };
    });
    
    return [...baseColumns, ...monthColumns];
  }, [stores, skus, weeks]);
  
  // Create row data with a limit of 100 rows
  useEffect(() => {
    if (stores.length > 0 && skus.length > 0) {
      console.log("Creating row data with:", stores.length, "stores and", skus.length, "SKUs");
      
      const rows: PlanningTableRow[] = [];
      let rowCount = 0;
      const MAX_ROWS = 100;
      
      // Create rows until we hit our limit or run out of combinations
      outerLoop:
      for (const store of stores) {
        for (const sku of skus) {
          if (rowCount >= MAX_ROWS) {
            break outerLoop;
          }
          
          const row: PlanningTableRow = {
            store: store.id,
            storeLabel: store.label,
            sku: sku.id,
            skuLabel: sku.label
          };
          
          // Initialize week data
          weeks.forEach(week => {
            // Find existing planning data
            const existingData = planningData.find(
              data => data.store === store.id && 
                     data.sku === sku.id && 
                     data.week === week.id
            );
            
            const salesUnits = existingData ? existingData.salesUnits : 0;
            const { salesDollars, gmDollars, gmPercentage } = calculateGMData(
              salesUnits,
              sku.price,
              sku.cost
            );
            
            row[`${week.id}_salesUnits`] = salesUnits;
            row[`${week.id}_salesDollars`] = salesDollars;
            row[`${week.id}_gmDollars`] = gmDollars;
            row[`${week.id}_gmPercentage`] = gmPercentage;
          });
          
          rows.push(row);
          rowCount++;
        }
      }
      
      console.log(`Row data created: ${rows.length} rows (limited to ${MAX_ROWS})`);
      setRowData(rows);
    }
  }, [stores, skus, weeks, planningData]);
  
  const onGridReady = (params: any) => {
    console.log("Grid ready", params);
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };
  
  const onCellValueChanged = useCallback(
    (event: any) => {
      const { data, colDef } = event;
      const fieldName = colDef.field || '';
      
      // Only process sales units changes
      if (fieldName.endsWith('_salesUnits')) {
        const weekId = fieldName.split('_')[0];
        const store = data.store;
        const sku = data.sku;
        const salesUnits = data[fieldName] || 0;
        
        // Find the SKU to get price and cost
        const skuData = skus.find(s => s.id === sku);
        
        if (skuData) {
          // Calculate new values
          const { salesDollars, gmDollars, gmPercentage } = calculateGMData(
            salesUnits,
            skuData.price,
            skuData.cost
          );
          
          // Update row data
          data[`${weekId}_salesDollars`] = salesDollars;
          data[`${weekId}_gmDollars`] = gmDollars;
          data[`${weekId}_gmPercentage`] = gmPercentage;
          
          // Update grid
          gridApi.refreshCells({
            rowNodes: [event.node],
            columns: [
              `${weekId}_salesDollars`,
              `${weekId}_gmDollars`,
              `${weekId}_gmPercentage`
            ],
            force: true
          });
          
          // Update Redux state
          const newPlanningData = {
            store,
            sku,
            week: weekId,
            salesUnits
          };
          
          dispatch(updatePlanningData(newPlanningData));
          
          // Update local storage
          const updatedPlanningData = [...planningData];
          const existingIndex = updatedPlanningData.findIndex(
            item => item.store === store && item.sku === sku && item.week === weekId
          );
          
          if (existingIndex !== -1) {
            updatedPlanningData[existingIndex] = newPlanningData;
          } else {
            updatedPlanningData.push(newPlanningData);
          }
          
          savePlanningData(updatedPlanningData);
        }
      }
    },
    [dispatch, planningData, skus, gridApi]
  );
  
  console.log("Rendering Planning Grid with", rowData.length, "rows");
  
  return (
    <Box sx={{ height: 'calc(100vh - 170px)', width: '100%', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
        Data Viewer App
      </Typography>
      <Paper sx={{ height: '100%', width: '100%' }}>
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: true,
              minWidth: 100,
            }}
            domLayout="autoHeight"
            animateRows={true}  
          />
        </div>
      </Paper>
    </Box>
  );
};

export default PlanningGrid;