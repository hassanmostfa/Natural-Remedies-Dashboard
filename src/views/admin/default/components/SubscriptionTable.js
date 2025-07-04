// Chakra imports
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import subscriptionData from "views/admin/default/variables/subscriptionData.json";

export default function SubscriptionTable(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  return (
    <Card p="20px" align="center" direction="column" w="100%" {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        mb="8px">
        <Text color={textColor} fontSize="lg" fontWeight="700">
          Subscription Plans Overview
        </Text>
      </Flex>

      <Box overflowX="auto" w="100%">
        <Table variant="simple" color={textColor}>
          <Thead>
            <Tr my=".8rem" pl="0px" color="gray.400">
              <Th borderColor={borderColor} color="gray.400">
                Plan
              </Th>
              <Th borderColor={borderColor} color="gray.400">
                Subscribers
              </Th>
              <Th borderColor={borderColor} color="gray.400">
                Revenue
              </Th>
              <Th borderColor={borderColor} color="gray.400">
                Growth
              </Th>
              <Th borderColor={borderColor} color="gray.400">
                Status
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {subscriptionData.map((row, index) => {
              return (
                <Tr px="20px" py="16px" fontSize="sm" key={index}>
                  <Td borderColor={borderColor}>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      {row.plan}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      {row.subscribers.toLocaleString()}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      {row.revenue}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Text color="green.500" fontSize="sm" fontWeight="700">
                      {row.growth}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Badge
                      colorScheme={row.status === "active" ? "green" : "red"}
                      fontSize="sm"
                      fontWeight="700">
                      {row.status}
                    </Badge>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
} 