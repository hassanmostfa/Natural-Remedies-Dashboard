import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { useNavigate } from 'react-router-dom';
import { useCreateBodySystemMutation } from 'api/bodySystemsSlice';
import Swal from 'sweetalert2';

const AddBodySystem = () => {
  const navigate = useNavigate();
  const [createBodySystem, { isLoading: isCreating }] = useCreateBodySystemMutation();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    status: 'active',
    bodySystemId: '',
  });

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#4B2E2B',
    });
  };

  const showSuccessAlert = () => {
    Swal.fire({
      title: 'Success!',
      text: 'Body system created successfully',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/admin/categories');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.title.trim()) {
      showErrorAlert('Body system title is required');
      return;
    }

    if (!formData.description.trim()) {
      showErrorAlert('Description is required');
      return;
    }

    try {
      // Call the create body system API
      await createBodySystem({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        bodySystemId: formData.bodySystemId
      }).unwrap();

      showSuccessAlert();
      
    } catch (error) {
      console.error('Failed to create body system:', error);
      
      let errorMessage = 'Failed to create body system. Please try again.';
      if (error.data?.message) {
        errorMessage = error.data.message;
      }

      showErrorAlert(errorMessage);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will lose any unsaved changes',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/admin/categories');
      }
    });
  };

  return (
    <Box mt="80px">
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex px="25px" mb="20px" justifyContent="space-between" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Add New Body System
          </Text>
        </Flex>
        
        <Box px="25px" pb="25px">
          <form onSubmit={handleSubmit}>
            <VStack spacing="6" align="stretch" maxW="600px">
              {/* Body System Name */}
              <FormControl isRequired>
                <FormLabel color={textColor} fontWeight="600">
                  Title
                </FormLabel>
                <Input
                  placeholder="Enter title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  bg={useColorModeValue('white', 'gray.700')}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="lg"
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px blue.500',
                  }}
                />
              </FormControl>

              {/* Description */}
              <FormControl isRequired>
                <FormLabel color={textColor} fontWeight="600">
                  Description
                </FormLabel>
                <Textarea
                  placeholder="Enter description for this body system"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  bg={useColorModeValue('white', 'gray.700')}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="lg"
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px blue.500',
                  }}
                />
              </FormControl>

              {/* Status */}
              <FormControl>
                <FormLabel color={textColor} fontWeight="600">
                  Status
                </FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  bg={useColorModeValue('white', 'gray.700')}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="lg"
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px blue.500',
                  }}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Action Buttons */}
              <Flex gap="4" pt="4">
                <Button
                  type="submit"
                  variant="darkBrand"
                  color="white"
                  fontSize="sm"
                  fontWeight="500"
                  borderRadius="70px"
                  px="24px"
                  py="5px"
                  isLoading={isCreating}
                  loadingText="Creating..."
                  _hover={{
                    bg: 'blue.600',
                  }}
                >
                  Create Body System
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  color={textColor}
                  fontSize="sm"
                  fontWeight="500"
                  borderRadius="70px"
                  px="24px"
                  py="5px"
                  onClick={handleCancel}
                  _hover={{
                    bg: useColorModeValue('gray.100', 'gray.600'),
                  }}
                >
                  Cancel
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
      </Card>
    </Box>
  );
};

export default AddBodySystem;