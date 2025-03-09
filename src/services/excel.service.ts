// src/services/excel.service.ts
import * as XLSX from 'xlsx';
import { Store } from '../types/store.types';
import { SKU } from '../types/sku.types';
import { Week, PlanningData } from '../types/planning.types';

interface ExcelData {
  stores: Store[];
  skus: SKU[];
  weeks: Week[];
  planningData: PlanningData[];
}

export const parseExcelFile = (file: File): Promise<ExcelData> => {
  console.log("Starting to parse Excel file:", file.name, file.size, "bytes");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        console.log("File loaded into reader");
        const data = e.target?.result;
        if (!data) {
          throw new Error("No data read from file");
        }
        
        console.log("Parsing with XLSX.read...");
        const workbook = XLSX.read(data, { type: 'binary' });
        console.log("Workbook parsed, sheets:", workbook.SheetNames);
        
        // Check if required sheets exist
        if (!workbook.Sheets['Stores']) {
          throw new Error("Missing 'Stores' sheet");
        }
        if (!workbook.Sheets['SKUs']) {
          throw new Error("Missing 'SKUs' sheet");
        }
        if (!workbook.Sheets['Calendar']) {
          throw new Error("Missing 'Calendar' sheet");
        }
        if (!workbook.Sheets['Planning']) {
          throw new Error("Missing 'Planning' sheet");
        }
        
        // Parse Stores sheet
        console.log("Parsing Stores sheet...");
        const storesSheet = workbook.Sheets['Stores'];
        const rawStores = XLSX.utils.sheet_to_json(storesSheet);
        console.log("Raw stores data:", rawStores);
        
        const stores: Store[] = rawStores.map((row: any) => {
          // Log each row to debug column access issues
          console.log("Processing store row:", row);
          return {
            seqNo: row['Seq No.'] || 0,
            id: row['ID'] || '',
            label: row['Label'] || '',
            city: row['City'] || '',
            state: row['State'] || ''
          };
        });
        console.log("Processed stores:", stores);
        
        // Parse SKUs sheet
        console.log("Parsing SKUs sheet...");
        const skusSheet = workbook.Sheets['SKUs'];
        const rawSKUs = XLSX.utils.sheet_to_json(skusSheet);
        console.log("Raw SKUs data:", rawSKUs);
        
        const skus: SKU[] = rawSKUs.map((row: any) => {
          // Log each row to debug column access issues
          console.log("Processing SKU row:", row);
          
          // Handle price and cost conversion carefully
          let price = 0;
          if (typeof row['Price'] === 'string') {
            price = parseFloat(row['Price'].replace(/[$,]/g, '').trim());
          } else if (typeof row['Price'] === 'number') {
            price = row['Price'];
          }
          
          let cost = 0;
          if (typeof row['Cost'] === 'string') {
            cost = parseFloat(row['Cost'].replace(/[$,]/g, '').trim());
          } else if (typeof row['Cost'] === 'number') {
            cost = row['Cost'];
          }
          
          return {
            id: row['ID'] || '',
            label: row['Label'] || '',
            class: row['Class'] || '',
            department: row['Department'] || '',
            price: isNaN(price) ? 0 : price,
            cost: isNaN(cost) ? 0 : cost
          };
        });
        console.log("Processed SKUs:", skus);
        
        // Parse Calendar sheet
        console.log("Parsing Calendar sheet...");
        const calendarSheet = workbook.Sheets['Calendar'];
        const rawCalendar = XLSX.utils.sheet_to_json(calendarSheet);
        console.log("Raw Calendar data:", rawCalendar);
        
        const weeks: Week[] = rawCalendar.map((row: any) => {
          // Log each row to debug column access issues
          console.log("Processing week row:", row);
          return {
            seqNo: row['Seq No.'] || 0,
            id: row['Week'] || '',
            label: row['Week Label'] || '',
            month: row['Month'] || '',
            monthLabel: row['Month Label'] || ''
          };
        });
        console.log("Processed weeks:", weeks);
        
        // Parse Planning sheet
        console.log("Parsing Planning sheet...");
        const planningSheet = workbook.Sheets['Planning'];
        const rawPlanning = XLSX.utils.sheet_to_json(planningSheet);
        console.log("Raw Planning data:", rawPlanning);
        
        const planningData: PlanningData[] = rawPlanning.map((row: any) => {
          // Log each row to debug column access issues
          console.log("Processing planning row:", row);
          
          let salesUnits = 0;
          if (typeof row['Sales Units'] === 'string') {
            salesUnits = parseInt(row['Sales Units'], 10);
          } else if (typeof row['Sales Units'] === 'number') {
            salesUnits = row['Sales Units'];
          }
          
          return {
            store: row['Store'] || '',
            sku: row['SKU'] || '',
            week: row['Week'] || '',
            salesUnits: isNaN(salesUnits) ? 0 : salesUnits
          };
        });
        console.log("Processed planning data:", planningData);
        
        // Validate data integrity
        if (stores.length === 0) {
          throw new Error("No valid store data found");
        }
        if (skus.length === 0) {
          throw new Error("No valid SKU data found");
        }
        if (weeks.length === 0) {
          throw new Error("No valid week data found");
        }
        
        // Validate that IDs are not empty
        const emptyStoreIds = stores.filter(store => !store.id).length;
        if (emptyStoreIds > 0) {
          console.warn(`Found ${emptyStoreIds} stores with empty IDs`);
        }
        
        const emptySkuIds = skus.filter(sku => !sku.id).length;
        if (emptySkuIds > 0) {
          console.warn(`Found ${emptySkuIds} SKUs with empty IDs`);
        }
        
        const emptyWeekIds = weeks.filter(week => !week.id).length;
        if (emptyWeekIds > 0) {
          console.warn(`Found ${emptyWeekIds} weeks with empty IDs`);
        }
        
        resolve({
          stores,
          skus,
          weeks,
          planningData
        });
      } catch (error) {
        console.error("Excel parsing error:", error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      reject(error);
    };
    
    console.log("Starting to read file as binary string...");
    reader.readAsBinaryString(file);
  });
};