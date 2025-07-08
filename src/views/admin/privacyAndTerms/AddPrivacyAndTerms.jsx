import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Card,
  Badge,
  Icon,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaSave, FaEdit } from 'react-icons/fa';
const AddPrivacyAndTerms = () => {
  const navigate = useNavigate();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const [formData, setFormData] = React.useState({
    type: '',
    content: '',
    status: 'active',
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

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // In a real app, you would call your API here
      // const response = await api.post('/policies', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      Swal.fire({
        title: 'Success!',
        text: 'Policy has been created successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      navigate('/admin/privacy-and-terms');
    } catch (error) {
      console.error('Failed to create policy:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create policy. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const renderFormContent = () => {
    return (
      <VStack spacing={6} align="stretch" w="100%">
        <FormControl isInvalid={!!errors.type}>
          <FormLabel color={textColor} fontWeight="bold">
            Policy Type *
          </FormLabel>
          <Select
            placeholder="Select policy type"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
          >
            <option value="privacy">Privacy Policy</option>
            <option value="terms">Terms of Service</option>
          </Select>
          <FormErrorMessage>{errors.type}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel color={textColor} fontWeight="bold">
            Status
          </FormLabel>
          <Select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </FormControl>
        
        <FormControl isInvalid={!!errors.content}>
          <FormLabel color={textColor} fontWeight="bold">
            Policy Content *
          </FormLabel>
          <Box border="1px" borderColor={borderColor} borderRadius="md">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(value) => handleInputChange('content', value)}
              placeholder="Enter the detailed policy content..."
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
          <FormErrorMessage>{errors.content}</FormErrorMessage>
        </FormControl>
      </VStack>
    );
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card p={6}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={2}>
              Add New Policy
            </Text>
            <Text color="gray.500">
              Create a new privacy policy or terms of service document
            </Text>
          </Box>

          <Box p={6} border="1px solid" borderColor={borderColor} borderRadius="lg">
            {renderFormContent()}
          </Box>

          <HStack justify="space-between">
            <Button
              onClick={() => navigate('/admin/privacy-and-terms')}
              variant="outline"
              colorScheme="gray"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              colorScheme="green"
            >
              Create Policy
            </Button>
          </HStack>
        </VStack>
      </Card>
    </Box>
  );
};

export default AddPrivacyAndTerms;
