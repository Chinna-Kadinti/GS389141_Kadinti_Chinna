import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from '@mui/material';
import {
  Store as StoreIcon,
  Inventory as InventoryIcon,
  TableChart as TableChartIcon,
  BarChart as ChartIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const navItems = [
  { path: '/stores', label: 'Stores', icon: <StoreIcon /> },
  { path: '/skus', label: 'SKUs', icon: <InventoryIcon /> },
  { path: '/planning', label: 'Planning', icon: <TableChartIcon /> },
  { path: '/chart', label: 'Chart', icon: <ChartIcon /> },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

export default Sidebar;