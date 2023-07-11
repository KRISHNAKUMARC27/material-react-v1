// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import MonitorHeartIcon from '@material-ui/icons/LocalHospital';

import DashboardPage from "views/Dashboard/TestTask.js";
import TableList from "views/TableList/TableList.js";

import ComparisonExecution from "views/TableList/ComparisonExecution.js";

import TestSuite from "views/TestSuite/TestSuite.js";

import Health from "views/Health/Health";

const dashboardRoutes = [
  {
    path: "/health",
    name: "Engine Health",
    icon: MonitorHeartIcon,
    component: Health,
    layout: "/admin",
  },
  // {
  //   path: "/dbhealth",
  //   name: "DB Health",
  //   icon: MonitorHeartIcon,
  //   component: DBHealth,
  //   layout: "/admin",
  // },
  {
    path: "/testTask",
    name: "Test Execution Status",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/comparisonRun",
    name: "Comparison Run",
    icon: Dashboard,
    component: ComparisonExecution,
    layout: "/admin",
  },
  {
    path: "/ddrtable",
    name: "DDR Test Data",
    icon: "content_paste",
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/suite",
    name: "Test Suites",
    icon: "folder",
    component: TestSuite,
    layout: "/admin",
  },


];

export default dashboardRoutes;
