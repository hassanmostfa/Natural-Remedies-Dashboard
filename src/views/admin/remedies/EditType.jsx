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
    Spinner,
    useToast,
    Image,
    Icon,
    Progress,
  } from '@chakra-ui/react';
 import * as React from 'react';
 import Card from 'components/card/Card';
 import { useNavigate, useParams } from 'react-router-dom';
 import { 
    useGetRemedyTypeQuery,
    useUpdateRemedyTypeMutation 
  } from 'api/remediesTypesSlice';
import { useUploadImageMutation } from 'api/fileUploadSlice';
import { FaUpload, FaImage } from 'react-icons/fa';

import Swal from 'sweetalert2';
 
 import { useEffect } from 'react';
 const EditRemedyType = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const toast = useToast();
   const { data: remedyType, isLoading: isFetching, isError , refetch} = useGetRemedyTypeQuery(id);
     const [updateRemedyType, { isLoading: isUpdating }] = useUpdateRemedyTypeMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  
  // Color mode values
   const textColor = useColorModeValue('secondaryGray.900', 'white');
   const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
   const inputBg = useColorModeValue('white', 'gray.700');
   const cancelHoverBg = useColorModeValue('gray.100', 'gray.600');
 
         const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    status: 'active',
    image: '',
  });

  // Image upload states
  const [imagePreview, setImagePreview] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
 
   useEffect(() => {
    refetch();
   }, [refetch]);

   // Set form data when remedy type data is loaded
   React.useEffect(() => {
     if (remedyType?.data) {
       console.log('Initial data loaded:', remedyType.data);
                        setFormData({
          name: remedyType.data.name || '',
          description: remedyType.data.description || '',
          status: remedyType.data.status || 'active',
          image: remedyType.data.image || '',
        });
     }
   }, [remedyType]);

   const statusOptions = [
     { value: 'active', label: 'Active' },
     { value: 'inactive', label: 'Inactive' },
   ];
 
   const showErrorAlert = (message) => {
     Swal.fire({
       title: 'Error!',
       text: message,
       icon: 'error',
       confirmButtonText: 'OK',
     });
   };
 
   const showSuccessAlert = () => {
     Swal.fire({
       title: 'Success!',
       text: 'Remedy type updated successfully',
       icon: 'success',
       confirmButtonText: 'OK',
     }).then((result) => {
       if (result.isConfirmed) {
         navigate('/admin/remedy-types');
       }
     });
   };
 
     const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Image upload handlers
  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      
      // Validate file
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

      // Start upload with progress simulation
      setIsUploadingImage(true);
      setUploadProgress(0);
      
      // Create preview
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Upload image
      uploadImage({ file: selectedFile })
        .unwrap()
        .then((response) => {
          clearInterval(progressInterval);
          setUploadProgress(100);
          
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
        })
        .catch((error) => {
          clearInterval(progressInterval);
          console.error('Image upload error:', error);
          setImagePreview(null);
          toast({
            title: 'Error',
            description: error.data?.message || 'Failed to upload image',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        })
        .finally(() => {
          setTimeout(() => {
            setIsUploadingImage(false);
            setUploadProgress(0);
          }, 500);
        });
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleImageUpload(files);
  };

  const clearImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    setImagePreview(null);
  };   

   const handleSubmit = async (e) => {
     e.preventDefault();
 
     if (!formData.name.trim()) {
       showErrorAlert('Remedy type name is required');
       return;
     }
 
     if (!formData.description.trim()) {
       showErrorAlert('Description is required');
       return;
     }
 
     try {
       console.log('Submitting data:', { id, data: formData });
       
               // Create payload with only changed fields if you want partial updates
        const payload = {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          image: formData.image,
        };
 
       const response = await updateRemedyType({
         id,
         remedyType: payload
       }).unwrap();
 
       console.log('Update response:', response);
       
       if (response.success) {
         showSuccessAlert();
       } else {
         showErrorAlert(response.message || 'Update failed');
       }
     } catch (error) {
       console.error('Failed to update remedy type:', error);
       let errorMessage = 'Failed to update remedy type. Please try again.';
       
       if (error.data) {
         console.error('Error details:', error.data);
         if (error.data.message) {
           errorMessage = error.data.message;
         } else if (error.data.errors) {
           errorMessage = Object.values(error.data.errors).join('\n');
         }
       }
       
       showErrorAlert(errorMessage);
     }
   };
 
   const handleCancel = () => {
     Swal.fire({
       title: 'Are you sure?',
       text: 'You will lose any unsaved changes',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#4B2E2B',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Yes, cancel it!'
     }).then((result) => {
       if (result.isConfirmed) {
         navigate('/admin/remedy-types');
       }
     });
   };
 
   if (isFetching) {
     return (
       <Flex justify="center" align="center" height="100vh">
         <Spinner size="xl" />
       </Flex>
     );
   }
 
   if (isError) {
     return (
       <Flex justify="center" align="center" height="100vh">
         <Text>Error loading remedy type data</Text>
       </Flex>
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
         <Flex px="25px" mb="20px" justifyContent="space-between" align="center">
           <Text
             color={textColor}
             fontSize="22px"
             fontWeight="700"
             lineHeight="100%"
           >
             Edit Remedy Type
           </Text>
         </Flex>
         
         <Box px="25px" pb="25px">
                       <form onSubmit={handleSubmit}>
              <VStack spacing="6" align="stretch" w="100%">
               <FormControl isRequired>
                 <FormLabel color={textColor} fontWeight="600">
                   Name
                 </FormLabel>
                 <Input
                   placeholder="Enter remedy type name"
                   value={formData.name}
                   onChange={(e) => handleInputChange('name', e.target.value)}
                   bg={inputBg}
                   border="1px solid"
                   borderColor={borderColor}
                   borderRadius="lg"
                   _focus={{
                     borderColor: 'blue.500',
                     boxShadow: '0 0 0 1px blue.500',
                   }}
                 />
               </FormControl>
 
               <FormControl isRequired>
                 <FormLabel color={textColor} fontWeight="600">
                   Description
                 </FormLabel>
                 <Textarea
                   placeholder="Enter description for this remedy type"
                   value={formData.description}
                   onChange={(e) => handleInputChange('description', e.target.value)}
                   rows={4}
                   bg={inputBg}
                   border="1px solid"
                   borderColor={borderColor}
                   borderRadius="lg"
                   _focus={{
                     borderColor: 'blue.500',
                     boxShadow: '0 0 0 1px blue.500',
                   }}
                 />
               </FormControl>
 
               <FormControl>
                 <FormLabel color={textColor} fontWeight="600">
                   Status
                 </FormLabel>
                 <Select
                   value={formData.status}
                   onChange={(e) => handleInputChange('status', e.target.value)}
                   bg={inputBg}
                   border="1px solid"
                   borderColor={borderColor}
                   borderRadius="lg"
                   _focus={{
                     borderColor: 'blue.500',
                     boxShadow: '0 0 0 1px blue.500',
                   }}
                 >
                   {statusOptions.map((option) => (
                     <option key={option.value} value={option.value}>
                       {option.label}
                     </option>
                   ))}
                 </Select>
                               </FormControl>

                <FormControl>
                  <FormLabel color={textColor} fontWeight="600">
                    Remedy Type Image
                  </FormLabel>
                  <Box
                    border="1px dashed"
                    borderColor={isDragging ? 'brand.500' : 'gray.300'}
                    borderRadius="md"
                    p={4}
                    textAlign="center"
                    backgroundColor={isDragging ? 'brand.50' : inputBg}
                    cursor="pointer"
                    onDragOver={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const files = Array.from(e.dataTransfer.files);
                      handleImageUpload(files);
                    }}
                    mb={4}
                    position="relative"
                  >
                    {imagePreview || formData.image ? (
                      <Flex direction="column" align="center">
                        <Image
                          src={imagePreview || formData.image}
                          alt="Remedy Type Image"
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
                          onClick={() => document.getElementById('image-upload').click()}
                          bg="transparent"
                          color="#422afb"
                        >
                          Upload Image
                          <input
                            type="file"
                            id="image-upload"
                            hidden
                            accept="image/*"
                            onChange={handleFileInputChange}
                          />
                        </Button>
                      </>
                    )}
                    
                    {/* Progress overlay - shows during upload */}
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
                          <Box w="100%" maxW="300px" mb={2}>
                            <Progress 
                              value={uploadProgress} 
                              colorScheme="blue" 
                              size="lg" 
                              borderRadius="full"
                              hasStripe
                              isAnimated
                              w={"100%"}
                            />
                            <Text color="white" fontSize="xs" mt="1" textAlign="center">
                              {Math.round(uploadProgress)}%
                            </Text>
                          </Box>
                          <Text color="white" fontSize="sm" opacity="0.9">Please wait while we upload your image</Text>
                        </VStack>
                      </Box>
                    )}
                  </Box>
                </FormControl>

                <Flex gap="4" pt="4">
                 <Button
                   type="submit"
                   variant="darkBrand"
                   color="white"
                   fontSize="sm"
                   fontWeight="500"
                   borderRadius="70px"
                   px="24px"
                   py="5px"
                   isLoading={isUpdating}
                   loadingText="Updating..."
                   _hover={{
                     bg: 'blue.600',
                   }}
                 >
                   Update Remedy Type
                 </Button>
                 <Button
                   type="button"
                   variant="outline"
                   color={textColor}
                   fontSize="sm"
                   fontWeight="500"
                   borderRadius="70px"
                   px="24px"
                   py="5px"
                   onClick={handleCancel}
                   _hover={{
                     bg: cancelHoverBg,
                   }}
                 >
                   Cancel
                 </Button>
               </Flex>
             </VStack>
           </form>
         </Box>
       </Card>
     </Box>
   );
 };
 
 export default EditRemedyType;