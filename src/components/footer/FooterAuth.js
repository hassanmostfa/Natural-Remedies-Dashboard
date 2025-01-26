/*eslint-disable*/
import React from "react";
import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Footer() {
  let textColor = useColorModeValue("#000000", "white");
  let linkColor = useColorModeValue({ base: "gray.400", lg: "white" }, "white");
  return (
    <Flex
      zIndex='3'
      flexDirection={{
        base: "column",
        lg: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent='start'
      px={{ base: "30px", md: "0px" }}
      pb='30px'
      ml={{ lg: "70px" }}
      >
      <Text
        color={textColor}
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", lg: "0px" }}>
        {" "}
        {/* &copy; {1900 + new Date().getYear()} */}
        <Text as='span' fontWeight='500' ms='4px' textAlign={"center"}>
          Powered by
          <Link
            mx='3px'
            color={textColor}
            href='#'
            target='_blank'
            fontWeight='700'>
            Cloud Lift Solutions
          </Link>
        </Text>
      </Text>
    </Flex>
  );
}
