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
  StepStatus,
  StepTitle,
  StepSeparator,
  useSteps,
  Grid,
  GridItem,
  Image,
  Icon,
  Spinner,
  Avatar,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { useNavigate } from 'react-router-dom';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { FaLeaf, FaUpload } from 'react-icons/fa6';
import { useCreateArticleMutation } from 'api/articlesSlice';
import { useUploadImageMutation } from 'api/fileUploadSlice';

const AddArticle = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const inputBg = useColorModeValue('white', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');

  // API mutations
  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();
  const [uploadImage] = useUploadImageMutation();

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
    plans: 'rookie', // Changed to single plan selection
    status: 'active',
  });

  const [plants, setPlants] = React.useState([
    { id: 1, title: '', image: '', description: '' }
  ]);

  // Image handling states
  const [isDragging, setIsDragging] = React.useState({
    main_image: false,
    plants: [false]
  });

  const [uploading, setUploading] = React.useState({
    main_image: false,
    plants: [false]
  });

  const [imagePreviews, setImagePreviews] = React.useState({
    main_image: null,
    plants: [null]
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Cleanup object URLs on unmount
  React.useEffect(() => {
    return () => {
      // Clean up object URLs to prevent memory leaks
      Object.values(imagePreviews).forEach(url => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      // Clean up plants array URLs
      imagePreviews.plants.forEach(url => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' },
  ];

  const planOptions = [
    { value: 'rookie', label: 'Rookie' },
    { value: 'skilled', label: 'Skilled' },
    { value: 'master', label: 'Master' },
  ];

  // Basic info handlers
  const handleBasicInfoChange = React.useCallback((field, value) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle plan selection changes
  const handlePlansChange = React.useCallback((selectedPlan) => {
    setBasicInfo(prev => ({
      ...prev,
      plans: selectedPlan
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

  // Update plant image field specifically
  const updatePlantImage = React.useCallback((plantIndex, imageUrl) => {
    setPlants(prev => 
      prev.map((item, index) => 
        index === plantIndex ? { ...item, image: imageUrl } : item
      )
    );
  }, []);

  // Image handling functions
  const handleImageUpload = (files, field, index = null) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      
      if (!selectedFile.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Please select an image file (JPEG, PNG, etc.)',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image size should be less than 5MB',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      handleImageUploadToServer(selectedFile, field, index);
    }
  };

  const handleDragOver = (e, field, index = null) => {
    e.preventDefault();
    if (index !== null) {
      setIsDragging(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? true : item)
      }));
    } else {
      setIsDragging(prev => ({ ...prev, [field]: true }));
    }
  };

  const handleDragLeave = (field, index = null) => {
    if (index !== null) {
      setIsDragging(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? false : item)
      }));
    } else {
      setIsDragging(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleDrop = (e, field, index = null) => {
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
    handleImageUpload(files, field, index);
  };

  const handleFileInputChange = (e, field, index = null) => {
    const files = e.target.files;
    handleImageUpload(files, field, index);
  };

  const handleImageUploadToServer = async (file, field, index = null) => {
    try {
      const previewUrl = URL.createObjectURL(file);
      
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

      const response = await uploadImage(file).unwrap();
      
      if (response.success && response.url) {
        if (index !== null) {
          updatePlantImage(index, response.url);
        } else {
          handleBasicInfoChange('image', response.url);
        }

        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
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

  const handleRemoveImage = (field, index = null) => {
    if (index !== null) {
      setImagePreviews(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? null : item)
      }));
      updatePlantImage(index, '');
    } else {
      setImagePreviews(prev => ({ ...prev, [field]: null }));
      handleBasicInfoChange('image', '');
    }
  };

  const addPlant = React.useCallback(() => {
    const newId = Math.max(...plants.map(item => item.id), 0) + 1;
    setPlants(prev => [
      ...prev, 
      { id: newId, title: '', image: '', description: '' }
    ]);
    setIsDragging(prev => ({ ...prev, plants: [...prev.plants, false] }));
    setUploading(prev => ({ ...prev, plants: [...prev.plants, false] }));
    setImagePreviews(prev => ({ ...prev, plants: [...prev.plants, null] }));
  }, [plants]);

  const removePlant = React.useCallback((id) => {
    const index = plants.findIndex(item => item.id === id);
    if (index !== -1) {
      setPlants(prev => prev.filter(item => item.id !== id));
      setIsDragging(prev => ({
        ...prev,
        plants: prev.plants.filter((_, i) => i !== index)
      }));
      setUploading(prev => ({
        ...prev,
        plants: prev.plants.filter((_, i) => i !== index)
      }));
      setImagePreviews(prev => ({
        ...prev,
        plants: prev.plants.filter((_, i) => i !== index)
      }));
    }
  }, [plants]);

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
        if (!basicInfo.image.trim()) {
          toast({
            title: 'Error',
            description: 'Article image is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        if (!basicInfo.plans) {
          toast({
            title: 'Error',
            description: 'A plan must be selected',
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
        // Check if all plants have required fields
        for (let i = 0; i < plants.length; i++) {
          const plant = plants[i];
          if (!plant.title.trim() || !plant.description.trim()) {
            toast({
              title: 'Error',
              description: `Plant ${i + 1} must have both title and description`,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            return false;
          }
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
      // Prepare the data for API submission
      const submissionData = {
        title: basicInfo.title,
        image: basicInfo.image,
        description: basicInfo.description,
        plans: basicInfo.plans, // Send as string, not array
        status: basicInfo.status,
        plants: plants.map(plant => ({
          title: plant.title,
          image: plant.image,
          description: plant.description
        }))
      };

      // Call the API to create the article
      const response = await createArticle(submissionData).unwrap();
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Article created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Navigate back to articles list
        navigate('/admin/articles');
      } else {
        throw new Error(response.message || 'Failed to create article');
      }
      
    } catch (error) {
      console.error('Failed to create article:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to create article. Please try again.',
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
                <FormLabel color={textColor}>Article Image</FormLabel>
                <Box
                  border="1px dashed"
                  borderColor={isDragging.main_image ? 'brand.500' : 'gray.300'}
                  borderRadius="md"
                  p={4}
                  textAlign="center"
                  backgroundColor={isDragging.main_image ? 'brand.50' : inputBg}
                  cursor="pointer"
                  onDragOver={(e) => handleDragOver(e, 'main_image')}
                  onDragLeave={() => handleDragLeave('main_image')}
                  onDrop={(e) => handleDrop(e, 'main_image')}
                  mb={4}
                  position="relative"
                >
                  {imagePreviews.main_image || basicInfo.image ? (
                    <Flex direction="column" align="center">
                      <Image
                        src={imagePreviews.main_image || basicInfo.image}
                        alt="Article Image"
                        maxH="200px"
                        mb={2}
                        borderRadius="md"
                        fallback={<Icon as={FaLeaf} color="green.500" boxSize="100px" />}
                      />
                      <Button
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleRemoveImage('main_image')}
                      >
                        Remove Image
                      </Button>
                    </Flex>
                  ) : (
                    <>
                      {uploading.main_image && (
                        <Box
                          position="absolute"
                          top="0"
                          left="0"
                          right="0"
                          bottom="0"
                          backgroundColor="rgba(0, 0, 0, 0.8)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="md"
                          zIndex="50"
                          backdropFilter="blur(5px)"
                          border="2px solid #422afb"
                        >
                          <VStack spacing="4">
                            <Spinner size="xl" color="white" thickness="8px" speed="0.6s" />
                            <Text color="white" fontSize="lg" fontWeight="bold">Uploading Image...</Text>
                            <Text color="white" fontSize="sm" opacity="0.9">Please wait while we upload your image</Text>
                          </VStack>
                        </Box>
                      )}
                      
                      {uploading.main_image ? (
                        <VStack spacing="3">
                          <Spinner size="lg" color="#422afb" thickness="6px" speed="0.6s" />
                          <Text color="#422afb" fontSize="md" fontWeight="bold">Uploading...</Text>
                          <Text color="#422afb" fontSize="sm" opacity="0.8">Please wait</Text>
                        </VStack>
                      ) : (
                        <>
                          <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={3} />
                          <Text color="gray.500" mb={2} fontSize="sm">
                            Drag & Drop Image Here
                          </Text>
                          <Text color="gray.500" mb={3} fontSize="sm">
                            or
                          </Text>
                        </>
                      )}
                      
                      <Button
                        variant="outline"
                        border="none"
                        onClick={() => document.getElementById('main-image-file-input').click()}
                        isLoading={uploading.main_image}
                        loadingText="Uploading..."
                        leftIcon={uploading.main_image ? <Spinner size="sm" color="white" /> : undefined}
                        disabled={uploading.main_image}
                        _disabled={{
                          opacity: 0.6,
                          cursor: 'not-allowed'
                        }}
                        bg={uploading.main_image ? "blue.500" : "transparent"}
                        color={uploading.main_image ? "white" : "#422afb"}
                        _hover={{
                          bg: uploading.main_image ? "blue.600" : "brand.50",
                          borderColor: "brand.400"
                        }}
                        transition="all 0.2s"
                      >
                        {uploading.main_image ? '🔄 Uploading...' : 'Upload Image'}
                        <input
                          type="file"
                          id="main-image-file-input"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleFileInputChange(e, 'main_image')}
                          disabled={uploading.main_image}
                        />
                      </Button>
                    </>
                  )}
                </Box>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>Visible to Plan</FormLabel>
                <Select
                  value={basicInfo.plans}
                  onChange={(e) => handlePlansChange(e.target.value)}
                  bg={inputBg}
                  color={textColor}
                  borderColor={borderColor}
                >
                  {planOptions.map(option => (
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
              {plants.map((item, index) => (
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
                      <Box
                        border="1px dashed"
                        borderColor={isDragging.plants[index] ? 'brand.500' : 'gray.300'}
                        borderRadius="md"
                        p={3}
                        textAlign="center"
                        backgroundColor={isDragging.plants[index] ? 'brand.50' : inputBg}
                        cursor="pointer"
                        onDragOver={(e) => handleDragOver(e, 'plants', index)}
                        onDragLeave={() => handleDragLeave('plants', index)}
                        onDrop={(e) => handleDrop(e, 'plants', index)}
                        position="relative"
                        minH="120px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        transition="all 0.2s"
                        _hover={{
                          borderColor: 'brand.400',
                          backgroundColor: isDragging.plants[index] ? 'brand.100' : 'gray.50'
                        }}
                      >
                        {imagePreviews.plants[index] || item.image ? (
                          <Flex direction="column" align="center">
                            <Image
                              src={imagePreviews.plants[index] || item.image}
                              alt={`Plant ${item.id} Image`}
                              maxH="100px"
                              mb={2}
                              borderRadius="md"
                              fallback={<Icon as={FaLeaf} color="green.500" boxSize="50px" />}
                            />
                            <Button
                              variant="outline"
                              colorScheme="red"
                              size="xs"
                              onClick={() => handleRemoveImage('plants', index)}
                            >
                              Remove
                            </Button>
                          </Flex>
                        ) : (
                          <>
                            {uploading.plants[index] && (
                              <Box
                                position="absolute"
                                top="0"
                                left="0"
                                right="0"
                                bottom="0"
                                backgroundColor="rgba(0, 0, 0, 0.8)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="md"
                                zIndex="50"
                                backdropFilter="blur(5px)"
                                border="2px solid #422afb"
                              >
                                <VStack spacing="3">
                                  <Spinner size="lg" color="white" thickness="6px" speed="0.6s" />
                                  <Text color="white" fontSize="sm" fontWeight="bold">Uploading Image...</Text>
                                  <Text color="white" fontSize="xs" opacity="0.9">Please wait</Text>
                                </VStack>
                              </Box>
                            )}
                            
                            {uploading.plants[index] ? (
                              <VStack spacing="2">
                                <Spinner size="md" color="#422afb" thickness="4px" speed="0.6s" />
                                <Text color="#422afb" fontSize="sm" fontWeight="bold">Uploading...</Text>
                              </VStack>
                            ) : (
                              <>
                                <Icon as={FaUpload} w={6} h={6} color="#422afb" mb={2} />
                                <Text color="gray.500" fontSize="xs" mb={2}>
                                  Drag & Drop Image
                                </Text>
                                <Text color="gray.500" fontSize="xs" mb={2}>
                                  or
                                </Text>
                                <Button
                                  variant="outline"
                                  size="xs"
                                  onClick={() => document.getElementById(`plant-image-file-input-${item.id}`).click()}
                                  isLoading={uploading.plants[index]}
                                  loadingText="Uploading..."
                                  disabled={uploading.plants[index]}
                                  _disabled={{
                                    opacity: 0.6,
                                    cursor: 'not-allowed'
                                  }}
                                  bg={uploading.plants[index] ? "blue.500" : "transparent"}
                                  color={uploading.plants[index] ? "white" : "#422afb"}
                                  _hover={{
                                    bg: uploading.plants[index] ? "blue.600" : "brand.50",
                                    borderColor: "brand.400"
                                  }}
                                >
                                  {uploading.plants[index] ? '🔄 Uploading...' : 'Upload Image'}
                                  <input
                                    type="file"
                                    id={`plant-image-file-input-${item.id}`}
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => handleFileInputChange(e, 'plants', index)}
                                    disabled={uploading.plants[index]}
                                  />
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </Box>
                    </FormControl>
                    <GridItem colSpan={2}>
                      <FormControl>
                        <FormLabel fontSize="sm" color={textColor}>Description</FormLabel>
                        <Textarea
                          value={item.description}
                          onChange={(e) => handlePlantChange(item.id, 'description', e.target.value)}
                          placeholder="Enter plant description"
                          size="sm"
                          rows={3}
                          resize="vertical"
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
                      isLoading={isSubmitting || isCreating}
                      loadingText="Creating Article"
                    >
                      Create Article
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
