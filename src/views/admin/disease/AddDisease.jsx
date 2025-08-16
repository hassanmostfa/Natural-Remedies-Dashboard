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
  useToast,
  HStack,
  IconButton,
  Heading,
  Stepper,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
  Grid,
  GridItem,
  Image,
  Avatar,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { useNavigate } from 'react-router-dom';
import { AddIcon, CloseIcon, UploadIcon } from '@chakra-ui/icons';


import { useCreateDiseaseMutation } from 'api/diseasesSlice';

const AddDisease = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const inputBg = useColorModeValue('white', 'gray.700');

  // API hooks
  const [createDisease, { isLoading: isCreating }] = useCreateDiseaseMutation();

  const steps = [
    { title: 'Basic Information' },
    { title: 'Symptoms' },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Separate state for each section to prevent re-renders
  const [basicInfo, setBasicInfo] = React.useState({
    name: '',
    description: '',
    status: 'active',
  });



  const [symptoms, setSymptoms] = React.useState([
    { id: 1, name: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' },
  ];

  // Basic info handlers
  const handleBasicInfoChange = React.useCallback((field, value) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Symptoms handlers
  const handleSymptomChange = React.useCallback((id, field, value) => {
    setSymptoms(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  const addSymptom = React.useCallback(() => {
    setSymptoms(prev => [
      ...prev, 
      { id: Math.max(...prev.map(item => item.id), 0) + 1, name: '' }
    ]);
  }, []);

  const removeSymptom = React.useCallback((id) => {
    setSymptoms(prev => prev.filter(item => item.id !== id));
  }, []);




  const validateStep = (step) => {
    switch (step) {
      case 0: // Basic Information
        if (!basicInfo.name.trim()) {
          toast({
            title: 'Error',
            description: 'Disease name is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        if (!basicInfo.description.trim()) {
          toast({
            title: 'Error',
            description: 'Description is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }


        return true;
      case 1: // Symptoms
        if (symptoms.length === 0 || !symptoms[0].name.trim()) {
          toast({
            title: 'Error',
            description: 'At least one symptom is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const prevStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Combine all data
      const formData = {
        ...basicInfo,
        symptoms: symptoms.map(s => s.name).filter(name => name.trim()),
      };

      // Create disease using API
      await createDisease(formData).unwrap();

      toast({
        title: 'Success',
        description: 'Disease added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Navigate back to diseases list
      navigate('/admin/disease');
      
    } catch (error) {
      console.error('Failed to add disease:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to add disease. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/disease');
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Basic Information</Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>


              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color={textColor}>Disease Name</FormLabel>
                  <Input
                    value={basicInfo.name}
                    onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                    placeholder="Enter disease name"
                  />
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color={textColor}>Description</FormLabel>
                  <Textarea
                    value={basicInfo.description}
                    onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                    placeholder="Enter disease description"
                    rows={4}
                  />
                </FormControl>
              </GridItem>

              <FormControl>
                <FormLabel color={textColor}>Status</FormLabel>
                <Select
                  value={basicInfo.status}
                  onChange={(e) => handleBasicInfoChange('status', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Symptoms</Heading>
            <Flex justify="space-between" align="center" mb={4}>
              <Text color={textColor} fontSize="sm">Add common symptoms of this disease</Text>
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={addSymptom}
              >
                Add Symptom
              </Button>
            </Flex>
            <VStack spacing={4} align="stretch">
              {symptoms.map((item) => (
                <Box key={item.id} p={4} border="1px" borderColor={borderColor} borderRadius="lg">
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontWeight="medium" color={textColor}>
                      Symptom {item.id}
                    </Text>
                    <IconButton
                      aria-label="Remove symptom"
                      icon={<CloseIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removeSymptom(item.id)}
                      isDisabled={symptoms.length === 1}
                    />
                  </Flex>
                  <FormControl>
                    <FormLabel fontSize="sm" color={textColor}>Symptom Name</FormLabel>
                    <Input
                      value={item.name}
                      onChange={(e) => handleSymptomChange(item.id, 'name', e.target.value)}
                      placeholder="Enter symptom name"
                      size="sm"
                    />
                  </FormControl>
                </Box>
              ))}
            </VStack>
          </Box>
        );



      default:
        return null;
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card>
        <Box p={6}>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="lg" color={textColor}>Add New Disease</Heading>
            <Text color="gray.500" fontSize="sm">
              Step {activeStep + 1} of {steps.length}
            </Text>
          </Flex>

          {/* Stepper */}
          <Stepper index={activeStep} mb={8}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink='0'>
                  <StepTitle>{step.title}</StepTitle>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <Flex justify="space-between" pt={6}>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  colorScheme="gray"
                >
                  Cancel
                </Button>
                
                <HStack spacing={4}>
                  {activeStep > 0 && (
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      colorScheme="blue"
                    >
                      Previous
                    </Button>
                  )}
                  
                  {activeStep < steps.length - 1 ? (
                    <Button
                      onClick={nextStep}
                      colorScheme="blue"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      colorScheme="green"
                      isLoading={isSubmitting || isCreating}
                      loadingText="Adding Disease"
                    >
                      Add Disease
                    </Button>
                  )}
                </HStack>
              </Flex>
            </VStack>
          </form>
        </Box>
      </Card>
    </Box>
  );
};

export default AddDisease;
