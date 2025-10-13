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
  HStack,
  useToast,
  Icon,
  Spinner,
  Checkbox,
  CheckboxGroup,
  Stack,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaUpload, FaImage } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Card from 'components/card/Card';
import { useGetAdQuery, useUpdateAdMutation, useGetAdTypesQuery } from 'api/adsSlice';
import { useUploadImageMutation } from 'api/fileUploadSlice';
import { useGetVideosQuery } from 'api/videosSlice';
import { useGetRemediesQuery } from 'api/remediesSlice';
import { useGetCoursesQuery } from 'api/coursesSlice';
import { useGetArticlesQuery } from 'api/articlesSlice';

// Custom SearchableSelect Component
const SearchableSelect = ({ 
  label, 
  placeholder, 
  options, 
  value, 
  onChange, 
  isLoading, 
  textColor, 
  inputBg, 
  inputBorder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const containerRef = React.useRef(null);

  // Client-side filtering
  const filteredOptions = options?.filter(option => 
    option.title?.toLowerCase().includes(searchValue.toLowerCase())
  ) || [];

  const selectedOption = options?.find(option => String(option.id) === String(value));

  const handleSelectOption = (optionId) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchValue('');
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchValue('');
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Handle clicks outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchValue('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box position="relative" ref={containerRef}>
      <FormLabel color={textColor} fontSize="xs" fontWeight="600" mb={1}>
        {label}
      </FormLabel>
      
      {/* Trigger Button */}
      <Button
        onClick={handleToggleDropdown}
        bg={inputBg}
        color={textColor}
        border="1px solid"
        borderColor={inputBorder}
        borderRadius="md"
        width="100%"
        justifyContent="space-between"
        rightIcon={<ChevronDownIcon />}
        isLoading={isLoading}
        _hover={{ bg: inputBg }}
        _active={{ bg: inputBg }}
      >
        {selectedOption ? selectedOption.title : placeholder}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg={inputBg}
          border="1px solid"
          borderColor={inputBorder}
          borderRadius="md"
          boxShadow="lg"
          zIndex={1000}
          mt={1}
        >
          {/* Search Input */}
          <Box p={2} borderBottom="1px solid" borderColor={inputBorder}>
            <Input
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchValue}
              onChange={handleSearchChange}
              bg="white"
              color="black"
              borderColor={inputBorder}
              size="sm"
              autoFocus
            />
          </Box>

          {/* Options List */}
          <Box maxH="200px" overflowY="auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <Box
                  key={option.id}
                  p={3}
                  cursor="pointer"
                  _hover={{ bg: "blue.50" }}
                  onClick={() => handleSelectOption(option.id)}
                  borderBottom="1px solid"
                  borderColor={inputBorder}
                  _last={{ borderBottom: "none" }}
                >
                  <Text fontSize="sm" color={textColor}>
                    {option.title}
                  </Text>
                </Box>
              ))
            ) : (
              <Box p={3} textAlign="center">
                <Text fontSize="sm" color="gray.500">
                  No {label.toLowerCase()} found
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

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
  const [uploadImage] = useUploadImageMutation();
  
  // State declarations
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    status: 'active',
    image: '',
    visibility_target: 'all',
    target_plans: [],
    ad_types: [],
    ad_type_elements: [],
  });

  const [adTypeSelections, setAdTypeSelections] = useState([
    { id: 1, adType: '', element: '' }
  ]);

  // Data fetching hooks (no search parameters)
  const { data: adTypesData } = useGetAdTypesQuery();
  const { data: videosData, isLoading: isLoadingVideos } = useGetVideosQuery({ per_page: 1000 });
  const { data: remediesData, isLoading: isLoadingRemedies } = useGetRemediesQuery({ per_page: 1000 });
  const { data: coursesData, isLoading: isLoadingCourses } = useGetCoursesQuery({ per_page: 1000 });
  const { data: articlesData, isLoading: isLoadingArticles } = useGetArticlesQuery({ per_page: 1000 });

  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const visibilityTargetOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'guest', label: 'Guest Users Only' },
    { value: 'user', label: 'Registered Users Only' },
  ];

  const targetPlanOptions = [
    { value: 'rookie', label: 'Rookie' },
    { value: 'skilled', label: 'Skilled' },
    { value: 'master', label: 'Master' },
  ];

  // Load ad data when fetched (only once)
  useEffect(() => {
    if (adResponse?.data && !isDataLoaded) {
      const adData = adResponse.data;
      console.log('Loading ad data:', adData);
      setFormData({
        title: adData.title || '',
        url: adData.url || '',
        description: adData.description || '',
        status: adData.status || 'active',
        image: adData.image || '',
        visibility_target: adData.visibility_target || 'all',
        target_plans: adData.target_plans || [],
        ad_types: adData.ad_types || [],
        ad_type_elements: adData.ad_type_elements || [],
      });
      
      // Initialize adTypeSelections based on existing data
      if (adData.ad_types && adData.ad_types.length > 0) {
        const selections = adData.ad_types.map((adTypeId, index) => ({
          id: index + 1,
          adType: String(adTypeId),
          element: adData.ad_type_elements && adData.ad_type_elements[index] ? String(adData.ad_type_elements[index]) : ''
        }));
        setAdTypeSelections(selections);
      } else {
        setAdTypeSelections([{ id: 1, adType: '', element: '' }]);
      }
      
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
        // Reset ad_type_elements when ad_types changes
        ...(name === 'ad_types' && { ad_type_elements: [] }),
      };
      console.log('Updated formData:', newData);
      return newData;
    });
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value,
        // Reset ad_type_elements when ad_types changes
        ...(field === 'ad_types' && { ad_type_elements: [] }),
      };
      console.log('Updated formData:', newData);
      return newData;
    });
  };


  // Dynamic ad types functions
  const addAdType = () => {
    const newId = Math.max(...adTypeSelections.map(item => item.id)) + 1;
    setAdTypeSelections([...adTypeSelections, { id: newId, adType: '', element: '' }]);
  };

  const removeAdType = (id) => {
    if (adTypeSelections.length > 1) {
      setAdTypeSelections(adTypeSelections.filter(item => item.id !== id));
    }
  };

  const updateAdTypeSelection = (id, field, value) => {
    const updated = adTypeSelections.map(item => 
      item.id === id 
        ? { ...item, [field]: value, ...(field === 'adType' && { element: '' }) }
        : item
    );
    setAdTypeSelections(updated);
    
    // Update form data
    const adTypes = updated.map(item => item.adType).filter(Boolean).map(Number);
    const adTypeElements = updated
      .filter(item => item.adType && item.element)
      .map(item => parseInt(item.element));
    
    setFormData(prev => {
      const newData = {
        ...prev,
        ad_types: adTypes,
        ad_type_elements: adTypeElements,
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
    if (formData.ad_types.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one ad type',
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
        description: formData.description || null,
        status: formData.status,
        visibility_target: formData.visibility_target,
        target_plans: formData.target_plans,
        ad_types: formData.ad_types,
        ad_type_elements: formData.ad_type_elements,
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

              {/* Description Field */}
              <FormControl>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Description (Optional)
                </FormLabel>
                <Input
                  type="text"
                  name="description"
                  placeholder="Enter ad description"
                  value={formData.description}
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

              {/* Visibility Target Field */}
              <FormControl isRequired>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Visibility Target
                </FormLabel>
                <Select
                  name="visibility_target"
                  value={formData.visibility_target}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={inputBorder}
                  icon={<ChevronDownIcon />}
                >
                  {visibilityTargetOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
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
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Target Plans Field */}
              <FormControl>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Target Plans (Optional)
                </FormLabel>
                <CheckboxGroup
                  value={formData.target_plans}
                  onChange={(values) => handleArrayChange('target_plans', values)}
                >
                  <Stack spacing={4} direction="row" wrap="wrap">
                    {targetPlanOptions.map(option => (
                      <Checkbox
                        key={option.value}
                        value={option.value}
                        colorScheme="blue"
                        color={textColor}
                      >
                        {option.label}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </FormControl>

              {/* Dynamic Ad Types Section */}
              <FormControl isRequired>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Ad Types *
                </FormLabel>
                <VStack spacing={4} align="stretch">
                  {adTypeSelections.map((selection, index) => (
                    <Box key={selection.id} p={4} border="1px solid" borderColor={inputBorder} borderRadius="md">
                      <Flex justify="space-between" align="center" mb={3}>
                        <Text color={textColor} fontSize="sm" fontWeight="600">
                          Ad Type {index + 1}
                        </Text>
                        {adTypeSelections.length > 1 && (
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            onClick={() => removeAdType(selection.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </Flex>
                      
                      <HStack spacing={3} align="stretch">
                        {/* Ad Type Selection */}
                        <Box flex="1">
                          <FormLabel color={textColor} fontSize="xs" fontWeight="600" mb={1}>
                            Ad Type
                          </FormLabel>
                          <Select
                            value={selection.adType}
                            onChange={(e) => updateAdTypeSelection(selection.id, 'adType', e.target.value)}
                            bg={inputBg}
                            color={textColor}
                            borderColor={inputBorder}
                            icon={<ChevronDownIcon />}
                          >
                            <option value="">Select Ad Type</option>
                            {adTypesData?.data?.map(adType => (
                              <option key={adType.id} value={adType.id}>
                                {adType.name}
                              </option>
                            ))}
                          </Select>
                        </Box>

                        {/* Element Selection - Only show for specific types */}
                        {selection.adType && ['remedy', 'video', 'course', 'article'].includes(
                          adTypesData?.data?.find(type => type.id === parseInt(selection.adType))?.name
                        ) && (
                          <Box flex="1">
                            <SearchableSelect
                              label={`Select ${adTypesData?.data?.find(type => type.id === parseInt(selection.adType))?.name}`}
                              placeholder={`Select a ${adTypesData?.data?.find(type => type.id === parseInt(selection.adType))?.name}`}
                              options={
                                adTypesData?.data?.find(type => type.id === parseInt(selection.adType))?.name === 'video' ? videosData?.data :
                                adTypesData?.data?.find(type => type.id === parseInt(selection.adType))?.name === 'remedy' ? remediesData?.data :
                                adTypesData?.data?.find(type => type.id === parseInt(selection.adType))?.name === 'course' ? coursesData?.data :
                                adTypesData?.data?.find(type => type.id === parseInt(selection.adType))?.name === 'article' ? articlesData?.data : []
                              }
                              value={selection.element}
                              onChange={(value) => updateAdTypeSelection(selection.id, 'element', value)}
                              isLoading={
                                (adTypesData?.data?.find(type => type.id === parseInt(selection.adType))?.name === 'video' && isLoadingVideos) ||
                                (adTypesData?.data?.find(type => type.id === parseInt(selection.adType))?.name === 'remedy' && isLoadingRemedies) ||
                                (adTypesData?.data?.find(type => type.id === parseInt(selection.adType))?.name === 'course' && isLoadingCourses) ||
                                (adTypesData?.data?.find(type => type.id === parseInt(selection.adType))?.name === 'article' && isLoadingArticles)
                              }
                              textColor={textColor}
                              inputBg={inputBg}
                              inputBorder={inputBorder}
                            />
                          </Box>
                        )}
                      </HStack>
                    </Box>
                  ))}
                  
                  {/* Add Type Button */}
                  <Button
                    type="button"
                    variant="outline"
                    colorScheme="blue"
                    onClick={addAdType}
                    leftIcon={<Text>+</Text>}
                  >
                    Add Type
                  </Button>
                </VStack>
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
