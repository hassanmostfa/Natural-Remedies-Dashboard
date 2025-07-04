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
  IconButton,
  Image,
  Avatar,
  Divider,
  Heading,
  Icon,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { useNavigate } from 'react-router-dom';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { FaLeaf } from 'react-icons/fa6';

const AddRemedy = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const [formData, setFormData] = React.useState({
    disease: '',
    remedyType: '',
    image: '',
    title: '',
    description: '',
    ingredients: [{ image: '', name: '' }],
    instructions: [{ image: '', name: '' }],
    benefits: [{ image: '', name: '' }],
    precautions: [{ image: '', name: '' }],
    status: 'active',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const diseaseOptions = [
    { value: 'Common Cold', label: 'Common Cold' },
    { value: 'Headache', label: 'Headache' },
    { value: 'Digestive Issues', label: 'Digestive Issues' },
    { value: 'Insomnia', label: 'Insomnia' },
    { value: 'Anxiety', label: 'Anxiety' },
    { value: 'Skin Problems', label: 'Skin Problems' },
    { value: 'Joint Pain', label: 'Joint Pain' },
    { value: 'Respiratory Issues', label: 'Respiratory Issues' },
  ];

  const remedyTypeOptions = [
    { value: 'Herbal Tea', label: 'Herbal Tea' },
    { value: 'Essential Oil', label: 'Essential Oil' },
    { value: 'Herbal Supplement', label: 'Herbal Supplement' },
    { value: 'Tincture', label: 'Tincture' },
    { value: 'Salve', label: 'Salve' },
    { value: 'Fresh Herb', label: 'Fresh Herb' },
  ];

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

  const handleListChange = (listName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addListItem = (listName) => {
    setFormData(prev => ({
      ...prev,
      [listName]: [...prev[listName], { image: '', name: '' }]
    }));
  };

  const removeListItem = (listName, index) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
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

      if (!formData.disease) {
        toast({
          title: 'Error',
          description: 'Disease is required',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (!formData.remedyType) {
        toast({
          title: 'Error',
          description: 'Remedy type is required',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // In a real app, you would call your API here
      // const response = await api.post('/remedies', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Success',
        description: 'Remedy added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Navigate back to remedies list
      navigate('/admin/remedies');
      
    } catch (error) {
      console.error('Failed to add remedy:', error);
      toast({
        title: 'Error',
        description: 'Failed to add remedy. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/remedies');
  };

  const ListSection = ({ title, listName, items }) => (
    <Box>
      <Flex justify="space-between" align="center" mb="4">
        <Heading size="md" color={textColor}>{title}</Heading>
        <Button
          size="sm"
          leftIcon={<AddIcon />}
          onClick={() => addListItem(listName)}
          colorScheme="blue"
          variant="outline"
        >
          Add Item
        </Button>
      </Flex>
      <VStack spacing="4" align="stretch">
        {items.map((item, index) => (
          <Box key={index} p="4" border="1px solid" borderColor={borderColor} borderRadius="lg">
            <Flex justify="space-between" align="center" mb="3">
              <Text fontWeight="600" color={textColor}>Item {index + 1}</Text>
              <IconButton
                size="sm"
                icon={<CloseIcon />}
                onClick={() => removeListItem(listName, index)}
                colorScheme="red"
                variant="ghost"
                isDisabled={items.length === 1}
              />
            </Flex>
            <HStack spacing="4">
              <FormControl>
                <FormLabel fontSize="sm" color={textColor}>Image URL</FormLabel>
                <Input
                  placeholder="Enter image URL"
                  value={item.image}
                  onChange={(e) => handleListChange(listName, index, 'image', e.target.value)}
                  size="sm"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" color={textColor}>Name</FormLabel>
                <Input
                  placeholder="Enter name"
                  value={item.name}
                  onChange={(e) => handleListChange(listName, index, 'name', e.target.value)}
                  size="sm"
                />
              </FormControl>
              <Box>
                <FormLabel fontSize="sm" color={textColor}>Preview</FormLabel>
                <Avatar
                  src={item.image}
                  size="md"
                  fallback={<Icon as={FaLeaf} color="green.500" />}
                />
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );

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
            Add New Remedy
          </Text>
        </Flex>
        
        <Box px="25px" pb="25px">
          <form onSubmit={handleSubmit}>
            <VStack spacing="8" align="stretch" maxW="800px">
              {/* Basic Information */}
              <Box>
                <Heading size="md" color={textColor} mb="4">Basic Information</Heading>
                <VStack spacing="4" align="stretch">
                  <HStack spacing="4">
                    <FormControl isRequired>
                      <FormLabel color={textColor} fontWeight="600">Title</FormLabel>
                      <Input
                        placeholder="Enter remedy title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        bg={useColorModeValue('white', 'gray.700')}
                        border="1px solid"
                        borderColor={borderColor}
                        borderRadius="lg"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel color={textColor} fontWeight="600">Main Image URL</FormLabel>
                      <Input
                        placeholder="Enter main image URL"
                        value={formData.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        bg={useColorModeValue('white', 'gray.700')}
                        border="1px solid"
                        borderColor={borderColor}
                        borderRadius="lg"
                      />
                    </FormControl>
                  </HStack>

                  <HStack spacing="4">
                    <FormControl isRequired>
                      <FormLabel color={textColor} fontWeight="600">Disease</FormLabel>
                      <Select
                        value={formData.disease}
                        onChange={(e) => handleInputChange('disease', e.target.value)}
                        bg={useColorModeValue('white', 'gray.700')}
                        border="1px solid"
                        borderColor={borderColor}
                        borderRadius="lg"
                        placeholder="Select disease"
                      >
                        {diseaseOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel color={textColor} fontWeight="600">Remedy Type</FormLabel>
                      <Select
                        value={formData.remedyType}
                        onChange={(e) => handleInputChange('remedyType', e.target.value)}
                        bg={useColorModeValue('white', 'gray.700')}
                        border="1px solid"
                        borderColor={borderColor}
                        borderRadius="lg"
                        placeholder="Select remedy type"
                      >
                        {remedyTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </HStack>

                  <FormControl isRequired>
                    <FormLabel color={textColor} fontWeight="600">Description</FormLabel>
                    <Textarea
                      placeholder="Enter detailed description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      bg={useColorModeValue('white', 'gray.700')}
                      border="1px solid"
                      borderColor={borderColor}
                      borderRadius="lg"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color={textColor} fontWeight="600">Status</FormLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      bg={useColorModeValue('white', 'gray.700')}
                      border="1px solid"
                      borderColor={borderColor}
                      borderRadius="lg"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </VStack>
              </Box>

              <Divider />

              {/* Ingredients */}
              <ListSection 
                title="Ingredients" 
                listName="ingredients" 
                items={formData.ingredients} 
              />

              <Divider />

              {/* Instructions */}
              <ListSection 
                title="Instructions" 
                listName="instructions" 
                items={formData.instructions} 
              />

              <Divider />

              {/* Benefits */}
              <ListSection 
                title="Benefits" 
                listName="benefits" 
                items={formData.benefits} 
              />

              <Divider />

              {/* Precautions */}
              <ListSection 
                title="Precautions" 
                listName="precautions" 
                items={formData.precautions} 
              />

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
                  Add Remedy
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

export default AddRemedy;
