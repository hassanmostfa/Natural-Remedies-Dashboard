import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Card,
  Badge,
  Icon,
  useToast,
  Spinner,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as React from 'react';
import { FaShieldAlt, FaFileContract, FaSave } from 'react-icons/fa';
import { useGetPoliciesQuery, useUpdatePolicyMutation } from 'api/policiesSlice';

const PrivacyAndTerms = () => {
  const toast = useToast();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const cardBg = useColorModeValue('white', 'navy.800');

  // API hooks for both policy types
  const { data: privacyResponse, isLoading: isLoadingPrivacy, refetch: refetchPrivacy } = useGetPoliciesQuery({ type: 'privacy' });
  const { data: termsResponse, isLoading: isLoadingTerms, refetch: refetchTerms } = useGetPoliciesQuery({ type: 'terms' });
  
  const [updatePolicy, { isLoading: isUpdating }] = useUpdatePolicyMutation();

  // Form states
  const [privacyForm, setPrivacyForm] = React.useState({
    content: '',
    status: 'active',
  });

  const [termsForm, setTermsForm] = React.useState({
    content: '',
    status: 'active',
  });

  const [errors, setErrors] = React.useState({});
  const [activeTab, setActiveTab] = React.useState(0);

  // Load privacy policy data
  React.useEffect(() => {
    if (privacyResponse?.data) {
      const policyData = privacyResponse.data;
      setPrivacyForm({
        content: policyData.content || '',
        status: policyData.status || 'active',
      });
    }
  }, [privacyResponse?.data]);

  // Load terms policy data
  React.useEffect(() => {
    if (termsResponse?.data) {
      const policyData = termsResponse.data;
      setTermsForm({
        content: policyData.content || '',
        status: policyData.status || 'active',
      });
    }
  }, [termsResponse?.data]);

  const handlePrivacyChange = (field, value) => {
    setPrivacyForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[`privacy_${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`privacy_${field}`]: ''
      }));
    }
  };

  const handleTermsChange = (field, value) => {
    setTermsForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[`terms_${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`terms_${field}`]: ''
      }));
    }
  };

  const validateForm = (formData, prefix) => {
    const newErrors = {};
    
    if (!formData.content.trim()) {
      newErrors[`${prefix}_content`] = 'Content is required';
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handlePrivacySubmit = async () => {
    if (!validateForm(privacyForm, 'privacy')) {
      return;
    }

    try {
      const policyData = {
        type: 'privacy',
        content: privacyForm.content,
        status: privacyForm.status,
      };

      await updatePolicy({ id: privacyResponse.data.id, policy: policyData }).unwrap();

      toast({
        title: 'Success',
        description: 'Privacy Policy updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      refetchPrivacy();
    } catch (error) {
      console.error('Failed to update privacy policy:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to update privacy policy. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleTermsSubmit = async () => {
    if (!validateForm(termsForm, 'terms')) {
      return;
    }

    try {
      const policyData = {
        type: 'terms',
        content: termsForm.content,
        status: termsForm.status,
      };

      await updatePolicy({ id: termsResponse.data.id, policy: policyData }).unwrap();

      toast({
        title: 'Success',
        description: 'Terms & Conditions updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      refetchTerms();
    } catch (error) {
      console.error('Failed to update terms policy:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to update terms policy. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderPolicyForm = (type, formData, onChange, onSubmit, isLoading, isUpdating, errors) => {
    const isPrivacy = type === 'privacy';
        const typeColors = {
          privacy: 'blue',
          terms: 'green'
        };
        
        const typeIcons = {
          privacy: FaShieldAlt,
          terms: FaFileContract
        };
    
    const typeLabels = {
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions'
    };
        
        return (
         <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack spacing={3}>
            <Icon as={typeIcons[type]} color={`${typeColors[type]}.500`} boxSize={6} />
            <Text color={textColor} fontSize="xl" fontWeight="bold">
              {typeLabels[type]}
            </Text>
            <Badge 
              colorScheme={typeColors[type]}
              px="3"
              py="1"
              borderRadius="full"
              fontSize="sm"
            >
              {formData.status}
            </Badge>
          </HStack>

             {/* Content Editor */}
           <FormControl isInvalid={!!errors[`${type}_content`]}>
             <FormLabel color={textColor} fontWeight="bold">
               Content *
             </FormLabel>
             <Box mb={10}>
               <ReactQuill
                 theme="snow"
                 value={formData.content}
                 onChange={(value) => onChange('content', value)}
                 placeholder={`Enter the ${typeLabels[type].toLowerCase()} content...`}
                 style={{ height: '200px' , border:'none' }}
                 modules={{
                   toolbar: [
                     [{ 'header': [1, 2, 3, false] }],
                     ['bold', 'italic', 'underline', 'strike'],
                     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                     [{ 'color': [] }, { 'background': [] }],
                     [{ 'align': [] }],
                     ['link', 'blockquote', 'code-block'],
                     ['clean']
                   ],
                 }}
               />
             </Box>
             {errors[`${type}_content`] && (
               <Text color="red.500" fontSize="sm" mt={1}>
                 {errors[`${type}_content`]}
        </Text>
             )}
           </FormControl>

          {/* Submit Button */}
          <Button
            onClick={onSubmit}
            colorScheme={typeColors[type]}
            isLoading={isUpdating}
            loadingText="Updating..."
            leftIcon={<FaSave />}
            size="lg"
          >
            Update {typeLabels[type]}
                     </Button>
         </VStack>
     );
  };

  // Loading state
  if (isLoadingPrivacy || isLoadingTerms) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card p={6}>
          <Flex justify="center" align="center" h="200px">
            <VStack spacing={4}>
              <Spinner size="xl" color="#422afb" thickness="4px" />
              <Text color={textColor}>Loading policies...</Text>
            </VStack>
          </Flex>
        </Card>
      </Box>
    );
  }

    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <VStack spacing={8} align="stretch">
        {/* Page Header */}
        <Box>
          <Text color={textColor} fontSize="3xl" fontWeight="bold" mb={2}>
            Privacy & Terms Management
          </Text>
          <Text color="gray.500">
            Update your privacy policy and terms & conditions content
          </Text>
        </Box>

                 {/* Tabs */}
         <Card p={6} bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="xl" boxShadow="lg">
           <Tabs index={activeTab} onChange={setActiveTab} variant="soft-rounded" colorScheme="blue" size="lg">
             <TabList bg="gray.50" p={2} borderRadius="xl" border="1px solid" borderColor="gray.200">
               <Tab 
                 _selected={{ 
                   bg: "blue.500", 
                   color: "white", 
                   boxShadow: "lg",
                   transform: "translateY(-2px)",
                   transition: "all 0.2s"
                 }}
                 _hover={{ 
                   bg: "blue.400", 
                   transform: "translateY(-1px)",
                   transition: "all 0.2s"
                 }}
                 borderRadius="lg"
                 fontWeight="semibold"
                 transition="all 0.2s"
               >
                 <HStack spacing={3}>
                   <Icon as={FaShieldAlt} boxSize={5} />
                   <Text fontSize="md">Privacy Policy</Text>
          </HStack>
               </Tab>
               <Tab 
                 _selected={{ 
                   bg: "green.500", 
                   color: "white", 
                   boxShadow: "lg",
                   transform: "translateY(-2px)",
                   transition: "all 0.2s"
                 }}
                 _hover={{ 
                   bg: "green.400", 
                   transform: "translateY(-1px)",
                   transition: "all 0.2s"
                 }}
                 borderRadius="lg"
                 fontWeight="semibold"
                 transition="all 0.2s"
               >
                 <HStack spacing={3}>
                   <Icon as={FaFileContract} boxSize={5} />
                   <Text fontSize="md">Terms & Conditions</Text>
              </HStack>
               </Tab>
             </TabList>

                         <TabPanels>
               {/* Privacy Policy Tab */}
               <TabPanel pt={8}>
                 {renderPolicyForm(
                   'privacy',
                   privacyForm,
                   handlePrivacyChange,
                   handlePrivacySubmit,
                   isLoadingPrivacy,
                   isUpdating,
                   errors
                 )}
               </TabPanel>

               {/* Terms & Conditions Tab */}
               <TabPanel pt={8}>
                 {renderPolicyForm(
                   'terms',
                   termsForm,
                   handleTermsChange,
                   handleTermsSubmit,
                   isLoadingTerms,
                   isUpdating,
                   errors
                 )}
               </TabPanel>
             </TabPanels>
          </Tabs>
      </Card>
      </VStack>
    </Box>
  );
};

export default PrivacyAndTerms;
