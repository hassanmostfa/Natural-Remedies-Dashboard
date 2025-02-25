import React, { useState, useEffect } from 'react';
import {
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useGetUserProfileQuery } from 'api/userSlice';
import { useGetRolesQuery } from 'api/roleSlice';

const ShowAdmin = () => {
  const { id } = useParams();
  const { data: admin, isLoading: isAdminLoading, isError: isAdminError } =
    useGetUserProfileQuery(id);
  const { data: roles, isLoading: isRolesLoading, isError: isRolesError } =
    useGetRolesQuery();
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    if (admin?.data && roles?.data) {
      const role = roles.data.find((r) => r.id === admin.data?.roleId);
      if (role) {
        setSelectedRole(role.name);
      }
    }
  }, [admin, roles]);

  if (isAdminLoading || isRolesLoading) {
    return <div>Loading...</div>;
  }

  if (isAdminError || isRolesError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="container add-admin-container w-100">
      <div className="add-admin-card shadow p-4 bg-white w-100">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          mb="20px !important"
          lineHeight="100%"
        >
          View Admin
        </Text>

        {/* Table Layout */}
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Tbody>
            {/* Name Field */}
            <Tr>
              <Th>Name</Th>
              <Td>{admin.data?.name}</Td>
            </Tr>

            {/* Email Field */}
            <Tr>
              <Th>Email</Th>
              <Td>{admin.data?.email}</Td>
            </Tr>

            {/* Role Field */}
            <Tr>
              <Th>Role</Th>
              <Td>{selectedRole}</Td>
            </Tr>
          </Tbody>
        </Table>
      </div>
    </div>
  );
};

export default ShowAdmin;