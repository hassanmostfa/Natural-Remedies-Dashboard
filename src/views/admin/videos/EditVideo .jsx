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
   import { useEffect } from 'react';
   import { useParams, useNavigate } from 'react-router-dom';
   import { AddIcon, CloseIcon } from '@chakra-ui/icons';
   import { FaUpload, FaLeaf } from 'react-icons/fa';
   import { useUploadImageMutation } from 'api/fileUploadSlice';
   import { 
      useGetVideoQuery,
      useUpdateVideoMutation 
   } from 'api/videosSlice';
   import Card from 'components/card/Card';
   
   const EditVideo = () => {
      const { id } = useParams();
      const navigate = useNavigate();
      const toast = useToast();
      const [uploadImage] = useUploadImageMutation();
      
      // Enhanced query with error logging
      const { 
      data: videoData, 
      isLoading, 
      isError, 
      error: queryError,
      refetch 
      } = useGetVideoQuery(id, {
      refetchOnMountOrArgChange: true,
      });
   
      // Debug logging
      useEffect(() => {
      console.group('EditVideo Component State');
      console.log('Video ID:', id);
      console.log('Loading state:', isLoading);
      console.log('Error state:', isError);
      console.log('Query error:', queryError);
      console.log('Video data:', videoData);
      console.groupEnd();
      }, [id, isLoading, isError, queryError, videoData]);
   
      const [updateVideo, { error: updateError }] = useUpdateVideoMutation();
   
      const textColor = useColorModeValue('secondaryGray.900', 'white');
      const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
      const inputBg = useColorModeValue('gray.100', 'gray.700');
      const cardBg = useColorModeValue('white', 'navy.700');

      const memoizedColors = React.useMemo(() => ({
         textColor,
         borderColor,
         inputBg,
         cardBg,
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
   
      const [ingredients, setIngredients] = React.useState([]);
      const [instructions, setInstructions] = React.useState([]);
      const [benefits, setBenefits] = React.useState([]);
   
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

      const [isDragging, setIsDragging] = React.useState({
         mainImage: false,
         ingredients: [],
         instructions: [],
         benefits: [],
      });
   
      // Initialize form with existing data
      useEffect(() => {
         if (videoData?.data) { // Check for videoData.data
         console.log('Initializing form with video data:', videoData.data);
         
         // Basic Info - access properties from videoData.data
         setBasicInfo({
            image: videoData.data.image || '',
            videoLink: videoData.data.videoLink || '',
            title: videoData.data.title || '',
            description: videoData.data.description || '',
            visiblePlans: videoData.data.visiblePlans || 'all',
            status: videoData.data.status || 'active',
         });
      
         // Ingredients - access from videoData.data.ingredients
         const initIngredients = videoData.data.ingredients?.length > 0 
            ? videoData.data.ingredients.map((ing, i) => ({ 
               id: ing.id || i + 1,  // Use existing ID if available
               name: ing.name || '',
               image: ing.image || '' 
               }))
            : [{ id: 1, name: '', image: '' }];
         
         // Instructions - access from videoData.data.instructions
         const initInstructions = videoData.data.instructions?.length > 0 
            ? videoData.data.instructions.map((inst, i) => ({ 
               id: inst.id || i + 1,
               title: inst.title || '',
               image: inst.image || '' 
               }))
            : [{ id: 1, title: '', image: '' }];
         
         // Benefits - access from videoData.data.benefits
         const initBenefits = videoData.data.benefits?.length > 0 
            ? videoData.data.benefits.map((ben, i) => ({ 
               id: ben.id || i + 1,
               title: ben.title || '',
               image: ben.image || '' 
               }))
            : [{ id: 1, title: '', image: '' }];
      
         setIngredients(initIngredients);
         setInstructions(initInstructions);
         setBenefits(initBenefits);
      
         // Initialize image previews
         setImagePreviews({
            mainImage: videoData.data.image || null,
            ingredients: initIngredients.map(ing => ing.image || null),
            instructions: initInstructions.map(inst => inst.image || null),
            benefits: initBenefits.map(ben => ben.image || null),
         });
      
         // Initialize uploading states
         setUploading({
            mainImage: false,
            ingredients: Array(initIngredients.length).fill(false),
            instructions: Array(initInstructions.length).fill(false),
            benefits: Array(initBenefits.length).fill(false),
         });
      
         console.log('Form initialization complete');
         }
      }, [videoData]);
   
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
      const newId = ingredients.length > 0 ? Math.max(...ingredients.map(item => item.id)) + 1 : 1;
      setIngredients(prev => [
         ...prev, 
         { id: newId, name: '', image: '' }
      ]);
      setUploading(prev => ({
         ...prev,
         ingredients: [...prev.ingredients, false]
      }));
      setImagePreviews(prev => ({
         ...prev,
         ingredients: [...prev.ingredients, null]
      }));
      }, [ingredients]);
   
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
      }, [ingredients]);
   
      // Instructions handlers
      const handleInstructionChange = React.useCallback((id, field, value) => {
      setInstructions(prev => 
         prev.map(item => 
            item.id === id ? { ...item, [field]: value } : item
         )
      );
      }, []);
   
      const addInstruction = React.useCallback(() => {
      const newId = instructions.length > 0 ? Math.max(...instructions.map(item => item.id)) + 1 : 1;
      setInstructions(prev => [
         ...prev, 
         { id: newId, title: '', image: '' }
      ]);
      setUploading(prev => ({
         ...prev,
         instructions: [...prev.instructions, false]
      }));
      setImagePreviews(prev => ({
         ...prev,
         instructions: [...prev.instructions, null]
      }));
      }, [instructions]);
   
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
      const newId = benefits.length > 0 ? Math.max(...benefits.map(item => item.id)) + 1 : 1;
      setBenefits(prev => [
         ...prev, 
         { id: newId, title: '', image: '' }
      ]);
      setUploading(prev => ({
         ...prev,
         benefits: [...prev.benefits, false]
      }));
      setImagePreviews(prev => ({
         ...prev,
         benefits: [...prev.benefits, null]
      }));
      }, [benefits]);
   
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
      }, [benefits]);
   
      // Image upload handler
      const handleImageUpload = async (file, field, index = null) => {
      console.log(`Uploading image for ${field}${index !== null ? ` at index ${index}` : ''}`);
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
         console.log('Upload response:', response);
         
         if (response.success && response.url) {
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

      const handleFileChange = (e, field, index = null) => {
      const file = e.target.files[0];
      if (!file) {
         console.log('No file selected');
         return;
      }
   
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
   
      // Clean up preview URLs when component unmounts
      useEffect(() => {
      return () => {
         console.log('Cleaning up image previews');
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
      console.log(`Validating step ${step}`);
      switch (step) {
         case 0:
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
         case 1:
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
         case 2:
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
         case 3:
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
      console.log('Moving to next step');
      if (validateStep(activeStep)) {
         setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
      };
   
      const prevStep = () => {
      console.log('Moving to previous step');
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };
   
      const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Submitting form data');
      setIsSubmitting(true);
   
      try {
         const formData = {
            ...basicInfo,
            ingredients,
            instructions,
            benefits,
         };
   
         console.log('Form data to submit:', formData);
   
         const response = await updateVideo({ id, submissionData: formData }).unwrap();
         console.log('Update response:', response);
   
         toast({
            title: 'Success',
            description: 'Video updated successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
         });
   
         navigate('/admin/videos');
         
      } catch (error) {
         console.error('Failed to update video:', error);
         toast({
            title: 'Error',
            description: error.data?.message || 'Failed to update video. Please try again.',
            status: 'error',
            duration: 3000,
            isClosable: true,
         });
      } finally {
         setIsSubmitting(false);
      }
      };
   
      const handleCancel = () => {
      console.log('Canceling edit');
      navigate('/admin/videos');
      };
   
      const renderStepContent = () => {
      console.log('Rendering step content for step', activeStep);
      if (isLoading) {
         console.log('Loading state - showing spinner');
         return <Spinner size="xl" />;
      }
      if (isError) {
         console.log('Error state - showing error message');
         return <Text color="red.500">Error loading video data</Text>;
      }
   
      switch (activeStep) {
         case 0:
            return (
            <Box>
               <Heading size="md" color={textColor} mb={4}>Basic Information</Heading>
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
                        placeholder="Enter video URL"
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
                  {ingredients.map((item, index) => (
                  <Box
                    key={item.id}
                    p={4}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={memoizedColors.cardBg}
                    onDragOver={(e) => handleDragOver(e, 'ingredients', index)}
                    onDragLeave={() => handleDragLeave('ingredients', index)}
                    onDrop={(e) => handleDrop(e, 'ingredients', index)}
                    opacity={isDragging.ingredients[index] ? 0.5 : 1}
                    transition="opacity 0.2s ease-in-out"
                  >
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
                  {instructions.map((item, index) => (
                  <Box
                    key={item.id}
                    p={4}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={memoizedColors.cardBg}
                    onDragOver={(e) => handleDragOver(e, 'instructions', index)}
                    onDragLeave={() => handleDragLeave('instructions', index)}
                    onDrop={(e) => handleDrop(e, 'instructions', index)}
                    opacity={isDragging.instructions[index] ? 0.5 : 1}
                    transition="opacity 0.2s ease-in-out"
                  >
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
                  {benefits.map((item, index) => (
                  <Box
                    key={item.id}
                    p={4}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={memoizedColors.cardBg}
                    onDragOver={(e) => handleDragOver(e, 'benefits', index)}
                    onDragLeave={() => handleDragLeave('benefits', index)}
                    onDrop={(e) => handleDrop(e, 'benefits', index)}
                    opacity={isDragging.benefits[index] ? 0.5 : 1}
                    transition="opacity 0.2s ease-in-out"
                  >
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
   
      if (isLoading) {
      return (
         <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            <Card>
            <Box p={6} textAlign="center">
               <Spinner size="xl" />
               <Text mt={4}>Loading video data...</Text>
            </Box>
            </Card>
         </Box>
      );
      }
   
      if (isError) {
      return (
         <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            <Card>
            <Box p={6} textAlign="center">
               <Text color="red.500">Error loading video data</Text>
               <Text fontSize="sm" color="gray.500" mt={2}>
                  {queryError?.data?.message || 'Please try again later'}
               </Text>
               <Button mt={4} onClick={() => navigate('/admin/videos')}>
                  Back to Videos
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
               <Heading size="lg" color={textColor}>Edit Video</Heading>
               <Text color="gray.500" fontSize="sm">
                  Step {activeStep + 1} of {steps.length}
               </Text>
            </Flex>
   
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
   
            <form onSubmit={(e) => e.preventDefault()}>
               <VStack spacing={6} align="stretch">
                  {renderStepContent()}
   
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
                          type="button"
                          colorScheme="green"
                          isLoading={isSubmitting}
                          loadingText="Updating Video"
                          onClick={handleSubmit}
                        >
                          Update Video
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
   
   export default EditVideo;