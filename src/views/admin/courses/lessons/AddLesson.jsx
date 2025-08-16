import {
  Box,
  Button,
  Flex,
  VStack,
  Text,
  useColorModeValue,
  useToast,
  HStack,
  Heading,
  useSteps,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBackIcon, ChevronRightIcon as BreadcrumbChevron } from '@chakra-ui/icons';
import { useCreateLessonMutation } from 'api/lessonsSlice';
import { useGetCourseQuery } from 'api/coursesSlice';
import { useGetRemediesQuery } from 'api/remediesSlice';
import { useImageUpload } from 'hooks/useImageUpload';
import LessonFormStepper from 'components/lesson/LessonFormStepper';

const AddLesson = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { courseId, id, course_id } = params;
  const actualCourseId = courseId || id || course_id;
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
  
  // API hooks
  const { data: courseResponse, isLoading: isLoadingCourse } = useGetCourseQuery(actualCourseId);
  const [createLesson, { isLoading: isCreating }] = useCreateLessonMutation();
  const { data: remediesResponse, isLoading: isLoadingRemedies } = useGetRemediesQuery({
    per_page: 100
  });

  // Image upload hook
  const {
    imagePreview,
    setImagePreview,
    isDragging,
    isUploadingImage,
    uploadProgress,
    contentImagePreviews,
    setContentImagePreviews,
    contentImageUploading,
    contentImageDragging,
    contentImageProgress,
    handleMainImageUpload,
    handleContentImageUpload,
    handleContentPdfUpload,
    clearMainImage,
    clearContentImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleContentImageDragOver,
    handleContentImageDragLeave,
    handleContentImageDrop,
  } = useImageUpload();

  const courseData = courseResponse?.data || null;
  const availableRemedies = remediesResponse?.data || [];

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
      handleMainImageUpload(selectedFile, (url) => {
        setFormData(prev => ({
          ...prev,
          image: url
        }));
      });
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleImageUpload(files);
  };

  const clearImage = () => {
    clearMainImage();
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  // Content block image upload functions
  const handleContentImageUploadWrapper = (files, blockIndex, fieldName) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      handleContentImageUpload(selectedFile, blockIndex, fieldName, (url) => {
        updateContentBlock(blockIndex, fieldName, url);
      });
    }
  };

  const handleContentItemImageUpload = (files, blockIndex, itemIndex, itemType) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const fieldName = `${itemIndex}-${itemType}`;
      handleContentImageUpload(selectedFile, blockIndex, fieldName, (url) => {
        updateContentItem(blockIndex, itemIndex, itemType, 'image_url', url);
      });
    }
  };

  const clearContentImageWrapper = (blockIndex, fieldName) => {
    clearContentImage(blockIndex, fieldName);
    updateContentBlock(blockIndex, fieldName, '');
  };

  const clearContentItemImage = (blockIndex, itemIndex, itemType) => {
    const uploadKey = `${blockIndex}-${itemIndex}-${itemType}`;
    clearContentImage(blockIndex, uploadKey);
    updateContentItem(blockIndex, itemIndex, itemType, 'image_url', '');
  };

  // PDF upload function
  const handlePdfUpload = (files, blockIndex) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      handleContentPdfUpload(selectedFile, blockIndex, 'pdf_url', (url) => {
        updateContentBlock(blockIndex, 'pdf_url', url);
        updateContentBlock(blockIndex, 'content', { 
          ...formData.content_blocks[blockIndex].content,
          pdf_url: url 
        });
      });
    }
  };

  // Content block management
  const addContentBlock = (type) => {
    const newBlock = {
      type,
      title: '',
      description: '',
      order: formData.content_blocks.length,
      is_active: true,
      ...(type === 'content' && { 
        content: { items: [{ title: '', image_url: '' }] } 
      }),
      ...(type === 'text' && { 
        content: { html_content: '' }
      }),
      ...(type === 'video' && { 
        video_url: '', 
        title: '',
        content: { video_url: '', title: '' }
      }),
      ...(type === 'remedy' && { 
        remedy_id: '',
        content: { remedy_id: '' }
      }),
      ...(type === 'tip' && { 
        image_url: '',
        content: { image_url: '', html_content: '' }
      }),
      ...(type === 'image' && { 
        image_url: '',
        link_url: '',
        content: { image_url: '', link_url: '' }
      }),
      ...(type === 'pdf' && { 
        pdf_url: '',
        content: { pdf_url: '' }
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
          let arrayKey;
          if (itemType === 'ingredient') arrayKey = 'items';
          else if (itemType === 'step') arrayKey = 'steps';
          else if (itemType === 'content') arrayKey = 'items';
          else arrayKey = 'items';
          
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
          let arrayKey;
          if (itemType === 'ingredient') arrayKey = 'items';
          else if (itemType === 'step') arrayKey = 'steps';
          else if (itemType === 'content') arrayKey = 'items';
          else arrayKey = 'items';
          
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
          let arrayKey;
          if (itemType === 'ingredient') arrayKey = 'items';
          else if (itemType === 'step') arrayKey = 'steps';
          else if (itemType === 'content') arrayKey = 'items';
          else arrayKey = 'items';
          
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

  const validateStep = (step, showToast = true) => {
    switch (step) {
      case 0: // Basic Information
        if (!formData.title.trim()) {
          if (showToast) {
            toast({
              title: 'Error',
              description: 'Lesson title is required',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
          return false;
        }
        if (!formData.description.trim()) {
          if (showToast) {
            toast({
              title: 'Error',
              description: 'Lesson description is required',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
          return false;
        }
        if (!formData.image) {
          if (showToast) {
            toast({
              title: 'Error',
              description: 'Lesson image is required',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
          return false;
        }
        return true;
      case 1: // Content Blocks
        if (formData.content_blocks.length === 0) {
          if (showToast) {
            toast({
              title: 'Error',
              description: 'At least one content block is required',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
          return false;
        }
        
        // Validate each content block has required fields filled
        for (let i = 0; i < formData.content_blocks.length; i++) {
          const block = formData.content_blocks[i];
          
          // Check if block has required content based on type
          if (block.type === 'text' && (!block.content?.html_content || block.content.html_content.trim() === '')) {
            if (showToast) {
              toast({
                title: 'Error',
                description: `Text content block #${i + 1} must have content`,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            }
            return false;
          }
          
          if (block.type === 'video' && (!block.video_url || !block.video_url.trim())) {
            if (showToast) {
              toast({
                title: 'Error',
                description: `Video content block #${i + 1} must have a video URL`,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            }
            return false;
          }
          
          if (block.type === 'remedy' && (!block.remedy_id || !block.remedy_id.trim())) {
            if (showToast) {
              toast({
                title: 'Error',
                description: `Remedy content block #${i + 1} must have a remedy selected`,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            }
            return false;
          }
          
          if (block.type === 'tip' && (!block.content?.html_content || block.content.html_content.trim() === '')) {
            if (showToast) {
              toast({
                title: 'Error',
                description: `Tip content block #${i + 1} must have content`,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            }
            return false;
          }
          
          if (block.type === 'image' && (!block.image_url || !block.image_url.trim())) {
            if (showToast) {
              toast({
                title: 'Error',
                description: `Image content block #${i + 1} must have an image`,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            }
            return false;
          }
          
          if (block.type === 'pdf' && (!block.pdf_url || !block.pdf_url.trim())) {
            if (showToast) {
              toast({
                title: 'Error',
                description: `PDF content block #${i + 1} must have a PDF file`,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            }
            return false;
          }
          
          if (block.type === 'content') {
            const items = block.content?.items || [];
            if (items.length === 0) {
              if (showToast) {
                toast({
                  title: 'Error',
                  description: `Content block #${i + 1} must have at least one item`,
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
                });
              }
              return false;
            }
            
            // Check each content item has a title
            for (let j = 0; j < items.length; j++) {
              if (!items[j].title || !items[j].title.trim()) {
                if (showToast) {
                  toast({
                    title: 'Error',
                    description: `Content block #${i + 1}, item #${j + 1} must have a title`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                  });
                }
                return false;
              }
            }
          }
        }
        return true;
      default:
        return true;
    }
  };

  const isStepValid = (step) => {
    return validateStep(step, false);
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
      const lessonData = {
        course_id: parseInt(actualCourseId),
        title: formData.title,
        description: formData.description,
        image: formData.image,
        status: formData.status,
        content_blocks: formData.content_blocks.map((block, index) => {
          // Handle different content types
          switch (block.type) {
            case 'text':
              return {
                type: block.type,
                order: index,
                content: {
                  html_content: block.content?.html_content || ''
                }
              };
            
            case 'video':
              return {
                type: block.type,
                order: index,
                content: {
                  video_url: block.video_url || block.content?.video_url || '',
                  title: block.title || block.content?.title || ''
                }
              };
            
            case 'remedy':
              return {
                type: block.type,
                order: index,
                content: {
                  remedy_id: block.remedy_id || block.content?.remedy_id || ''
                }
              };
            
            case 'tip':
              return {
                type: block.type,
                order: index,
                content: {
                  image_url: block.image_url || block.content?.image_url || '',
                  html_content: block.content?.html_content || '',
                  alt_text: block.content?.alt_text || ''
                }
              };
            
            case 'image':
              return {
                type: block.type,
                order: index,
                content: {
                  image_url: block.image_url || block.content?.image_url || '',
                  link_url: block.link_url || block.content?.link_url || '',
                  alt_text: block.content?.alt_text || ''
                }
              };
            
            case 'pdf':
              return {
                type: block.type,
                order: index,
                content: {
                  pdf_url: block.pdf_url || block.content?.pdf_url || ''
                }
              };
            
            case 'content':
              return {
                type: block.type,
                order: index,
                content: {
                  items: block.content?.items || []
                }
              };
            
            default:
              return {
                type: block.type,
                order: index,
                content: block.content || {}
              };
          }
        })
      };

      await createLesson(lessonData).unwrap();

      toast({
        title: 'Success',
        description: 'Lesson created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate(`/admin/courses/${actualCourseId}/lessons`);
      
    } catch (error) {
      console.error('Failed to create lesson:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to create lesson. Please try again.',
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
                Add Lesson
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Flex justify="space-between" align="center" mb={6}>
            <VStack align="start" spacing={1}>
              <Heading size="lg" color={textColor}>Add New Lesson</Heading>
              {courseData && (
                <Text color="gray.500" fontSize="sm">
                  Course: {courseData.title}
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

          <form onSubmit={handleSubmit} key={activeStep}>
            <LessonFormStepper
              activeStep={activeStep}
              steps={steps}
              formData={formData}
              textColor={textColor}
              borderColor={borderColor}
              // Image upload states
              imagePreview={imagePreview}
              isDragging={isDragging}
              isUploadingImage={isUploadingImage}
              uploadProgress={uploadProgress}
              contentImagePreviews={contentImagePreviews}
              contentImageUploading={contentImageUploading}
              contentImageDragging={contentImageDragging}
              contentImageProgress={contentImageProgress}
              // Data
              availableRemedies={availableRemedies}
              // Handlers
              handleInputChange={handleInputChange}
              handleFileInputChange={handleFileInputChange}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={(e) => handleDrop(e, (file) => handleMainImageUpload(file, (url) => {
                setFormData(prev => ({ ...prev, image: url }));
              }))}
              clearImage={clearImage}
              // Content block handlers
              addContentBlock={addContentBlock}
              updateContentBlock={updateContentBlock}
              removeContentBlock={removeContentBlock}
              moveContentBlock={moveContentBlock}
              addContentItem={addContentItem}
              updateContentItem={updateContentItem}
              removeContentItem={removeContentItem}
              handleContentImageUpload={handleContentImageUploadWrapper}
              handleContentItemImageUpload={handleContentItemImageUpload}
              clearContentImage={clearContentImageWrapper}
              clearContentItemImage={clearContentItemImage}
              handleContentImageDragOver={handleContentImageDragOver}
              handleContentImageDragLeave={handleContentImageDragLeave}
              handleContentImageDrop={handleContentImageDrop}
              handlePdfUpload={handlePdfUpload}
              handlePdfDragOver={handleContentImageDragOver}
              handlePdfDragLeave={handleContentImageDragLeave}
              handlePdfDrop={handleContentImageDrop}
            />

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
                      isDisabled={!isStepValid(activeStep)}
                    >
                      Next
                    </Button>
                  ) : (
                  <Button
                    onClick={handleSubmit}
                    colorScheme="green"
                    isLoading={isSubmitting || isCreating}
                    loadingText="Creating Lesson"
                  >
                    Create Lesson
                  </Button>
                )}
              </HStack>
            </Flex>
          </form>
        </Box>
      </Card>
    </Box>
  );
};

export default AddLesson;