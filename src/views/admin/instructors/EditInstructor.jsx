import React, { useState, useEffect } from 'react';
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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { FaGraduationCap, FaUpload } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Card from 'components/card/Card';
import { useGetInstructorQuery, useUpdateInstructorMutation } from 'api/instructorsSlice';
import { useUploadImageMutation } from 'api/fileUploadSlice';

const EditInstructor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorder = useColorModeValue('gray.300', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // API hooks
  const { data: instructorData, isLoading: isLoadingInstructor, isError: isErrorInstructor, error: instructorError, refetch } = useGetInstructorQuery(id);
  const [updateInstructor, { isLoading: isUpdating }] = useUpdateInstructorMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    specialization: '',
    experience_years: '',
    bio: '',
    status: 'active',
    image: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  // Load instructor data when it's fetched
  useEffect(() => {
    if (instructorData?.data) {
      const instructor = instructorData.data;
      setFormData({
        name: instructor.name || '',
        description: instructor.description || '',
        specialization: instructor.specialization || '',
        experience_years: instructor.experience_years ? String(instructor.experience_years) : '',
        bio: instructor.bio || '',
        status: instructor.status || 'active',
        image: instructor.image || '',
      });
      setOriginalData(instructor);
      
      // Set image preview if instructor has an image
      if (instructor.image) {
        setImagePreview(instructor.image);
      }
    }
  }, [instructorData]);

  useEffect(() => {
    refetch();
  }, [refetch]);

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
        status: formData.status,
        image: formData.image || null,
      };

      await updateInstructor({ id, instructor: instructorData }).unwrap();

      toast({
        title: 'Success',
        description: 'Instructor updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/admin/instructors');
      
    } catch (error) {
      console.error('Failed to update instructor:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to update instructor. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Loading state
  if (isLoadingInstructor) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Flex justify="center" align="center" h="200px">
              <VStack spacing={4}>
                <Spinner size="xl" color="#422afb" thickness="8px" speed="0.6s" />
                <Text color={textColor} fontSize="lg" fontWeight="bold">Loading instructor...</Text>
                <Text color="gray.500" fontSize="sm">Please wait while we fetch the instructor data</Text>
              </VStack>
            </Flex>
          </Box>
        </Card>
      </Box>
    );
  }

  // Error state
  if (isErrorInstructor) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              <Text>
                {instructorError?.data?.message || 'Failed to load instructor data. Please try again.'}
              </Text>
            </Alert>
            <Button
              leftIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin/instructors')}
              colorScheme="blue"
            >
              Back to Instructors
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
          <Flex justify="space-between" align="center" mb="20px">
            <Text color={textColor} fontSize="22px" fontWeight="700">
              Edit Instructor
            </Text>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="outline"
              onClick={() => navigate('/admin/instructors')}
              size="sm"
            >
              Back to Instructors
            </Button>
          </Flex>

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
              <FormControl>
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
              </FormControl>

              {/* Experience Years Field */}
              <FormControl>
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
              </FormControl>

              {/* Bio Field */}
              <FormControl>
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
              </FormControl>

              {/* Status Field */}
              <FormControl isRequired>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Status
                </FormLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={inputBorder}
                  icon={<ChevronDownIcon />}
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Action Buttons */}
              <HStack spacing={4}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  flex="1"
                  size="lg"
                  isLoading={isUpdating}
                  loadingText="Updating Instructor"
                >
                  Update Instructor
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

export default EditInstructor;
