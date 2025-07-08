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
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { useNavigate } from 'react-router-dom';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { FaPlay, FaUsers, FaClock, FaDollarSign, FaStar, FaBook, FaVideo } from 'react-icons/fa';

const AddCourse = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const steps = [
    { title: 'Basic Information' },
    { title: 'Course Overview' },
    { title: 'Course Content' },
    { title: 'Instructors' },
    { title: 'Remedies Selection' },
    { title: 'Sessions Management' },
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
    instructors: [{ name: '', description: '', image: '' }],
    selectedRemedies: [],
    relatedCourses: [],
    status: 'active',
    // Session data structure
    sessions: [
      {
        day: 1,
        title: 'Introduction',
        description: '',
        videoUrl: '',
        videoDescription: '',
        lessonContent: [{ title: '', image: '' }],
        remedies: [],
        tip: '',
        isCompleted: false,
      }
    ]
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' },
  ];

  const planOptions = [
    { value: 'Basic Plan', label: 'Basic Plan' },
    { value: 'Premium Plan', label: 'Premium Plan' },
    { value: 'Master Plan', label: 'Master Plan' },
  ];

  // Available remedies for selection
  const availableRemedies = [
    { id: 1, title: 'Ginger Honey Tea', disease: 'Common Cold', remedyType: 'Herbal Tea' },
    { id: 2, title: 'Lavender Oil Massage', disease: 'Headache', remedyType: 'Essential Oil' },
    { id: 3, title: 'Peppermint Capsules', disease: 'Digestive Issues', remedyType: 'Herbal Supplement' },
    { id: 4, title: 'Chamomile Tea', disease: 'Insomnia', remedyType: 'Herbal Tea' },
    { id: 5, title: 'Eucalyptus Steam', disease: 'Respiratory Issues', remedyType: 'Steam Therapy' },
  ];

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

  const handleSessionChange = React.useCallback((sessionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      sessions: prev.sessions.map((session, i) => 
        i === sessionIndex ? { ...session, [field]: value } : session
      )
    }));
  }, []);

  const handleSessionLessonChange = React.useCallback((sessionIndex, lessonIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      sessions: prev.sessions.map((session, i) => 
        i === sessionIndex ? {
          ...session,
          lessonContent: session.lessonContent.map((lesson, j) => 
            j === lessonIndex ? { ...lesson, [field]: value } : lesson
          )
        } : session
      )
    }));
  }, []);

  const addSessionLesson = React.useCallback((sessionIndex) => {
    setFormData(prev => ({
      ...prev,
      sessions: prev.sessions.map((session, i) => 
        i === sessionIndex ? {
          ...session,
          lessonContent: [...session.lessonContent, { title: '', image: '' }]
        } : session
      )
    }));
  }, []);

  const removeSessionLesson = React.useCallback((sessionIndex, lessonIndex) => {
    setFormData(prev => ({
      ...prev,
      sessions: prev.sessions.map((session, i) => 
        i === sessionIndex ? {
          ...session,
          lessonContent: session.lessonContent.filter((_, j) => j !== lessonIndex)
        } : session
      )
    }));
  }, []);

  const addSession = React.useCallback(() => {
    setFormData(prev => {
      const newSessionNumber = prev.sessions.length + 1;
      return {
        ...prev,
        sessions: [...prev.sessions, {
          day: newSessionNumber,
          title: `Session ${newSessionNumber}`,
          description: '',
          videoUrl: '',
          videoDescription: '',
          lessonContent: [{ title: '', image: '' }],
          remedies: [],
          tip: '',
          isCompleted: false,
        }],
        sessionsNumber: newSessionNumber
      };
    });
  }, []);

  const removeSession = React.useCallback((sessionIndex) => {
    setFormData(prev => ({
      ...prev,
      sessions: prev.sessions.filter((_, i) => i !== sessionIndex),
      sessionsNumber: prev.sessions.length - 1
    }));
  }, []);

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
      case 3: // Instructors
        if (formData.instructors.length === 0 || !formData.instructors[0].name.trim()) {
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
      case 5: // Sessions Management
        if (formData.sessionsNumber < 1) {
          toast({
            title: 'Error',
            description: 'At least one session is required',
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
      // Validate all steps
      for (let i = 0; i < steps.length; i++) {
        if (!validateStep(i)) {
          setActiveStep(i);
          return;
        }
      }

      // In a real app, you would call your API here
      // const response = await api.post('/courses', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Success',
        description: 'Course added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Navigate back to courses list
      navigate('/admin/courses');
      
    } catch (error) {
      console.error('Failed to add course:', error);
      toast({
        title: 'Error',
        description: 'Failed to add course. Please try again.',
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

  const ListItemInput = React.memo(({ listName, index, field, value, onChange, placeholder, textColor }) => {
    const handleChange = React.useCallback((e) => {
      onChange(index, field, e.target.value);
    }, [index, field, onChange]);

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

  const ListSection = React.memo(({ title, listName, items, fields = ['image', 'name'] }) => {
    const handleFieldChange = React.useCallback((index, field, value) => {
      handleListChange(listName, index, field, value);
    }, [listName, handleListChange]);

    const handleAddItem = React.useCallback(() => {
      addListItem(listName);
    }, [listName, addListItem]);

    const handleRemoveItem = React.useCallback((index) => {
      removeListItem(listName, index);
    }, [listName, removeListItem]);

    return (
      <Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="sm" color={textColor}>{title}</Heading>
          <Button
            leftIcon={<AddIcon />}
            size="sm"
            colorScheme="blue"
            variant="outline"
            onClick={handleAddItem}
          >
            Add {title.slice(0, -1)}
          </Button>
        </Flex>
        <VStack spacing={4} align="stretch">
          {items.map((item, index) => (
            <Box key={`${listName}-${index}`} p={4} border="1px" borderColor={borderColor} borderRadius="lg">
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="medium" color={textColor}>
                  {title.slice(0, -1)} {index + 1}
                </Text>
                <IconButton
                  aria-label={`Remove ${title.slice(0, -1).toLowerCase()}`}
                  icon={<CloseIcon />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleRemoveItem(index)}
                  isDisabled={items.length === 1}
                />
              </Flex>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {fields.map(field => (
                  <ListItemInput
                    key={`${listName}-${index}-${field}`}
                    listName={listName}
                    index={index}
                    field={field}
                    value={item[field]}
                    onChange={handleFieldChange}
                    placeholder={`Enter ${field}`}
                    textColor={textColor}
                  />
                ))}
              </Grid>
            </Box>
          ))}
        </VStack>
      </Box>
    );
  });

  const renderStepContent = React.useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Basic Information</Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <FormControl>
                <FormLabel color={textColor}>Course Image URL</FormLabel>
                <Input
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="Enter image URL"
                />
              </FormControl>

              <FormControl>
                <FormLabel color={textColor}>Title</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter course title"
                />
              </FormControl>

              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color={textColor}>Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter course description"
                    rows={3}
                  />
                </FormControl>
              </GridItem>

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
                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Image URL</FormLabel>
                      <Input
                        value={content.image || ''}
                        onChange={(e) => handleListChange('courseContent', index, 'image', e.target.value)}
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
            <Heading size="md" color={textColor} mb={4}>Instructors</Heading>
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="sm" color="gray.500">Add instructors for this course</Text>
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={() => addListItem('instructors', { name: '', description: '', image: '' })}
              >
                Add Instructor
              </Button>
            </Flex>
            <VStack spacing={4} align="stretch">
              {formData.instructors.map((instructor, index) => (
                <Box key={`instructor-${index}`} p={4} border="1px" borderColor={borderColor} borderRadius="lg">
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontWeight="medium" color={textColor}>
                      Instructor {index + 1}
                    </Text>
                    <IconButton
                      aria-label="Remove instructor"
                      icon={<CloseIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removeListItem('instructors', index)}
                      isDisabled={formData.instructors.length === 1}
                    />
                  </Flex>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Name</FormLabel>
                      <Input
                        value={instructor.name || ''}
                        onChange={(e) => handleListChange('instructors', index, 'name', e.target.value)}
                        placeholder="Enter instructor name"
                        size="sm"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Image URL</FormLabel>
                      <Input
                        value={instructor.image || ''}
                        onChange={(e) => handleListChange('instructors', index, 'image', e.target.value)}
                        placeholder="Enter image URL"
                        size="sm"
                      />
                    </FormControl>
                    <GridItem colSpan={2}>
                      <FormControl>
                        <FormLabel fontSize="sm" color={textColor}>Description</FormLabel>
                        <Textarea
                          value={instructor.description || ''}
                          onChange={(e) => handleListChange('instructors', index, 'description', e.target.value)}
                          placeholder="Enter instructor description"
                          rows={3}
                          size="sm"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                </Box>
              ))}
            </VStack>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Selected Remedies</Heading>
            <FormControl>
              <FormLabel color={textColor}>Choose Remedies for this Course</FormLabel>
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
                      const isSelected = formData.selectedRemedies.includes(remedy.title);
                      if (isSelected) {
                        setFormData(prev => ({
                          ...prev,
                          selectedRemedies: prev.selectedRemedies.filter(r => r !== remedy.title)
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          selectedRemedies: [...prev.selectedRemedies, remedy.title]
                        }));
                      }
                    }}
                    bg={formData.selectedRemedies.includes(remedy.title) ? 'blue.50' : 'transparent'}
                    _hover={{ bg: formData.selectedRemedies.includes(remedy.title) ? 'blue.100' : 'gray.50' }}
                  >
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium" color={textColor}>
                          {remedy.title}
                        </Text>
                        <HStack spacing={2}>
                          <Badge colorScheme="blue" size="sm">
                            {remedy.disease}
                          </Badge>
                          <Badge colorScheme="green" size="sm">
                            {remedy.remedyType}
                          </Badge>
                        </HStack>
                      </VStack>
                      <Box
                        w={4}
                        h={4}
                        borderRadius="full"
                        border="2px"
                        borderColor={formData.selectedRemedies.includes(remedy.title) ? 'blue.500' : 'gray.300'}
                        bg={formData.selectedRemedies.includes(remedy.title) ? 'blue.500' : 'transparent'}
                      />
                    </Flex>
                  </Box>
                ))}
              </VStack>
              {formData.selectedRemedies.length > 0 && (
                <Box mt={4} p={3} bg="blue.50" borderRadius="lg">
                  <Text fontSize="sm" color="blue.700" fontWeight="medium">
                    Selected Remedies: {formData.selectedRemedies.join(', ')}
                  </Text>
                </Box>
              )}
            </FormControl>
          </Box>
        );

      case 5:
        return (
          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md" color={textColor}>Sessions Management</Heading>
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                colorScheme="green"
                variant="outline"
                onClick={addSession}
              >
                Add Session
              </Button>
            </Flex>

            <Accordion allowMultiple>
              {formData.sessions.map((session, sessionIndex) => (
                <AccordionItem key={sessionIndex}>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <HStack>
                        <Icon as={FaVideo} color="blue.500" />
                        <Text fontWeight="medium" color={textColor}>
                          Session {session.day}: {session.title}
                        </Text>
                      </HStack>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <VStack spacing={4} align="stretch">
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <FormControl>
                          <FormLabel fontSize="sm" color={textColor}>Session Title</FormLabel>
                          <Input
                            value={session.title}
                            onChange={(e) => handleSessionChange(sessionIndex, 'title', e.target.value)}
                            placeholder="Enter session title"
                            size="sm"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" color={textColor}>Video URL (Optional)</FormLabel>
                          <Input
                            value={session.videoUrl}
                            onChange={(e) => handleSessionChange(sessionIndex, 'videoUrl', e.target.value)}
                            placeholder="Enter video URL"
                            size="sm"
                          />
                        </FormControl>

                        <GridItem colSpan={2}>
                          <FormControl>
                            <FormLabel fontSize="sm" color={textColor}>Description</FormLabel>
                            <Textarea
                              value={session.description}
                              onChange={(e) => handleSessionChange(sessionIndex, 'description', e.target.value)}
                              placeholder="Enter session description"
                              rows={3}
                              size="sm"
                            />
                          </FormControl>
                        </GridItem>

                        {session.videoUrl && (
                          <GridItem colSpan={2}>
                            <FormControl>
                              <FormLabel fontSize="sm" color={textColor}>Video Description</FormLabel>
                              <Textarea
                                value={session.videoDescription}
                                onChange={(e) => handleSessionChange(sessionIndex, 'videoDescription', e.target.value)}
                                placeholder="Enter video description"
                                rows={2}
                                size="sm"
                              />
                            </FormControl>
                          </GridItem>
                        )}

                        <GridItem colSpan={2}>
                          <FormControl>
                            <FormLabel fontSize="sm" color={textColor}>Tip</FormLabel>
                            <Textarea
                              value={session.tip}
                              onChange={(e) => handleSessionChange(sessionIndex, 'tip', e.target.value)}
                              placeholder="Enter helpful tip for this session"
                              rows={2}
                              size="sm"
                            />
                          </FormControl>
                        </GridItem>
                      </Grid>

                      {/* Lesson Content for this session */}
                      <Box>
                        <Flex justify="space-between" align="center" mb={3}>
                          <Text fontWeight="medium" fontSize="sm" color={textColor}>
                            Lesson Content
                          </Text>
                          <Button
                            leftIcon={<AddIcon />}
                            size="xs"
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => addSessionLesson(sessionIndex)}
                          >
                            Add Lesson
                          </Button>
                        </Flex>
                        <VStack spacing={3} align="stretch">
                          {session.lessonContent.map((lesson, lessonIndex) => (
                            <Box key={lessonIndex} p={3} border="1px" borderColor={borderColor} borderRadius="md">
                              <Flex justify="space-between" align="center" mb={2}>
                                <Text fontSize="sm" color={textColor}>
                                  Lesson {lessonIndex + 1}
                                </Text>
                                <IconButton
                                  aria-label="Remove lesson"
                                  icon={<CloseIcon />}
                                  size="xs"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => removeSessionLesson(sessionIndex, lessonIndex)}
                                  isDisabled={session.lessonContent.length === 1}
                                />
                              </Flex>
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <FormControl>
                                  <FormLabel fontSize="xs" color={textColor}>Title</FormLabel>
                                  <Input
                                    value={lesson.title}
                                    onChange={(e) => handleSessionLessonChange(sessionIndex, lessonIndex, 'title', e.target.value)}
                                    placeholder="Enter lesson title"
                                    size="sm"
                                  />
                                </FormControl>
                                <FormControl>
                                  <FormLabel fontSize="xs" color={textColor}>Image URL</FormLabel>
                                  <Input
                                    value={lesson.image}
                                    onChange={(e) => handleSessionLessonChange(sessionIndex, lessonIndex, 'image', e.target.value)}
                                    placeholder="Enter image URL"
                                    size="sm"
                                  />
                                </FormControl>
                              </Grid>
                            </Box>
                          ))}
                        </VStack>
                      </Box>

                      <Flex justify="space-between">
                        <Badge colorScheme="blue" variant="subtle">
                          Day {session.day}
                        </Badge>
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => removeSession(sessionIndex)}
                          isDisabled={formData.sessions.length === 1}
                        >
                          Remove Session
                        </Button>
                      </Flex>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        );

      default:
        return null;
    }
  }, [activeStep, formData, textColor, borderColor, planOptions, statusOptions, availableRemedies, handleInputChange, handleListChange, handleSessionChange, handleSessionLessonChange, addListItem, removeListItem, addSession, addSessionLesson, removeSessionLesson, removeSession]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card>
        <Box p={6}>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="lg" color={textColor}>Add New Course</Heading>
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
                      isLoading={isSubmitting}
                      loadingText="Adding Course"
                    >
                      Add Course
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

export default AddCourse;
