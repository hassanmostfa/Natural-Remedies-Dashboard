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
   Checkbox,
   Radio,
   RadioGroup,
   Stack,
   Badge,
   Divider,
   Heading,
   Icon,
   Switch,
   FormHelperText,
   Image,
   Progress,
   } from '@chakra-ui/react';
   import * as React from 'react';
   import Card from 'components/card/Card';
   import { useNavigate } from 'react-router-dom';
   import { FaBell, FaUsers, FaUser, FaGlobe, FaBullhorn, FaCircleInfo, FaTriangleExclamation, FaCircleCheck, FaUpload, FaImage } from 'react-icons/fa6';
import { useUploadImageMutation } from 'api/fileUploadSlice';
import { useSendNotificationMutation } from 'api/notificationsSlice';

      const Notifications = () => {
      const navigate = useNavigate();
      const toast = useToast();
      
      const textColor = useColorModeValue('secondaryGray.900', 'white');
      const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
      const inputBg = useColorModeValue('white', 'gray.700');
      const hoverBg = useColorModeValue('gray.100', 'gray.600');

         const [formData, setFormData] = React.useState({
         title: '',
         message: '',
         type: 'user',
         notificationType: 'info',
         targetAudience: 'all',
         selectedUsers: [],
         selectedCategories: [],
         selectedRemedyTypes: [],
         priority: 'normal',
         scheduledDate: '',
         scheduledTime: '',
         isScheduled: false,
         includeImage: false,
         imageUrl: '',
      });

      const [isSubmitting, setIsSubmitting] = React.useState(false);
      const [imagePreview, setImagePreview] = React.useState(null);
      const [selectedFile, setSelectedFile] = React.useState(null);
      const [isDragging, setIsDragging] = React.useState(false);
      const [isUploadingImage, setIsUploadingImage] = React.useState(false);
      const [uploadProgress, setUploadProgress] = React.useState(0);

      // API hooks
      const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
      const [sendNotification, { isLoading: isSendingNotification }] = useSendNotificationMutation();

      const notificationTypeOptions = [
         { value: 'info', label: 'Information', icon: FaCircleInfo, color: 'blue' },
         { value: 'warning', label: 'Warning', icon: FaTriangleExclamation, color: 'orange' },
         { value: 'success', label: 'Success', icon: FaCircleCheck, color: 'green' },
         { value: 'announcement', label: 'Announcement', icon: FaBullhorn, color: 'purple' },
      ];

      const targetAudienceOptions = [
         { value: 'all', label: 'All Users', icon: FaGlobe },
         { value: 'specific', label: 'Specific Users', icon: FaUser },
         { value: 'category', label: 'By Category', icon: FaUsers },
         { value: 'remedyType', label: 'By Remedy Type', icon: FaUsers },
      ];

         const typeOptions = [
         { value: 'user', label: 'User' },
         { value: 'guest', label: 'Guest' },
      ];

      const priorityOptions = [
         { value: 'low', label: 'Low' },
         { value: 'normal', label: 'Normal' },
         { value: 'high', label: 'High' },
         { value: 'urgent', label: 'Urgent' },
      ];

      // Mock data for dropdowns
      const userOptions = [
         { value: 'user1', label: 'John Doe (john@example.com)' },
         { value: 'user2', label: 'Jane Smith (jane@example.com)' },
         { value: 'user3', label: 'Mike Johnson (mike@example.com)' },
         { value: 'user4', label: 'Sarah Wilson (sarah@example.com)' },
      ];

      const categoryOptions = [
         { value: 'digestive', label: 'Digestive Health' },
         { value: 'respiratory', label: 'Respiratory Health' },
         { value: 'immune', label: 'Immune System' },
         { value: 'pain', label: 'Pain Relief' },
         { value: 'sleep', label: 'Sleep & Relaxation' },
         { value: 'skin', label: 'Skin Health' },
         { value: 'energy', label: 'Energy & Vitality' },
         { value: 'womens', label: 'Women\'s Health' },
      ];

      const remedyTypeOptions = [
         { value: 'herbal-tea', label: 'Herbal Tea' },
         { value: 'essential-oil', label: 'Essential Oil' },
         { value: 'herbal-supplement', label: 'Herbal Supplement' },
         { value: 'tincture', label: 'Tincture' },
         { value: 'salve', label: 'Salve' },
         { value: 'fresh-herb', label: 'Fresh Herb' },
      ];

      const handleInputChange = (field, value) => {
         setFormData(prev => ({
            ...prev,
            [field]: value
         }));
      };

         const handleArrayChange = (field, value, checked) => {
         setFormData(prev => ({
            ...prev,
            [field]: checked 
            ? [...prev[field], value]
            : prev[field].filter(item => item !== value)
         }));
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
            setUploadProgress(0);
            
            // Simulate progress updates
            const progressInterval = setInterval(() => {
               setUploadProgress(prev => {
                  if (prev >= 90) {
                     clearInterval(progressInterval);
                     return prev;
                  }
                  return prev + Math.random() * 15;
               });
            }, 200);

            // Add a small delay to ensure state is set before upload starts
            await new Promise(resolve => setTimeout(resolve, 100));

            const response = await uploadImage(file).unwrap();
            
            // Complete the progress
            setUploadProgress(100);
            clearInterval(progressInterval);
            
            // Add a small delay to show 100% completion
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (response.success && response.url) {
               setFormData(prev => ({
                  ...prev,
                  imageUrl: response.url
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
            setUploadProgress(0);
         }
      };

      const clearImage = () => {
         setImagePreview(null);
         setSelectedFile(null);
         setUploadProgress(0);
         setFormData(prev => ({
            ...prev,
            imageUrl: ''
         }));
      };

      const handleSubmit = async (e) => {
         e.preventDefault();
         setIsSubmitting(true);

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

            if (!formData.message.trim()) {
            toast({
               title: 'Error',
               description: 'Message is required',
               status: 'error',
               duration: 3000,
               isClosable: true,
            });
            return;
            }

            if (formData.targetAudience === 'specific' && formData.selectedUsers.length === 0) {
            toast({
               title: 'Error',
               description: 'Please select at least one user',
               status: 'error',
               duration: 3000,
               isClosable: true,
            });
            return;
            }

            if (formData.targetAudience === 'category' && formData.selectedCategories.length === 0) {
            toast({
               title: 'Error',
               description: 'Please select at least one category',
               status: 'error',
               duration: 3000,
               isClosable: true,
            });
            return;
            }

            if (formData.targetAudience === 'remedyType' && formData.selectedRemedyTypes.length === 0) {
            toast({
               title: 'Error',
               description: 'Please select at least one remedy type',
               status: 'error',
               duration: 3000,
               isClosable: true,
            });
            return;
            }

                         // Prepare notification data
             const notificationData = {
               title: formData.title,
               description: formData.message,
               type: formData.type,
               ...(formData.imageUrl && { image: formData.imageUrl }),
             };

            // Send notification via API
            const response = await sendNotification(notificationData).unwrap();

                         toast({
                title: 'Success',
                description: response.message || (formData.isScheduled 
                   ? 'Notification scheduled successfully' 
                   : 'Notification sent successfully'),
                status: 'success',
                duration: 3000,
                isClosable: true,
             });

            // Navigate back to admin dashboard
            navigate('/admin');
            
         } catch (error) {
            console.error('Failed to send notification:', error);
            toast({
            title: 'Error',
            description: 'Failed to send notification. Please try again.',
            status: 'error',
            duration: 3000,
            isClosable: true,
            });
         } finally {
            setIsSubmitting(false);
         }
      };

      const handleCancel = () => {
         navigate('/admin');
      };

      const getNotificationTypeIcon = (type) => {
         const option = notificationTypeOptions.find(opt => opt.value === type);
         return option ? option.icon : FaCircleInfo;
      };

      const getNotificationTypeColor = (type) => {
         const option = notificationTypeOptions.find(opt => opt.value === type);
         return option ? option.color : 'blue';
      };

      return (
         <Box mt={"90px"}>
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
                  Send Notification
               </Text>
            </Flex>
            
            <Box px="25px" pb="25px">
               <form onSubmit={handleSubmit}>
                  <VStack spacing="8" align="stretch" w="100%">
                                 {/* Basic Information */}
                  <Box>
                     <VStack spacing="4" align="stretch">
                        <HStack spacing="4">
                        <FormControl isRequired>
                           <FormLabel color={textColor} fontWeight="600">Title</FormLabel>
                                                   <Input
                              placeholder="Enter notification title"
                              value={formData.title}
                              onChange={(e) => handleInputChange('title', e.target.value)}
                              bg={inputBg}
                              border="1px solid"
                              borderColor={borderColor}
                              borderRadius="lg"
                           />
                        </FormControl>
                        <FormControl isRequired>
                           <FormLabel color={textColor} fontWeight="600">Type</FormLabel>
                           <Select
                              value={formData.type}
                              onChange={(e) => handleInputChange('type', e.target.value)}
                              bg={inputBg}
                              border="1px solid"
                              borderColor={borderColor}
                              borderRadius="lg"
                           >
                              {typeOptions.map(option => (
                                 <option key={option.value} value={option.value}>
                                    {option.label}
                                 </option>
                              ))}
                           </Select>
                        </FormControl>
                        </HStack>

                        <FormControl isRequired>
                        <FormLabel color={textColor} fontWeight="600">Message</FormLabel>
                                             <Textarea
                           placeholder="Enter notification message"
                           value={formData.message}
                           onChange={(e) => handleInputChange('message', e.target.value)}
                           rows={4}
                           bg={inputBg}
                           border="1px solid"
                           borderColor={borderColor}
                           borderRadius="lg"
                           />
                        </FormControl>

                     </VStack>
                  </Box>

                  <Divider />

                  {/* Additional Options */}
                  <Box>
                     <Heading size="md" color={textColor} mb="4">Additional Options</Heading>
                                       <VStack spacing="4" align="stretch">
                        <FormControl>
                        <Flex align="center" justify="space-between">
                           <FormLabel color={textColor} fontWeight="600" mb="0">Include Image</FormLabel>
                           <Switch
                              isChecked={formData.includeImage}
                              onChange={(e) => handleInputChange('includeImage', e.target.checked)}
                           />
                        </Flex>
                        </FormControl>

                        {formData.includeImage && (
                        <FormControl>
                           <FormLabel color={textColor} fontWeight="600">Notification Image</FormLabel>
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
                              h="100%"
                           >
                                                             {isUploadingImage ? (
                                  <>
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
                                        h="100%"
                                     >
                                        <VStack spacing="4" w="80%">
                                           <Progress 
                                              value={uploadProgress} 
                                              size="lg" 
                                              colorScheme="blue" 
                                              borderRadius="full"
                                              hasStripe
                                              isAnimated
                                              w="100%"
                                           />
                                           <Text color="white" fontSize="lg" fontWeight="bold">
                                              Uploading Image... {Math.round(uploadProgress)}%
                                           </Text>
                                           <Text color="white" fontSize="sm" opacity="0.9">
                                              Please wait while we upload your image
                                           </Text>
                                        </VStack>
                                     </Box>
                                     <VStack spacing="2">
                                        <Progress 
                                           value={uploadProgress} 
                                           size="md" 
                                           colorScheme="blue" 
                                           borderRadius="full"
                                           hasStripe
                                           isAnimated
                                           w="100%"
                                        />
                                        <Text color="#422afb" fontSize="sm" fontWeight="bold">
                                           Uploading... {Math.round(uploadProgress)}%
                                        </Text>
                                        <Text color="#422afb" fontSize="xs" opacity="0.8">
                                           Please wait
                                        </Text>
                                     </VStack>
                                  </>
                               ) : imagePreview ? (
                                  <Flex direction="column" align="center">
                                     <Image
                                        src={imagePreview}
                                        alt="Notification Preview"
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
                                        onClick={() => document.getElementById('notification-image-upload').click()}
                                        isLoading={isUploadingImage}
                                        loadingText="Uploading..."
                                        leftIcon={isUploadingImage ? <Icon as={FaUpload} /> : undefined}
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
                                           id="notification-image-upload"
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
                        )}


                     </VStack>
                  </Box>

                  {/* Action Buttons */}
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
                                                 isLoading={isSubmitting || isSendingNotification}
                         loadingText={formData.isScheduled ? "Scheduling..." : "Sending..."}
                        leftIcon={<Icon as={FaBell} />}
                        _hover={{
                        bg: 'blue.600',
                        }}
                     >
                        {formData.isScheduled ? 'Schedule Notification' : 'Send Notification'}
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
                        bg: hoverBg,
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

      export default Notifications;
