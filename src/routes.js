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
import { TbBrandAdonisJs } from "react-icons/tb";
import { MdAdminPanelSettings } from "react-icons/md";
import { TiMinus } from "react-icons/ti";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaRegCalendarDays } from "react-icons/fa6";
import { LiaClinicMedicalSolid } from "react-icons/lia";
import { IoNotificationsOutline } from "react-icons/io5";
import { CiDiscount1 } from "react-icons/ci";

// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import Admins from 'views/admin/admins/Admins';
import AddAdmin from 'views/admin/admins/AddAdmin';
import Roles from 'views/admin/roles/Roles';
import Users from 'views/admin/users/Users';
import FamilyAccounts from 'views/admin/users/FamilyAccounts';
import PromoCodes from 'views/admin/promoCodes/PromoCodes';
import AddPromoCode from 'views/admin/promoCodes/AddPromoCode';
// Auth Imports
import SignInCentered from 'views/auth/signIn';
import AddRole from 'views/admin/roles/AddRole';
import AllNotification from 'views/admin/notification/AllNotification';
import AddNotification from 'views/admin/notification/AddNotification';
import AllTypes from 'views/admin/productType/AllTypes';
import AddType from 'views/admin/productType/AddType';
import AllBrands from 'views/admin/brand/AllBrands';
import AddBrand from 'views/admin/brand/AddBrand';
import AllCategories from 'views/admin/category/AllCategories';
import AddCategory from 'views/admin/category/AddCategory';

