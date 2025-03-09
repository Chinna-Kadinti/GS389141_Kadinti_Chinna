import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Week, PlanningData } from '../../types/planning.types';

interface PlanningState {
  weeks: Week[];
  planningData: PlanningData[];
}

const initialState: PlanningState = {
  weeks: [],
  planningData: []
};

const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {
    setWeeks: (state, action: PayloadAction<Week[]>) => {
      state.weeks = action.payload;
    },
    setPlanningData: (state, action: PayloadAction<PlanningData[]>) => {
      state.planningData = action.payload;
    },
    updatePlanningData: (state, action: PayloadAction<PlanningData>) => {
      const { store, sku, week } = action.payload;
      const index = state.planningData.findIndex(
        item => item.store === store && item.sku === sku && item.week === week
      );
      
      if (index !== -1) {
        state.planningData[index] = action.payload;
      } else {
        state.planningData.push(action.payload);
      }
    }
  }
});

export const { setWeeks, setPlanningData, updatePlanningData } = planningSlice.actions;
export default planningSlice.reducer;