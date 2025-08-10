import React, { useState, useCallback, useEffect } from 'react';
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
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetArticleQuery, useUpdateArticleMutation } from '../../../api/articlesSlice';
import { useUploadImageMutation } from '../../../api/fileUploadSlice';
import { FiPlus, FiX, FiUpload, FiEdit3 } from 'react-icons/fi';

const steps = [
  { title: 'Basic Info', description: 'Article details' },
  { title: 'Plants', description: 'Add plant information' },
  { title: 'Review', description: 'Review and submit' },
];

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  

  
  const [activeStep, setActiveStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState({
    title: '',
    image: '',
    description: '',
    plans: ['rookie'],
    status: 'active',
  });
  const [plants, setPlants] = useState([]);
  const [editingPlantIndex, setEditingPlantIndex] = useState(null);
  const [editingPlant, setEditingPlant] = useState({
    title: '',
    description: '',
    image: '',
  });

  // API hooks
  const { data: article, isLoading: isLoadingArticle, error: articleError } = useGetArticleQuery(id);
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  


  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const planOptions = [
    { value: 'rookie', label: 'Rookie' },
    { value: 'skilled', label: 'Skilled' },
    { value: 'master', label: 'Master' },
  ];

  // Load article data when component mounts
  useEffect(() => {
    if (article) {

      
      // Map old plan values to new ones if needed
      const mapOldPlansToNew = (oldPlans) => {
        if (!oldPlans || !Array.isArray(oldPlans)) return ['rookie'];
        
        // If plans are from old system, map them to new ones
        const planMapping = {
          'basic': 'rookie',
          'premium': 'skilled', 
          'pro': 'master'
        };
        
        return oldPlans.map(plan => planMapping[plan] || plan).filter(plan => 
          planOptions.some(option => option.value === plan)
        );
      };
      
      const mappedPlans = mapOldPlansToNew(article.plans);
      
      setBasicInfo({
        title: article.title || '',
        image: article.image || '',
        description: article.description || '',
        plans: mappedPlans.length > 0 ? mappedPlans : ['rookie'],
        status: article.status || 'active',
      });
      // Ensure plants have the correct structure
      const formattedPlants = (article.plants || []).map(plant => ({
        title: plant.title || '',
        description: plant.description || '',
        image: plant.image || '',
      }));
      setPlants(formattedPlants);
    }
  }, [article, planOptions]);

  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePlansChange = (values) => {
    setBasicInfo(prev => ({ ...prev, plans: values }));
  };

  const handleImageUpload = async (file, type = 'main') => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const result = await uploadImage(formData).unwrap();
      
      if (type === 'main') {
        setBasicInfo(prev => ({ ...prev, image: result.url }));
      } else {
        return result.url;
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.data?.message || 'Failed to upload image',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const addPlant = () => {
    setPlants(prev => [...prev, {
      title: '',
      description: '',
      image: '',
    }]);
  };

  const removePlant = (index) => {
    setPlants(prev => prev.filter((_, i) => i !== index));
  };

  const updatePlant = (index, field, value) => {
    setPlants(prev => prev.map((plant, i) => 
      i === index ? { ...plant, [field]: value } : plant
    ));
  };

  const handlePlantImageUpload = async (file, index) => {
    try {
      const imageUrl = await handleImageUpload(file, 'plant');
      if (imageUrl) {
        updatePlant(index, 'image', imageUrl);
      }
    } catch (error) {
      console.error('Plant image upload failed:', error);
    }
  };

  const openEditPlant = (index) => {
    setEditingPlantIndex(index);
    setEditingPlant({ ...plants[index] });
    onOpen();
  };

  const saveEditedPlant = () => {
    if (editingPlantIndex !== null) {
      setPlants(prev => prev.map((plant, i) => 
        i === editingPlantIndex ? editingPlant : plant
      ));
      setEditingPlantIndex(null);
      setEditingPlant({ title: '', description: '', image: '' });
      onClose();
    }
  };

  const handleSubmit = async () => {
    try {
      const articleData = {
        ...basicInfo,
        plants,
      };

      await updateArticle({ id, submissionData: articleData }).unwrap();
      
      toast({
        title: 'Success',
        description: 'Article updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/admin/articles');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to update article',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const nextStep = () => {
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  if (isLoadingArticle) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (articleError) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Text color="red.500">Error loading article: {articleError?.data?.message || articleError?.message}</Text>
      </Flex>
    );
  }

  if (!article && !isLoadingArticle) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Text color="gray.500">Article not found</Text>
      </Flex>
    );
  }

  return (
    <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="sm" mt="80px">
      <Heading size="lg" mb={6}>Edit Article</Heading>
      
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

      {/* Step 1: Basic Info */}
      {activeStep === 0 && (
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel color={textColor}>Title</FormLabel>
            <Input
              value={basicInfo.title}
              onChange={(e) => handleBasicInfoChange('title', e.target.value)}
              placeholder="Enter article title"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={textColor}>Description</FormLabel>
            <Textarea
              value={basicInfo.description}
              onChange={(e) => handleBasicInfoChange('description', e.target.value)}
              placeholder="Enter article description"
              rows={4}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={textColor}>Plans</FormLabel>
            <Box
              border="1px solid"
              borderColor={borderColor}
              borderRadius="md"
              p={4}
              bg={bgColor}
            >
              <CheckboxGroup value={basicInfo.plans} onChange={handlePlansChange}>
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  {planOptions.map((plan) => (
                    <Box
                      key={plan.value}
                      p={3}
                      border="2px solid"
                      borderColor={basicInfo.plans.includes(plan.value) ? 'brand.500' : borderColor}
                      borderRadius="lg"
                      bg={basicInfo.plans.includes(plan.value) ? 'brand.50' : 'transparent'}
                      transition="all 0.2s"
                      _hover={{
                        borderColor: 'brand.300',
                        bg: basicInfo.plans.includes(plan.value) ? 'brand.100' : 'gray.50'
                      }}
                    >
                      <Checkbox 
                        value={plan.value}
                        colorScheme="brand"
                        size="lg"
                        fontWeight="semibold"
                      >
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold" color={textColor}>
                            {plan.label}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {plan.value === 'rookie' && 'Essential content for beginners'}
                            {plan.value === 'skilled' && 'Advanced features and detailed guides'}
                            {plan.value === 'master' && 'Complete access to all resources'}
                          </Text>
                        </VStack>
                      </Checkbox>
                    </Box>
                  ))}
                </Grid>
              </CheckboxGroup>
            </Box>
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={textColor}>Status</FormLabel>
            <Select
              value={basicInfo.status}
              onChange={(e) => handleBasicInfoChange('status', e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={textColor}>Main Image</FormLabel>
            <Box
              border="2px dashed"
              borderColor={borderColor}
              borderRadius="lg"
              p={6}
              textAlign="center"
              position="relative"
              _hover={{ borderColor: 'blue.500' }}
              transition="all 0.2s"
            >
              {basicInfo.image ? (
                <Box position="relative">
                  <Image
                    src={basicInfo.image}
                    alt="Article preview"
                    maxH="200px"
                    mx="auto"
                    borderRadius="md"
                  />
                  {isUploading && (
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="rgba(0,0,0,0.5)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="md"
                    >
                      <Spinner color="white" />
                    </Box>
                  )}
                  <IconButton
                    icon={<FiEdit3 />}
                    position="absolute"
                    top={2}
                    right={2}
                    size="sm"
                    colorScheme="blue"
                    onClick={() => document.getElementById('main-image-input').click()}
                  />
                </Box>
              ) : (
                <VStack spacing={4}>
                  <Icon as={FiUpload} w={8} h={8} color="gray.400" />
                  <Text>Drag and drop an image here, or click to select</Text>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => document.getElementById('main-image-input').click()}
                  >
                    Select Image
                  </Button>
                </VStack>
              )}
              <Input
                id="main-image-input"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleImageUpload(file, 'main');
                }}
                display="none"
              />
            </Box>
          </FormControl>
        </VStack>
      )}

      {/* Step 2: Plants */}
      {activeStep === 1 && (
        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center">
            <Heading size="md">Plants</Heading>
            <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={addPlant}>
              Add Plant
            </Button>
          </Flex>

          {plants.map((plant, index) => (
            <Box
              key={index}
              p={4}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="lg"
              bg={bgColor}
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Text fontWeight="semibold">Plant {index + 1}</Text>
                <HStack>
                  <IconButton
                    icon={<FiEdit3 />}
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditPlant(index)}
                  />
                  <IconButton
                    icon={<FiX />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => removePlant(index)}
                  />
                </HStack>
              </Flex>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <VStack align="stretch" spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color={textColor}>Title</FormLabel>
                    <Input
                      value={plant.title}
                      onChange={(e) => updatePlant(index, 'title', e.target.value)}
                      placeholder="Plant title"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color={textColor}>Description</FormLabel>
                    <Textarea
                      value={plant.description}
                      onChange={(e) => updatePlant(index, 'description', e.target.value)}
                      placeholder="Plant description"
                      rows={3}
                    />
                  </FormControl>
                </VStack>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Image</FormLabel>
                  <Box
                    border="2px dashed"
                    borderColor={borderColor}
                    borderRadius="lg"
                    p={4}
                    textAlign="center"
                    position="relative"
                    _hover={{ borderColor: 'blue.500' }}
                    transition="all 0.2s"
                    minH="120px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {plant.image ? (
                      <Box position="relative" w="full">
                        <Image
                          src={plant.image}
                          alt="Plant preview"
                          maxH="100px"
                          mx="auto"
                          borderRadius="md"
                        />
                        {isUploading && (
                          <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bg="rgba(0,0,0,0.5)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            borderRadius="md"
                          >
                            <Spinner color="white" size="sm" />
                          </Box>
                        )}
                        <IconButton
                          icon={<FiEdit3 />}
                          position="absolute"
                          top={1}
                          right={1}
                          size="xs"
                          colorScheme="blue"
                          onClick={() => document.getElementById(`plant-image-${index}`).click()}
                        />
                      </Box>
                    ) : (
                      <VStack spacing={2}>
                        <Icon as={FiUpload} w={6} h={6} color="gray.400" />
                        <Text fontSize="sm">Click to upload</Text>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => document.getElementById(`plant-image-${index}`).click()}
                        >
                          Upload
                        </Button>
                      </VStack>
                    )}
                    <Input
                      id={`plant-image-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handlePlantImageUpload(file, index);
                      }}
                      display="none"
                    />
                  </Box>
                </FormControl>
              </Grid>
            </Box>
          ))}

          {plants.length === 0 && (
            <Box
              p={8}
              textAlign="center"
              border="2px dashed"
              borderColor={borderColor}
              borderRadius="lg"
            >
              <Text color="gray.500">No plants added yet. Click "Add Plant" to get started.</Text>
            </Box>
          )}
        </VStack>
      )}

      {/* Step 3: Review */}
      {activeStep === 2 && (
        <VStack spacing={6} align="stretch">
          <Heading size="md">Review Article</Heading>
          
          <Box p={4} border="1px solid" borderColor={borderColor} borderRadius="lg">
            <Text fontWeight="semibold" mb={2}>Basic Information</Text>
            <Text><strong>Title:</strong> {basicInfo.title}</Text>
            <Text><strong>Description:</strong> {basicInfo.description}</Text>
            <Text><strong>Status:</strong> {basicInfo.status}</Text>
            <Text><strong>Plans:</strong> {basicInfo.plans.join(', ')}</Text>
            {basicInfo.image && (
              <Box mt={2}>
                <Text fontWeight="semibold">Main Image:</Text>
                <Image src={basicInfo.image} alt="Article" maxH="150px" mt={2} borderRadius="md" />
              </Box>
            )}
          </Box>

          <Box p={4} border="1px solid" borderColor={borderColor} borderRadius="lg">
            <Text fontWeight="semibold" mb={2}>Plants ({plants.length})</Text>
            {plants.map((plant, index) => (
              <Box key={index} p={3} border="1px solid" borderColor={borderColor} borderRadius="md" mt={2}>
                <Text><strong>Title:</strong> {plant.title}</Text>
                <Text><strong>Description:</strong> {plant.description}</Text>
                {plant.image && (
                  <Image src={plant.image} alt={plant.title} maxH="100px" mt={2} borderRadius="md" />
                )}
              </Box>
            ))}
          </Box>
        </VStack>
      )}

      {/* Navigation Buttons */}
      <Flex justify="space-between" mt={8}>
        <Button
          onClick={prevStep}
          isDisabled={activeStep === 0}
          variant="outline"
        >
          Previous
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isUpdating}
            loadingText="Updating..."
          >
            Update Article
          </Button>
        ) : (
          <Button
            colorScheme="blue"
            onClick={nextStep}
            isDisabled={
              (activeStep === 0 && (!basicInfo.title || !basicInfo.description || !basicInfo.image)) ||
              (activeStep === 1 && plants.length === 0)
            }
          >
            Next
          </Button>
        )}
      </Flex>

      {/* Edit Plant Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Plant</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color={textColor}>Title</FormLabel>
                <Input
                  value={editingPlant.title}
                  onChange={(e) => setEditingPlant(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Plant title"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>Description</FormLabel>
                <Textarea
                  value={editingPlant.description}
                  onChange={(e) => setEditingPlant(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Plant description"
                  rows={3}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>Image</FormLabel>
                <Box
                  border="2px dashed"
                  borderColor={borderColor}
                  borderRadius="lg"
                  p={4}
                  textAlign="center"
                  position="relative"
                  _hover={{ borderColor: 'blue.500' }}
                  transition="all 0.2s"
                  minH="120px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {editingPlant.image ? (
                    <Box position="relative" w="full">
                      <Image
                        src={editingPlant.image}
                        alt="Plant preview"
                        maxH="100px"
                        mx="auto"
                        borderRadius="md"
                      />
                      <IconButton
                        icon={<FiEdit3 />}
                        position="absolute"
                        top={1}
                        right={1}
                        size="xs"
                        colorScheme="blue"
                        onClick={() => document.getElementById('edit-plant-image').click()}
                      />
                    </Box>
                  ) : (
                    <VStack spacing={2}>
                      <Icon as={FiUpload} w={6} h={6} color="gray.400" />
                      <Text fontSize="sm">Click to upload</Text>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => document.getElementById('edit-plant-image').click()}
                      >
                        Upload
                      </Button>
                    </VStack>
                  )}
                  <Input
                    id="edit-plant-image"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          const imageUrl = await handleImageUpload(file, 'plant');
                          if (imageUrl) {
                            setEditingPlant(prev => ({ ...prev, image: imageUrl }));
                          }
                        } catch (error) {
                          console.error('Plant image upload failed:', error);
                        }
                      }
                    }}
                    display="none"
                  />
                </Box>
              </FormControl>

              <HStack spacing={4} w="full">
                <Button onClick={onClose} variant="outline" flex={1}>
                  Cancel
                </Button>
                <Button onClick={saveEditedPlant} colorScheme="blue" flex={1}>
                  Save Changes
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EditArticle;
