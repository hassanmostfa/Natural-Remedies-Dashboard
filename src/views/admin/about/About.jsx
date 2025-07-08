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
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';

const About = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.800');

  const [formData, setFormData] = React.useState({
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
      mainDescription: 'At Natural Remedies, we believe in the power of nature to heal and nurture. Our mission is to provide you with the highest quality natural remedies, backed by centuries of traditional wisdom and modern scientific research. We are committed to helping you achieve optimal health through safe, effective, and sustainable natural solutions.'
    });
    setErrors({});
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
          </Flex>

          <VStack spacing={6} align="stretch">
            {/* Main Description */}
            <FormControl isInvalid={!!errors.mainDescription}>
              <FormLabel color={textColor} fontWeight="bold">
                Main Description
              </FormLabel>
              <Box border="1px" borderColor="gray.200" borderRadius="md">
                <ReactQuill
                  theme="snow"
                  value={formData.mainDescription}
                  onChange={(value) => handleInputChange('mainDescription', value)}
                  placeholder="Enter the about page content..."
                  style={{ height: '300px' }}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'align': [] }],
                      ['link', 'blockquote', 'code-block'],
                      ['clean']
                    ],
                  }}
                />
              </Box>
              <FormErrorMessage>{errors.mainDescription}</FormErrorMessage>
            </FormControl>
          </VStack>

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
              leftIcon={<FaSave />}
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </HStack>
        </VStack>
      </Card>
    </Box>
  );
};

export default About;
