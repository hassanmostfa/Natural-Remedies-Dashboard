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
 } from '@chakra-ui/react';
 import * as React from 'react';
 import Card from 'components/card/Card';
 import { useNavigate, useParams } from 'react-router-dom';
 import { 
   useGetBodySystemQuery,
   useUpdateBodySystemMutation 
 } from 'api/bodySystemsSlice';
 import Swal from 'sweetalert2';
 
 const UpdateBodySystem = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { data: bodySystem, isLoading, isError } = useGetBodySystemQuery(id);
   const [updateBodySystem, { isLoading: isUpdating }] = useUpdateBodySystemMutation();
   
   const textColor = useColorModeValue('secondaryGray.900', 'white');
   const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
   const inputBg = useColorModeValue('white', 'gray.700');
   const cancelHoverBg = useColorModeValue('gray.100', 'gray.600');
 
   const [formData, setFormData] = React.useState({
     title: '',
     description: '',
     status: 'active',
   });
 
   // Set form data when bodySystem data is loaded
   React.useEffect(() => {
     if (bodySystem?.data) {
       console.log('Initial data loaded:', bodySystem.data);
       setFormData({
         title: bodySystem.data.title || '',
         description: bodySystem.data.description || '',
         status: bodySystem.data.status || 'active',
       });
     }
   }, [bodySystem]);
 
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
       text: 'Body system updated successfully',
       icon: 'success',
       confirmButtonText: 'OK',
     }).then((result) => {
       if (result.isConfirmed) {
         navigate('/admin/categories');
       }
     });
   };
 
   const handleInputChange = (field, value) => {
     setFormData(prev => ({
       ...prev,
       [field]: value
     }));
   };
 
   const handleSubmit = async (e) => {
     e.preventDefault();
 
     if (!formData.title.trim()) {
       showErrorAlert('Body system title is required');
       return;
     }
 
     if (!formData.description.trim()) {
       showErrorAlert('Description is required');
       return;
     }
 
     try {
       console.log('Submitting data:', { id, data: formData });
       
       const response = await updateBodySystem({
         id, // This is the ID from useParams
         bodySystem: formData
       }).unwrap();
 
       console.log('Update response:', response);
       
       if (response.success) {
         showSuccessAlert();
       } else {
         showErrorAlert(response.message || 'Update failed');
       }
     } catch (error) {
       console.error('Failed to update body system:', error);
       let errorMessage = 'Failed to update body system. Please try again.';
       
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
         navigate('/admin/categories');
       }
     });
   };
 
   if (isLoading) {
     return (
       <Flex justify="center" align="center" height="100vh">
         <Spinner size="xl" />
       </Flex>
     );
   }
 
   if (isError) {
     return (
       <Flex justify="center" align="center" height="100vh">
         <Text>Error loading body system data</Text>
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
             Update Body System
           </Text>
         </Flex>
         
         <Box px="25px" pb="25px">
           <form onSubmit={handleSubmit}>
             <VStack spacing="6" align="stretch" maxW="600px">
               <FormControl isRequired>
                 <FormLabel color={textColor} fontWeight="600">
                   Title
                 </FormLabel>
                 <Input
                   placeholder="Enter title"
                   value={formData.title}
                   onChange={(e) => handleInputChange('title', e.target.value)}
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
                   placeholder="Enter description for this body system"
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
                   Update Body System
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
 
 export default UpdateBodySystem;