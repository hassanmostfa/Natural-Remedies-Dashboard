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
import { FaSkull } from "react-icons/fa";
import { GiStomach } from "react-icons/gi";
import { FaBook, FaPlay , FaFile , FaStar , FaAd } from "react-icons/fa";
import { FaPersonChalkboard } from "react-icons/fa6";

// Admin Imports
import MainDashboard from 'views/admin/default';
import Admins from 'views/admin/admins/Admins';
import AddAdmin from 'views/admin/admins/AddAdmin';
import ProtectedRoute from 'components/protectedRoute/ProtectedRoute';
import EditAdmin from 'views/admin/admins/EditAdmin';
import ShowAdmin from 'views/admin/admins/ShowAdmin';
import Users from 'views/admin/users/Users';
import AddUser from 'views/admin/users/AddUser';
import EditUser from 'views/admin/users/EditUser';
import SubscriptionPlans from 'views/admin/plans/SubscriptionPlans';
import AddPlan from 'views/admin/plans/AddPlan';
import Types from 'views/admin/remedies/Types';
import AddRemedyType from 'views/admin/remedies/AddType';
import EditRemedyType from 'views/admin/remedies/EditType';
import Categories from 'views/admin/categories/Categories';
import AddCategory from 'views/admin/categories/AddCategory';
import EditBodySystem from 'views/admin/categories/EditBodySystem';
import Remedies from 'views/admin/remedies/Remedies';
import AddRemedy from 'views/admin/remedies/AddRemedy';
import EditRemedy from 'views/admin/remedies/EditRemedy';
import ShowRemedy from 'views/admin/remedies/ShowRemedy';
import Notifications from 'views/admin/notifications/Notifications';
import Instructors from 'views/admin/instructors/Instructors';
import AddInstructor from 'views/admin/instructors/AddInstructor';
import EditInstructor from 'views/admin/instructors/EditInstructor';
import Courses from 'views/admin/courses/Courses';
import AddCourse from 'views/admin/courses/AddCourse';
import EditCourse from 'views/admin/courses/EditCourse';
import Lessons from 'views/admin/courses/lessons/Lessons';
import AddLesson from 'views/admin/courses/lessons/AddLesson';
import EditLesson from 'views/admin/courses/lessons/EditLesson';
import Videos from 'views/admin/videos/Videos';
import AddVideo from 'views/admin/videos/AddVideo';
import EditVideo from 'views/admin/videos/EditVideo ';
import Articles from 'views/admin/articles/Articles';
import AddArticle from 'views/admin/articles/AddArticle';
import EditArticle from 'views/admin/articles/EditArticle';
import Reviews from 'views/admin/reviews/Reviews';
import Disease from 'views/admin/disease/Disease';
import AddDisease from 'views/admin/disease/AddDisease';
import EditDisease from 'views/admin/disease/EditDisease';
import Faqs from 'views/admin/faqs/Faqs';
import AddFaq from 'views/admin/faqs/AddFaq';
import EditFaq from 'views/admin/faqs/EditFaq';
import PrivacyAndTerms from 'views/admin/privacyAndTerms/PrivacyAndTerms';
import AddPrivacyAndTerms from 'views/admin/privacyAndTerms/AddPrivacyAndTerms';
import EditPrivacyAndTerms from 'views/admin/privacyAndTerms/EditPrivacyAndTerms';
import ContactUs from 'views/admin/contactUs/ContactUs';
import About from 'views/admin/about/About';
import Ads from 'views/admin/ads/Ads';
import AddAd from 'views/admin/ads/AddAd';
import EditAd from 'views/admin/ads/EditAd';

