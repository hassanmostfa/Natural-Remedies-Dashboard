import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Textarea,
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
  useToast,
  Spinner,
} from '@chakra-ui/react';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetFaqQuery, useUpdateFaqMutation } from 'api/faqsSlice';

const steps = [
  { title: 'Basic Information', description: 'Question and Answer' },
  { title: 'Preview', description: 'Review and Update' },
];

const EditFaq = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: 2,
  });

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // API hooks
  const { data: faqResponse, isLoading: isLoadingFaq, isError: isErrorLoadingFaq , refetch} = useGetFaqQuery(id);
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();

  const [formData, setFormData] = React.useState({
    question: '',
    answer: '',
  });

  const [errors, setErrors] = React.useState({});
  const [isDataLoaded, setIsDataLoaded] = React.useState(false);

  // Load FAQ data when fetched (only once)
  React.useEffect(() => {
    if (faqResponse?.data && !isDataLoaded) {
      const faqData = faqResponse.data;
      setFormData({
        question: faqData.question || '',
        answer: faqData.answer || '',
      });
      setIsDataLoaded(true);
    }
  }, [faqResponse?.data, isDataLoaded]);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

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
    if (!validateStep(0)) {
      return;
    }

    try {
      // Prepare the data according to the API structure
      const faqData = {
        question: formData.question,
        answer: formData.answer,
      };

      await updateFaq({ id, faq: faqData }).unwrap();

      toast({
        title: 'Success',
        description: 'FAQ updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      refetch();

      navigate('/admin/undefined/faqs');
      
    } catch (error) {
      console.error('Failed to update FAQ:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to update FAQ. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
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
          </VStack>
        );

      case 1:
        return (
          <VStack spacing={6} align="stretch" w="100%">
            <Box p={6} bg="gray.50" borderRadius="md" border="1px solid" borderColor={borderColor}>
              <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
                Preview FAQ
              </Text>
              
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    Question:
                  </Text>
                  <Text fontWeight="bold" color={textColor} fontSize="md">
                    {formData.question || 'No question entered yet...'}
                  </Text>
                </Box>
                
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    Answer:
                  </Text>
                  <Text color={textColor} fontSize="sm" lineHeight="1.6">
                    {formData.answer || 'No answer entered yet...'}
                  </Text>
                </Box>
              </VStack>
            </Box>

            <Box p={4} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
              <Text fontSize="sm" color="blue.700">
                <strong>Ready to update:</strong> Review the changes above and click "Update FAQ" to save your modifications.
              </Text>
            </Box>
          </VStack>
        );

      default:
        return null;
    }
  };

  // Loading state
  if (isLoadingFaq) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Flex justify="center" align="center" h="200px">
              <VStack spacing={4}>
                <Spinner size="xl" color="#422afb" thickness="4px" />
                <Text color={textColor}>Loading FAQ details...</Text>
              </VStack>
            </Flex>
          </Box>
        </Card>
      </Box>
    );
  }

  // Error state
  if (isErrorLoadingFaq) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Flex justify="center" align="center" h="200px">
              <VStack spacing={4}>
                <Text color="red.500" fontSize="lg">Error loading FAQ details</Text>
                <Text color={textColor} fontSize="sm">
                  The FAQ you're looking for might not exist or there was an error loading it.
                </Text>
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/undefined/faqs')}
                  size="sm"
                >
                  Back to FAQs
                </Button>
              </VStack>
            </Flex>
          </Box>
        </Card>
      </Box>
    );
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card p={6}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={2}>
              Edit FAQ
            </Text>
            <Text color="gray.500">
              Update the frequently asked question with new information
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
              onClick={() => navigate('/admin/undefined/faqs')}
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
                  isLoading={isUpdating}
                  loadingText="Updating FAQ"
                >
                  Update FAQ
                </Button>
              )}
            </HStack>
          </HStack>
        </VStack>
      </Card>
    </Box>
  );
};

export default EditFaq;
