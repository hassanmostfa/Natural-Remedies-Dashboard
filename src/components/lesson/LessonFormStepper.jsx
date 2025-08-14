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
  Heading,
  Icon,
  Grid,
  Badge,
  HStack,
  Image,
  Stepper,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Spinner,
  Progress,
} from '@chakra-ui/react';
import { FaPlay, FaVideo, FaFileAlt, FaImage, FaLeaf, FaList, FaUpload } from 'react-icons/fa';
import ImageUploadContainer from 'components/upload/ImageUploadContainer';
import ContentBlockForm from 'components/lesson/ContentBlockForm';

const LessonFormStepper = ({
  activeStep,
  steps,
  formData,
  textColor,
  borderColor,
  // Image upload states
  imagePreview,
  isDragging,
  isUploadingImage,
  uploadProgress,
  contentImagePreviews,
  contentImageUploading,
  contentImageDragging,
  contentImageProgress,
  // Data
  availableRemedies,
  // Handlers
  handleInputChange,
  handleFileInputChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  clearImage,
  // Content block handlers
  addContentBlock,
  updateContentBlock,
  removeContentBlock,
  moveContentBlock,
  addContentItem,
  updateContentItem,
  removeContentItem,
  handleContentImageUpload,
  handleContentItemImageUpload,
  clearContentImage,
  clearContentItemImage,
  handleContentImageDragOver,
  handleContentImageDragLeave,
  handleContentImageDrop,
  handlePdfUpload,
  handlePdfDragOver,
  handlePdfDragLeave,
  handlePdfDrop,
}) => {
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const contentTypeOptions = [
    { value: 'content', label: 'Content', icon: FaList, color: 'cyan.500' },
    { value: 'text', label: 'Text', icon: FaFileAlt, color: 'blue.500' },
    { value: 'video', label: 'Video', icon: FaVideo, color: 'red.500' },
    { value: 'remedy', label: 'Remedy', icon: FaLeaf, color: 'green.500' },
    { value: 'tip', label: 'Tip', icon: FaFileAlt, color: 'yellow.500' },
    { value: 'image', label: 'Image', icon: FaImage, color: 'purple.500' },
    { value: 'pdf', label: 'PDF', icon: FaFileAlt, color: 'red.600' },
  ];

  const renderStepContent = () => {
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
                  {/* Progress bar overlay - shown when uploading */}
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
                      <VStack spacing="4" w="full" px={8}>
                        <Spinner size="xl" color="white" thickness="8px" speed="0.6s" />
                        <Text color="white" fontSize="lg" fontWeight="bold">Uploading Image...</Text>
                        <Text color="white" fontSize="sm" opacity="0.9">Please wait while we upload your image</Text>
                        <Progress 
                          value={uploadProgress} 
                          size="md" 
                          colorScheme="blue" 
                          borderRadius="full"
                          w="full"
                          bg="rgba(255, 255, 255, 0.2)"
                        />
                        <Text color="white" fontSize="sm" opacity="0.8">{uploadProgress}%</Text>
                      </VStack>
                    </Box>
                  )}
                  
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
                {formData.content_blocks.map((block, index) => (
                  <ContentBlockForm
                    key={index}
                    block={block}
                    index={index}
                    textColor={textColor}
                    borderColor={borderColor}
                    contentImagePreviews={contentImagePreviews}
                    contentImageUploading={contentImageUploading}
                    contentImageDragging={contentImageDragging}
                    contentImageProgress={contentImageProgress}
                    availableRemedies={availableRemedies}
                    onUpdateBlock={updateContentBlock}
                    onRemoveBlock={removeContentBlock}
                    onMoveBlock={moveContentBlock}
                    onAddContentItem={addContentItem}
                    onUpdateContentItem={updateContentItem}
                    onRemoveContentItem={removeContentItem}
                    onContentImageUpload={handleContentImageUpload}
                    onContentItemImageUpload={handleContentItemImageUpload}
                    onClearContentImage={clearContentImage}
                    onClearContentItemImage={clearContentItemImage}
                    onContentImageDragOver={handleContentImageDragOver}
                    onContentImageDragLeave={handleContentImageDragLeave}
                    onContentImageDrop={handleContentImageDrop}
                    onPdfUpload={handlePdfUpload}
                    onPdfDragOver={handlePdfDragOver}
                    onPdfDragLeave={handlePdfDragLeave}
                    onPdfDrop={handlePdfDrop}
                    formDataContentBlocks={formData.content_blocks}
                  />
                ))}
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
  };

  return (
    <>
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

      {/* Step Content */}
      <VStack spacing={6} align="stretch">
        {renderStepContent()}
      </VStack>
    </>
  );
};

export default LessonFormStepper;
