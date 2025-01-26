import React from 'react';
import { Icon, Box } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdSettings,
  MdLocalPharmacy,
  MdMedicalServices,
  MdPeople,
  MdCategory,
  MdInventory,
  MdAssignment,
  MdNotifications,
  MdList,
  MdDescription,
  MdAdsClick,
  MdPrivacyTip,
  MdAssignmentReturn,
} from 'react-icons/md';

import { FiChevronsRight } from "react-icons/fi";
// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import Admins from 'views/admin/admins/Admins';
import RTL from 'views/admin/rtl';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: "Admin Management",
    layout: "/admin",
    icon: <Icon as={MdSettings} width="20px" height="20px" color="#8f9bba" />,
    component: null,
    subRoutes: [
      {
        name: "Admins",
        path: "/admins",
        icon: <Icon as={FiChevronsRight} width="20px" height="20px" color="inherit" />,
        component: <Admins />,
      },
      {
        name: "Rules",
        path: "/management/rules",
        icon: <Icon as={FiChevronsRight} width="20px" height="20px" color="inherit" />,
        component: <Profile />,
      },
    ],
  },
  {
    name: 'Pharmacy Management',
    layout: '/admin',
    path: '/pharmacy',
    icon: <Icon as={MdLocalPharmacy} width="20px" height="20px" color="inherit" />,
    component: <Admins />,
  },
  {
    name: 'Doctor Management',
    layout: '/admin',
    path: '/doctors',
    icon: <Icon as={MdMedicalServices} width="20px" height="20px" color="inherit" />,
    component: <DataTables />,
  },
  {
    name: 'User Management',
    layout: '/admin',
    path: '/users',
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Categories',
    layout: '/admin',
    path: '/categories',
    icon: <Icon as={MdCategory} width="20px" height="20px" color="inherit" />,
    component: <NFTMarketplace />,
  },
  {
    name: 'Products',
    layout: '/admin',
    path: '/products',
    icon: <Icon as={MdInventory} width="20px" height="20px" color="inherit" />,
    component: <DataTables />,
  },
  {
    name: 'Attributes',
    layout: '/admin',
    path: '/attributes',
    icon: <Icon as={MdList} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Product Types',
    layout: '/admin',
    path: '/product-types',
    icon: <Icon as={MdCategory} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Brands',
    layout: '/admin',
    path: '/brands',
    icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Prescription',
    layout: '/admin',
    path: '/prescription',
    icon: <Icon as={MdAssignment} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Medicine Reminder',
    layout: '/admin',
    path: '/medicine-reminder',
    icon: <Icon as={MdNotifications} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Orders',
    layout: '/admin',
    path: '/orders',
    icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit" />,
    component: <DataTables />,
  },
  {
    name: 'Reports',
    layout: '/admin',
    path: '/reports',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <NFTMarketplace />,
  },
  {
    name: 'Appointments',
    layout: '/admin',
    path: '/appointments',
    icon: <Icon as={MdMedicalServices} width="20px" height="20px" color="inherit" />,
    component: <DataTables />,
  },
  {
    name: 'CMS',
    layout: '/admin',
    path: '/cms',
    icon: <Icon as={MdSettings} width="20px" height="20px" color="#8f9bba" />,
    component: <Box />,
    subRoutes: [
      {
        name: 'Banners',
        path: '/cms/banners',
        icon: <Icon as={FiChevronsRight} width="20px" height="20px" color="inherit" />,
        component: <Profile />,
      },
      {
        name: 'Ads',
        path: '/cms/ads',
        icon: <Icon as={FiChevronsRight} width="20px" height="20px" color="inherit" />,
        component: <SignInCentered />,
      },
      {
        name: 'About Us',
        path: '/cms/about-us',
        icon: <Icon as={FiChevronsRight} width="20px" height="20px" color="inherit" />,
        component: <SignInCentered />,
      },
      {
        name: 'Privacy & Policy',
        path: '/cms/privacy-and-policy',
        icon: <Icon as={FiChevronsRight} width="20px" height="20px" color="inherit" />,
        component: <SignInCentered />,
      },
      {
        name: 'Returned',
        path: '/cms/returned',
        icon: <Icon as={FiChevronsRight} width="20px" height="20px" color="inherit" />,
        component: <SignInCentered />,
      },
    ],
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;
