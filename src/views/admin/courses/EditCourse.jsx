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
  Image,
  Avatar,
  Divider,
  Heading,
  Icon,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Grid,
  GridItem,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stepper,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { useNavigate, useParams } from 'react-router-dom';
import { AddIcon, CloseIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { FaPlay, FaUsers, FaClock, FaDollarSign, FaStar, FaBook, FaVideo, FaUpload } from 'react-icons/fa';
import { useGetCourseQuery, useUpdateCourseMutation } from 'api/coursesSlice';
import { useUploadImageMutation } from 'api/fileUploadSlice';
import { useGetInstructorsQuery } from 'api/instructorsSlice';
import { useGetRemediesQuery } from 'api/remediesSlice';

const EditCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorder = useColorModeValue('gray.300', 'gray.600');

  const steps = [
    { title: 'Basic Information' },
    { title: 'Course Overview' },
    { title: 'Course Content' },
    { title: 'Instructor Selection' },
    { title: 'Remedies Selection' },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [formData, setFormData] = React.useState({
    image: '',
    title: '',
    description: '',
    duration: '',
    sessionsNumber: 1,
    price: 0,
    plan: '',
    overview: '',
    courseContent: [{ title: '', image: '' }],
    instructor_ids: [],
    selectedRemedies: [],
    status: 'active',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // API hooks
  const { data: courseData, isLoading: isLoadingCourse, isError: isErrorCourse, error: courseError, refetch } = useGetCourseQuery(id);
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  
  // Pagination and search states for instructors and remedies
  const [instructorsPage, setInstructorsPage] = React.useState(1);
  const [remediesPage, setRemediesPage] = React.useState(1);
  const [instructorsPerPage, setInstructorsPerPage] = React.useState(1000); // Increased to show more
  const [remediesPerPage, setRemediesPerPage] = React.useState(1000); // Increased to show more
  const [instructorsSearch, setInstructorsSearch] = React.useState('');
  const [remediesSearch, setRemediesSearch] = React.useState('');
  
  const { data: instructorsResponse, isLoading: isLoadingInstructors } = useGetInstructorsQuery({
    page: instructorsPage,
    per_page: instructorsPerPage,
    search: instructorsSearch
  });
  const { data: remediesResponse, isLoading: isLoadingRemedies } = useGetRemediesQuery({
    page: remediesPage,
    per_page: remediesPerPage,
    search: remediesSearch
  });

  // Image upload states
  const [imagePreview, setImagePreview] = React.useState(null);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' },
  ];

  const planOptions = [
    { value: 'basic', label: 'Basic' },
    { value: 'pro', label: 'Pro' },
    { value: 'premium', label: 'Premium' },
  ];

  // Get instructors and remedies from API with pagination support
  const availableInstructors = React.useMemo(() => {
    if (!instructorsResponse?.data) return [];
    return instructorsResponse.data;
  }, [instructorsResponse?.data]);

  const availableRemedies = React.useMemo(() => {
    if (!remediesResponse?.data) return [];
    return remediesResponse.data;
  }, [remediesResponse?.data]);

  // Load course data when it's fetched
  React.useEffect(() => {
    if (courseData?.data) {
      const course = courseData.data;
      
      // Extract instructor IDs from instructors array
      const instructorIds = course.instructors ? course.instructors.map(instructor => instructor.id) : [];
      
      // Extract remedy IDs from remedies array
      const remedyIds = course.remedies ? course.remedies.map(remedy => remedy.id) : [];
      
      setFormData({
        image: course.image || '',
        title: course.title || '',
        description: course.description || '',
        duration: course.duration || '',
        sessionsNumber: course.sessionsNumber || 1,
        price: parseFloat(course.price) || 0,
        plan: course.plan || '',
        overview: course.overview || '',
        courseContent: course.courseContent && course.courseContent.length > 0 ? course.courseContent : [{ title: '', image: '' }],
        instructor_ids: instructorIds,
        selectedRemedies: remedyIds,
        status: course.status || 'active',
      });
      
      // Set image preview if course has an image
      if (course.image) {
        setImagePreview(course.image);
      }
    }
  }, [courseData]);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const handleInputChange = React.useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleListChange = React.useCallback((listName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  }, []);

  const addListItem = React.useCallback((listName, defaultItem = { image: '', name: '' }) => {
    setFormData(prev => ({
      ...prev,
      [listName]: [...prev[listName], defaultItem]
    }));
  }, []);

  const removeListItem = React.useCallback((listName, index) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }));
  }, []);

  const handleInstructorSelection = React.useCallback((instructorId) => {
    setFormData(prev => {
      const isSelected = prev.instructor_ids.includes(instructorId);
      if (isSelected) {
        return {
          ...prev,
          instructor_ids: prev.instructor_ids.filter(id => id !== instructorId)
        };
      } else {
        return {
          ...prev,
          instructor_ids: [...prev.instructor_ids, instructorId]
        };
      }
    });
  }, []);

  // Search handlers
  const handleInstructorsSearch = React.useCallback((searchTerm) => {
    setInstructorsSearch(searchTerm);
    setInstructorsPage(1); // Reset to first page when searching
  }, []);

  const handleRemediesSearch = React.useCallback((searchTerm) => {
    setRemediesSearch(searchTerm);
    setRemediesPage(1); // Reset to first page when searching
  }, []);

  // Pagination handlers
  const handleLoadMoreInstructors = React.useCallback(() => {
    if (instructorsResponse?.pagination?.has_more_pages) {
      setInstructorsPage(prev => prev + 1);
    }
  }, [instructorsResponse?.pagination?.has_more_pages]);

  const handleLoadMoreRemedies = React.useCallback(() => {
    if (remediesResponse?.pagination?.has_more_pages) {
      setRemediesPage(prev => prev + 1);
    }
  }, [remediesResponse?.pagination?.has_more_pages]);

  const validateStep = (step) => {
    switch (step) {
      case 0: // Basic Information
        if (!formData.title.trim()) {
          toast({
            title: 'Error',
            description: 'Title is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        if (!formData.description.trim()) {
          toast({
            title: 'Error',
            description: 'Description is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        if (!formData.duration.trim()) {
          toast({
            title: 'Error',
            description: 'Duration is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        if (!formData.plan) {
          toast({
            title: 'Error',
            description: 'Plan is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        return true;
      case 1: // Course Overview
        if (!formData.overview.trim()) {
          toast({
            title: 'Error',
            description: 'Overview is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        return true;
      case 2: // Course Content
        if (formData.courseContent.length === 0 || !formData.courseContent[0].title.trim()) {
          toast({
            title: 'Error',
            description: 'At least one course content item is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        return true;
      case 3: // Instructor Selection
        if (formData.instructor_ids.length === 0) {
          toast({
            title: 'Error',
            description: 'At least one instructor is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        return true;
      case 4: // Remedies Selection
        return true; // Optional step
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
      // Validate all steps
      for (let i = 0; i < steps.length; i++) {
        if (!validateStep(i)) {
          setActiveStep(i);
          return;
        }
      }

      // Prepare course data for API
      const courseUpdateData = {
        image: formData.image,
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        sessionsNumber: formData.sessionsNumber,
        price: formData.price,
        plan: formData.plan,
        overview: formData.overview,
        courseContent: formData.courseContent,
        instructor_ids: formData.instructor_ids,
        selectedRemedies: formData.selectedRemedies.map(remedy => remedy.toString()),
        status: formData.status,
      };

      // Call the API
      await updateCourse({ id, course: courseUpdateData }).unwrap();

      toast({
        title: 'Success',
        description: 'Course updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Navigate back to courses list
      navigate('/admin/courses');
      
    } catch (error) {
      console.error('Failed to update course:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to update course. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/courses');
  };

  // Image upload functions
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
      setSelectedFile(file);
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
        setFormData(prev => ({
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
      setSelectedFile(null);
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
    setSelectedFile(null);
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const ListItemInput = React.memo(({ listName, index, field, value, onChange, placeholder, textColor }) => {
    const handleChange = React.useCallback((e) => {
      onChange(index, field, e.target.value);
    }, [index, field, onChange]);

    // Hooks must be called unconditionally
    const [isUploadingContentImage, setIsUploadingContentImage] = React.useState(false);
    const [contentImagePreview, setContentImagePreview] = React.useState(null);

    // For image fields, use drag-and-drop upload with server upload
    if (field === 'image') {
      const handleContentImageUpload = async (file) => {
        try {
          const previewUrl = URL.createObjectURL(file);
          setContentImagePreview(previewUrl);
          setIsUploadingContentImage(true);
          
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
            onChange(index, field, response.url);
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
          setContentImagePreview(null);
          toast({
            title: 'Error',
            description: error.data?.message || 'Failed to upload image',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setIsUploadingContentImage(false);
        }
      };

      const handleContentImageDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
            handleContentImageUpload(file);
          } else {
            toast({
              title: 'Error',
              description: 'Please select a valid image file (max 5MB)',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        }
      };

      const handleContentFileInputChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
            handleContentImageUpload(file);
          } else {
            toast({
              title: 'Error',
              description: 'Please select a valid image file (max 5MB)',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        }
      };

      const clearContentImage = () => {
        setContentImagePreview(null);
        onChange(index, field, '');
      };

      return (
        <FormControl>
          <FormLabel fontSize="sm" color={textColor}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </FormLabel>
          <Box
            border="1px dashed"
            borderColor="gray.300"
            borderRadius="md"
            p={4}
            textAlign="center"
            backgroundColor="white"
            cursor="default"
            position="relative"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleContentImageDrop}
          >
            {(value || contentImagePreview) ? (
              <Flex direction="column" align="center">
                <Image
                  src={value || contentImagePreview}
                  alt="Preview"
                  maxH="120px"
                  mb={2}
                  borderRadius="md"
                  fallback={<Icon as={FaPlay} color="gray.500" boxSize="60px" />}
                />
                <Button
                  variant="outline"
                  colorScheme="red"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearContentImage();
                  }}
                >
                  Remove Image
                </Button>
              </Flex>
            ) : (
              <>
                {isUploadingContentImage && (
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
                {isUploadingContentImage ? (
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
                    <Button
                      variant="outline"
                      border="none"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById(`${listName}-${index}-image-upload`).click();
                      }}
                      size="sm"
                      bg="transparent"
                      color="#422afb"
                      disabled={isUploadingContentImage}
                    >
                      Upload Image
                      <input
                        type="file"
                        id={`${listName}-${index}-image-upload`}
                        hidden
                        accept="image/*"
                        onChange={handleContentFileInputChange}
                        disabled={isUploadingContentImage}
                      />
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>
        </FormControl>
      );
    }

    // For regular text fields
    return (
      <FormControl>
        <FormLabel fontSize="sm" color={textColor}>
          {field.charAt(0).toUpperCase() + field.slice(1)}
        </FormLabel>
        <Input
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          size="sm"
        />
      </FormControl>
    );
  });

  const renderStepContent = React.useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Basic Information</Heading>
            <VStack spacing={6} align="stretch">
              {/* Row 1: Course Image */}
              <FormControl>
                <FormLabel color={textColor}>Course Image</FormLabel>
                <Box
                  border="1px dashed"
                  borderColor={isDragging ? 'brand.500' : 'gray.300'}
                  borderRadius="md"
                  p={4}
                  textAlign="center"
                  backgroundColor={isDragging ? 'brand.50' : 'white'}
                  cursor="pointer"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  position="relative"
                >
                  {imagePreview ? (
                    <Flex direction="column" align="center">
                      <Image
                        src={imagePreview}
                        alt="Course Preview"
                        maxH="200px"
                        mb={2}
                        borderRadius="md"
                        fallback={<Icon as={FaPlay} color="gray.500" boxSize="100px" />}
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
                        onClick={() => document.getElementById('course-image-upload').click()}
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
                          id="course-image-upload"
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

              {/* Row 2: Title */}
              <FormControl>
                <FormLabel color={textColor}>Title</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter course title"
                />
              </FormControl>

              {/* Row 3: Description */}
              <FormControl>
                <FormLabel color={textColor}>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter course description"
                  rows={3}
                />
              </FormControl>

              {/* Row 4: Duration, Number of Sessions, Price */}
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                <FormControl>
                  <FormLabel color={textColor}>Duration</FormLabel>
                  <Input
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 8 weeks"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Number of Sessions</FormLabel>
                  <NumberInput
                    value={formData.sessionsNumber}
                    onChange={(value) => handleInputChange('sessionsNumber', parseInt(value))}
                    min={1}
                    max={100}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Price ($)</FormLabel>
                  <NumberInput
                    value={formData.price}
                    onChange={(value) => handleInputChange('price', parseFloat(value))}
                    min={0}
                    precision={2}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Grid>

              {/* Row 5: Plan and Status */}
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <FormControl>
                  <FormLabel color={textColor}>Plan</FormLabel>
                  <Select
                    value={formData.plan}
                    onChange={(e) => handleInputChange('plan', e.target.value)}
                  >
                    <option value="">Select a plan</option>
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
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </VStack>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Course Overview</Heading>
            <FormControl>
              <FormLabel color={textColor}>Overview</FormLabel>
              <Textarea
                value={formData.overview}
                onChange={(e) => handleInputChange('overview', e.target.value)}
                placeholder="Enter detailed course overview"
                rows={6}
              />
            </FormControl>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Course Content</Heading>
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="sm" color="gray.500">Add content items that will be covered in this course</Text>
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={() => addListItem('courseContent', { title: '', image: '' })}
              >
                Add Content Item
              </Button>
            </Flex>
            <VStack spacing={4} align="stretch">
              {formData.courseContent.map((content, index) => (
                <Box key={`content-${index}`} p={4} border="1px" borderColor={borderColor} borderRadius="lg">
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontWeight="medium" color={textColor}>
                      Course Content {index + 1}
                    </Text>
                    <IconButton
                      aria-label="Remove content item"
                      icon={<CloseIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removeListItem('courseContent', index)}
                      isDisabled={formData.courseContent.length === 1}
                    />
                  </Flex>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Title</FormLabel>
                      <Input
                        value={content.title || ''}
                        onChange={(e) => handleListChange('courseContent', index, 'title', e.target.value)}
                        placeholder="Enter content title"
                        size="sm"
                      />
                    </FormControl>
                    <ListItemInput
                      listName="courseContent"
                      index={index}
                      field="image"
                      value={content.image || ''}
                      onChange={(index, field, value) => handleListChange('courseContent', index, field, value)}
                      placeholder="Enter image"
                      textColor={textColor}
                    />
                  </Grid>
                </Box>
              ))}
            </VStack>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Instructor Selection</Heading>
            <Text fontSize="sm" color="gray.500" mb={4}>
              Select instructors for this course. You can select multiple instructors.
            </Text>
            
            {/* Search Input */}
            <FormControl mb={4}>
              <FormLabel fontSize="sm" color={textColor}>Search Instructors</FormLabel>
              <Input
                placeholder="Search by name, specialization, or experience..."
                value={instructorsSearch}
                onChange={(e) => handleInstructorsSearch(e.target.value)}
                size="md"
              />
            </FormControl>
            
            {isLoadingInstructors ? (
              <Flex justify="center" align="center" py={8}>
                <VStack spacing={4}>
                  <Spinner size="lg" color="#422afb" thickness="4px" />
                  <Text color="gray.500">Loading instructors...</Text>
                </VStack>
              </Flex>
            ) : availableInstructors.length === 0 ? (
              <Box p={6} textAlign="center" bg="gray.50" borderRadius="lg">
                <Text color="gray.500">No instructors available</Text>
              </Box>
            ) : (
              <>
                <VStack spacing={3} align="stretch">
                  {availableInstructors.map((instructor) => (
                    <Box
                      key={instructor.id}
                      p={4}
                      border="1px"
                      borderColor={borderColor}
                      borderRadius="lg"
                      cursor="pointer"
                      onClick={() => handleInstructorSelection(instructor.id)}
                      bg={formData.instructor_ids.includes(instructor.id) ? 'blue.50' : 'transparent'}
                      _hover={{ bg: formData.instructor_ids.includes(instructor.id) ? 'blue.100' : 'gray.50' }}
                    >
                      <Flex justify="space-between" align="center">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium" color={textColor}>
                            {instructor.name}
                          </Text>
                          <HStack spacing={2}>
                            <Badge colorScheme="blue" size="sm">
                              {instructor.specialization || 'General'}
                            </Badge>
                            <Badge colorScheme="green" size="sm">
                              {instructor.experience_years ? `${instructor.experience_years} years` : 'Experienced'}
                            </Badge>
                          </HStack>
                        </VStack>
                        <Box
                          w={4}
                          h={4}
                          borderRadius="full"
                          border="2px"
                          borderColor={formData.instructor_ids.includes(instructor.id) ? 'blue.500' : 'gray.300'}
                          bg={formData.instructor_ids.includes(instructor.id) ? 'blue.500' : 'transparent'}
                        />
                      </Flex>
                    </Box>
                  ))}
                </VStack>
                
                {/* Pagination Info */}
                {instructorsResponse?.pagination && (
                  <Box mt={4} p={3} bg="gray.50" borderRadius="lg">
                    <Flex justify="space-between" align="center">
                      <Text fontSize="sm" color="gray.600">
                        Showing {instructorsResponse.pagination.from}-{instructorsResponse.pagination.to} of {instructorsResponse.pagination.total} instructors
                      </Text>
                      {instructorsResponse.pagination.has_more_pages && (
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          onClick={handleLoadMoreInstructors}
                          isLoading={isLoadingInstructors}
                        >
                          Load More
                        </Button>
                      )}
                    </Flex>
                  </Box>
                )}
                
                {formData.instructor_ids.length > 0 && (
                  <Box mt={4} p={3} bg="blue.50" borderRadius="lg">
                    <Text fontSize="sm" color="blue.700" fontWeight="medium">
                      Selected Instructors: {formData.instructor_ids.map(id => {
                        const instructor = availableInstructors.find(i => i.id === id);
                        return instructor ? instructor.name : `Instructor ${id}`;
                      }).join(', ')}
                    </Text>
                  </Box>
                )}
              </>
            )}
          </Box>
        );

      case 4:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Selected Remedies</Heading>
            <Text fontSize="sm" color="gray.500" mb={4}>
              Choose remedies for this course. You can select multiple remedies.
            </Text>
            
            {/* Search Input */}
            <FormControl mb={4}>
              <FormLabel fontSize="sm" color={textColor}>Search Remedies</FormLabel>
              <Input
                placeholder="Search by title, disease, or remedy type..."
                value={remediesSearch}
                onChange={(e) => handleRemediesSearch(e.target.value)}
                size="md"
              />
            </FormControl>
            
            {isLoadingRemedies ? (
              <Flex justify="center" align="center" py={8}>
                <VStack spacing={4}>
                  <Spinner size="lg" color="#422afb" thickness="4px" />
                  <Text color="gray.500">Loading remedies...</Text>
                </VStack>
              </Flex>
            ) : availableRemedies.length === 0 ? (
              <Box p={6} textAlign="center" bg="gray.50" borderRadius="lg">
                <Text color="gray.500">No remedies available</Text>
              </Box>
            ) : (
              <>
                <VStack spacing={3} align="stretch">
                  {availableRemedies.map((remedy) => (
                    <Box
                      key={remedy.id}
                      p={3}
                      border="1px"
                      borderColor={borderColor}
                      borderRadius="lg"
                      cursor="pointer"
                      onClick={() => {
                        const isSelected = formData.selectedRemedies.includes(remedy.id);
                        if (isSelected) {
                          setFormData(prev => ({
                            ...prev,
                            selectedRemedies: prev.selectedRemedies.filter(r => r !== remedy.id)
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            selectedRemedies: [...prev.selectedRemedies, remedy.id]
                          }));
                        }
                      }}
                      bg={formData.selectedRemedies.includes(remedy.id) ? 'blue.50' : 'transparent'}
                      _hover={{ bg: formData.selectedRemedies.includes(remedy.id) ? 'blue.100' : 'gray.50' }}
                    >
                      <Flex justify="space-between" align="center">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium" color={textColor}>
                            {remedy.title}
                          </Text>
                          <HStack spacing={2}>
                            <Badge colorScheme="blue" size="sm">
                              {remedy.disease?.name || 'General'}
                            </Badge>
                            <Badge colorScheme="green" size="sm">
                              {remedy.remedy_type?.name || 'Natural'}
                            </Badge>
                          </HStack>
                        </VStack>
                        <Box
                          w={4}
                          h={4}
                          borderRadius="full"
                          border="2px"
                          borderColor={formData.selectedRemedies.includes(remedy.id) ? 'blue.500' : 'gray.300'}
                          bg={formData.selectedRemedies.includes(remedy.id) ? 'blue.500' : 'transparent'}
                        />
                      </Flex>
                    </Box>
                  ))}
                </VStack>
                
                {/* Pagination Info */}
                {remediesResponse?.pagination && (
                  <Box mt={4} p={3} bg="gray.50" borderRadius="lg">
                    <Flex justify="space-between" align="center">
                      <Text fontSize="sm" color="gray.600">
                        Showing {remediesResponse.pagination.from}-{remediesResponse.pagination.to} of {remediesResponse.pagination.total} remedies
                      </Text>
                      {remediesResponse.pagination.has_more_pages && (
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          onClick={handleLoadMoreRemedies}
                          isLoading={isLoadingRemedies}
                        >
                          Load More
                        </Button>
                      )}
                    </Flex>
                  </Box>
                )}
                
                {formData.selectedRemedies.length > 0 && (
                  <Box mt={4} p={3} bg="blue.50" borderRadius="lg">
                    <Text fontSize="sm" color="blue.700" fontWeight="medium">
                      Selected Remedies: {formData.selectedRemedies.map(id => {
                        const remedy = availableRemedies.find(r => r.id === id);
                        return remedy ? remedy.title : `Remedy ${id}`;
                      }).join(', ')}
                    </Text>
                  </Box>
                )}
              </>
            )}
          </Box>
        );

      default:
        return null;
    }
  }, [activeStep, formData, textColor, borderColor, planOptions, statusOptions, availableRemedies, availableInstructors, isLoadingInstructors, isLoadingRemedies, instructorsResponse?.pagination, remediesResponse?.pagination, instructorsSearch, remediesSearch, handleInputChange, handleListChange, handleInstructorSelection, handleInstructorsSearch, handleRemediesSearch, handleLoadMoreInstructors, handleLoadMoreRemedies, addListItem, removeListItem]);

  // Loading state
  if (isLoadingCourse) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Flex justify="center" align="center" h="200px">
              <VStack spacing={4}>
                <Spinner size="xl" color="#422afb" thickness="8px" speed="0.6s" />
                <Text color={textColor} fontSize="lg" fontWeight="bold">Loading course...</Text>
                <Text color="gray.500" fontSize="sm">Please wait while we fetch the course data</Text>
              </VStack>
            </Flex>
          </Box>
        </Card>
      </Box>
    );
  }

  // Error state
  if (isErrorCourse) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              <Text>
                {courseError?.data?.message || 'Failed to load course data. Please try again.'}
              </Text>
            </Alert>
            <Button
              leftIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin/courses')}
              colorScheme="blue"
            >
              Back to Courses
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card>
        <Box p={6}>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="lg" color={textColor}>Edit Course</Heading>
            <HStack spacing={4}>
              <Text color="gray.500" fontSize="sm">
                Step {activeStep + 1} of {steps.length}
              </Text>
              <Button
                leftIcon={<ArrowBackIcon />}
                variant="outline"
                onClick={() => navigate('/admin/courses')}
                size="sm"
              >
                Back to Courses
              </Button>
            </HStack>
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

          <form onSubmit={handleSubmit} key={activeStep}>
            <VStack spacing={6} align="stretch">
              {renderStepContent}

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
                      loadingText="Updating Course"
                    >
                      Update Course
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

export default EditCourse;
