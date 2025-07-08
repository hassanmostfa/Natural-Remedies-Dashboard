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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
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
} from '@chakra-ui/react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const steps = [
  { title: 'Basic Information', description: 'Question, Answer and Order' },
  { title: 'Settings', description: 'Status and Preview' },
];

const AddFaq = () => {
  const navigate = useNavigate();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: 2,
  });

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const [formData, setFormData] = React.useState({
    question: '',
    answer: '',
    order: 1,
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
        if (!formData.question.trim()) {
          newErrors.question = 'Question is required';
        }
        if (!formData.answer.trim()) {
          newErrors.answer = 'Answer is required';
        }
        if (!formData.order || formData.order < 1) {
          newErrors.order = 'Order must be at least 1';
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
      // const response = await api.post('/faqs', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      Swal.fire({
        title: 'Success!',
        text: 'FAQ has been created successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      navigate('/admin/faqs');
    } catch (error) {
      console.error('Failed to create FAQ:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create FAQ. Please try again.',
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
            <FormControl isInvalid={!!errors.question}>
              <FormLabel color={textColor} fontWeight="bold">
                Question *
              </FormLabel>
              <Textarea
                placeholder="Enter the frequently asked question..."
                value={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                rows={3}
                resize="vertical"
              />
              <FormErrorMessage>{errors.question}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.answer}>
              <FormLabel color={textColor} fontWeight="bold">
                Answer *
              </FormLabel>
              <Textarea
                placeholder="Enter the detailed answer..."
                value={formData.answer}
                onChange={(e) => handleInputChange('answer', e.target.value)}
                rows={6}
                resize="vertical"
              />
              <FormErrorMessage>{errors.answer}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.order}>
              <FormLabel color={textColor} fontWeight="bold">
                Display Order *
              </FormLabel>
              <NumberInput
                min={1}
                value={formData.order}
                onChange={(value) => handleInputChange('order', parseInt(value) || 1)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{errors.order}</FormErrorMessage>
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
                {formData.question || 'Question will appear here...'}
              </Text>
              <Text color="gray.600" fontSize="sm">
                {formData.answer || 'Answer will appear here...'}
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
              Add New FAQ
            </Text>
            <Text color="gray.500">
              Create a new frequently asked question with detailed information
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
              onClick={() => navigate('/admin/faqs')}
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
                  Create FAQ
                </Button>
              )}
            </HStack>
          </HStack>
        </VStack>
      </Card>
    </Box>
  );
};

export default AddFaq;
