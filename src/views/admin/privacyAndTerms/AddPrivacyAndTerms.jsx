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
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Card,
  Stepper,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
  Badge, 
} from '@chakra-ui/react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const steps = [
  { title: 'Basic Information', description: 'Title, Type and Content' },
  { title: 'Settings', description: 'Status and Preview' },
];

const AddPrivacyAndTerms = () => {
  const navigate = useNavigate();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: 2,
  });

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const [formData, setFormData] = React.useState({
    title: '',
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

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0:
        if (!formData.title.trim()) {
          newErrors.title = 'Title is required';
        }
        if (!formData.type) {
          newErrors.type = 'Type is required';
        }
        if (!formData.content.trim()) {
          newErrors.content = 'Content is required';
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
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

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <VStack spacing={6} align="stretch" w="100%">
            <FormControl isInvalid={!!errors.title}>
              <FormLabel color={textColor} fontWeight="bold">
                Policy Title *
              </FormLabel>
              <Input
                placeholder="Enter the policy title..."
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

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

            <FormControl isInvalid={!!errors.content}>
              <FormLabel color={textColor} fontWeight="bold">
                Policy Content *
              </FormLabel>
              <Textarea
                placeholder="Enter the detailed policy content..."
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={12}
                resize="vertical"
              />
              <FormErrorMessage>{errors.content}</FormErrorMessage>
            </FormControl>
          </VStack>
        );

      case 1:
        return (
          <VStack spacing={6} align="stretch" w="100%">
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

            <Box p={4} bg="gray.50" borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={2}>
                Preview:
              </Text>
              <Text fontWeight="bold" color={textColor} mb={2}>
                {formData.title || 'Title will appear here...'}
              </Text>
              <Badge 
                colorScheme={formData.type === 'privacy' ? 'blue' : 'green'}
                mb={2}
                alignSelf="start"
              >
                {formData.type || 'Type'}
              </Badge>
              <Text color="gray.600" fontSize="sm" noOfLines={4}>
                {formData.content || 'Content will appear here...'}
              </Text>
            </Box>
          </VStack>
        );

      default:
        return null;
    }
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

          <Stepper index={activeStep} orientation="horizontal" size="lg">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>

          <Box p={6} border="1px solid" borderColor={borderColor} borderRadius="lg">
            {renderStepContent()}
          </Box>

          <HStack justify="space-between">
            <Button
              onClick={() => navigate('/admin/privacy-and-terms')}
              variant="outline"
              colorScheme="gray"
            >
              Cancel
            </Button>

            <HStack>
              {activeStep > 0 && (
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  colorScheme="blue"
                >
                  Previous
                </Button>
              )}

              {activeStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  colorScheme="blue"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  colorScheme="green"
                >
                  Create Policy
                </Button>
              )}
            </HStack>
          </HStack>
        </VStack>
      </Card>
    </Box>
  );
};

export default AddPrivacyAndTerms;
