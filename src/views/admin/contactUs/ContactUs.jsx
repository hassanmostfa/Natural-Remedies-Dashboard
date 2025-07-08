import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Card,
  Icon,
  Divider,
} from '@chakra-ui/react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaSave, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ContactUs = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const [formData, setFormData] = React.useState({
    phone: '+1 (555) 123-4567',
    email: 'contact@naturalremedies.com',
    address: '123 Natural Way, Healing City, HC 12345',
  });

  const [errors, setErrors] = React.useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you would call your API here
      // const response = await api.put('/contact', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      Swal.fire({
        title: 'Success!',
        text: 'Contact information has been updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update contact information:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update contact information. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      phone: '+1 (555) 123-4567',
      email: 'contact@naturalremedies.com',
      address: '123 Natural Way, Healing City, HC 12345',
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card p={6}>
        <VStack spacing={8} align="stretch">
          <Flex justify="space-between" align="center">
            <Box>
              <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={2}>
                Contact Information
              </Text>
              <Text color="gray.500">
                Manage your contact details and business information
              </Text>
            </Box>
            <Button
              leftIcon={isEditing ? <FaSave /> : <FaEdit />}
              colorScheme={isEditing ? "green" : "blue"}
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              isLoading={isLoading}
            >
              {isEditing ? 'Save Changes' : 'Edit'}
            </Button>
          </Flex>

          <VStack spacing={6} align="stretch">
            {/* Phone */}
            <FormControl isInvalid={!!errors.phone}>
              <FormLabel color={textColor} fontWeight="bold">
                <HStack>
                  <Icon as={FaPhone} color="blue.500" />
                  <Text>Phone Number</Text>
                </HStack>
              </FormLabel>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                isReadOnly={!isEditing}
                bg={isEditing ? 'white' : 'gray.50'}
              />
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>

            {/* Email */}
            <FormControl isInvalid={!!errors.email}>
              <FormLabel color={textColor} fontWeight="bold">
                <HStack>
                  <Icon as={FaEnvelope} color="green.500" />
                  <Text>Email Address</Text>
                </HStack>
              </FormLabel>
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                isReadOnly={!isEditing}
                bg={isEditing ? 'white' : 'gray.50'}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            {/* Address */}
            <FormControl isInvalid={!!errors.address}>
              <FormLabel color={textColor} fontWeight="bold">
                <HStack>
                  <Icon as={FaMapMarkerAlt} color="red.500" />
                  <Text>Address</Text>
                </HStack>
              </FormLabel>
              <Textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                isReadOnly={!isEditing}
                bg={isEditing ? 'white' : 'gray.50'}
                rows={2}
              />
              <FormErrorMessage>{errors.address}</FormErrorMessage>
            </FormControl>
          </VStack>

          {isEditing && (
            <HStack justify="flex-end" spacing={4}>
              <Button
                onClick={handleCancel}
                variant="outline"
                colorScheme="gray"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                colorScheme="green"
                isLoading={isLoading}
              >
                Save Changes
              </Button>
            </HStack>
          )}
        </VStack>
      </Card>
    </Box>
  );
};

export default ContactUs;
