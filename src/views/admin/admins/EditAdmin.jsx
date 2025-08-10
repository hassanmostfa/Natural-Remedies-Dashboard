import React, { useState, useEffect } from 'react';
import {
  Button,
  Text,
  useColorModeValue,
  Flex,
  Box,
  Input,
  HStack,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateAdminMutation } from 'api/adminSlice';
import { useGetAdminProfileQuery } from 'api/adminSlice';

const EditAdmin = () => {
  const { id } = useParams();
  const { data: admin, isLoading: isAdminLoading, isError: isAdminError , refetch } = useGetAdminProfileQuery(id);
  const [editAdmin, { isLoading: isCreating }] = useUpdateAdminMutation();
  const navigate = useNavigate();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue("white", "navy.700");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.600");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  // Update formData when admin data is available
  useEffect(() => {
    if (admin?.data) {
      setFormData({
        name: admin.data.name,
        email: admin.data.email,
        phone: admin.data.phone,
        password: '', // Password is not pre-filled for security reasons
      });
    }
  }, [admin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    refetch();
  }, [refetch]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a copy of formData
    const dataToSend = { ...formData };

    // Remove the password field if it's empty
    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    console.log('Data being sent to API:', dataToSend);

    try {
      const response = await editAdmin({ id, admin: dataToSend }).unwrap();
      
      console.log('Admin updated successfully:', response);
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Admin updated successfully',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/admin/admins'); // Redirect to the admins page after successful submission
        }
      });
    } catch (error) {
      console.error('Failed to update admin:', error);
      
      let errorMessage = 'Failed to update admin';
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK',
      });
    }
  };

  if (isAdminLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text color={textColor} fontSize="lg">Loading admin details...</Text>
      </Flex>
    );
  }

  if (isAdminError) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text color="red.500" fontSize="lg">Error loading admin data</Text>
        <Button onClick={() => navigate('/admin/admins')} colorScheme="blue" ml="4">
          Back to Admins
        </Button>
      </Flex>
    );
  }

  return (
    <Flex justify="center" p="20px" mt={"80px"}>
      <Box w="100%" p="6" boxShadow="md" borderRadius="lg" bg={cardBg}>
        <HStack justify="space-between" mb="20px">
          <Button
            leftIcon={<ChevronLeftIcon />}
            color="green.500"
            onClick={() => navigate('/admin/admins')}
            border="2px solid"
            borderColor="green.500"
            _hover={{ bg: 'green.100' }}
          >
            Back
          </Button>
          <Text color={textColor} fontSize="22px" fontWeight="700">
            Edit Admin
          </Text>
          <Box w="80px" /> {/* Spacer to center the title */}
        </HStack>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <Box mb="3" mt={"20px"}>
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Name <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              type="text"
              name="name"
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              placeholder="Enter Admin Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Box>

          {/* Email Field */}
          <Box mb="3">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Email <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              type="email"
              name="email"
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Box>

          {/* Phone Field */}
          <Box mb="3">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Phone <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              type="tel"
              name="phone"
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </Box>

          {/* Password Field */}
          <Box mb="3">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Password
            </Text>
            <Input
              type="password"
              name="password"
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              placeholder="Enter new password (leave blank to keep current)"
              value={formData.password}
              onChange={handleInputChange}
            />
          </Box>



          {/* Submit Button */}
          <Button
            width="200px"
            variant="darkBrand"
            fontSize="sm"
            fontWeight="500"
            borderRadius="xl"
            px="24px"
            py="5px"
            type="submit"
            height="40px"
            isLoading={isCreating}
            loadingText="Updating Admin..."
            mt={"20px"}
          >
            Update Admin
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default EditAdmin;