import React, { useState, useEffect } from "react";
import {
  Text,
  useColorModeValue,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useGetUserProfileQuery } from "api/userSlice";
import { useGetRolesQuery } from "api/roleSlice";

const ShowAdmin = () => {
  const { id } = useParams();
  const { data: admin, isLoading: isAdminLoading, isError: isAdminError } =
    useGetUserProfileQuery(id);
  const { data: roles, isLoading: isRolesLoading, isError: isRolesError } =
    useGetRolesQuery();

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardBg = useColorModeValue("white", "navy.700");
  const tableBg = useColorModeValue("white", "navy.700");
  const tableTextColor = useColorModeValue("gray.700", "white");

  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    if (admin?.data && roles?.data) {
      const role = roles.data.find((r) => r.id === admin.data?.roleId);
      if (role) {
        setSelectedRole(role.name);
      }
    }
  }, [admin, roles]);

  if (isAdminLoading || isRolesLoading) {
    return <Box textAlign="center" p="20px">Loading...</Box>;
  }

  if (isAdminError || isRolesError) {
    return <Box textAlign="center" p="20px" color="red.500">Error loading data</Box>;
  }

  return (
    <Flex justify="center" p="20px" mt={"80px"}>
      <Box w="100%" p="6" boxShadow="md" borderRadius="lg" bg={cardBg}>
        <Text color={textColor} fontSize="22px" fontWeight="700" mb="20px">
          View Admin
        </Text>

        {/* Table Layout */}
        <Table w="100%" variant="simple" mb="24px" mt="12px" bg={tableBg} color={tableTextColor}>
          <Tbody>
            {/* Name Field */}
            <Tr>
              <Th w="30%">Name</Th>
              <Td>{admin.data?.name}</Td>
            </Tr>

            {/* Email Field */}
            <Tr>
              <Th w="30%">Email</Th>
              <Td>{admin.data?.email}</Td>
            </Tr>

            {/* Role Field */}
            <Tr>
              <Th w="30%">Role</Th>
              <Td>{selectedRole}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
};

export default ShowAdmin;
