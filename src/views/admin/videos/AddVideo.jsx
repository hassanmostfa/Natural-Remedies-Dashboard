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

const AddVideo = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const steps = [
    { title: 'Basic Information' },
    { title: 'Ingredients' },
    { title: 'Instructions' },
    { title: 'Benefits & Uses' },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Separate state for each section to prevent re-renders
  const [basicInfo, setBasicInfo] = React.useState({
    image: '',
    videoLink: '',
    title: '',
    description: '',
    status: 'active',
  });

  const [ingredients, setIngredients] = React.useState([
    { id: 1, name: '', image: '' }
  ]);

  const [instructions, setInstructions] = React.useState([
    { id: 1, title: '', image: '' }
  ]);

  const [benefits, setBenefits] = React.useState([
    { id: 1, title: '', image: '' }
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

  // Ingredients handlers
  const handleIngredientChange = React.useCallback((id, field, value) => {
    setIngredients(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  const addIngredient = React.useCallback(() => {
    setIngredients(prev => [
      ...prev, 
      { id: Math.max(...prev.map(item => item.id), 0) + 1, name: '', image: '' }
    ]);
  }, []);

  const removeIngredient = React.useCallback((id) => {
    setIngredients(prev => prev.filter(item => item.id !== id));
  }, []);

  // Instructions handlers
  const handleInstructionChange = React.useCallback((id, field, value) => {
    setInstructions(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  const addInstruction = React.useCallback(() => {
    setInstructions(prev => [
      ...prev, 
      { id: Math.max(...prev.map(item => item.id), 0) + 1, title: '', image: '' }
    ]);
  }, []);

  const removeInstruction = React.useCallback((id) => {
    setInstructions(prev => prev.filter(item => item.id !== id));
  }, []);

  // Benefits handlers
  const handleBenefitChange = React.useCallback((id, field, value) => {
    setBenefits(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  const addBenefit = React.useCallback(() => {
    setBenefits(prev => [
      ...prev, 
      { id: Math.max(...prev.map(item => item.id), 0) + 1, title: '', image: '' }
    ]);
  }, []);

  const removeBenefit = React.useCallback((id) => {
    setBenefits(prev => prev.filter(item => item.id !== id));
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
        if (!basicInfo.videoLink.trim()) {
          toast({
            title: 'Error',
            description: 'Video link is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        return true;
      case 1: // Ingredients
        if (ingredients.length === 0 || !ingredients[0].name.trim()) {
          toast({
            title: 'Error',
            description: 'At least one ingredient is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        return true;
      case 2: // Instructions
        if (instructions.length === 0 || !instructions[0].title.trim()) {
          toast({
            title: 'Error',
            description: 'At least one instruction is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        return true;
      case 3: // Benefits
        if (benefits.length === 0 || !benefits[0].title.trim()) {
          toast({
            title: 'Error',
            description: 'At least one benefit is required',
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
        ingredients,
        instructions,
        benefits,
      };

      // In a real app, you would call your API here
      // const response = await api.post('/videos', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Success',
        description: 'Video added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Navigate back to videos list
      navigate('/admin/videos');
      
    } catch (error) {
      console.error('Failed to add video:', error);
      toast({
        title: 'Error',
        description: 'Failed to add video. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/videos');
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Basic Information</Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <FormControl>
                <FormLabel color={textColor}>Video Image URL</FormLabel>
                <Input
                  value={basicInfo.image}
                  onChange={(e) => handleBasicInfoChange('image', e.target.value)}
                  placeholder="Enter image URL"
                />
              </FormControl>

              <FormControl>
                <FormLabel color={textColor}>Video Link</FormLabel>
                <Input
                  value={basicInfo.videoLink}
                  onChange={(e) => handleBasicInfoChange('videoLink', e.target.value)}
                  placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                />
              </FormControl>

              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color={textColor}>Title</FormLabel>
                  <Input
                    value={basicInfo.title}
                    onChange={(e) => handleBasicInfoChange('title', e.target.value)}
                    placeholder="Enter video title"
                  />
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color={textColor}>Description</FormLabel>
                  <Textarea
                    value={basicInfo.description}
                    onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                    placeholder="Enter video description"
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
            <Heading size="md" color={textColor} mb={4}>Ingredients</Heading>
            <Flex justify="space-between" align="center" mb={4}>
              <Text color={textColor} fontSize="sm">Add ingredients for this video</Text>
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={addIngredient}
              >
                Add Ingredient
              </Button>
            </Flex>
            <VStack spacing={4} align="stretch">
              {ingredients.map((item) => (
                <Box key={item.id} p={4} border="1px" borderColor={borderColor} borderRadius="lg">
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontWeight="medium" color={textColor}>
                      Ingredient {item.id}
                    </Text>
                    <IconButton
                      aria-label="Remove ingredient"
                      icon={<CloseIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removeIngredient(item.id)}
                      isDisabled={ingredients.length === 1}
                    />
                  </Flex>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Name</FormLabel>
                      <Input
                        value={item.name}
                        onChange={(e) => handleIngredientChange(item.id, 'name', e.target.value)}
                        placeholder="Enter ingredient name"
                        size="sm"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Image</FormLabel>
                      <Input
                        value={item.image}
                        onChange={(e) => handleIngredientChange(item.id, 'image', e.target.value)}
                        placeholder="Enter image URL"
                        size="sm"
                      />
                    </FormControl>
                  </Grid>
                </Box>
              ))}
            </VStack>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Instructions</Heading>
            <Flex justify="space-between" align="center" mb={4}>
              <Text color={textColor} fontSize="sm">Add step-by-step instructions</Text>
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={addInstruction}
              >
                Add Instruction
              </Button>
            </Flex>
            <VStack spacing={4} align="stretch">
              {instructions.map((item) => (
                <Box key={item.id} p={4} border="1px" borderColor={borderColor} borderRadius="lg">
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontWeight="medium" color={textColor}>
                      Step {item.id}
                    </Text>
                    <IconButton
                      aria-label="Remove instruction"
                      icon={<CloseIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removeInstruction(item.id)}
                      isDisabled={instructions.length === 1}
                    />
                  </Flex>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Title</FormLabel>
                      <Input
                        value={item.title}
                        onChange={(e) => handleInstructionChange(item.id, 'title', e.target.value)}
                        placeholder="Enter instruction title"
                        size="sm"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Image</FormLabel>
                      <Input
                        value={item.image}
                        onChange={(e) => handleInstructionChange(item.id, 'image', e.target.value)}
                        placeholder="Enter image URL"
                        size="sm"
                      />
                    </FormControl>
                  </Grid>
                </Box>
              ))}
            </VStack>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Benefits & Uses</Heading>
            <Flex justify="space-between" align="center" mb={4}>
              <Text color={textColor} fontSize="sm">Add benefits and uses of this video</Text>
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={addBenefit}
              >
                Add Benefit
              </Button>
            </Flex>
            <VStack spacing={4} align="stretch">
              {benefits.map((item) => (
                <Box key={item.id} p={4} border="1px" borderColor={borderColor} borderRadius="lg">
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontWeight="medium" color={textColor}>
                      Benefit {item.id}
                    </Text>
                    <IconButton
                      aria-label="Remove benefit"
                      icon={<CloseIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removeBenefit(item.id)}
                      isDisabled={benefits.length === 1}
                    />
                  </Flex>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Title</FormLabel>
                      <Input
                        value={item.title}
                        onChange={(e) => handleBenefitChange(item.id, 'title', e.target.value)}
                        placeholder="Enter benefit title"
                        size="sm"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Image</FormLabel>
                      <Input
                        value={item.image}
                        onChange={(e) => handleBenefitChange(item.id, 'image', e.target.value)}
                        placeholder="Enter image URL"
                        size="sm"
                      />
                    </FormControl>
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
            <Heading size="lg" color={textColor}>Add New Video</Heading>
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
                      loadingText="Adding Video"
                    >
                      Add Video
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

export default AddVideo;
