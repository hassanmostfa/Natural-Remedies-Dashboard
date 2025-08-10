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
  Icon,
  Spinner,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { useNavigate } from 'react-router-dom';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { FaUpload, FaLeaf } from 'react-icons/fa';
import { useUploadImageMutation } from 'api/fileUploadSlice';
import { useCreateVideoMutation } from 'api/videosSlice';

const AddVideo = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [uploadImage] = useUploadImageMutation();
  const [createVideo] = useCreateVideoMutation();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const cardBg = useColorModeValue('white', 'navy.700');

  // Memoize the color values
  const memoizedColors = React.useMemo(() => ({
    textColor,
    borderColor,
    inputBg,
    cardBg
  }), [textColor, borderColor, inputBg, cardBg]);

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

  // State for each section
  const [basicInfo, setBasicInfo] = React.useState({
    image: '',
    videoLink: '',
    title: '',
    description: '',
    visiblePlans: 'all',
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
  const [uploading, setUploading] = React.useState({
    mainImage: false,
    ingredients: [],
    instructions: [],
    benefits: [],
  });

  const [imagePreviews, setImagePreviews] = React.useState({
    mainImage: null,
    ingredients: [],
    instructions: [],
    benefits: [],
  });

  // Add drag and drop state
  const [isDragging, setIsDragging] = React.useState({
    mainImage: false,
    ingredients: [],
    instructions: [],
    benefits: [],
  });

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
    setUploading(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, false]
    }));
    setImagePreviews(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, null]
    }));
    setIsDragging(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, false]
    }));
  }, []);

  const removeIngredient = React.useCallback((id) => {
    const index = ingredients.findIndex(item => item.id === id);
    setIngredients(prev => prev.filter(item => item.id !== id));
    setUploading(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
    setIsDragging(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  }, [ingredients]);

  // Instructions handlers
  const handleInstructionChange = React.useCallback((id, field, value) => {
    setInstructions(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  // Create stable input handlers for instructions
  const createInstructionInputHandler = React.useCallback((id, field) => {
    return (e) => {
      handleInstructionChange(id, field, e.target.value);
    };
  }, [handleInstructionChange]);

  const addInstruction = React.useCallback(() => {
    setInstructions(prev => [
      ...prev, 
      { id: Math.max(...prev.map(item => item.id), 0) + 1, title: '', image: '' }
    ]);
    setUploading(prev => ({
      ...prev,
      instructions: [...prev.instructions, false]
    }));
    setImagePreviews(prev => ({
      ...prev,
      instructions: [...prev.instructions, null]
    }));
    setIsDragging(prev => ({
      ...prev,
      instructions: [...prev.instructions, false]
    }));
  }, []);

  const removeInstruction = React.useCallback((id) => {
    const index = instructions.findIndex(item => item.id === id);
    setInstructions(prev => prev.filter(item => item.id !== id));
    setUploading(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
    setIsDragging(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  }, [instructions]);

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
    setUploading(prev => ({
      ...prev,
      benefits: [...prev.benefits, false]
    }));
    setImagePreviews(prev => ({
      ...prev,
      benefits: [...prev.benefits, null]
    }));
    setIsDragging(prev => ({
      ...prev,
      benefits: [...prev.benefits, false]
    }));
  }, []);

  const removeBenefit = React.useCallback((id) => {
    const index = benefits.findIndex(item => item.id === id);
    setBenefits(prev => prev.filter(item => item.id !== id));
    setUploading(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
    setIsDragging(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  }, [benefits]);

  // Drag and drop handlers
  const handleDragOver = React.useCallback((e, field, index = null) => {
    e.preventDefault();
    if (index !== null) {
      setIsDragging(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? true : item)
      }));
    } else {
      setIsDragging(prev => ({ ...prev, [field]: true }));
    }
  }, []);

  const handleDragLeave = React.useCallback((field, index = null) => {
    if (index !== null) {
      setIsDragging(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? false : item)
      }));
    } else {
      setIsDragging(prev => ({ ...prev, [field]: false }));
    }
  }, []);

  const handleDrop = React.useCallback((e, field, index = null) => {
    e.preventDefault();
    if (index !== null) {
      setIsDragging(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? false : item)
      }));
    } else {
      setIsDragging(prev => ({ ...prev, [field]: false }));
    }
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange({ target: { files } }, field, index);
    }
  }, []);

  // Image upload handler
  const handleImageUpload = async (file, field, index = null) => {
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Set preview and uploading state
      if (index !== null) {
        setImagePreviews(prev => ({
          ...prev,
          [field]: prev[field].map((item, i) => i === index ? previewUrl : item)
        }));
        setUploading(prev => ({
          ...prev,
          [field]: prev[field].map((item, i) => i === index ? true : item)
        }));
      } else {
        setImagePreviews(prev => ({ ...prev, [field]: previewUrl }));
        setUploading(prev => ({ ...prev, [field]: true }));
      }
  
      const formData = new FormData();
      formData.append("image", file);
  
      const response = await uploadImage(file).unwrap();
      if (response.success && response.url) {
        // Update the corresponding field with the URL
        if (index !== null) {
          if (field === 'ingredients') {
            handleIngredientChange(ingredients[index].id, 'image', response.url);
          } else if (field === 'instructions') {
            handleInstructionChange(instructions[index].id, 'image', response.url);
          } else if (field === 'benefits') {
            handleBenefitChange(benefits[index].id, 'image', response.url);
          }
        } else {
          handleBasicInfoChange('image', response.url);
        }
  
        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      // Reset uploading state
      if (index !== null) {
        setUploading(prev => ({
          ...prev,
          [field]: prev[field].map((item, i) => i === index ? false : item)
        }));
      } else {
        setUploading(prev => ({ ...prev, [field]: false }));
      }
    }
  };

  const handleFileChange = (e, field, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: 'Error',
        description: 'Please select an image file (JPEG, PNG, etc.)',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Check file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size should be less than 5MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    handleImageUpload(file, field, index);
  };

  // Remove image handler
  const handleRemoveImage = React.useCallback((field, index = null) => {
    if (index !== null) {
      if (field === 'ingredients') {
        handleIngredientChange(ingredients[index].id, 'image', '');
      } else if (field === 'instructions') {
        handleInstructionChange(instructions[index].id, 'image', '');
      } else if (field === 'benefits') {
        handleBenefitChange(benefits[index].id, 'image', '');
      }
      setImagePreviews(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? null : item)
      }));
    } else {
      handleBasicInfoChange('image', '');
      setImagePreviews(prev => ({ ...prev, [field]: null }));
    }
  }, [ingredients, instructions, benefits, handleIngredientChange, handleInstructionChange, handleBenefitChange, handleBasicInfoChange]);

  // Clean up preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      Object.values(imagePreviews).forEach(previews => {
        if (Array.isArray(previews)) {
          previews.forEach(url => url && URL.revokeObjectURL(url));
        } else if (previews) {
          URL.revokeObjectURL(previews);
        }
      });
    };
  }, [imagePreviews]);

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

      // Call the API mutation
      await createVideo(formData).unwrap();

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
        description: error.data?.message || 'Failed to add video. Please try again.',
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
            <Heading size="md" color={memoizedColors.textColor} mb={4}>Basic Information</Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <FormControl>
                <FormLabel color={memoizedColors.textColor} fontWeight="600">Video Image</FormLabel>
                <Box
                  border="1px dashed"
                  borderColor={isDragging.mainImage ? 'brand.500' : 'gray.300'}
                  borderRadius="md"
                  p={3}
                  textAlign="center"
                  backgroundColor={isDragging.mainImage ? 'brand.50' : memoizedColors.inputBg}
                  cursor="pointer"
                  onDragOver={(e) => handleDragOver(e, 'mainImage')}
                  onDragLeave={() => handleDragLeave('mainImage')}
                  onDrop={(e) => handleDrop(e, 'mainImage')}
                  minH="120px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                >
                  {(imagePreviews.mainImage || basicInfo.image) ? (
                    <Flex direction="column" align="center">
                      <Image
                        src={imagePreviews.mainImage || basicInfo.image}
                        alt="Video Image"
                        w="100%"
                        maxH="80px"
                        mb={2}
                        borderRadius="md"
                        fallback={<Icon as={FaLeaf} color="green.500" boxSize="40px" />}
                      />
                      <Button
                        variant="outline"
                        colorScheme="red"
                        size="xs"
                        onClick={() => handleRemoveImage('mainImage')}
                      >
                        Remove
                      </Button>
                    </Flex>
                  ) : (
                    <>
                      {uploading.mainImage && (
                        <Box
                          position="absolute"
                          top="0"
                          left="0"
                          right="0"
                          bottom="0"
                          backgroundColor="rgba(0, 0, 0, 0.7)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="md"
                          zIndex="10"
                          backdropFilter="blur(2px)"
                        >
                          <VStack spacing="3">
                            <Spinner size="lg" color="white" thickness="4px" />
                            <Text color="white" fontSize="sm" fontWeight="bold">Uploading...</Text>
                            <Text color="white" fontSize="xs" opacity="0.8">Please wait</Text>
                          </VStack>
                        </Box>
                      )}
                      <Icon as={FaUpload} w={6} h={6} color="#422afb" mb={2} />
                      <Text color="gray.500" fontSize="xs" mb={2}>
                        Drag & Drop
                      </Text>
                      <Button
                        variant="outline"
                        color="#422afb"
                        border="none"
                        size="xs"
                        onClick={() => document.getElementById('main-image-file-input').click()}
                        isLoading={uploading.mainImage}
                        loadingText="Uploading..."
                        leftIcon={uploading.mainImage ? <Spinner size="xs" /> : undefined}
                      >
                        {uploading.mainImage ? 'Uploading...' : 'Upload'}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'mainImage')}
                          display="none"
                          id="main-image-file-input"
                        />
                      </Button>
                    </>
                  )}
                </Box>
              </FormControl>

              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color={memoizedColors.textColor} fontWeight="600">Title</FormLabel>
                  <Input
                    value={basicInfo.title}
                    onChange={(e) => handleBasicInfoChange('title', e.target.value)}
                    placeholder="Enter video title"
                    bg={memoizedColors.cardBg}
                    border="1px solid"
                    borderColor={memoizedColors.borderColor}
                    borderRadius="lg"
                  />
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color={memoizedColors.textColor} fontWeight="600">Video Link</FormLabel>
                  <Input
                    value={basicInfo.videoLink}
                    onChange={(e) => handleBasicInfoChange('videoLink', e.target.value)}
                    placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                    bg={memoizedColors.cardBg}
                    border="1px solid"
                    borderColor={memoizedColors.borderColor}
                    borderRadius="lg"
                  />
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color={memoizedColors.textColor} fontWeight="600">Description</FormLabel>
                  <Textarea
                    value={basicInfo.description}
                    onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                    placeholder="Enter video description"
                    rows={4}
                    bg={memoizedColors.cardBg}
                    border="1px solid"
                    borderColor={memoizedColors.borderColor}
                    borderRadius="lg"
                  />
                </FormControl>
              </GridItem>

              <FormControl>
                <FormLabel color={memoizedColors.textColor} fontWeight="600">Visible to Plans</FormLabel>
                <Select
                  value={basicInfo.visiblePlans}
                  onChange={(e) => handleBasicInfoChange('visiblePlans', e.target.value)}
                  bg={memoizedColors.cardBg}
                  border="1px solid"
                  borderColor={memoizedColors.borderColor}
                  borderRadius="lg"
                >
                  {visiblePlansOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel color={memoizedColors.textColor} fontWeight="600">Status</FormLabel>
                <Select
                  value={basicInfo.status}
                  onChange={(e) => handleBasicInfoChange('status', e.target.value)}
                  bg={memoizedColors.cardBg}
                  border="1px solid"
                  borderColor={memoizedColors.borderColor}
                  borderRadius="lg"
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
            <Heading size="md" color={memoizedColors.textColor} mb={4}>Ingredients</Heading>
            <Flex justify="space-between" align="center" mb={4}>
              <Text color={memoizedColors.textColor} fontSize="sm">Add ingredients for this video</Text>
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={addIngredient}
                borderRadius="70px"
                px="24px"
                py="5px"
                _hover={{
                  bg: memoizedColors.inputBg,
                }}
              >
                Add Ingredient
              </Button>
            </Flex>
            <VStack spacing={4} align="stretch">
              {ingredients.map((item, index) => (
                <Box
                  key={item.id}
                  p={4}
                  border="1px"
                  borderColor={memoizedColors.borderColor}
                  borderRadius="lg"
                  bg={memoizedColors.cardBg}
                  onDragOver={(e) => handleDragOver(e, 'ingredients', index)}
                  onDragLeave={() => handleDragLeave('ingredients', index)}
                  onDrop={(e) => handleDrop(e, 'ingredients', index)}
                  opacity={isDragging.ingredients[index] ? 0.5 : 1}
                  transition="opacity 0.2s ease-in-out"
                >
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontWeight="600" color={memoizedColors.textColor}>
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
                      <FormLabel fontSize="sm" color={memoizedColors.textColor} fontWeight="600">Name</FormLabel>
                      <Input
                        value={item.name}
                        onChange={(e) => handleIngredientChange(item.id, 'name', e.target.value)}
                        placeholder="Enter ingredient name"
                        size="sm"
                        bg={memoizedColors.cardBg}
                        border="1px solid"
                        borderColor={memoizedColors.borderColor}
                        borderRadius="lg"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" color={memoizedColors.textColor} fontWeight="600">Image</FormLabel>
                      <Box
                        border="1px dashed"
                        borderColor={isDragging.ingredients[index] ? 'brand.500' : 'gray.300'}
                        borderRadius="md"
                        p={3}
                        textAlign="center"
                        backgroundColor={isDragging.ingredients[index] ? 'brand.50' : memoizedColors.inputBg}
                        cursor="pointer"
                        onDragOver={(e) => handleDragOver(e, 'ingredients', index)}
                        onDragLeave={() => handleDragLeave('ingredients', index)}
                        onDrop={(e) => handleDrop(e, 'ingredients', index)}
                        minH="120px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                      >
                        {(imagePreviews.ingredients[index] || item.image) ? (
                          <Flex direction="column" align="center">
                            <Image
                              src={imagePreviews.ingredients[index] || item.image}
                              alt="Ingredient Image"
                              maxH="80px"
                              mb={2}
                              borderRadius="md"
                              fallback={<Icon as={FaLeaf} color="green.500" boxSize="40px" />}
                            />
                            <Button
                              variant="outline"
                              colorScheme="red"
                              size="xs"
                              onClick={() => handleRemoveImage('ingredients', index)}
                            >
                              Remove
                            </Button>
                          </Flex>
                        ) : (
                          <>
                            {uploading.ingredients[index] && (
                              <Box
                                position="absolute"
                                top="0"
                                left="0"
                                right="0"
                                bottom="0"
                                backgroundColor="rgba(0, 0, 0, 0.7)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="md"
                                zIndex="10"
                                backdropFilter="blur(2px)"
                              >
                                <VStack spacing="3">
                                  <Spinner size="lg" color="white" thickness="4px" />
                                  <Text color="white" fontSize="sm" fontWeight="bold">Uploading...</Text>
                                  <Text color="white" fontSize="xs" opacity="0.8">Please wait</Text>
                                </VStack>
                              </Box>
                            )}
                            <Icon as={FaUpload} w={6} h={6} color="#422afb" mb={2} />
                            <Text color="gray.500" fontSize="xs" mb={2}>
                              Drag & Drop
                            </Text>
                            <Button
                              variant="outline"
                              color="#422afb"
                              border="none"
                              size="xs"
                              onClick={() => document.getElementById(`ingredient-${index}-file-input`).click()}
                              isLoading={uploading.ingredients[index]}
                              loadingText="Uploading..."
                              leftIcon={uploading.ingredients[index] ? <Spinner size="xs" /> : undefined}
                            >
                              {uploading.ingredients[index] ? 'Uploading...' : 'Upload'}
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'ingredients', index)}
                                display="none"
                                id={`ingredient-${index}-file-input`}
                              />
                            </Button>
                          </>
                        )}
                      </Box>
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
            <Heading size="md" color={memoizedColors.textColor} mb={4}>Instructions</Heading>
            <Flex justify="space-between" align="center" mb={4}>
              <Text color={memoizedColors.textColor} fontSize="sm">Add step-by-step instructions</Text>
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={addInstruction}
                borderRadius="70px"
                px="24px"
                py="5px"
                _hover={{
                  bg: memoizedColors.inputBg,
                }}
              >
                Add Instruction
              </Button>
            </Flex>
            <VStack spacing={4} align="stretch">
              {instructions.map((item, index) => (
                <Box
                  key={item.id}
                  p={4}
                  border="1px"
                  borderColor={memoizedColors.borderColor}
                  borderRadius="lg"
                  bg={memoizedColors.cardBg}
                  onDragOver={(e) => handleDragOver(e, 'instructions', index)}
                  onDragLeave={() => handleDragLeave('instructions', index)}
                  onDrop={(e) => handleDrop(e, 'instructions', index)}
                  opacity={isDragging.instructions[index] ? 0.5 : 1}
                  transition="opacity 0.2s ease-in-out"
                >
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontWeight="600" color={memoizedColors.textColor}>
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
                      <FormLabel fontSize="sm" color={memoizedColors.textColor} fontWeight="600">Title</FormLabel>
                      <Input
                        value={item.title}
                        onChange={(e) => handleInstructionChange(item.id, 'title', e.target.value)}
                        placeholder="Enter instruction title"
                        size="sm"
                        bg={memoizedColors.cardBg}
                        border="1px solid"
                        borderColor={memoizedColors.borderColor}
                        borderRadius="lg"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" color={memoizedColors.textColor} fontWeight="600">Image</FormLabel>
                      <Box
                        border="1px dashed"
                        borderColor={isDragging.instructions[index] ? 'brand.500' : 'gray.300'}
                        borderRadius="md"
                        p={3}
                        textAlign="center"
                        backgroundColor={isDragging.instructions[index] ? 'brand.50' : memoizedColors.inputBg}
                        cursor="pointer"
                        onDragOver={(e) => handleDragOver(e, 'instructions', index)}
                        onDragLeave={() => handleDragLeave('instructions', index)}
                        onDrop={(e) => handleDrop(e, 'instructions', index)}
                        minH="120px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                      >
                        {(imagePreviews.instructions[index] || item.image) ? (
                          <Flex direction="column" align="center">
                            <Image
                              src={imagePreviews.instructions[index] || item.image}
                              alt="Instruction Image"
                              maxH="80px"
                              mb={2}
                              borderRadius="md"
                              fallback={<Icon as={FaLeaf} color="green.500" boxSize="40px" />}
                            />
                            <Button
                              variant="outline"
                              colorScheme="red"
                              size="xs"
                              onClick={() => handleRemoveImage('instructions', index)}
                            >
                              Remove
                            </Button>
                          </Flex>
                        ) : (
                          <>
                            {uploading.instructions[index] && (
                              <Box
                                position="absolute"
                                top="0"
                                left="0"
                                right="0"
                                bottom="0"
                                backgroundColor="rgba(0, 0, 0, 0.7)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="md"
                                zIndex="10"
                                backdropFilter="blur(2px)"
                              >
                                <VStack spacing="3">
                                  <Spinner size="lg" color="white" thickness="4px" />
                                  <Text color="white" fontSize="sm" fontWeight="bold">Uploading...</Text>
                                  <Text color="white" fontSize="xs" opacity="0.8">Please wait</Text>
                                </VStack>
                              </Box>
                            )}
                            <Icon as={FaUpload} w={6} h={6} color="#422afb" mb={2} />
                            <Text color="gray.500" fontSize="xs" mb={2}>
                              Drag & Drop
                            </Text>
                            <Button
                              variant="outline"
                              color="#422afb"
                              border="none"
                              size="xs"
                              onClick={() => document.getElementById(`instruction-${index}-file-input`).click()}
                              isLoading={uploading.instructions[index]}
                              loadingText="Uploading..."
                              leftIcon={uploading.instructions[index] ? <Spinner size="xs" /> : undefined}
                            >
                              {uploading.instructions[index] ? 'Uploading...' : 'Upload'}
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'instructions', index)}
                                display="none"
                                id={`instruction-${index}-file-input`}
                              />
                            </Button>
                          </>
                        )}
                      </Box>
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
            <Heading size="md" color={memoizedColors.textColor} mb={4}>Benefits & Uses</Heading>
            <Flex justify="space-between" align="center" mb={4}>
              <Text color={memoizedColors.textColor} fontSize="sm">Add benefits and uses of this video</Text>
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={addBenefit}
                borderRadius="70px"
                px="24px"
                py="5px"
                _hover={{
                  bg: memoizedColors.inputBg,
                }}
              >
                Add Benefit
              </Button>
            </Flex>
            <VStack spacing={4} align="stretch">
              {benefits.map((item, index) => (
                <Box
                  key={item.id}
                  p={4}
                  border="1px"
                  borderColor={memoizedColors.borderColor}
                  borderRadius="lg"
                  bg={memoizedColors.cardBg}
                  onDragOver={(e) => handleDragOver(e, 'benefits', index)}
                  onDragLeave={() => handleDragLeave('benefits', index)}
                  onDrop={(e) => handleDrop(e, 'benefits', index)}
                  opacity={isDragging.benefits[index] ? 0.5 : 1}
                  transition="opacity 0.2s ease-in-out"
                >
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontWeight="600" color={memoizedColors.textColor}>
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
                      <FormLabel fontSize="sm" color={memoizedColors.textColor} fontWeight="600">Title</FormLabel>
                      <Input
                        value={item.title}
                        onChange={(e) => handleBenefitChange(item.id, 'title', e.target.value)}
                        placeholder="Enter benefit title"
                        size="sm"
                        bg={memoizedColors.cardBg}
                        border="1px solid"
                        borderColor={memoizedColors.borderColor}
                        borderRadius="lg"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" color={memoizedColors.textColor} fontWeight="600">Image</FormLabel>
                      <Box
                        border="1px dashed"
                        borderColor={isDragging.benefits[index] ? 'brand.500' : 'gray.300'}
                        borderRadius="md"
                        p={3}
                        textAlign="center"
                        backgroundColor={isDragging.benefits[index] ? 'brand.50' : memoizedColors.inputBg}
                        cursor="pointer"
                        onDragOver={(e) => handleDragOver(e, 'benefits', index)}
                        onDragLeave={() => handleDragLeave('benefits', index)}
                        onDrop={(e) => handleDrop(e, 'benefits', index)}
                        minH="120px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                      >
                        {(imagePreviews.benefits[index] || item.image) ? (
                          <Flex direction="column" align="center">
                            <Image
                              src={imagePreviews.benefits[index] || item.image}
                              alt="Benefit Image"
                              maxH="80px"
                              mb={2}
                              borderRadius="md"
                              fallback={<Icon as={FaLeaf} color="green.500" boxSize="40px" />}
                            />
                            <Button
                              variant="outline"
                              colorScheme="red"
                              size="xs"
                              onClick={() => handleRemoveImage('benefits', index)}
                            >
                              Remove
                            </Button>
                          </Flex>
                        ) : (
                          <>
                            {uploading.benefits[index] && (
                              <Box
                                position="absolute"
                                top="0"
                                left="0"
                                right="0"
                                bottom="0"
                                backgroundColor="rgba(0, 0, 0, 0.7)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="md"
                                zIndex="10"
                                backdropFilter="blur(2px)"
                              >
                                <VStack spacing="3">
                                  <Spinner size="lg" color="white" thickness="4px" />
                                  <Text color="white" fontSize="sm" fontWeight="bold">Uploading...</Text>
                                  <Text color="white" fontSize="xs" opacity="0.8">Please wait</Text>
                                </VStack>
                              </Box>
                            )}
                            <Icon as={FaUpload} w={6} h={6} color="#422afb" mb={2} />
                            <Text color="gray.500" fontSize="xs" mb={2}>
                              Drag & Drop
                            </Text>
                            <Button
                              variant="outline"
                              color="#422afb"
                              border="none"
                              size="xs"
                              onClick={() => document.getElementById(`benefit-${index}-file-input`).click()}
                              isLoading={uploading.benefits[index]}
                              loadingText="Uploading..."
                              leftIcon={uploading.benefits[index] ? <Spinner size="xs" /> : undefined}
                            >
                              {uploading.benefits[index] ? 'Uploading...' : 'Upload'}
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'benefits', index)}
                                display="none"
                                id={`benefit-${index}-file-input`}
                              />
                            </Button>
                          </>
                        )}
                      </Box>
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
    <Box mt="80px">
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex px="25px" mb="20px" justifyContent="space-between" align="center">
          <Text
            color={memoizedColors.textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Add New Video
          </Text>
        </Flex>
        
        <Box px="25px" pb="25px">
          <form onSubmit={(e) => e.preventDefault()}>
            <VStack spacing="8" align="stretch" w="100%">
              <Stepper index={activeStep} colorScheme="blue" size="sm">
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
                    </Box>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>

              <Box>
                {renderStepContent()}
              </Box>

              <Flex gap="4" pt="4" justify="space-between">
                <Button
                  type="button"
                  variant="outline"
                  color={memoizedColors.textColor}
                  fontSize="sm"
                  fontWeight="500"
                  borderRadius="70px"
                  px="24px"
                  py="5px"
                  onClick={handleCancel}
                  _hover={{
                    bg: memoizedColors.inputBg,
                  }}
                >
                  Cancel
                </Button>

                <HStack spacing="4">
                  {activeStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      color={memoizedColors.textColor}
                      fontSize="sm"
                      fontWeight="500"
                      borderRadius="70px"
                      px="24px"
                      py="5px"
                      onClick={prevStep}
                      _hover={{
                        bg: memoizedColors.inputBg,
                      }}
                    >
                      Previous
                    </Button>
                  )}

                  {activeStep < steps.length - 1 ? (
                    <Button
                      type="button"
                      variant="darkBrand"
                      color="white"
                      fontSize="sm"
                      fontWeight="500"
                      borderRadius="70px"
                      px="24px"
                      py="5px"
                      onClick={nextStep}
                      _hover={{
                        bg: 'blue.600',
                      }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="darkBrand"
                      color="white"
                      fontSize="sm"
                      fontWeight="500"
                      borderRadius="70px"
                      px="24px"
                      py="5px"
                      isLoading={isSubmitting}
                      loadingText="Adding Video"
                      onClick={handleSubmit}
                      _hover={{
                        bg: 'blue.600',
                      }}
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