import React, { useState } from 'react';
import {
  Button,
  Text,
  useColorModeValue,
  Input,
  Box,
  Flex,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useCreateAdminMutation } from 'api/adminSlice';

const AddAdmin = () => {
  const navigate = useNavigate();
  const [createAdmin, { isLoading }] = useCreateAdminMutation();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const inputBorder = useColorModeValue('gray.300', 'gray.600');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createAdmin(formData).unwrap();
      
      console.log('Admin created successfully:', response);
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Admin added successfully',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/admin/admins'); // Redirect to the admins page
        }
      });
    } catch (error) {
      console.error('Failed to create admin:', error);
      
      let errorMessage = 'Failed to add admin';
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

  return (
    <Flex p="20px" mt={'80px'}>
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
            Add New Admin
          </Text>
          <Box w="80px" /> {/* Spacer to center the title */}
        </HStack>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <Box mb="4">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Name <span style={{ color: 'red' }}>*</span>
            </Text>
            <Input
              type="text"
              name="name"
              placeholder="Enter Admin Name"
              value={formData.name}
              onChange={handleInputChange}
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              required
            />
          </Box>

          {/* Email Field */}
          <Box mb="4">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Email <span style={{ color: 'red' }}>*</span>
            </Text>
            <Input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              required
            />
          </Box>

          {/* Phone Field */}
          <Box mb="4">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Phone <span style={{ color: 'red' }}>*</span>
            </Text>
            <Input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleInputChange}
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              required
            />
          </Box>

          {/* Password Field */}
          <Box mb="6">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Password <span style={{ color: 'red' }}>*</span>
            </Text>
            <Flex align="center">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                bg={inputBg}
                color={textColor}
                borderColor={inputBorder}
                minLength="8"
                required
              />
              <IconButton
                ml="2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
              />
            </Flex>
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
            isLoading={isLoading}
            loadingText="Creating Admin..."
          >
            Create Admin
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default AddAdmin;