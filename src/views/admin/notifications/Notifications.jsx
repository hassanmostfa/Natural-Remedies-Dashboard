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
   } from '@chakra-ui/react';
   import * as React from 'react';
   import Card from 'components/card/Card';
   import { useNavigate } from 'react-router-dom';
   import { FaBell, FaUsers, FaUser, FaGlobe, FaBullhorn, FaCircleInfo, FaTriangleExclamation, FaCircleCheck } from 'react-icons/fa6';

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
      includeAction: false,
      actionText: '',
      actionUrl: '',
   });

   const [isSubmitting, setIsSubmitting] = React.useState(false);

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

         // In a real app, you would call your API here
         // const response = await api.post('/notifications', formData);
         
         // Simulate API call
         await new Promise(resolve => setTimeout(resolve, 1000));

         toast({
         title: 'Success',
         description: formData.isScheduled 
            ? 'Notification scheduled successfully' 
            : 'Notification sent successfully',
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
      <div className="container">
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
               <VStack spacing="8" align="stretch" maxW="800px">
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
                        <FormLabel color={textColor} fontWeight="600">Image URL</FormLabel>
                                                <Input
                           placeholder="Enter image URL"
                           value={formData.imageUrl}
                           onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                           bg={inputBg}
                           border="1px solid"
                           borderColor={borderColor}
                           borderRadius="lg"
                        />
                     </FormControl>
                     )}

                     <FormControl>
                     <Flex align="center" justify="space-between">
                        <FormLabel color={textColor} fontWeight="600" mb="0">Include Action Button</FormLabel>
                        <Switch
                           isChecked={formData.includeAction}
                           onChange={(e) => handleInputChange('includeAction', e.target.checked)}
                        />
                     </Flex>
                     </FormControl>

                     {formData.includeAction && (
                        <FormControl>
                           <FormLabel color={textColor} fontWeight="600">Action URL</FormLabel>
                              <Input
                              placeholder="https://example.com"
                              value={formData.actionUrl}
                              onChange={(e) => handleInputChange('actionUrl', e.target.value)}
                              bg={inputBg}
                              border="1px solid"
                              borderColor={borderColor}
                              borderRadius="lg"
                              />
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
                     isLoading={isSubmitting}
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
      </div>
   );
   };

   export default Notifications;
