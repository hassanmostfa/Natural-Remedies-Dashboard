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
   Avatar,
   Divider,
   Heading,
   Icon,
   Image,
   Stepper,
   Step,
   StepIcon,
   StepIndicator,
   StepNumber,
   StepStatus,
   StepTitle,
   StepDescription,
   StepSeparator,
   Spinner,
 } from '@chakra-ui/react';
 import * as React from 'react';
 import Card from 'components/card/Card';
 import { useNavigate, useParams } from 'react-router-dom';
 import { AddIcon, CloseIcon } from '@chakra-ui/icons';
 import { FaLeaf, FaUpload } from 'react-icons/fa6';
 import { useUpdateRemedyMutation, useGetRemedyQuery } from 'api/remediesSlice';
 import { useGetDiseasesQuery } from 'api/diseasesSlice';
 import { useGetRemedyTypesQuery } from 'api/remediesTypesSlice';
 import { useGetBodySystemsQuery } from 'api/bodySystemsSlice';
 import { useUploadImageMutation } from 'api/fileUploadSlice';

// Custom hook for stable input handling
const useStableInput = (initialValue, onChange) => {
  const [value, setValue] = React.useState(initialValue);
  const [isFocused, setIsFocused] = React.useState(false);
  
  React.useEffect(() => {
    if (!isFocused) {
      setValue(initialValue);
    }
  }, [initialValue, isFocused]);
  
  const handleChange = React.useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(e);
  }, [onChange]);
  
  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
  }, []);
  
  const handleBlur = React.useCallback(() => {
    setIsFocused(false);
  }, []);
  
  return {
    value,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur
  };
};

// Top-level stable input component
const StableInput = React.memo(({ value, onChange, placeholder, size, bg, borderColor, borderRadius }) => {
  const inputProps = useStableInput(value, onChange);
  
  return (
    <Input
      placeholder={placeholder}
      size={size}
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius={borderRadius}
      autoComplete="off"
      spellCheck="false"
      {...inputProps}
    />
  );
});
// Top-level memoized list item to keep component identity stable across renders
const ListItem = React.memo(({ 
  item, 
  index, 
   listName, 
   textColor, 
   borderColor, 
  inputBg,
  cardBg,
  isDragging, 
   uploading, 
  imagePreviews,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInputChange,
  onListChange,
  onRemoveImage,
  onRemoveItem
}) => {
  const handleInputChange = React.useCallback((e) => {
    onListChange(listName, index, 'name', e.target.value);
  }, [onListChange, listName, index]);

  const handleRemoveItemClick = React.useCallback(() => {
    onRemoveItem(listName, index);
  }, [onRemoveItem, listName, index]);

  const handleRemoveImageClick = React.useCallback(() => {
    onRemoveImage(listName, index);
  }, [onRemoveImage, listName, index]);

  const handleDragOverLocal = React.useCallback((e) => {
    onDragOver(e, listName, index);
  }, [onDragOver, listName, index]);

  const handleDragLeaveLocal = React.useCallback(() => {
    onDragLeave(listName, index);
  }, [onDragLeave, listName, index]);

  const handleDropLocal = React.useCallback((e) => {
    onDrop(e, listName, index);
  }, [onDrop, listName, index]);

  const handleFileInputChangeLocal = React.useCallback((e) => {
    onFileInputChange(e, listName, index);
  }, [onFileInputChange, listName, index]);

  const handleUploadClick = React.useCallback(() => {
    document.getElementById(`${listName}-${item.id || index}-file-input`).click();
  }, [listName, item.id, index]);

  return (
    <Box p="4" border="1px solid" borderColor={borderColor} borderRadius="lg">
           <Flex justify="space-between" align="center" mb="3">
             <Text fontWeight="600" color={textColor}>Item {index + 1}</Text>
             <IconButton
               size="sm"
               icon={<CloseIcon />}
          onClick={handleRemoveItemClick}
               colorScheme="red"
               variant="ghost"
             />
           </Flex>
           <HStack spacing="4">
             <FormControl>
               <FormLabel fontSize="sm" color={textColor}>Image</FormLabel>
          <Box
            border="1px dashed"
            borderColor={isDragging ? 'brand.500' : 'gray.300'}
            borderRadius="md"
            p={3}
            textAlign="center"
            backgroundColor={isDragging ? 'brand.50' : inputBg}
            cursor="pointer"
            onDragOver={handleDragOverLocal}
            onDragLeave={handleDragLeaveLocal}
            onDrop={handleDropLocal}
            minH="120px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            {(imagePreviews || item.image_url) ? (
              <Flex direction="column" align="center">
                <Image
                  src={imagePreviews || item.image_url}
                  alt="Item Image"
                  maxH="80px"
                  mb={2}
                  borderRadius="md"
                  fallback={<Icon as={FaLeaf} color="green.500" boxSize="40px" />}
               />
               <Button
                 variant="outline"
                  colorScheme="red"
                  size="xs"
                  onClick={handleRemoveImageClick}
               >
                  Remove
               </Button>
              </Flex>
            ) : (
              <>
                {uploading && (
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
                  onClick={handleUploadClick}
                  isLoading={uploading}
                  loadingText="Uploading..."
                  leftIcon={uploading ? <Spinner size="xs" /> : undefined}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    id={`${listName}-${item.id || index}-file-input`}
                    hidden
                    accept="image/*"
                    onChange={handleFileInputChangeLocal}
                  />
                </Button>
              </>
               )}
             </Box>
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" color={textColor}>Name</FormLabel>
          <StableInput
            value={item.name}
            onChange={handleInputChange}
            placeholder="Enter name"
            size="sm"
            bg={cardBg}
            borderColor={borderColor}
            borderRadius="lg"
          />
        </FormControl>
           </HStack>
         </Box>
  );
});

