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
   } from '@chakra-ui/react';
   import * as React from 'react';
   import Card from 'components/card/Card';
   import { useNavigate } from 'react-router-dom';

   const AddType = () => {
   const navigate = useNavigate();
   const toast = useToast();
   
   const textColor = useColorModeValue('secondaryGray.900', 'white');
   const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

   const [formData, setFormData] = React.useState({
      name: '',
      description: '',
      status: 'active',
      colorScheme: 'green',
   });

   const [isSubmitting, setIsSubmitting] = React.useState(false);


   const statusOptions = [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
   ];

   const handleInputChange = (field, value) => {
      setFormData(prev => ({
         ...prev,
         [field]: value
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
         // Validate form data
         if (!formData.name.trim()) {
         toast({
            title: 'Error',
            description: 'Type name is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
         });
         return;
         }

         if (!formData.description.trim()) {
         toast({
            title: 'Error',
            description: 'Description is required',
            status: 'error',
            duration: 3000,
            isClosable: true,
         });
         return;
         }

         // In a real app, you would call your API here
         // const response = await api.post('/remedy-types', formData);
         
         // Simulate API call
         await new Promise(resolve => setTimeout(resolve, 1000));

         toast({
         title: 'Success',
         description: 'Remedy type added successfully',
         status: 'success',
         duration: 3000,
         isClosable: true,
         });

         // Navigate back to types list
         navigate('/admin/remedy-types');
         
      } catch (error) {
         console.error('Failed to add remedy type:', error);
         toast({
         title: 'Error',
         description: 'Failed to add remedy type. Please try again.',
         status: 'error',
         duration: 3000,
         isClosable: true,
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleCancel = () => {
      navigate('/admin/remedy-types');
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
               Add New Remedy Type
            </Text>
         </Flex>
         
         <Box px="25px" pb="25px">
            <form onSubmit={handleSubmit}>
               <VStack spacing="6" align="stretch" maxW="600px">
               {/* Type Name */}
               <FormControl isRequired>
                  <FormLabel color={textColor} fontWeight="600">
                     Type Name
                  </FormLabel>
                  <Input
                     placeholder="Enter remedy type name"
                     value={formData.name}
                     onChange={(e) => handleInputChange('name', e.target.value)}
                     bg={useColorModeValue('white', 'gray.700')}
                     border="1px solid"
                     borderColor={borderColor}
                     borderRadius="lg"
                     _focus={{
                     borderColor: 'blue.500',
                     boxShadow: '0 0 0 1px blue.500',
                     }}
                  />
               </FormControl>

               {/* Description */}
               <FormControl isRequired>
                  <FormLabel color={textColor} fontWeight="600">
                     Description
                  </FormLabel>
                  <Textarea
                     placeholder="Enter description for this remedy type"
                     value={formData.description}
                     onChange={(e) => handleInputChange('description', e.target.value)}
                     rows={4}
                     bg={useColorModeValue('white', 'gray.700')}
                     border="1px solid"
                     borderColor={borderColor}
                     borderRadius="lg"
                     _focus={{
                     borderColor: 'blue.500',
                     boxShadow: '0 0 0 1px blue.500',
                     }}
                  />
               </FormControl>

               {/* Status */}
               <FormControl>
                  <FormLabel color={textColor} fontWeight="600">
                     Status
                  </FormLabel>
                  <Select
                     value={formData.status}
                     onChange={(e) => handleInputChange('status', e.target.value)}
                     bg={useColorModeValue('white', 'gray.700')}
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
                     loadingText="Adding..."
                     _hover={{
                     bg: 'blue.600',
                     }}
                  >
                     Add Remedy Type
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
                     bg: useColorModeValue('gray.100', 'gray.600'),
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

   export default AddType; 