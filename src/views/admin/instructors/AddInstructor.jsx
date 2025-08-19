import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
  Image,
  Select,
  IconButton,
  Textarea,
  VStack,
  HStack,
  useToast,
  Avatar,
  Icon,
  Spinner,
  Progress,
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaGraduationCap, FaUpload } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Card from 'components/card/Card';
import { useCreateInstructorMutation } from 'api/instructorsSlice';
import { useUploadImageMutation } from 'api/fileUploadSlice';

const AddInstructor = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorder = useColorModeValue('gray.300', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // API hooks
  const [createInstructor, { isLoading: isCreating }] = useCreateInstructorMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    specialization: '',
    experience_years: '',
    bio: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);





  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
      setSelectedFile(file);
      setIsUploadingImage(true);
      setUploadProgress(0);
      
      // Don't set image preview immediately - wait until upload is complete
      
      // Debug: Check authentication
      const token = localStorage.getItem("admin_token");
      const tokenExpiry = localStorage.getItem("admin_token_expires_at");
      console.log('Debug - Token exists:', !!token);
      console.log('Debug - Token expiry:', tokenExpiry);
      console.log('Debug - Current time:', new Date().toISOString());

      console.log('Debug - Starting upload...');
      console.log('Debug - File size:', file.size, 'bytes');
      
      // Force a small delay to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Upload with real progress tracking
      const response = await uploadImage({
        file,
        onProgress: (percent) => {
          console.log('Upload progress:', percent + '%');
          setUploadProgress(percent);
        }
      }).unwrap();
      
      console.log('Debug - Upload response:', response);
      
      // Small delay to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (response.success && response.url) {
        // Set the image preview to the uploaded URL
        setImagePreview(response.url);
        
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
        throw new Error('Upload failed - No success response');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        data: error.data,
        originalStatus: error.originalStatus
      });
      
      setImagePreview(null);
      setSelectedFile(null);
      
      // More specific error messages
      let errorMessage = 'Failed to upload image';
      if (error.status === 'PARSING_ERROR' && error.originalStatus === 500) {
        errorMessage = 'Server error (500). The upload service is currently unavailable. Please try again later or contact support.';
      } else if (error.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.status === 413) {
        errorMessage = 'File too large. Please select a smaller image.';
      } else if (error.status === 415) {
        errorMessage = 'Invalid file type. Please select a valid image.';
      } else if (error.status >= 500 || error.originalStatus >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploadingImage(false);
      setUploadProgress(0);
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Name is required',
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
    if (formData.experience_years && isNaN(formData.experience_years)) {
      toast({
        title: 'Error',
        description: 'Experience years must be a number',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare the data according to the API structure
      const instructorData = {
        name: formData.name,
        description: formData.description,
        specialization: formData.specialization || null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        bio: formData.bio || null,
        status: 'active', // Default status
        image: formData.image || null,
      };

      await createInstructor(instructorData).unwrap();

      toast({
        title: 'Success',
        description: 'Instructor created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/admin/instructors');
      
    } catch (error) {
      console.error('Failed to create instructor:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to create instructor. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card>
        <Box p={6}>
          <Text color={textColor} fontSize="22px" fontWeight="700" mb="20px">
            Add New Instructor
          </Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              {/* Profile Image Upload */}
              <FormControl>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Profile Image
                </FormLabel>
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
                  position="relative"
                >
                                     {imagePreview ? (
                     <Flex direction="column" align="center">
                       <Image
                         src={imagePreview}
                         alt="Profile Preview"
                         maxH="200px"
                         mb={2}
                         borderRadius="md"
                         fallback={<Icon as={FaGraduationCap} color="gray.500" boxSize="100px" />}
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
                      {isUploadingImage ? (
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
                           zIndex="9999"
                           backdropFilter="blur(5px)"
                           border="2px solid #422afb"
                         >
                          <VStack spacing="4" w="90%">
                            <Spinner size="xl" color="white" thickness="8px" speed="0.6s" />
                            <Text color="white" fontSize="lg" fontWeight="bold">Uploading Image...</Text>
                            
                            {/* Progress Bar */}
                            <Box w="100%" maxW="300px">
                              <Progress 
                                value={uploadProgress} 
                                colorScheme="blue" 
                                size="lg" 
                                borderRadius="full"
                                hasStripe
                                isAnimated
                                bg="rgba(255,255,255,0.2)"
                              />
                              <Text color="white" fontSize="sm" textAlign="center" mt={2} fontWeight="bold">
                                {Math.round(uploadProgress)}% Complete
                              </Text>
                            </Box>
                            
                            <Text color="white" fontSize="sm" opacity="0.9">Please wait while we upload your image</Text>
                          </VStack>
                        </Box>
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

              {/* Name Field */}
              <FormControl isRequired>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Name
                </FormLabel>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter instructor's name"
                  value={formData.name}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={inputBorder}
                />
              </FormControl>

              {/* Description Field */}
              <FormControl isRequired>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Description
                </FormLabel>
                <Textarea
                  name="description"
                  placeholder="Enter instructor's description"
                  value={formData.description}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={inputBorder}
                  rows={4}
                />
              </FormControl>

              {/* Specialization Field */}
              {/* <FormControl>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Specialization
                </FormLabel>
                <Input
                  type="text"
                  name="specialization"
                  placeholder="Enter instructor's specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={inputBorder}
                />
              </FormControl> */}

              {/* Experience Years Field */}
              {/* <FormControl>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Experience Years
                </FormLabel>
                <Input
                  type="number"
                  name="experience_years"
                  placeholder="Enter years of experience"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={inputBorder}
                  min="0"
                  max="50"
                />
              </FormControl> */}

              {/* Bio Field */}
              {/* <FormControl>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Bio (Optional)
                </FormLabel>
                <Textarea
                  name="bio"
                  placeholder="Enter instructor's detailed bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={inputBorder}
                  rows={6}
                />
              </FormControl> */}



              {/* Action Buttons */}
              <HStack spacing={4}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  flex="1"
                  size="lg"
                  isLoading={isCreating}
                  loadingText="Creating Instructor"
                >
                  Create Instructor
                </Button>
                <Button
                  variant="outline"
                  flex="1"
                  size="lg"
                  onClick={() => navigate('/admin/instructors')}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </form>
        </Box>
      </Card>
    </Box>
  );
};

export default AddInstructor;
