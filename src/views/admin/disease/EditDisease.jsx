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
import { useNavigate, useParams } from 'react-router-dom';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { FaImage, FaUpload } from 'react-icons/fa';
import { useUploadImageMutation } from 'api/fileUploadSlice';
import { useGetDiseaseQuery, useUpdateDiseaseMutation } from 'api/diseasesSlice';

const EditDisease = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const inputBg = useColorModeValue('white', 'gray.700');

  // API hooks
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [updateDisease, { isLoading: isUpdating }] = useUpdateDiseaseMutation();
  
  // Get disease data
  const { data: diseaseResponse, isLoading: isLoadingDisease, error } = useGetDiseaseQuery(id);

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
    image: '',
    description: '',
    status: 'active',
  });

  // Image upload states
  const [imagePreview, setImagePreview] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);

  const [symptoms, setSymptoms] = React.useState([
    { id: 1, name: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' },
  ];

  // Load disease data when it's fetched
  React.useEffect(() => {
    if (diseaseResponse?.data) {
      const disease = diseaseResponse.data;
      setBasicInfo({
        name: disease.name || '',
        image: disease.image || '',
        description: disease.description || '',
        status: disease.status || 'active',
      });
      
      // Set symptoms
      if (disease.symptoms && disease.symptoms.length > 0) {
        const symptomsData = disease.symptoms.map((symptom, index) => ({
          id: index + 1,
          name: symptom
        }));
        setSymptoms(symptomsData);
      } else {
        setSymptoms([{ id: 1, name: '' }]);
      }
    }
  }, [diseaseResponse]);

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

  // Image upload functions (matching AddRemedy pattern)
  const handleImageUpload = (files) => {
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

      handleImageUploadToServer(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleImageUpload(files);
  };

  const handleImageUploadToServer = async (file) => {
    try {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setIsUploadingImage(true);
      
      // Add a small delay to ensure state is set before upload starts
      await new Promise(resolve => setTimeout(resolve, 100));

      // Add a minimum loading time to make the loading state more visible
      const uploadStartTime = Date.now();
      const response = await uploadImage(file).unwrap();
      const uploadTime = Date.now() - uploadStartTime;
      
      // Ensure loading state is visible for at least 1 second
      if (uploadTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - uploadTime));
      }
      
      if (response.success && response.url) {
        setBasicInfo(prev => ({
          ...prev,
          image: response.url
        }));

        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      setImagePreview(null);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to upload image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setBasicInfo(prev => ({
      ...prev,
      image: ''
    }));
  };

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
        if (!basicInfo.image.trim()) {
          toast({
            title: 'Error',
            description: 'Please upload an image for the disease',
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

      // Update disease using API
      await updateDisease({ id, disease: formData }).unwrap();

      toast({
        title: 'Success',
        description: 'Disease updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Navigate back to diseases list
      navigate('/admin/disease');
      
    } catch (error) {
      console.error('Failed to update disease:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to update disease. Please try again.',
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

  // Loading state while fetching disease data
  if (isLoadingDisease) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Flex justify="center" align="center" h="200px">
              <VStack spacing={4}>
                <Spinner size="xl" color="blue.500" />
                <Text color={textColor}>Loading disease data...</Text>
              </VStack>
            </Flex>
          </Box>
        </Card>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Flex justify="center" align="center" h="200px">
              <VStack spacing={4}>
                <Text color="red.500" fontSize="lg">Error loading disease</Text>
                <Text color="gray.500">{error.data?.message || 'Failed to load disease data'}</Text>
                <Button onClick={handleCancel} colorScheme="blue">
                  Back to Diseases
                </Button>
              </VStack>
            </Flex>
          </Box>
        </Card>
      </Box>
    );
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Basic Information</Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color={textColor}>Disease Image</FormLabel>
                  <Box
                    border="1px dashed"
                    borderColor={isDragging ? 'brand.500' : 'gray.300'}
                    borderRadius="md"
                    p={4}
                    textAlign="center"
                    backgroundColor={isDragging ? 'brand.50' : inputBg}
                    cursor="pointer"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    mb={4}
                    position="relative"
                  >
                    {imagePreview || basicInfo.image ? (
                      <Flex direction="column" align="center">
                        <Image
                          src={imagePreview || basicInfo.image}
                          alt="Disease Image"
                          maxH="200px"
                          mb={2}
                          borderRadius="md"
                          fallback={<Icon as={FaImage} color="gray.500" boxSize="100px" />}
                        />
                        <Button
                          variant="outline"
                          colorScheme="red"
                          size="sm"
                          onClick={clearImage}
                        >
                          Remove Image
                        </Button>
                      </Flex>
                    ) : (
                      <>
                        {isUploadingImage && (
                          <Box
                            position="absolute"
                            top="0"
                            left="0"
                            right="0"
                            bottom="0"
                            backgroundColor="rgba(0, 0, 0, 0.9)"
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
                        {isUploadingImage ? (
                          <VStack spacing="2">
                            <Spinner size="lg" color="#422afb" thickness="6px" speed="0.6s" />
                            <Text color="#422afb" fontSize="sm" fontWeight="bold">Uploading...</Text>
                            <Text color="#422afb" fontSize="xs" opacity="0.8">Please wait</Text>
                          </VStack>
                        ) : (
                          <>
                            <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
                            <Text color="gray.500" mb={2}>
                              Drag & Drop Image Here
                            </Text>
                            <Text color="gray.500" mb={2}>
                              or
                            </Text>
                          </>
                        )}
                        <Button
                          variant="outline"
                          border="none"
                          onClick={() => document.getElementById('image-upload').click()}
                          isLoading={isUploadingImage}
                          loadingText="Uploading..."
                          leftIcon={isUploadingImage ? <Spinner size="sm" color="white" /> : undefined}
                          disabled={isUploadingImage}
                          _disabled={{
                            opacity: 0.6,
                            cursor: 'not-allowed'
                          }}
                          bg={isUploadingImage ? "blue.500" : "transparent"}
                          color={isUploadingImage ? "white" : "#422afb"}
                        >
                          {isUploadingImage ? '🔄 Uploading...' : 'Upload Image'}
                          <input
                            type="file"
                            id="image-upload"
                            hidden
                            accept="image/*"
                            onChange={handleFileInputChange}
                            disabled={isUploadingImage}
                          />
                        </Button>
                      </>
                    )}
                  </Box>
                </FormControl>
              </GridItem>

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
            <Heading size="lg" color={textColor}>Edit Disease</Heading>
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
                      isLoading={isSubmitting || isUpdating}
                      loadingText="Updating Disease"
                    >
                      Update Disease
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

export default EditDisease;
