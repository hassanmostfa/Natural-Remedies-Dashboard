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
import paymentTransactions from "views/admin/default/variables/paymentTransactions.json";

export default function PaymentTable(props) {
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
          Recent Payment Transactions
        </Text>
      </Flex>

      <Box overflowX="auto" w="100%">
        <Table variant="simple" color={textColor}>
          <Thead>
            <Tr my=".8rem" pl="0px" color="gray.400">
              <Th borderColor={borderColor} color="gray.400">
                Transaction ID
              </Th>
              <Th borderColor={borderColor} color="gray.400">
                User
              </Th>
              <Th borderColor={borderColor} color="gray.400">
                Plan
              </Th>
              <Th borderColor={borderColor} color="gray.400">
                Amount
              </Th>
              <Th borderColor={borderColor} color="gray.400">
                Status
              </Th>
              <Th borderColor={borderColor} color="gray.400">
                Date
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {paymentTransactions.map((row, index) => {
              return (
                <Tr px="20px" py="16px" fontSize="sm" key={index}>
                  <Td borderColor={borderColor}>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      {row.transactionId}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      {row.user}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      {row.plan}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      {row.amount}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Badge
                      colorScheme={row.status === "successful" ? "green" : "red"}
                      fontSize="sm"
                      fontWeight="700">
                      {row.status}
                    </Badge>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      {row.date}
                    </Text>
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