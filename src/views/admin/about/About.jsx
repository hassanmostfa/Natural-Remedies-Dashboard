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
  Spinner,
  useToast,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaEdit } from 'react-icons/fa';
import { useGetAboutByIdQuery, useUpdateAboutMutation } from 'api/aboutSlice';

const About = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isDataLoaded, setIsDataLoaded] = React.useState(false);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.800');

  // API hooks
  const { data: aboutResponse, isLoading, isError, refetch } = useGetAboutByIdQuery(1);
  const [updateAbout, { isLoading: isUpdating }] = useUpdateAboutMutation();

  const [formData, setFormData] = React.useState({
    mainDescription: ''
  });

  const [errors, setErrors] = React.useState({});

  // Load data when API response is received
  React.useEffect(() => {
    if (aboutResponse?.data && !isDataLoaded) {
      setFormData({
        mainDescription: aboutResponse.data.mainDescription || ''
      });
      setIsDataLoaded(true);
    }
  }, [aboutResponse?.data, isDataLoaded]);

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

    try {
      await updateAbout({
        id: 1,
        mainDescription: formData.mainDescription
      }).unwrap();

      toast({
        title: 'Success',
        description: 'About information has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to update about information:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to update about information. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    // Reset form data to original values from API
    if (aboutResponse?.data) {
      setFormData({
        mainDescription: aboutResponse.data.mainDescription || ''
      });
    }
    setErrors({});
  };

  // Loading state
  if (isLoading) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card p={6}>
          <Flex justify="center" align="center" h="200px">
            <VStack spacing={4}>
              <Spinner size="xl" color="#422afb" thickness="4px" />
              <Text color={textColor}>Loading about information...</Text>
            </VStack>
          </Flex>
        </Card>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card p={6}>
          <Flex justify="center" align="center" h="200px">
            <Text color="red.500">Error loading about information. Please try again.</Text>
          </Flex>
        </Card>
      </Box>
    );
  }

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
              isLoading={isUpdating}
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