const routes = [
  {
    name: 'Super Admin',
    layout: '/admin',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
    showInSidebar: true,
  },
  {
    name: "Admin Management",
    layout: "/admin",
    icon: <Icon as={MdAdminPanelSettings} width="20px" height="20px" color="#8f9bba" />,
    component: null,
    showInSidebar: true,
    subRoutes: [
      {
        name: "Admins",
        path: "/admins",
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <Admins />,
        showInSidebar: true,
      },
      {
        name: "Rules",
        path: "/rules",
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <Roles />,
        showInSidebar: true,
      },
    ],
  },
  {
    name: "Add Rule",
    layout: "/admin",
    path: "/add-rule",
    icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
    showInSidebar: false,
  },
  {
    name: 'Pharmacy Management',
    layout: '/admin',
    path: '/pharmacy',
    icon: <Icon as={MdLocalPharmacy} width="20px" height="20px" color="inherit" />,
    component: <Admins />,
    showInSidebar: true,
  },
  {
    name: 'Doctor Management',
    layout: '/admin',
    path: '/doctors',
    icon: <Icon as={MdMedicalServices} width="20px" height="20px" color="inherit" />,
    component: <DataTables />,
    showInSidebar: true,
  },
  {
    name: 'Clinic Management',
    layout: '/admin',
    path: '/clinics',
    icon: <Icon as={LiaClinicMedicalSolid} width="20px" height="20px" color="inherit" />,
    component: <DataTables />,
    showInSidebar: true,
  },
  {
    name: 'User Management',
    layout: '/admin',
    path: '/users',
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: <Users />,
    showInSidebar: true,
  },
  {
    name: 'Categories',
    layout: '/admin',
    path: '/categories',
    icon: <Icon as={BiSolidCategoryAlt} width="20px" height="20px" color="inherit" />,
    component: <AllCategories />,
    showInSidebar: true,
  },
  {
    name: 'Categories',
    layout: '/admin',
    path: '/add-category',
    icon: <Icon as={BiSolidCategoryAlt} width="20px" height="20px" color="inherit" />,
    component: <AddCategory />,
    showInSidebar: false,
  },
  {
    name: 'Products',
    layout: '/admin',
    path: '/products',
    icon: <Icon as={MdInventory} width="20px" height="20px" color="inherit" />,
    component: <DataTables />,
    showInSidebar: true,
  },
  {
    name: 'Attributes',
    layout: '/admin',
    path: '/attributes',
    icon: <Icon as={MdList} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
    showInSidebar: true,
  },
  {
    name: 'Product Types',
    layout: '/admin',
    path: '/product-types',
    icon: <Icon as={MdCategory} width="20px" height="20px" color="inherit" />,
    component: <AllTypes />,
    showInSidebar: true,
  },
  {
    name: 'Product Types',
    layout: '/admin',
    path: '/add-product-types',
    icon: <Icon as={MdCategory} width="20px" height="20px" color="inherit" />,
    component: <AddType />,
    showInSidebar: false,
  },
  {
    name: 'Brands',
    layout: '/admin',
    path: '/brands',
    icon: <Icon as={TbBrandAdonisJs} width="20px" height="20px" color="inherit" />,
    component: <AllBrands />,
    showInSidebar: true,
  },
  {
    name: 'Brands',
    layout: '/admin',
    path: '/add-brand',
    icon: <Icon as={TbBrandAdonisJs} width="20px" height="20px" color="inherit" />,
    component: <AddBrand />,
    showInSidebar: false,
  },
  {
    name: 'Prescription',
    layout: '/admin',
    path: '/prescription',
    icon: <Icon as={MdAssignment} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
    showInSidebar: true,
  },
  {
    name: 'Medicine Reminder',
    layout: '/admin',
    path: '/medicine-reminder',
    icon: <Icon as={MdNotifications} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
    showInSidebar: true,
  },
  {
    name: 'Orders',
    layout: '/admin',
    path: '/orders',
    icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit" />,
    component: <DataTables />,
    showInSidebar: true,
  },
  {
    name: 'Notifications',
    layout: '/admin',
    path: '/notifications',
    icon: <Icon as={IoNotificationsOutline} width="20px" height="20px" color="inherit" />,
    component: <AllNotification />,
    showInSidebar: true,
  },
  {
    name: 'Notifications',
    layout: '/admin',
    path: '/add-notifications',
    icon: <Icon as={IoNotificationsOutline} width="20px" height="20px" color="inherit" />,
    component: <AddNotification />,
    showInSidebar: false,
  },
  {
    name: 'Promo Codes',
    layout: '/admin',
    path: '/promo-codes',
    icon: <Icon as={CiDiscount1} width="20px" height="20px" color="inherit" />,
    component: <PromoCodes />,
    showInSidebar: true,
  },
  {
    name: 'Promo Codes',
    layout: '/admin',
    path: '/add-promo-code',
    component: <AddPromoCode />,
    showInSidebar: false,
  },
  {
    name: 'Reports',
    layout: '/admin',
    path: '/reports',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <NFTMarketplace />,
    showInSidebar: true,
  },
  {
    name: 'Appointments',
    layout: '/admin',
    path: '/appointments',
    icon: <Icon as={FaRegCalendarDays} width="20px" height="20px" color="inherit" />,
    component: <DataTables />,
    showInSidebar: true,
  },
  {
    name: "CMS",
    layout: "/admin",
    icon: <Icon as={MdSettings} width="20px" height="20px" color="#8f9bba" />,
    component: null,
    showInSidebar: true,
    subRoutes: [
      {
        name: 'Blogs',
        path: '/blogs',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <DataTables />,
        showInSidebar: true,
      },
      {
        name: 'Banners',
        path: '/cms/banners',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <Profile />,
        showInSidebar: true,
      },
      {
        name: 'Ads',
        path: '/cms/ads',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <SignInCentered />,
        showInSidebar: true,
      },
      {
        name: 'About Us',
        path: '/cms/about-us',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <SignInCentered />,
        showInSidebar: true,
      },
      {
        name: 'Privacy & Policy',
        path: '/cms/privacy-and-policy',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <SignInCentered />,
        showInSidebar: true,
      },
      {
        name: 'Returned',
        path: '/cms/returned',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <SignInCentered />,
        showInSidebar: true,
      },
    ],
  },
  {
    name: 'Admin Management',
    layout: '/admin',
    path: '/add-New-Rule',
    icon: <Icon as={FaRegCalendarDays} width="20px" height="20px" color="inherit" />,
    component: <AddRole />,
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
    name: 'Family Accounts',
    layout: '/admin',
    path: '/family-Accounts',
    component: <FamilyAccounts />,
    showInSidebar: false,
  },
];

export default routes;
