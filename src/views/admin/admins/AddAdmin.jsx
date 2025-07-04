import React, { useState } from 'react';
import {
  Button,
  Text,
  useColorModeValue,
  Input,
  Box,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddAdmin = () => {
  const navigate = useNavigate();
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
      // In a real app, you would call your API here:
      // const response = await createAdmin(formData).unwrap();
      
      // For static demo purposes:
      console.log('Form submitted:', formData);
      
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add admin',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Flex p="20px" mt={'80px'}>
      <Box w="100%" p="6" boxShadow="md" borderRadius="lg" bg={cardBg}>
        <Text color={textColor} fontSize="22px" fontWeight="700" mb="20px">
          Add New Admin
        </Text>

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
              placeholder="Enter phone number (e.g. +966501234567)"
              value={formData.phone}
              onChange={handleInputChange}
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              pattern="\+966[0-9]{9}"
              title="Please enter a valid Saudi phone number (+966 followed by 9 digits)"
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
            width="100%"
            variant="solid"
            colorScheme="blue"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="md"
            px="24px"
            py="5px"
            type="submit"
            height="40px"
          >
            Create Admin
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default AddAdmin;