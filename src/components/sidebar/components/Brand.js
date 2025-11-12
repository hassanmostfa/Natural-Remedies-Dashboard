import React from "react";

import { Image } from "@chakra-ui/react";
// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import Logo from "../../../assets/img/logo2.png";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode

  return (
    <Flex align='center' direction='column'>
      <Image src={Logo} h='80px' alt='logo' />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
