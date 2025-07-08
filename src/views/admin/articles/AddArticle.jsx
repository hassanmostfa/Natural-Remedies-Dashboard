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
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { useNavigate } from 'react-router-dom';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';

const AddArticle = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const steps = [
    { title: 'Basic Information' },
    { title: 'Plants List' },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Separate state for each section to prevent re-renders
  const [basicInfo, setBasicInfo] = React.useState({
    title: '',
    image: '',
    description: '',
    visiblePlans: 'all',
    status: 'active',
  });

  const [plants, setPlants] = React.useState([
    { id: 1, title: '', image: '', description: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' },
  ];

  const visiblePlansOptions = [
    { value: 'all', label: 'All Plans' },
    { value: 'Rookie', label: 'Rookie' },
    { value: 'Skilled', label: 'Skilled' },
    { value: 'Master', label: 'Master' },
  ];

  // Basic info handlers
  const handleBasicInfoChange = React.useCallback((field, value) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Plants handlers
  const handlePlantChange = React.useCallback((id, field, value) => {
    setPlants(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  const addPlant = React.useCallback(() => {
    setPlants(prev => [
      ...prev, 
      { id: Math.max(...prev.map(item => item.id), 0) + 1, title: '', image: '', description: '' }
    ]);
  }, []);

  const removePlant = React.useCallback((id) => {
    setPlants(prev => prev.filter(item => item.id !== id));
  }, []);

  const validateStep = (step) => {
    switch (step) {
      case 0: // Basic Information
        if (!basicInfo.title.trim()) {
          toast({
            title: 'Error',
            description: 'Title is required',
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
      case 1: // Plants
        if (plants.length === 0 || !plants[0].title.trim()) {
          toast({
            title: 'Error',
            description: 'At least one plant is required',
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
        plants,
      };

      // In a real app, you would call your API here
      // const response = await api.post('/articles', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Success',
        description: 'Article added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Navigate back to articles list
      navigate('/admin/articles');
      
    } catch (error) {
      console.error('Failed to add article:', error);
      toast({
        title: 'Error',
        description: 'Failed to add article. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/articles');
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Basic Information</Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <FormControl>
                <FormLabel color={textColor}>Article Image URL</FormLabel>
                <Input
                  value={basicInfo.image}
                  onChange={(e) => handleBasicInfoChange('image', e.target.value)}
                  placeholder="Enter image URL"
                />
              </FormControl>

              <FormControl>
                <FormLabel color={textColor}>Visible to Plans</FormLabel>
                <Select
                  value={basicInfo.visiblePlans}
                  onChange={(e) => handleBasicInfoChange('visiblePlans', e.target.value)}
                >
                  {visiblePlansOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

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

              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color={textColor}>Title</FormLabel>
                  <Input
                    value={basicInfo.title}
                    onChange={(e) => handleBasicInfoChange('title', e.target.value)}
                    placeholder="Enter article title"
                  />
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color={textColor}>Description</FormLabel>
                  <Textarea
                    value={basicInfo.description}
                    onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                    placeholder="Enter article description"
                    rows={4}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Plants List</Heading>
            <Flex justify="space-between" align="center" mb={4}>
              <Text color={textColor} fontSize="sm">Add plants mentioned in this article</Text>
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={addPlant}
              >
                Add Plant
              </Button>
            </Flex>
            <VStack spacing={4} align="stretch">
              {plants.map((item) => (
                <Box key={item.id} p={4} border="1px" borderColor={borderColor} borderRadius="lg">
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontWeight="medium" color={textColor}>
                      Plant {item.id}
                    </Text>
                    <IconButton
                      aria-label="Remove plant"
                      icon={<CloseIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removePlant(item.id)}
                      isDisabled={plants.length === 1}
                    />
                  </Flex>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Title</FormLabel>
                      <Input
                        value={item.title}
                        onChange={(e) => handlePlantChange(item.id, 'title', e.target.value)}
                        placeholder="Enter plant title"
                        size="sm"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Image</FormLabel>
                      <Input
                        value={item.image}
                        onChange={(e) => handlePlantChange(item.id, 'image', e.target.value)}
                        placeholder="Enter image URL"
                        size="sm"
                      />
                    </FormControl>
                    <GridItem colSpan={2}>
                      <FormControl>
                        <FormLabel fontSize="sm" color={textColor}>Description</FormLabel>
                        <Textarea
                          value={item.description}
                          onChange={(e) => handlePlantChange(item.id, 'description', e.target.value)}
                          placeholder="Enter plant description"
                          size="sm"
                          rows={2}
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
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
            <Heading size="lg" color={textColor}>Add New Article</Heading>
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
                      isLoading={isSubmitting}
                      loadingText="Adding Article"
                    >
                      Add Article
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

export default AddArticle;