// Top-level memoized section wrapper
const ListSection = React.memo(({ 
  title, 
  listName, 
  items,
  textColor,
  borderColor,
  inputBg,
  cardBg,
  isDraggingMap,
  uploadingMap,
  imagePreviewsMap,
  onAddItem,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInputChange,
  onListChange,
  onRemoveImage,
  onRemoveItem
}) => {
  const handleAddItem = React.useCallback(() => {
    onAddItem(listName);
  }, [onAddItem, listName]);

  return (
    <Box>
      <Flex justify="space-between" align="center" mb="4">
        <Heading size="md" color={textColor}>{title}</Heading>
        <Button
          size="sm"
          leftIcon={<AddIcon />}
          onClick={handleAddItem}
          colorScheme="blue"
          variant="outline"
        >
          Add Item
        </Button>
      </Flex>
      <VStack spacing="4" align="stretch">
        {items.map((item, index) => (
          <ListItem
            key={`${listName}-${item.id || index}`}
            item={item}
            index={index}
            listName={listName}
            textColor={textColor}
            borderColor={borderColor}
            inputBg={inputBg}
            cardBg={cardBg}
            isDragging={isDraggingMap[listName]?.[index]}
            uploading={uploadingMap[listName]?.[index]}
            imagePreviews={imagePreviewsMap[listName]?.[index]}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onFileInputChange={onFileInputChange}
            onListChange={onListChange}
            onRemoveImage={onRemoveImage}
            onRemoveItem={onRemoveItem}
          />
       ))}
     </VStack>
   </Box>
 );
});
 
 const EditRemedy = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const toast = useToast();
   const [updateRemedy, { isLoading: isUpdating }] = useUpdateRemedyMutation();
   const [uploadImage] = useUploadImageMutation();
   
   // Fetch the remedy data by ID using RTK Query
   const { data: remedyData, isLoading: isRemedyLoading, isError: isRemedyError , refetch } = useGetRemedyQuery(id);
   
   // Fetch options from API
   const { data: diseasesData } = useGetDiseasesQuery();
   const { data: remedyTypesData } = useGetRemedyTypesQuery();
   const { data: bodySystemsData } = useGetBodySystemsQuery();
 
   // Color mode values
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
 
   const [formData, setFormData] = React.useState({
     title: '',
     disease_id: '',
     remedy_type_id: '',
     body_system_id: '',
     main_image_url: '',
     description: '',
     visible_to_plan: 'all',
     status: 'active',
     product_link: '',
     ingredients: [{ id: 1, image_url: '', name: '' }],
     instructions: [{ id: 1, image_url: '', name: '' }],
     benefits: [{ id: 1, image_url: '', name: '' }],
     precautions: [{ id: 1, image_url: '', name: '' }],
   });

   const [activeStep, setActiveStep] = React.useState(0);
   const [completedSteps, setCompletedSteps] = React.useState([]);
   const [nextId, setNextId] = React.useState(2);
 
   const [uploading, setUploading] = React.useState({
     main_image: false,
     ingredients: [],
     instructions: [],
     benefits: [],
     precautions: [],
   });
 
   const [imagePreviews, setImagePreviews] = React.useState({
     main_image: null,
     ingredients: [],
     instructions: [],
     benefits: [],
     precautions: [],
   });
 
   const [isDragging, setIsDragging] = React.useState({
     main_image: false,
     ingredients: [],
     instructions: [],
     benefits: [],
     precautions: [],
   });
 
   React.useEffect(() =>{
      refetch();
   }, [refetch])
   // Populate form with existing data when loaded
   React.useEffect(() => {
     if (remedyData?.data && diseasesData?.data && remedyTypesData?.data && bodySystemsData?.data) {
       const remedy = remedyData.data;
       
       // Find the disease ID by matching the disease name
       const diseaseId = diseasesData.data.find(d => d.name === remedy.disease_relation?.name)?.id || '';
       
       // Find the remedy type ID by matching the remedy type name
       const remedyTypeId = remedyTypesData.data.find(t => t.name === remedy.remedy_type?.name)?.id || '';
       
       // Find the body system ID by matching the body system title
       const bodySystemId = bodySystemsData.data.find(s => s.title === remedy.body_system?.title)?.id || '';
       
       // Add IDs to existing items
       const addIdsToItems = (items) => {
         return items?.map((item, index) => ({ ...item, id: index + 1 })) || [{ id: 1, image_url: '', name: '' }];
       };
       
       const newFormData = {
         title: remedy.title || '',
         disease_id: diseaseId,
         remedy_type_id: remedyTypeId,
         body_system_id: bodySystemId,
         main_image_url: remedy.main_image_url || '',
         description: remedy.description || '',
         visible_to_plan: remedy.visible_to_plan || 'all',
         status: remedy.status || 'active',
         product_link: remedy.product_link || '',
         ingredients: addIdsToItems(remedy.ingredients),
         instructions: addIdsToItems(remedy.instructions),
         benefits: addIdsToItems(remedy.benefits),
         precautions: addIdsToItems(remedy.precautions),
       };
       
       setFormData(newFormData);
       
       // Set nextId based on the maximum ID in the data
       const maxId = Math.max(
         ...remedy.ingredients?.map((_, i) => i + 1) || [1],
         ...remedy.instructions?.map((_, i) => i + 1) || [1],
         ...remedy.benefits?.map((_, i) => i + 1) || [1],
         ...remedy.precautions?.map((_, i) => i + 1) || [1]
       );
       setNextId(maxId + 1);
       
       // Initialize uploading states based on existing items
       setUploading({
         main_image: false,
         ingredients: Array(remedy.ingredients?.length || 1).fill(false),
         instructions: Array(remedy.instructions?.length || 1).fill(false),
         benefits: Array(remedy.benefits?.length || 1).fill(false),
         precautions: Array(remedy.precautions?.length || 1).fill(false),
       });
     }
   }, [remedyData, diseasesData, remedyTypesData, bodySystemsData]);
 
   const visiblePlansOptions = [
     { value: 'all', label: 'All Plans' },
     { value: 'rookie', label: 'Rookie' },
     { value: 'skilled', label: 'Skilled' },
     { value: 'master', label: 'Master' },
   ];
 
   const statusOptions = [
     { value: 'active', label: 'Active' },
     { value: 'inactive', label: 'Inactive' },
   ];
 
   const handleInputChange = (field, value) => {
     setFormData(prev => ({
       ...prev,
       [field]: value
     }));
   };
 
     const handleListChange = (listName, index, field, value) => {
    setFormData(prev => {
      const updatedList = [...prev[listName]];
      updatedList[index] = { ...updatedList[index], [field]: value };
      return {
        ...prev,
        [listName]: updatedList
      };
    });
  };
 
   const addListItem = React.useCallback((listName) => {
     const newId = nextId;
     setNextId(prev => prev + 1);
     
     setFormData(prev => ({
       ...prev,
       [listName]: [...prev[listName], { id: newId, image_url: '', name: '' }]
     }));
     
     setUploading(prev => ({
       ...prev,
       [listName]: [...(prev[listName] || []), false]
     }));
     
     setImagePreviews(prev => ({
       ...prev,
       [listName]: [...(prev[listName] || []), null]
     }));
   }, [nextId]);
 
   const removeListItem = React.useCallback((listName, index) => {
     setFormData(prev => ({
       ...prev,
       [listName]: prev[listName].filter((_, i) => i !== index)
     }));
     
     setUploading(prev => ({
       ...prev,
       [listName]: (prev[listName] || []).filter((_, i) => i !== index)
     }));
     
     setImagePreviews(prev => ({
       ...prev,
       [listName]: (prev[listName] || []).filter((_, i) => i !== index)
     }));
   }, []);
 
   const handleImageUploadToServer = async (file, field, index = null) => {
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
   
       const response = await uploadImage(file).unwrap();
       if (response.success && response.url) {
         // Update the corresponding field with the URL
         if (index !== null) {
           handleListChange(field, index, 'image_url', response.url);
         } else {
           // For main image, we need to update main_image_url in formData
           if (field === 'main_image') {
             handleInputChange('main_image_url', response.url);
         } else {
           handleInputChange(field, response.url);
           }
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
       
       let errorMessage = 'Failed to upload image';
       
       if (error?.data?.includes('<!DOCTYPE html>')) {
         errorMessage = 'Server returned HTML. Check API endpoint.';
       } else if (error?.status === 'PARSING_ERROR') {
         errorMessage = 'Invalid server response.';
       } else if (error?.error) {
         errorMessage = error.error;
       }
   
       toast({
         title: 'Error',
         description: errorMessage,
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

   const handleRemoveImage = React.useCallback((listName, index) => {
     setImagePreviews(prev => ({
       ...prev,
       [listName]: prev[listName].map((item, i) => i === index ? null : item)
     }));
     handleListChange(listName, index, 'image_url', '');
   }, []);
 
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
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     return; // Temporarily disable form submission
   };
 
   const handleUpdateRemedy = async () => {
     try {
       // Validate form data
       if (!formData.title.trim()) {
         toast({
           title: 'Error',
           description: 'Title is required',
           status: 'error',
           duration: 3000,
           isClosable: true,
         });
         return;
       }
 
       if (!formData.description.trim()) {
         toast({
           title: 'Error',
           description: 'Description is required',
           status: 'error',
           duration: 3000,
           isClosable: true,
         });
         return;
       }
 
       if (!formData.disease_id) {
         toast({
           title: 'Error',
           description: 'Disease is required',
           status: 'error',
           duration: 3000,
           isClosable: true,
         });
         return;
       }
 
       if (!formData.remedy_type_id) {
         toast({
           title: 'Error',
           description: 'Remedy type is required',
           status: 'error',
           duration: 3000,
           isClosable: true,
         });
         return;
       }
 
       if (!formData.body_system_id) {
         toast({
           title: 'Error',
           description: 'Body system is required',
           status: 'error',
           duration: 3000,
           isClosable: true,
         });
         return;
       }
 
       // Check if any image is still uploading
       const isUploading = uploading.main_image || 
                          uploading.ingredients.some(Boolean) || 
                          uploading.instructions.some(Boolean) || 
                          uploading.benefits.some(Boolean) || 
                          uploading.precautions.some(Boolean);
 
       if (isUploading) {
         toast({
           title: 'Error',
           description: 'Please wait for all images to finish uploading',
           status: 'error',
           duration: 3000,
           isClosable: true,
         });
         return;
       }
 
       // Prepare the data for API submission
       const submissionData = {
         id,
         title: formData.title,
         disease_id: formData.disease_id,
         remedy_type_id: formData.remedy_type_id,
         body_system_id: formData.body_system_id,
         main_image_url: formData.main_image_url,
         description: formData.description,
         visible_to_plan: formData.visible_to_plan,
         status: formData.status,
         product_link: formData.product_link,
         ingredients: formData.ingredients.map(({ id, ...item }) => item),
         instructions: formData.instructions.map(({ id, ...item }) => item),
         benefits: formData.benefits.map(({ id, ...item }) => item),
         precautions: formData.precautions.map(({ id, ...item }) => item),
       };
 
       console.log('Submitting update:', submissionData);
       // Call the API
       const response = await updateRemedy({ id, submissionData }).unwrap();
 
       toast({
         title: 'Success',
         description: response.message || 'Remedy updated successfully',
         status: 'success',
         duration: 3000,
         isClosable: true,
       });
 
       // Navigate back to remedies list
       navigate('/admin/remedies');
       
     } catch (error) {
       console.error('Failed to update remedy:', error);
       toast({
         title: 'Error',
         description: error?.data?.message || 'Failed to update remedy. Please try again.',
         status: 'error',
         duration: 3000,
         isClosable: true,
       });
     }
   };
 
   const handleCancel = () => {
     navigate('/admin/remedies');
   };
 
   const handleNext = () => {
     setActiveStep((prevStep) => prevStep + 1);
     setCompletedSteps((prev) => [...prev, activeStep]);
   };

   const handlePrevious = () => {
     setActiveStep((prevStep) => prevStep - 1);
   };

   const handleStepClick = (stepIndex) => {
     if (completedSteps.includes(stepIndex) || stepIndex <= activeStep) {
       setActiveStep(stepIndex);
     }
   };

   const isStepComplete = (stepIndex) => {
     return completedSteps.includes(stepIndex);
   };

   const canProceedToNext = () => {
     switch (activeStep) {
       case 0:
         return formData.title.trim() && 
                formData.disease_id && 
                formData.remedy_type_id && 
                formData.body_system_id && 
                formData.description.trim();
       case 1:
         return formData.ingredients.length > 0 && 
                formData.ingredients.every(item => item.name.trim());
       case 2:
         return formData.instructions.length > 0 && 
                formData.instructions.every(item => item.name.trim());
       case 3:
         return formData.benefits.length > 0 && 
                formData.benefits.every(item => item.name.trim());
       case 4:
         return formData.precautions.length > 0 && 
                formData.precautions.every(item => item.name.trim());
       default:
         return true;
          }
   };

   const steps = [
     { title: 'Basic Information', description: 'Remedy details' },
     { title: 'Ingredients', description: 'Required ingredients' },
     { title: 'Instructions', description: 'Step-by-step guide' },
     { title: 'Benefits', description: 'Health benefits' },
     { title: 'Precautions', description: 'Safety warnings' },
   ];

   const renderStepContent = () => {
     switch (activeStep) {
       case 0:
         return (
               <Box>
             <Heading size="md" color={memoizedColors.textColor} mb="4">Basic Information</Heading>
                 <VStack spacing="4" align="stretch">
                     <FormControl>
                 <FormLabel color={memoizedColors.textColor} fontWeight="600">Main Image</FormLabel>
                 <Box
                   border="1px dashed"
                   borderColor={isDragging.main_image ? 'brand.500' : 'gray.300'}
                   borderRadius="md"
                   p={4}
                   textAlign="center"
                   backgroundColor={isDragging.main_image ? 'brand.50' : memoizedColors.inputBg}
                   cursor="pointer"
                   onDragOver={(e) => handleDragOver(e, 'main_image')}
                   onDragLeave={() => handleDragLeave('main_image')}
                   onDrop={(e) => handleDrop(e, 'main_image')}
                   mb={4}
                   position="relative"
                 >
                   {imagePreviews.main_image || formData.main_image_url ? (
                     <Flex direction="column" align="center">
                       <Image
                         src={imagePreviews.main_image || formData.main_image_url}
                         alt="Main Image"
                         maxH="200px"
                         mb={2}
                         borderRadius="md"
                         fallback={<Icon as={FaLeaf} color="green.500" boxSize="100px" />}
                       />
                       <Button
                         variant="outline"
                         colorScheme="red"
                         size="sm"
                         onClick={() => {
                           setImagePreviews(prev => ({ ...prev, main_image: null }));
                           handleInputChange('main_image_url', '');
                         }}
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
                       {uploading.main_image ? (
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
                 <FormLabel color={memoizedColors.textColor} fontWeight="600">Title</FormLabel>
                 <Input
                   placeholder="Enter remedy title"
                   value={formData.title}
                   onChange={(e) => handleInputChange('title', e.target.value)}
                   bg={memoizedColors.cardBg}
                   border="1px solid"
                   borderColor={memoizedColors.borderColor}
                   borderRadius="lg"
                 />
               </FormControl>
 
                                      <HStack spacing="4">
                                           <FormControl isRequired>
                   <FormLabel color={memoizedColors.textColor} fontWeight="600">Disease</FormLabel>
                        <Select
                          value={formData.disease_id}
                          onChange={(e) => handleInputChange('disease_id', e.target.value)}
                     bg={memoizedColors.cardBg}
                          border="1px solid"
                     borderColor={memoizedColors.borderColor}
                          borderRadius="lg"
                          placeholder="Select disease"
                        >
                          {diseasesData?.data?.map((disease) => (
                            <option key={disease.id} value={disease.id}>
                              {disease.name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                     <FormControl isRequired>
                   <FormLabel color={memoizedColors.textColor} fontWeight="600">Remedy Type</FormLabel>
                       <Select
                         value={formData.remedy_type_id}
                         onChange={(e) => handleInputChange('remedy_type_id', e.target.value)}
                     bg={memoizedColors.cardBg}
                         border="1px solid"
                     borderColor={memoizedColors.borderColor}
                         borderRadius="lg"
                         placeholder="Select remedy type"
                       >
                         {remedyTypesData?.data?.map((type) => (
                           <option key={type.id} value={type.id}>
                             {type.name}
                           </option>
                         ))}
                       </Select>
                     </FormControl>
                     <FormControl isRequired>
                   <FormLabel color={memoizedColors.textColor} fontWeight="600">Body System</FormLabel>
                       <Select
                         value={formData.body_system_id}
                         onChange={(e) => handleInputChange('body_system_id', e.target.value)}
                     bg={memoizedColors.cardBg}
                         border="1px solid"
                     borderColor={memoizedColors.borderColor}
                         borderRadius="lg"
                         placeholder="Select body system"
                       >
                         {bodySystemsData?.data?.map((system) => (
                           <option key={system.id} value={system.id}>
                             {system.title}
                           </option>
                         ))}
                       </Select>
                     </FormControl>
                   </HStack>
 
                   <FormControl isRequired>
                 <FormLabel color={memoizedColors.textColor} fontWeight="600">Description</FormLabel>
                     <Textarea
                       placeholder="Enter detailed description"
                       value={formData.description}
                       onChange={(e) => handleInputChange('description', e.target.value)}
                       rows={4}
                   bg={memoizedColors.cardBg}
                       border="1px solid"
                   borderColor={memoizedColors.borderColor}
                       borderRadius="lg"
                     />
                   </FormControl>
 
               <HStack spacing="4">
                   <FormControl>
                   <FormLabel color={memoizedColors.textColor} fontWeight="600">Visible to Plans</FormLabel>
                     <Select
                       value={formData.visible_to_plan}
                       onChange={(e) => handleInputChange('visible_to_plan', e.target.value)}
                     bg={memoizedColors.cardBg}
                       border="1px solid"
                     borderColor={memoizedColors.borderColor}
                       borderRadius="lg"
                     >
                       {visiblePlansOptions.map((option) => (
                         <option key={option.value} value={option.value}>
                           {option.label}
                         </option>
                       ))}
                     </Select>
                   </FormControl>
                   <FormControl>
                   <FormLabel color={memoizedColors.textColor} fontWeight="600">Status</FormLabel>
                     <Select
                       value={formData.status}
                       onChange={(e) => handleInputChange('status', e.target.value)}
                     bg={memoizedColors.cardBg}
                       border="1px solid"
                     borderColor={memoizedColors.borderColor}
                       borderRadius="lg"
                     >
                       {statusOptions.map((option) => (
                         <option key={option.value} value={option.value}>
                           {option.label}
                         </option>
                       ))}
                     </Select>
                 </FormControl>
               </HStack>

               <FormControl>
                 <FormLabel color={memoizedColors.textColor} fontWeight="600">Product Link</FormLabel>
                 <Input
                   placeholder="Enter product link (e.g., Amazon URL)"
                   value={formData.product_link}
                   onChange={(e) => handleInputChange('product_link', e.target.value)}
                   bg={memoizedColors.cardBg}
                   border="1px solid"
                   borderColor={memoizedColors.borderColor}
                   borderRadius="lg"
                 />
                   </FormControl>
                 </VStack>
               </Box>
         );
       case 1:
         return (
               <ListSection 
                 title="Ingredients" 
                 listName="ingredients" 
                 items={formData.ingredients}
             textColor={memoizedColors.textColor}
             borderColor={memoizedColors.borderColor}
             inputBg={memoizedColors.inputBg}
             cardBg={memoizedColors.cardBg}
             isDraggingMap={isDragging}
             uploadingMap={uploading}
             imagePreviewsMap={imagePreviews}
             onAddItem={addListItem}
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}
             onFileInputChange={handleFileInputChange}
             onListChange={handleListChange}
             onRemoveImage={handleRemoveImage}
             onRemoveItem={removeListItem}
           />
         );
       case 2:
         return (
               <ListSection 
                 title="Instructions" 
                 listName="instructions" 
                 items={formData.instructions}
             textColor={memoizedColors.textColor}
             borderColor={memoizedColors.borderColor}
             inputBg={memoizedColors.inputBg}
             cardBg={memoizedColors.cardBg}
             isDraggingMap={isDragging}
             uploadingMap={uploading}
             imagePreviewsMap={imagePreviews}
             onAddItem={addListItem}
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}
             onFileInputChange={handleFileInputChange}
             onListChange={handleListChange}
             onRemoveImage={handleRemoveImage}
             onRemoveItem={removeListItem}
           />
         );
       case 3:
         return (
               <ListSection 
                 title="Benefits" 
                 listName="benefits" 
                 items={formData.benefits}
             textColor={memoizedColors.textColor}
             borderColor={memoizedColors.borderColor}
             inputBg={memoizedColors.inputBg}
             cardBg={memoizedColors.cardBg}
             isDraggingMap={isDragging}
             uploadingMap={uploading}
             imagePreviewsMap={imagePreviews}
             onAddItem={addListItem}
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}
             onFileInputChange={handleFileInputChange}
             onListChange={handleListChange}
             onRemoveImage={handleRemoveImage}
             onRemoveItem={removeListItem}
           />
         );
       case 4:
         return (
               <ListSection 
                 title="Precautions" 
                 listName="precautions" 
                 items={formData.precautions}
             textColor={memoizedColors.textColor}
             borderColor={memoizedColors.borderColor}
             inputBg={memoizedColors.inputBg}
             cardBg={memoizedColors.cardBg}
             isDraggingMap={isDragging}
             uploadingMap={uploading}
             imagePreviewsMap={imagePreviews}
             onAddItem={addListItem}
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}
             onFileInputChange={handleFileInputChange}
             onListChange={handleListChange}
             onRemoveImage={handleRemoveImage}
             onRemoveItem={removeListItem}
           />
         );
       default:
         return null;
     }
   };

   if (isRemedyLoading) {
     return (
       <Box mt="80px">
         <Card>
           <Flex justifyContent="center" alignItems="center" height="200px">
             <Text>Loading remedy data...</Text>
           </Flex>
         </Card>
       </Box>
     );
   }
 
   return (
     <Box mt="80px">
       <Card
         flexDirection="column"
         w="100%"
         px="0px"
         overflowX={{ sm: 'scroll', lg: 'hidden' }}
       >
         <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
           <Text
             color={textColor}
             fontSize="22px"
             fontWeight="700"
             lineHeight="100%"
           >
             Edit Remedy
           </Text>
         </Flex>
         
                  <Box px="25px" pb="25px">
           <form onSubmit={handleSubmit}>
             <VStack spacing="8" align="stretch" w="100%">
               <Stepper index={activeStep} colorScheme="blue" size="sm">
                 {steps.map((step, index) => (
                   <Step key={index} onClick={() => handleStepClick(index)} cursor="pointer">
                     <StepIndicator>
                       <StepStatus
                         complete={<StepIcon />}
                         incomplete={<StepNumber />}
                         active={<StepNumber />}
                       />
                     </StepIndicator>
                     <Box flexShrink="0">
                       <StepTitle>{step.title}</StepTitle>
                       <StepDescription>{step.description}</StepDescription>
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
                       onClick={handlePrevious}
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
                       onClick={handleNext}
                       isDisabled={!canProceedToNext()}
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
                         isLoading={isUpdating}
                         loadingText="Updating..."
                         isDisabled={!canProceedToNext()}
                         onClick={handleUpdateRemedy}
                   _hover={{
                           bg: 'blue.600',
                   }}
                 >
                         Update Remedy
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
 
 export default EditRemedy;