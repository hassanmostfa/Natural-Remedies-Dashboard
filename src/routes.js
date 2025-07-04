import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdHome,
  MdOutlineShoppingCart,
  MdInventory,
  MdAssignment,
} from 'react-icons/md';

import { MdAdminPanelSettings } from 'react-icons/md';
import { TiMinus } from 'react-icons/ti';
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaLeaf } from "react-icons/fa";
import { FaTags } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
// Admin Imports
import MainDashboard from 'views/admin/default';
import Admins from 'views/admin/admins/Admins';
import AddAdmin from 'views/admin/admins/AddAdmin';
import ProtectedRoute from 'components/protectedRoute/ProtectedRoute';
import EditAdmin from 'views/admin/admins/EditAdmin';
import ShowAdmin from 'views/admin/admins/ShowAdmin';
import Users from 'views/admin/users/Users';
import AddUser from 'views/admin/users/AddUser';
import SubscriptionPlans from 'views/admin/plans/SubscriptionPlans';
import AddPlan from 'views/admin/plans/AddPlan';
import Types from 'views/admin/remedies/Types';
import AddRemedyType from 'views/admin/remedies/AddType';
import Categories from 'views/admin/categories/Categories';
import AddCategory from 'views/admin/categories/AddCategory';
import Remedies from 'views/admin/remedies/Remedies';
import AddRemedy from 'views/admin/remedies/AddRemedy';
import { GiGrassMushroom } from "react-icons/gi";
import Notifications from 'views/admin/notifications/Notifications';


const routes = [
  {
    name: 'Super Admin',
    layout: '/admin',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component:<ProtectedRoute><MainDashboard /></ProtectedRoute> ,
    showInSidebar: true,
  },
  /* Start Admin Routes */
  {
    name: 'Admin Management',
    layout: '/admin',
    path: '/admins',
    icon: <Icon as={MdAdminPanelSettings} width="20px" height="20px" color="inherit" />,
    component: <Admins />,
    showInSidebar: true,
  },


  {
    name: 'Admin Management',
    layout: '/admin',
    path: '/add-admin',
    component: <AddAdmin />,
    showInSidebar: false,
  },

  {
    name: 'Admin Management',
    layout: '/admin',
    path: '/add-admin',
    component: <AddAdmin />,
    showInSidebar: false,
  },
  {
    name: 'Admin Management',
    layout: '/admin',
    path: '/edit-admin/:id',
    component: <EditAdmin />,
    showInSidebar: false,
  },
  
  {
    name: 'Admin Management',
    layout: '/admin',
    path: '/admin/details/:id',
    component: <ShowAdmin />,
    showInSidebar: false,
  },

  {
    name: 'Categories',
    layout: '/admin',
    path: '/categories',
    icon: <Icon as={FaTags} width="20px" height="20px" color="inherit" />,
    component: <Categories />,
    showInSidebar: true,
  },
  {
    name: 'Categories',
    layout: '/admin',
    path: '/add-category',
    component: <AddCategory />,
    showInSidebar: false,
  },

  {
    name: 'Remedies Types',
    layout: '/admin',
    path: '/remedy-types',
    icon: <Icon as={FaLeaf} width="20px" height="20px" color="inherit" />,
    component: <Types />,
    showInSidebar: true,
  },

  {
    name: 'Remedies Types',
    layout: '/admin',
    path: '/add-remedy-type',
    component: <AddRemedyType />,
    showInSidebar: false,
  },

  {
    name: 'Remedies',
    layout: '/admin',
    path: '/remedies',
    icon: <Icon as={GiGrassMushroom} width="20px" height="20px" color="inherit" />,
    component: <Remedies />,
    showInSidebar: true,
  },

  {
    name: 'Remedies',
    layout: '/admin',
    path: '/add-remedy',
    component: <AddRemedy />,
    showInSidebar: false,
  },

  {
    name: 'Notifications',
    layout: '/admin',
    path: '/notifications',
    icon: <Icon as={FaBell} width="20px" height="20px" color="inherit" />,
    component: <Notifications />,
    showInSidebar: true,
  },
  /* End Admin Routes */
  {
    name: 'Users',
    layout: '/admin',
    path: '/users',
    icon: <Icon as={FaUser} width="20px" height="20px" color="inherit" />,
    component: <Users />,
    showInSidebar: true,
  },
  {
    name: 'Users',
    layout: '/admin',
    path: '/add-user',
    component: <AddUser />,
    showInSidebar: false,
  },
  {
    name: 'Subscription Plans',
    layout: '/admin',
    path: '/plans',
    icon: <Icon as={GiTakeMyMoney} width="20px" height="20px" color="inherit" />,
    component: <SubscriptionPlans />,
    showInSidebar: true,
  },
  {
    name: 'Subscription Plans',
    layout: '/admin',
    path: '/add-plan',
    icon: <Icon as={GiTakeMyMoney} width="20px" height="20px" color="inherit" />,
    component: <AddPlan />,
    showInSidebar: false,
  },
  
  {
    name: "Logout",
    path: "/logout",
    icon: <RiLogoutCircleLine />, // Add an appropriate icon
    layout: "/admin", // Adjust the layout as needed
    showInSidebar: true,
  },
  
];

export default routes;
