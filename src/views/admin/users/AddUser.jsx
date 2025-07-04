import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
  Image,
  Select,
  IconButton,
  Textarea,
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddUser = () => {
  const navigate = useNavigate();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const inputBorder = useColorModeValue('gray.300', 'gray.600');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subscriptionPlan: 'Basic',
    image: '',
    status: 'active',
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your API
    console.log('User data to be submitted:', formData);
    
    Swal.fire({
      icon: 'success',
      title: 'User Created',
      text: 'The new user has been added successfully',
      confirmButtonText: 'OK',
    }).then(() => {
      navigate('/admin/users'); // Redirect to users list
    });
  };

  return (
    <Flex justify="center" p="20px" mt="80px">
      <Box w="100%" p="6" boxShadow="md" borderRadius="lg" bg={cardBg}>
        <Text color={textColor} fontSize="22px" fontWeight="700" mb="20px">
          Add New User
        </Text>

        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <FormControl mb="4">
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              Profile Image
            </FormLabel>
            <Flex align="center">
              <Box
                w="80px"
                h="80px"
                borderRadius="full"
                overflow="hidden"
                border="2px solid"
                borderColor={inputBorder}
                mr="4"
              >
                {imagePreview ? (
                  <Image src={imagePreview} w="100%" h="100%" objectFit="cover" />
                ) : (
                  <Flex
                    w="100%"
                    h="100%"
                    align="center"
                    justify="center"
                    bg={inputBg}
                  >
                    <AddIcon color="gray.500" />
                  </Flex>
                )}
              </Box>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                display="none"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button as="span" size="sm" variant="outline">
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </Button>
              </label>
            </Flex>
          </FormControl>

          {/* Name Field */}
          <FormControl mb="4" isRequired>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              Full Name
            </FormLabel>
            <Input
              type="text"
              name="name"
              placeholder="Enter user's full name"
              value={formData.name}
              onChange={handleInputChange}
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
            />
          </FormControl>

          {/* Email Field */}
          <FormControl mb="4" isRequired>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              Email Address
            </FormLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter user's email"
              value={formData.email}
              onChange={handleInputChange}
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
            />
          </FormControl>

          {/* Subscription Plan */}
          <FormControl mb="4" isRequired>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              Subscription Plan
            </FormLabel>
            <Select
              name="subscriptionPlan"
              value={formData.subscriptionPlan}
              onChange={handleInputChange}
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              icon={<ChevronDownIcon />}
            >
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="Premium">Premium</option>
            </Select>
          </FormControl>

          {/* Status */}
          <FormControl mb="6">
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              Account Status
            </FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              icon={<ChevronDownIcon />}
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="expired">Expired</option>
            </Select>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="blue"
            width="100%"
            size="lg"
            mt="4"
          >
            Create User
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default AddUser;