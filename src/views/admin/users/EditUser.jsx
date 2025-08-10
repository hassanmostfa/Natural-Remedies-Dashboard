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
import { FaUser, FaUpload } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Card from 'components/card/Card';
import { useGetUserQuery, useUpdateUserMutation } from 'api/usersSlice';
import { useUploadImageMutation } from 'api/fileUploadSlice';

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const inputBorder = useColorModeValue('gray.300', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // API hooks
  const { data: userData, isLoading: isLoadingUser, isError: isErrorUser, error: userError , refetch } = useGetUserQuery(id);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    full_name: '',
    subscription_plan: 'rookie',
    profile_image: '',
    password: '',
    account_status: 'active',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const subscriptionPlans = [
    { value: 'rookie', label: 'Rookie' },
    { value: 'skilled', label: 'Skilled' },
    { value: 'master', label: 'Master' },
  ];

  const accountStatuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
  ];

  // Load user data when it's fetched
  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
             setFormData({
         name: user.name || '',
         email: user.email || '',
         full_name: user.full_name || '',
         subscription_plan: user.subscription_plan || 'rookie',
         profile_image: user.profile_image || '',
         password: '',
         account_status: user.account_status || 'active',
       });
      setOriginalData(user);
      
      // Set image preview if user has a profile image
      if (user.profile_image) {
        setImagePreview(user.profile_image);
      }
    }
  }, [userData]);

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
          profile_image: response.url
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
      profile_image: ''
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
    if (!formData.email.trim()) {
      toast({
        title: 'Error',
        description: 'Email is required',
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
       const userData = {
         name: formData.name,
         email: formData.email,
         full_name: formData.full_name || formData.name, // Use name as fallback
         subscription_plan: formData.subscription_plan,
         profile_image: formData.profile_image || null,
         account_status: formData.account_status,
       };

       // Only include password if it's provided
       if (formData.password.trim()) {
         userData.password = formData.password;
       }

      await updateUser({ id, user: userData }).unwrap();

      toast({
        title: 'Success',
        description: 'User updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/admin/users');
      
    } catch (error) {
      console.error('Failed to update user:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to update user. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Loading state
  if (isLoadingUser) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Flex justify="center" align="center" h="200px">
              <VStack spacing={4}>
                <Spinner size="xl" color="#422afb" thickness="4px" />
                <Text color={textColor}>Loading user data...</Text>
              </VStack>
            </Flex>
          </Box>
        </Card>
      </Box>
    );
  }

  // Error state
  if (isErrorUser) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Alert status="error" mb={4}>
              <AlertIcon />
              Error loading user data. {userError?.data?.message || 'Please try again.'}
            </Alert>
            <Button
              leftIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin/users')}
              colorScheme="blue"
            >
              Back to Users
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
              Edit User
            </Text>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="outline"
              onClick={() => navigate('/admin/users')}
              size="sm"
            >
              Back to Users
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
                        fallback={<Icon as={FaUser} color="gray.500" boxSize="100px" />}
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
                  placeholder="Enter user's name"
                  value={formData.name}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={inputBorder}
                />
              </FormControl>

              {/* Full Name Field */}
              <FormControl>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Full Name (Optional)
                </FormLabel>
                <Input
                  type="text"
                  name="full_name"
                  placeholder="Enter user's full name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={inputBorder}
                />
              </FormControl>

                             {/* Email Field */}
               <FormControl isRequired>
                 <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                   Email Address
                 </FormLabel>
                 <Input
                   type="email"
                   name="email"
                   placeholder="Enter user's email"
                   value={formData.email}
                   onChange={handleInputChange}
                   bg={inputBg}
                   color={textColor}
                   borderColor={inputBorder}
                 />
               </FormControl>

               {/* Password Field */}
               <FormControl>
                 <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                   Password (Leave blank to keep current password)
                 </FormLabel>
                 <Input
                   type="password"
                   name="password"
                   placeholder="Enter new password (optional)"
                   value={formData.password}
                   onChange={handleInputChange}
                   bg={inputBg}
                   color={textColor}
                   borderColor={inputBorder}
                 />
               </FormControl>

               {/* Subscription Plan */}
               <FormControl isRequired>
                 <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                   Subscription Plan
                 </FormLabel>
                 <Select
                   name="subscription_plan"
                   value={formData.subscription_plan}
                   onChange={handleInputChange}
                   bg={inputBg}
                   color={textColor}
                   borderColor={inputBorder}
                   icon={<ChevronDownIcon />}
                 >
                   {subscriptionPlans.map(plan => (
                     <option key={plan.value} value={plan.value}>
                       {plan.label}
                     </option>
                   ))}
                 </Select>
               </FormControl>

               {/* Account Status */}
               <FormControl isRequired>
                 <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                   Account Status
                 </FormLabel>
                 <Select
                   name="account_status"
                   value={formData.account_status}
                   onChange={handleInputChange}
                   bg={inputBg}
                   color={textColor}
                   borderColor={inputBorder}
                   icon={<ChevronDownIcon />}
                 >
                   {accountStatuses.map(status => (
                     <option key={status.value} value={status.value}>
                       {status.label}
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
                loadingText="Updating User"
              >
                Update User
              </Button>
            </VStack>
          </form>
        </Box>
      </Card>
    </Box>
  );
};

export default EditUser;
