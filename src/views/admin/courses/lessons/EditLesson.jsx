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
  Divider,
  Heading,
  Icon,
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { useNavigate, useParams } from 'react-router-dom';
import { AddIcon, CloseIcon, ArrowBackIcon, ChevronRightIcon as BreadcrumbChevron } from '@chakra-ui/icons';
import { FaPlay, FaVideo, FaFileAlt, FaImage, FaLeaf, FaList, FaListOl, FaUpload } from 'react-icons/fa';
import { useGetLessonQuery, useUpdateLessonMutation } from 'api/lessonsSlice';
import { useUploadImageMutation } from 'api/fileUploadSlice';
import { useGetCourseQuery } from 'api/coursesSlice';
import { useGetRemediesQuery } from 'api/remediesSlice';

const EditLesson = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { courseId, id, course_id, lessonId, lesson_id } = params;
  const actualCourseId = courseId || id || course_id;
  const actualLessonId = lessonId || lesson_id;
  const toast = useToast();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const steps = [
    { title: 'Basic Information' },
    { title: 'Content Blocks' },
    { title: 'Review & Submit' },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [formData, setFormData] = React.useState({
    course_id: actualCourseId,
    title: '',
    description: '',
    image: '',
    status: 'active',
    content_blocks: []
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDataLoaded, setIsDataLoaded] = React.useState(false);
  
  // API hooks
  const { data: lessonResponse, isLoading: isLoadingLesson, error: lessonError } = useGetLessonQuery(actualLessonId);
  const { data: courseResponse, isLoading: isLoadingCourse } = useGetCourseQuery(actualCourseId);
  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const { data: remediesResponse, isLoading: isLoadingRemedies } = useGetRemediesQuery({
    per_page: 1000
  });

  // Image upload states
  const [imagePreview, setImagePreview] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  
  // Content block image states
  const [contentImagePreviews, setContentImagePreviews] = React.useState({});
  const [contentImageUploading, setContentImageUploading] = React.useState({});
  const [contentImageDragging, setContentImageDragging] = React.useState({});

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const contentTypeOptions = [
    { value: 'video', label: 'Video', icon: FaVideo, color: 'red.500' },
    { value: 'text', label: 'Text', icon: FaFileAlt, color: 'blue.500' },
    { value: 'image', label: 'Image', icon: FaImage, color: 'purple.500' },
    { value: 'remedy', label: 'Remedy', icon: FaLeaf, color: 'green.500' },
    { value: 'ingredients', label: 'Ingredients', icon: FaList, color: 'orange.500' },
    { value: 'instructions', label: 'Instructions', icon: FaListOl, color: 'teal.500' },
  ];

  const lessonData = lessonResponse?.data || null;
  const courseData = courseResponse?.data || null;
  const availableRemedies = remediesResponse?.data || [];


  // Load lesson data when component mounts
  React.useEffect(() => {
    if (lessonData && !isDataLoaded) {
      setFormData({
        course_id: lessonData.course_id || actualCourseId,
        title: lessonData.title || '',
        description: lessonData.description || '',
        image: lessonData.image || '',
        status: lessonData.status || 'active',
        content_blocks: lessonData.content_blocks || []
      });

      // Set image preview if exists
      if (lessonData.image) {
        setImagePreview(lessonData.image);
      }

      // Set content image previews
      if (lessonData.content_blocks) {
        const previews = {};
        lessonData.content_blocks.forEach((block, blockIndex) => {
          if (block.image_url) {
            previews[`${blockIndex}-image_url`] = block.image_url;
          }
          if (block.content && (block.content.items || block.content.steps)) {
            const items = block.content.items || block.content.steps || [];
            items.forEach((item, itemIndex) => {
              if (item.image_url) {
                const itemType = block.type === 'ingredients' ? 'ingredient' : 'step';
                previews[`${blockIndex}-${itemIndex}-${itemType}`] = item.image_url;
              }
            });
          }
        });
        setContentImagePreviews(previews);
      }

      setIsDataLoaded(true);
    }
  }, [lessonData, isDataLoaded, actualCourseId]);



  const handleInputChange = React.useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

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
      setIsUploadingImage(true);
      
      await new Promise(resolve => setTimeout(resolve, 100));

      const uploadStartTime = Date.now();
      const response = await uploadImage(file).unwrap();
      const uploadTime = Date.now() - uploadStartTime;
      
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
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  // Content block image upload functions
  const handleContentImageUpload = (files, blockIndex, fieldName) => {
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

      handleContentImageUploadToServer(selectedFile, blockIndex, fieldName);
    }
  };

  const handleContentImageUploadToServer = async (file, blockIndex, fieldName) => {
    const uploadKey = `${blockIndex}-${fieldName}`;
    
    try {
      const previewUrl = URL.createObjectURL(file);
      setContentImagePreviews(prev => ({
        ...prev,
        [uploadKey]: previewUrl
      }));
      setContentImageUploading(prev => ({
        ...prev,
        [uploadKey]: true
      }));
      
      await new Promise(resolve => setTimeout(resolve, 100));

      const uploadStartTime = Date.now();
      const response = await uploadImage(file).unwrap();
      const uploadTime = Date.now() - uploadStartTime;
      
      if (uploadTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - uploadTime));
      }
      
      if (response.success && response.url) {
        updateContentBlock(blockIndex, fieldName, response.url);

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
      setContentImagePreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[uploadKey];
        return newPreviews;
      });
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to upload image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setContentImageUploading(prev => ({
        ...prev,
        [uploadKey]: false
      }));
    }
  };

  const handleContentImageDrop = (e, blockIndex, fieldName) => {
    e.preventDefault();
    const uploadKey = `${blockIndex}-${fieldName}`;
    setContentImageDragging(prev => ({
      ...prev,
      [uploadKey]: false
    }));
    const files = e.dataTransfer.files;
    handleContentImageUpload(files, blockIndex, fieldName);
  };

  const handleContentImageDragOver = (e, blockIndex, fieldName) => {
    e.preventDefault();
    const uploadKey = `${blockIndex}-${fieldName}`;
    setContentImageDragging(prev => ({
      ...prev,
      [uploadKey]: true
    }));
  };

  const handleContentImageDragLeave = (blockIndex, fieldName) => {
    const uploadKey = `${blockIndex}-${fieldName}`;
    setContentImageDragging(prev => ({
      ...prev,
      [uploadKey]: false
    }));
  };

  const clearContentImage = (blockIndex, fieldName) => {
    const uploadKey = `${blockIndex}-${fieldName}`;
    setContentImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[uploadKey];
      return newPreviews;
    });
    updateContentBlock(blockIndex, fieldName, '');
  };

  // Content item image upload functions
  const handleContentItemImageUpload = (files, blockIndex, itemIndex, itemType) => {
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

      handleContentItemImageUploadToServer(selectedFile, blockIndex, itemIndex, itemType);
    }
  };

  const handleContentItemImageUploadToServer = async (file, blockIndex, itemIndex, itemType) => {
    const uploadKey = `${blockIndex}-${itemIndex}-${itemType}`;
    
    try {
      const previewUrl = URL.createObjectURL(file);
      setContentImagePreviews(prev => ({
        ...prev,
        [uploadKey]: previewUrl
      }));
      setContentImageUploading(prev => ({
        ...prev,
        [uploadKey]: true
      }));
      
      await new Promise(resolve => setTimeout(resolve, 100));

      const uploadStartTime = Date.now();
      const response = await uploadImage(file).unwrap();
      const uploadTime = Date.now() - uploadStartTime;
      
      if (uploadTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - uploadTime));
      }
      
      if (response.success && response.url) {
        updateContentItem(blockIndex, itemIndex, itemType, 'image_url', response.url);

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
      setContentImagePreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[uploadKey];
        return newPreviews;
      });
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to upload image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setContentImageUploading(prev => ({
        ...prev,
        [uploadKey]: false
      }));
    }
  };

  const clearContentItemImage = (blockIndex, itemIndex, itemType) => {
    const uploadKey = `${blockIndex}-${itemIndex}-${itemType}`;
    setContentImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[uploadKey];
      return newPreviews;
    });
    updateContentItem(blockIndex, itemIndex, itemType, 'image_url', '');
  };

  // Content block management
  const addContentBlock = (type) => {
    const newBlock = {
      type,
      title: '',
      description: '',
      order: formData.content_blocks.length,
      ...(type === 'video' && { video_url: '', image_url: '' }),
      ...(type === 'image' && { image_url: '' }),
      ...(type === 'remedy' && { remedy_id: '' }),
      ...(type === 'ingredients' && { 
        image_url: '', 
        content: { items: [{ title: '', image_url: '' }] } 
      }),
      ...(type === 'instructions' && { 
        image_url: '', 
        content: { steps: [{ title: '', image_url: '' }] } 
      }),
    };

    setFormData(prev => ({
      ...prev,
      content_blocks: [...prev.content_blocks, newBlock]
    }));
  };

  const updateContentBlock = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      content_blocks: prev.content_blocks.map((block, i) => 
        i === index ? { ...block, [field]: value } : block
      )
    }));
  };

  const removeContentBlock = (index) => {
    setFormData(prev => ({
      ...prev,
      content_blocks: prev.content_blocks.filter((_, i) => i !== index).map((block, i) => ({
        ...block,
        order: i
      }))
    }));
  };

  const moveContentBlock = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.content_blocks.length) return;

    setFormData(prev => {
      const newBlocks = [...prev.content_blocks];
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      return {
        ...prev,
        content_blocks: newBlocks.map((block, i) => ({ ...block, order: i }))
      };
    });
  };

  const addContentItem = (blockIndex, itemType, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      content_blocks: prev.content_blocks.map((block, i) => {
        if (i === blockIndex) {
          const arrayKey = itemType === 'ingredient' ? 'items' : 'steps';
          return {
            ...block,
            content: {
              ...block.content,
              [arrayKey]: [...(block.content?.[arrayKey] || []), defaultItem]
            }
          };
        }
        return block;
      })
    }));
  };

  const updateContentItem = (blockIndex, itemIndex, itemType, field, value) => {
    setFormData(prev => ({
      ...prev,
      content_blocks: prev.content_blocks.map((block, i) => {
        if (i === blockIndex) {
          const arrayKey = itemType === 'ingredient' ? 'items' : 'steps';
          return {
            ...block,
            content: {
              ...block.content,
              [arrayKey]: block.content[arrayKey].map((item, j) => 
                j === itemIndex ? { ...item, [field]: value } : item
              )
            }
          };
        }
        return block;
      })
    }));
  };

  const removeContentItem = (blockIndex, itemIndex, itemType) => {
    setFormData(prev => ({
      ...prev,
      content_blocks: prev.content_blocks.map((block, i) => {
        if (i === blockIndex) {
          const arrayKey = itemType === 'ingredient' ? 'items' : 'steps';
          return {
            ...block,
            content: {
              ...block.content,
              [arrayKey]: block.content[arrayKey].filter((_, j) => j !== itemIndex)
            }
          };
        }
        return block;
      })
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: // Basic Information
        if (!formData.title.trim()) {
          toast({
            title: 'Error',
            description: 'Lesson title is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        if (!formData.description.trim()) {
          toast({
            title: 'Error',
            description: 'Lesson description is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        return true;
      case 1: // Content Blocks
        if (formData.content_blocks.length === 0) {
          toast({
            title: 'Error',
            description: 'At least one content block is required',
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
      for (let i = 0; i < steps.length - 1; i++) {
        if (!validateStep(i)) {
          setActiveStep(i);
          return;
        }
      }

      // Prepare lesson data for API
      const lesson = {
        course_id: parseInt(actualCourseId),
        title: formData.title,
        description: formData.description,
        image: formData.image,
        status: formData.status,
        content_blocks: formData.content_blocks.map(block => ({
          ...block,
          order: block.order
        }))
      };

      await updateLesson({ id: actualLessonId, lesson }).unwrap();

      toast({
        title: 'Success',
        description: 'Lesson updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate(`/admin/courses/${actualCourseId}/lessons`);
      
    } catch (error) {
      console.error('Failed to update lesson:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to update lesson. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/courses/${actualCourseId}/lessons`);
  };

  // Image upload container component
  const ImageUploadContainer = ({ 
    value, 
    uploadKey, 
    onUpload, 
    onClear, 
    placeholder = "Upload Image",
    size = "sm" 
  }) => {
    const isUploading = contentImageUploading[uploadKey];
    const isDragging = contentImageDragging[uploadKey];
    const preview = contentImagePreviews[uploadKey];
    
    return (
      <Box
        border="1px dashed"
        borderColor={isDragging ? 'brand.500' : 'gray.300'}
        borderRadius="md"
        p={size === 'sm' ? 2 : 4}
        textAlign="center"
        backgroundColor={isDragging ? 'brand.50' : 'white'}
        cursor="default"
        onDragOver={(e) => {
          e.preventDefault();
          const parts = uploadKey.split('-');
          if (parts.length === 2) {
            handleContentImageDragOver(e, parseInt(parts[0]), parts[1]);
          }
        }}
        onDragLeave={() => {
          const parts = uploadKey.split('-');
          if (parts.length === 2) {
            handleContentImageDragLeave(parseInt(parts[0]), parts[1]);
          }
        }}
        onDrop={(e) => {
          const parts = uploadKey.split('-');
          if (parts.length === 2) {
            handleContentImageDrop(e, parseInt(parts[0]), parts[1]);
          }
        }}
        position="relative"
        minH={size === 'sm' ? '80px' : '120px'}
      >
        {preview || value ? (
          <Flex direction="column" align="center">
            <Image
              src={preview || value}
              alt="Preview"
              maxH={size === 'sm' ? '60px' : '100px'}
              mb={2}
              borderRadius="md"
              fallback={<Icon as={FaImage} color="gray.500" boxSize={size === 'sm' ? '30px' : '50px'} />}
            />
            <Button
              variant="outline"
              colorScheme="red"
              size="xs"
              onClick={onClear}
            >
              Remove
            </Button>
          </Flex>
        ) : (
          <>
            {isUploading && (
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
                <VStack spacing="2">
                  <Spinner size={size === 'sm' ? 'md' : 'lg'} color="white" thickness="4px" speed="0.6s" />
                  <Text color="white" fontSize={size === 'sm' ? 'xs' : 'sm'} fontWeight="bold">Uploading...</Text>
                </VStack>
              </Box>
            )}
            <Icon as={FaUpload} w={size === 'sm' ? 4 : 6} h={size === 'sm' ? 4 : 6} color="#422afb" mb={1} />
            <Text color="gray.500" mb={1} fontSize={size === 'sm' ? 'xs' : 'sm'}>
              Drag & Drop
            </Text>
            <Button
              variant="outline"
              border="none"
              onClick={onUpload}
              isLoading={isUploading}
              loadingText="Uploading..."
              bg={isUploading ? "blue.500" : "transparent"}
              color={isUploading ? "white" : "#422afb"}
              size="xs"
            >
              {placeholder}
            </Button>
          </>
        )}
      </Box>
    );
  };

  const renderContentBlockForm = (block, index) => {
    const typeOption = contentTypeOptions.find(opt => opt.value === block.type);
    
    return (
      <Box key={index} p={4} border="1px" borderColor={borderColor} borderRadius="lg" mb={4}>
        <Flex justify="space-between" align="center" mb={4}>
          <HStack spacing={3}>
            <Icon as={typeOption?.icon} color={typeOption?.color} />
            <Badge colorScheme={block.type === 'video' ? 'red' : block.type === 'text' ? 'blue' : 'purple'}>
              {typeOption?.label}
            </Badge>
            <Text fontWeight="medium" color={textColor}>Block {index + 1}</Text>
          </HStack>
          <HStack spacing={2}>
            <Button size="sm" onClick={() => moveContentBlock(index, 'up')} isDisabled={index === 0}>
              ↑
            </Button>
            <Button size="sm" onClick={() => moveContentBlock(index, 'down')} isDisabled={index === formData.content_blocks.length - 1}>
              ↓
            </Button>
            <IconButton
              aria-label="Remove block"
              icon={<CloseIcon />}
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={() => removeContentBlock(index)}
            />
          </HStack>
        </Flex>

        <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>Title</FormLabel>
            <Input
              value={block.title}
              onChange={(e) => updateContentBlock(index, 'title', e.target.value)}
              placeholder="Enter block title"
              size="sm"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>Description</FormLabel>
            <Input
              value={block.description}
              onChange={(e) => updateContentBlock(index, 'description', e.target.value)}
              placeholder="Enter block description"
              size="sm"
            />
          </FormControl>
        </Grid>

        {/* Type-specific fields */}
        {block.type === 'video' && (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm" color={textColor}>Video URL</FormLabel>
              <Input
                value={block.video_url || ''}
                onChange={(e) => updateContentBlock(index, 'video_url', e.target.value)}
                placeholder="Enter video URL"
                size="sm"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color={textColor}>Thumbnail Image</FormLabel>
              <ImageUploadContainer
                value={block.image_url}
                uploadKey={`${index}-image_url`}
                onUpload={() => document.getElementById(`content-image-${index}-image_url`).click()}
                onClear={() => clearContentImage(index, 'image_url')}
                placeholder="Upload Thumbnail"
              />
              <input
                type="file"
                id={`content-image-${index}-image_url`}
                hidden
                accept="image/*"
                onChange={(e) => handleContentImageUpload(e.target.files, index, 'image_url')}
                disabled={contentImageUploading[`${index}-image_url`]}
              />
            </FormControl>
          </VStack>
        )}

        {block.type === 'image' && (
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>Image</FormLabel>
            <ImageUploadContainer
              value={block.image_url}
              uploadKey={`${index}-image_url`}
              onUpload={() => document.getElementById(`content-image-${index}-image_url`).click()}
              onClear={() => clearContentImage(index, 'image_url')}
              placeholder="Upload Image"
            />
            <input
              type="file"
              id={`content-image-${index}-image_url`}
              hidden
              accept="image/*"
              onChange={(e) => handleContentImageUpload(e.target.files, index, 'image_url')}
              disabled={contentImageUploading[`${index}-image_url`]}
            />
          </FormControl>
        )}

        {block.type === 'remedy' && (
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>Select Remedy</FormLabel>
            <Select
              value={block.remedy_id || ''}
              onChange={(e) => updateContentBlock(index, 'remedy_id', e.target.value)}
              placeholder="Choose a remedy"
              size="sm"
            >
              {availableRemedies.map(remedy => (
                <option key={remedy.id} value={remedy.id}>
                  {remedy.title}
                </option>
              ))}
            </Select>
          </FormControl>
        )}

        {(block.type === 'ingredients' || block.type === 'instructions') && (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm" color={textColor}>Header Image</FormLabel>
              <ImageUploadContainer
                value={block.image_url}
                uploadKey={`${index}-image_url`}
                onUpload={() => document.getElementById(`content-image-${index}-image_url`).click()}
                onClear={() => clearContentImage(index, 'image_url')}
                placeholder="Upload Header Image"
              />
              <input
                type="file"
                id={`content-image-${index}-image_url`}
                hidden
                accept="image/*"
                onChange={(e) => handleContentImageUpload(e.target.files, index, 'image_url')}
                disabled={contentImageUploading[`${index}-image_url`]}
              />
            </FormControl>
            
            <Box>
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="medium" color={textColor}>
                  {block.type === 'ingredients' ? 'Ingredients' : 'Steps'}
                </Text>
                <Button
                  size="sm"
                  leftIcon={<AddIcon />}
                  onClick={() => addContentItem(
                    index, 
                    block.type === 'ingredients' ? 'ingredient' : 'step',
                    { title: '', image_url: '' }
                  )}
                >
                  Add {block.type === 'ingredients' ? 'Ingredient' : 'Step'}
                </Button>
              </Flex>
              
              {block.content && (
                <VStack spacing={3} align="stretch">
                  {(block.content.items || block.content.steps || []).map((item, itemIndex) => (
                    <Box key={itemIndex} p={3} border="1px" borderColor="gray.200" borderRadius="md">
                      <Grid templateColumns="1fr auto" gap={3} alignItems="start" mb={3}>
                        <FormControl>
                          <FormLabel fontSize="xs" color={textColor}>Title</FormLabel>
                          <Input
                            value={item.title || ''}
                            onChange={(e) => updateContentItem(
                              index, 
                              itemIndex, 
                              block.type === 'ingredients' ? 'ingredient' : 'step',
                              'title',
                              e.target.value
                            )}
                            placeholder="Enter title"
                            size="sm"
                          />
                        </FormControl>
                        <IconButton
                          aria-label="Remove item"
                          icon={<CloseIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => removeContentItem(
                            index, 
                            itemIndex, 
                            block.type === 'ingredients' ? 'ingredient' : 'step'
                          )}
                          mt={6}
                        />
                      </Grid>
                      <FormControl>
                        <FormLabel fontSize="xs" color={textColor}>Image</FormLabel>
                        <ImageUploadContainer
                          value={item.image_url}
                          uploadKey={`${index}-${itemIndex}-${block.type === 'ingredients' ? 'ingredient' : 'step'}`}
                          onUpload={() => document.getElementById(`item-image-${index}-${itemIndex}-${block.type}`).click()}
                          onClear={() => clearContentItemImage(index, itemIndex, block.type === 'ingredients' ? 'ingredient' : 'step')}
                          placeholder="Upload Image"
                          size="sm"
                        />
                        <input
                          type="file"
                          id={`item-image-${index}-${itemIndex}-${block.type}`}
                          hidden
                          accept="image/*"
                          onChange={(e) => handleContentItemImageUpload(e.target.files, index, itemIndex, block.type === 'ingredients' ? 'ingredient' : 'step')}
                          disabled={contentImageUploading[`${index}-${itemIndex}-${block.type === 'ingredients' ? 'ingredient' : 'step'}`]}
                        />
                      </FormControl>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          </VStack>
        )}
      </Box>
    );
  };

  const renderStepContent = React.useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Lesson Information</Heading>
            <VStack spacing={6} align="stretch">
              {/* Lesson Image */}
              <FormControl>
                <FormLabel color={textColor}>Lesson Image</FormLabel>
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
                        alt="Lesson Preview"
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
                        onClick={() => document.getElementById('lesson-image-upload').click()}
                        isLoading={isUploadingImage}
                        loadingText="Uploading..."
                        bg={isUploadingImage ? "blue.500" : "transparent"}
                        color={isUploadingImage ? "white" : "#422afb"}
                      >
                        {isUploadingImage ? '🔄 Uploading...' : 'Upload Image'}
                        <input
                          type="file"
                          id="lesson-image-upload"
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

              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <FormControl>
                  <FormLabel color={textColor}>Lesson Title</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter lesson title"
                  />
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

              <FormControl>
                <FormLabel color={textColor}>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter lesson description"
                  rows={4}
                />
              </FormControl>
            </VStack>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md" color={textColor}>Content Blocks</Heading>
              <Select
                placeholder="Add content block..."
                maxW="250px"
                onChange={(e) => {
                  if (e.target.value) {
                    addContentBlock(e.target.value);
                    e.target.value = '';
                  }
                }}
              >
                {contentTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Flex>

            {formData.content_blocks.length === 0 ? (
              <Box p={8} textAlign="center" bg="gray.50" borderRadius="lg">
                <Text color="gray.500" mb={4}>No content blocks added yet</Text>
                <Text color="gray.400" fontSize="sm">
                  Use the dropdown above to add different types of content blocks
                </Text>
              </Box>
            ) : (
              <VStack spacing={4} align="stretch">
                {formData.content_blocks.map((block, index) => 
                  renderContentBlockForm(block, index)
                )}
              </VStack>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Heading size="md" color={textColor} mb={4}>Review & Submit</Heading>
            <VStack spacing={6} align="stretch">
              <Box p={4} bg="gray.50" borderRadius="lg">
                <Text fontWeight="bold" color={textColor} mb={2}>Lesson Overview</Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Title:</Text>
                    <Text color={textColor}>{formData.title}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Status:</Text>
                    <Badge colorScheme={formData.status === 'active' ? 'green' : 'yellow'}>
                      {formData.status}
                    </Badge>
                  </Box>
                  <Box gridColumn="span 2">
                    <Text fontSize="sm" color="gray.500">Description:</Text>
                    <Text color={textColor}>{formData.description}</Text>
                  </Box>
                </Grid>
              </Box>

              <Box p={4} bg="gray.50" borderRadius="lg">
                <Text fontWeight="bold" color={textColor} mb={2}>
                  Content Blocks ({formData.content_blocks.length})
                </Text>
                <VStack spacing={2} align="stretch">
                  {formData.content_blocks.map((block, index) => {
                    const typeOption = contentTypeOptions.find(opt => opt.value === block.type);
                    return (
                      <Flex key={index} justify="space-between" align="center" p={2} bg="white" borderRadius="md">
                        <HStack spacing={3}>
                          <Text fontSize="sm" color="gray.500">#{index + 1}</Text>
                          <Icon as={typeOption?.icon} color={typeOption?.color} />
                          <Text fontSize="sm" fontWeight="medium">{block.title}</Text>
                          <Badge size="sm" colorScheme={block.type === 'video' ? 'red' : 'blue'}>
                            {typeOption?.label}
                          </Badge>
                        </HStack>
                      </Flex>
                    );
                  })}
                </VStack>
              </Box>
            </VStack>
          </Box>
        );

      default:
        return null;
    }
  }, [activeStep, formData, textColor, borderColor, isDragging, imagePreview, isUploadingImage, availableRemedies]);

  if (lessonError) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Alert status="error">
              <AlertIcon />
              Failed to load lesson data. Please try again.
            </Alert>
          </Box>
        </Card>
      </Box>
    );
  }

  if (isLoadingLesson) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6} textAlign="center">
            <Spinner size="xl" color="brand.500" thickness="4px" speed="0.6s" />
            <Text mt={4} color={textColor}>Loading lesson data...</Text>
          </Box>
        </Card>
      </Box>
    );
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card>
        <Box p={6}>
          {/* Breadcrumb */}
          <Breadcrumb spacing="8px" separator={<BreadcrumbChevron color="gray.500" />} mb={4}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/admin/courses')} color="blue.500" _hover={{ textDecoration: 'underline' }}>
                Courses
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate(`/admin/courses/${actualCourseId}/lessons`)} color="blue.500" _hover={{ textDecoration: 'underline' }}>
                {courseData?.title || 'Course'} Lessons
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color={textColor} fontWeight="medium">
                Edit Lesson
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Flex justify="space-between" align="center" mb={6}>
            <VStack align="start" spacing={1}>
              <Heading size="lg" color={textColor}>Edit Lesson</Heading>
              {courseData && (
                <Text color="gray.500" fontSize="sm">
                  Course: {courseData.title}
                </Text>
              )}
              {lessonData && (
                <Text color="gray.400" fontSize="xs">
                  Lesson ID: {lessonData.id}
                </Text>
              )}
            </VStack>
            <HStack spacing={4}>
              <Text color="gray.500" fontSize="sm">
                Step {activeStep + 1} of {steps.length}
              </Text>
              <Button
                leftIcon={<ArrowBackIcon />}
                variant="outline"
                onClick={handleCancel}
                size="sm"
              >
                Back to Lessons
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
                      loadingText="Updating Lesson"
                    >
                      Update Lesson
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

export default EditLesson;
