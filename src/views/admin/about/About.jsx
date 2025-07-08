import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  VStack,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Card,
} from '@chakra-ui/react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';

const About = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.800');

  const [formData, setFormData] = React.useState({
    title: 'About Natural Remedies',
    mainDescription: 'At Natural Remedies, we believe in the power of nature to heal and nurture. Our mission is to provide you with the highest quality natural remedies, backed by centuries of traditional wisdom and modern scientific research. We are committed to helping you achieve optimal health through safe, effective, and sustainable natural solutions.'
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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.mainDescription.trim()) {
      newErrors.mainDescription = 'Main description is required';
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
      // const response = await api.put('/about', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      Swal.fire({
        title: 'Success!',
        text: 'About information has been updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update about information:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update about information. Please try again.',
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
      title: 'About Natural Remedies',
      mainDescription: 'At Natural Remedies, we believe in the power of nature to heal and nurture. Our mission is to provide you with the highest quality natural remedies, backed by centuries of traditional wisdom and modern scientific research. We are committed to helping you achieve optimal health through safe, effective, and sustainable natural solutions.'
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
                About Us
              </Text>
              <Text color="gray.500">
                Manage your about page information
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
            {/* Title */}
            <FormControl isInvalid={!!errors.title}>
              <FormLabel color={textColor} fontWeight="bold">
                Title
              </FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                isReadOnly={!isEditing}
                bg={isEditing ? 'white' : 'gray.50'}
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            {/* Main Description */}
            <FormControl isInvalid={!!errors.mainDescription}>
              <FormLabel color={textColor} fontWeight="bold">
                Main Description
              </FormLabel>
              <Textarea
                value={formData.mainDescription}
                onChange={(e) => handleInputChange('mainDescription', e.target.value)}
                isReadOnly={!isEditing}
                bg={isEditing ? 'white' : 'gray.50'}
                rows={6}
              />
              <FormErrorMessage>{errors.mainDescription}</FormErrorMessage>
            </FormControl>
          </VStack>

          {isEditing && (
            <Button
              onClick={handleCancel}
              variant="outline"
              colorScheme="gray"
              mt={4}
            >
              Cancel
            </Button>
          )}
        </VStack>
      </Card>
    </Box>
  );
};

export default About;
