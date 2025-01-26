import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Box, useDisclosure, Portal } from "@chakra-ui/react";
import Footer from "components/footer/FooterAdmin.js";
import Navbar from "components/navbar/NavbarAdmin.js";
import Sidebar from "components/sidebar/Sidebar.js";
import { SidebarContext } from "contexts/SidebarContext";
import routes from "routes.js";

// Helper function to capitalize the first letter
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getLastPathSegment = (pathname) => {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : "/";
};

const AdminLayout = (props) => {
  const { ...rest } = props;
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [activeRoute, setActiveRoute] = useState("Default Brand Text");
  const location = useLocation();
  const { onOpen } = useDisclosure();

  // Helper to get the active route name
  const getActiveRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].subRoutes) {
        const subRouteActive = getActiveRoute(routes[i].subRoutes);
        if (subRouteActive) {
          return subRouteActive;
        }
      } else {
        const fullPath = `${routes[i].layout}${routes[i].path}`;
        if (location.pathname === fullPath) {
          return routes[i].name;
        }
      }
    }
    return getLastPathSegment(location.pathname);
  };

  // Update active route whenever location changes
  useEffect(() => {
    const newActiveRoute = getActiveRoute(routes);
    const capitalizedRoute = capitalizeFirstLetter(newActiveRoute); // Capitalize first letter
    setActiveRoute(capitalizedRoute); // Set the capitalized route name
  }, [location]);

  // Render routes for the app, including subroutes
  const getRoutes = (routes) => {
    return routes.flatMap((route, key) => {
      if (route.subRoutes) {
        // Handle subroutes by recursively mapping them
        return [
          // Parent route (optional, if it has a component)
          route.component && (
            <Route
              key={`parent-${key}`}
              path={`${route.path}`}
              element={route.component}
            />
          ),
          // Sub-routes
          ...route.subRoutes.map((subRoute, subKey) => (
            <Route
              key={`${key}-${subKey}`}
              path={`${route.path}${subRoute.path}`}
              element={subRoute.component}
            />
          )),
        ];
      } else if (route.layout === "/admin") {
        // Normal route
        return (
          <Route
            key={key}
            path={`${route.path}`}
            element={route.component}
          />
        );
      }
      return null;
    });
  };

  // Determine whether to show the main layout
  const getRoute = () => {
    return location.pathname !== "/admin/full-screen-maps";
  };

  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Sidebar routes={routes} display="none" {...rest} />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: "100%", xl: "calc( 100% - 290px )" }}
          maxWidth={{ base: "100%", xl: "calc( 100% - 290px )" }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          <Portal>
            <Box>
              <Navbar
                onOpen={onOpen}
                logoText={"Horizon UI Dashboard PRO"}
                brandText={activeRoute} // Dynamically updated brand text
                secondary={false}
                message={""}
                fixed={false}
                {...rest}
              />
            </Box>
          </Portal>
          {getRoute() ? (
            <Box
              mx="auto"
              p={{ base: "20px", md: "30px" }}
              pe="20px"
              minH="100vh"
              pt="50px"
            >
              <Routes>
                {getRoutes(routes)} {/* Dynamic route rendering */}
                <Route
                  path="/"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
              </Routes>
            </Box>
          ) : null}
          <Box>
            <Footer />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
};

export default AdminLayout;
