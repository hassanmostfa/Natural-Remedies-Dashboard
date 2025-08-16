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
  VStack,
  useToast,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaUpload, FaImage } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Card from 'components/card/Card';
import { useGetAdQuery, useUpdateAdMutation } from 'api/adsSlice';
import { useUploadImageMutation } from 'api/fileUploadSlice';
import { useGetVideosQuery } from 'api/videosSlice';
import { useGetRemediesQuery } from 'api/remediesSlice';
import { useGetCoursesQuery } from 'api/coursesSlice';

const EditAd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const inputBorder = useColorModeValue('gray.300', 'gray.600');

  // API hooks
  const { data: adResponse, isLoading: isLoadingAd, isError: isErrorLoadingAd , refetch } = useGetAdQuery(id);
  const [updateAd, { isLoading: isUpdating }] = useUpdateAdMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  
  // Data fetching hooks
  const { data: videosData, isLoading: isLoadingVideos } = useGetVideosQuery({ per_page: 1000 });
  const { data: remediesData, isLoading: isLoadingRemedies } = useGetRemediesQuery({ per_page: 1000 });
  const { data: coursesData, isLoading: isLoadingCourses } = useGetCoursesQuery({ per_page: 1000 });

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    status: 'active',
    image: '',
    type: 'home',
    element_id: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const typeOptions = [
    { value: 'home', label: 'Home' },
    { value: 'video', label: 'Video' },
    { value: 'remedy', label: 'Remedy' },
    { value: 'course', label: 'Course' },
  ];

  // Load ad data when fetched (only once)
  useEffect(() => {
    if (adResponse?.data && !isDataLoaded) {
      const adData = adResponse.data;
      console.log('Loading ad data:', adData);
      setFormData({
        title: adData.title || '',
        url: adData.url || '',
        status: adData.status || 'active',
        image: adData.image || '',
        type: adData.type || 'home',
        element_id: adData.element_id ? String(adData.element_id) : null,
      });
      setImagePreview(adData.image || null);
      setIsDataLoaded(true);
    }
  }, [adResponse?.data, isDataLoaded]);

  // Reset data loaded flag when ad response changes
  useEffect(() => {
    if (adResponse?.data) {
      setIsDataLoaded(false);
    }
  }, [adResponse?.data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input change:', name, value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value,
        // Reset element_id when type changes to home
        ...(name === 'type' && value === 'home' && { element_id: null }),
      };
      console.log('Updated formData:', newData);
      return newData;
    });
  };

  
  useEffect(() => {
    refetch();
  }, [refetch]);


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
    if (!formData.image.trim()) {
      toast({
        title: 'Error',
        description: 'Image is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (formData.type !== 'home' && !formData.element_id) {
      toast({
        title: 'Error',
        description: `Please select a ${formData.type}`,
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
      // Prepare the data according to the specified API structure
      const ad = {
        title: formData.title,
        image: formData.image,
        url: formData.url || null,
        type: formData.type,
        ...(formData.type !== 'home' && formData.element_id && { element_id: parseInt(formData.element_id) }),
      };

      await updateAd({ id, ad }).unwrap();

      toast({
        title: 'Success',
        description: 'Ad updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/admin/ads');
      
    } catch (error) {
      console.error('Failed to update ad:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to update ad. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Loading state
  if (isLoadingAd) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Flex justify="center" align="center" h="200px">
              <VStack spacing={4}>
                <Spinner size="xl" color="#422afb" thickness="4px" />
                <Text color={textColor}>Loading ad details...</Text>
              </VStack>
            </Flex>
          </Box>
        </Card>
      </Box>
    );
  }

  // Error state
  if (isErrorLoadingAd) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Flex justify="center" align="center" h="200px">
              <VStack spacing={4}>
                <Text color="red.500" fontSize="lg">Error loading ad details</Text>
                <Text color={textColor} fontSize="sm">
                  The ad you're looking for might not exist or there was an error loading it.
                </Text>
                <Button
                  leftIcon={<ArrowBackIcon />}
                  variant="outline"
                  onClick={() => navigate('/admin/ads')}
                  size="sm"
                >
                  Back to Ads
                </Button>
              </VStack>
            </Flex>
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
              Edit Ad
            </Text>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="outline"
              onClick={() => navigate('/admin/ads')}
              size="sm"
            >
              Back to Ads
            </Button>
          </Flex>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              {/* Ad Image Upload */}
              <FormControl isRequired>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Ad Image
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
                        alt="Ad Preview"
                        maxH="200px"
                        mb={2}
                        borderRadius="md"
                        fallback={<Icon as={FaImage} color="gray.500" boxSize="100px" />}
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

              {/* Title Field */}
              <FormControl isRequired>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Ad Title
                </FormLabel>
                <Input
                  type="text"
                  name="title"
                  placeholder="Enter ad title"
                  value={formData.title}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={inputBorder}
                />
              </FormControl>

              {/* URL Field */}
              <FormControl>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  URL (Optional)
                </FormLabel>
                <Input
                  type="url"
                  name="url"
                  placeholder="Enter URL (e.g., https://example.com)"
                  value={formData.url}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={inputBorder}
                />
              </FormControl>

              {/* Type Field */}
              <FormControl isRequired>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Ad Type
                </FormLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={inputBorder}
                  icon={<ChevronDownIcon />}
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

                             {/* Element Selection - Only show for non-home types */}
               {formData.type !== 'home' && (
                 <FormControl isRequired>
                   <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                     Select {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
                   </FormLabel>
                   <Select
                     name="element_id"
                     value={formData.element_id || ''}
                     onChange={handleInputChange}
                     bg={inputBg}
                     color={textColor}
                     borderColor={inputBorder}
                     icon={<ChevronDownIcon />}
                     isLoading={
                       (formData.type === 'video' && isLoadingVideos) ||
                       (formData.type === 'remedy' && isLoadingRemedies) ||
                       (formData.type === 'course' && isLoadingCourses)
                     }
                   >
                     <option value="">Select a {formData.type}</option>
                     
                                           {/* Video Options */}
                      {formData.type === 'video' && videosData?.data
                        ?.filter((video, index, self) => 
                          index === self.findIndex(v => v.id === video.id)
                        )
                        ?.map(video => (
                          <option key={video.id} value={video.id}>
                            {video.title}
                          </option>
                        ))}
                      
                      {/* Remedy Options */}
                      {formData.type === 'remedy' && remediesData?.data
                        ?.filter((remedy, index, self) => 
                          index === self.findIndex(r => r.id === remedy.id)
                        )
                        ?.map(remedy => (
                          <option key={remedy.id} value={remedy.id}>
                            {remedy.title}
                          </option>
                        ))}
                      
                      {/* Course Options */}
                      {formData.type === 'course' && coursesData?.data
                        ?.filter((course, index, self) => 
                          index === self.findIndex(c => c.id === course.id)
                        )
                        ?.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                   </Select>
                 </FormControl>
               )}

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
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                size="lg"
                isLoading={isUpdating}
                loadingText="Updating Ad"
              >
                Update Ad
              </Button>
            </VStack>
          </form>
        </Box>
      </Card>
    </Box>
  );
};

export default EditAd;