import { GiGrassMushroom } from "react-icons/gi";


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
    name: 'Body Systems',
    layout: '/admin',
    path: '/categories',
    icon: <Icon as={GiStomach} width="20px" height="20px" color="inherit" />,
    component: <Categories />,
    showInSidebar: true,
  },
  {
    name: 'Body System',
    layout: '/admin',
    path: '/add-category',
    component: <AddCategory />,
    showInSidebar: false,
  },
  {
    name: 'Body System',
    layout: '/admin',
    path: '/edit-body-system/:id',
    component: <EditBodySystem />,
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
    name: 'Remedies Types',
    layout: '/admin',
    path: '/edit-remedy-type/:id',
    component: <EditRemedyType />,
    showInSidebar: false,
  },
  {
    name: 'Diseases',
    layout: '/admin',
    path: '/disease',
    icon: <Icon as={FaSkull} width="20px" height="20px" color="inherit" />,
    component: <Disease />,
    showInSidebar: true,
  },
  {
    name: 'Diseases',
    layout: '/admin',
    path: '/add-disease',
    component: <AddDisease />,
    showInSidebar: false,
  },
  {
    name: 'Diseases',
    layout: '/admin',
    path: '/edit-disease/:id',
    component: <EditDisease />,
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
    name: 'Remedies',
    layout: '/admin',
    path: '/edit-remedy/:id',
    component: <EditRemedy />,
    showInSidebar: false,
  },
  {
    name: 'Remedies',
    layout: '/admin',
    path: '/remedy/:id',
    component: <ShowRemedy />,
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
  {
    name: 'Instructors',
    layout: '/admin',
    path: '/instructors',
    icon: <Icon as={FaPersonChalkboard} width="20px" height="20px" color="inherit" />,
    component: <Instructors />,
    showInSidebar: true,
  },
  {
    name: 'Instructors',
    layout: '/admin',
    path: '/add-instructor',
    component: <AddInstructor />,
    showInSidebar: false,
  },
  {
    name: 'Instructors',
    layout: '/admin',
    path: '/edit-instructor/:id',
    component: <EditInstructor />,
    showInSidebar: false,
  },
  {
    name: 'Courses',
    layout: '/admin',
    path: '/courses',
    icon: <Icon as={FaBook} width="20px" height="20px" color="inherit" />,
    component: <Courses />,
    showInSidebar: true,
  },

  {
    name: 'Courses',
    layout: '/admin',
    path: '/add-course',
    component: <AddCourse />,
    showInSidebar: false,
  },
  {
    name: 'Courses',
    layout: '/admin',
    path: '/edit-course/:id',
    component: <EditCourse />,
    showInSidebar: false,
  },
  {
    name: 'Courses',
    layout: '/admin',
    path: '/courses/:id/lessons',
    component: <Lessons />,
    showInSidebar: false,
  },
  {
    name: 'Courses',
    layout: '/admin',
    path: '/courses/:id/lessons/add',
    component: <AddLesson />,
    showInSidebar: false,
  },
  {
    name: 'Courses',
    layout: '/admin',
    path: '/courses/:id/lessons/:lessonId/edit',
    component: <EditLesson />,
    showInSidebar: false,
  },
  {
    name: 'Videos',
    layout: '/admin',
    path: '/videos',
    icon: <Icon as={FaPlay} width="20px" height="20px" color="inherit" />,
    component: <Videos />,
    showInSidebar: true,
  },
  {
    name: 'Videos',
    layout: '/admin',
    path: '/add-video',
    component: <AddVideo />,
    showInSidebar: false,
  },
  {
    name: 'Videos',
    layout: '/admin',
    path: '/edit-video/:id',
    component: <EditVideo />,
    showInSidebar: false,
  },
  {
    name: 'Articles',
    layout: '/admin',
    path: '/articles',
    icon: <Icon as={FaFile} width="20px" height="20px" color="inherit" />,
    component: <Articles />,
    showInSidebar: true,
  },
  {
    name: 'Articles',
    layout: '/admin',
    path: '/add-article',
    component: <AddArticle />,
    showInSidebar: false,
  },
  
  {
    name: 'Articles',
    layout: '/admin',
    path: '/edit-article/:id',
    component: <EditArticle />,
    showInSidebar: false,
  },

  {
    name: 'Reviews',
    layout: '/admin',
    path: '/reviews',
    icon: <Icon as={FaStar} width="20px" height="20px" color="inherit" />,
    component: <Reviews />,
    showInSidebar: true,
  },
 
  {
    name: 'Ads',
    layout: '/admin',
    path: '/ads',
    icon: <Icon as={FaAd} width="20px" height="20px" color="inherit" />,
    component: <Ads />,
    showInSidebar: true,
  },
  {
    name: 'Ads',
    layout: '/admin',
    path: '/add-ad',
    component: <AddAd />,
    showInSidebar: false,
  },
  {
    name: 'Ads',
    layout: '/admin',
    path: '/edit-ad/:id',
    component: <EditAd />,
    showInSidebar: false,
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
    name: 'Users',
    layout: '/admin',
    path: '/edit-user/:id',
    component: <EditUser />,
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
    name: 'Help Center',
    layout: '/admin',
    icon: (
      <Icon
      as={MdAdminPanelSettings}
      width="20px"
      height="20px"
      color="#8f9bba"
      />
    ),
    component: null,
    showInSidebar: true,
    subRoutes: [
      {
        name:'FAQ',
        path: '/faqs',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <Faqs />,
        showInSidebar: true,
      },
      {
        name:'Privacy & Terms',
        path: '/privacy-and-terms',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <PrivacyAndTerms />,
        showInSidebar: true,
      },
      {
        name:'Contact Us',
        path: '/contact-us',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <ContactUs />,
        showInSidebar: true,
      },
      {
        name:'About Us',
        path: '/about-us',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <About />,
        showInSidebar: true,
      },
    ],
  },
  {
    name: 'FAQ',
    layout: '/admin',
    path: '/add-faq',
    component: <AddFaq />,
    showInSidebar: false,
  },
  {
    name: 'FAQ',
    layout: '/admin',
    path: '/edit-faq/:id',
    component: <EditFaq />,
    showInSidebar: false,
  },
  {
    name: 'Privacy & Terms',
    layout: '/admin',
    path: '/add-policy',
    component: <AddPrivacyAndTerms />,
    showInSidebar: false,
  },
  {
    name: 'Privacy & Terms',
    layout: '/admin',
    path: '/edit-policy/:id',
    component: <EditPrivacyAndTerms />,
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
