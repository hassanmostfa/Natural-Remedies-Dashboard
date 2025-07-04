import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
  Select,
  Textarea,
  Badge,
  Icon,
  Stack,
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaSeedling, FaAward, FaCrown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useState } from 'react';

const AddPlan = () => {
  const navigate = useNavigate();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const inputBorder = useColorModeValue('gray.300', 'gray.600');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    period: 'month',
    features: '',
    status: 'active',
    icon: 'seedling',
    isPopular: false,
  });

  const iconOptions = [
    { value: 'seedling', label: 'Rookie', icon: FaSeedling, color: 'green' },
    { value: 'award', label: 'Skilled', icon: FaAward, color: 'blue' },
    { value: 'crown', label: 'Master', icon: FaCrown, color: 'purple' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.price) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill in all required fields',
        confirmButtonText: 'OK',
      });
      return;
    }

    // In a real app, you would send this data to your API
    console.log('Plan data to be submitted:', formData);
    
    Swal.fire({
      icon: 'success',
      title: 'Plan Created',
      text: 'The new subscription plan has been added successfully',
      confirmButtonText: 'OK',
    }).then(() => {
      navigate('/admin/subscription-plans'); // Redirect to plans list
    });
  };

  return (
    <Flex justify="center" p="20px" mt="80px">
      <Box w="100%" p="6" boxShadow="md" borderRadius="lg" bg={cardBg}>
        <Text color={textColor} fontSize="22px" fontWeight="700" mb="20px">
          Add New Subscription Plan
        </Text>

        <form onSubmit={handleSubmit}>
          {/* Plan Name */}
          <FormControl mb="4" isRequired>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              Plan Name
            </FormLabel>
            <Input
              type="text"
              name="name"
              placeholder="e.g. Professional, Enterprise"
              value={formData.name}
              onChange={handleInputChange}
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
            />
          </FormControl>

          {/* Price and Billing Period */}
          <Flex mb="4" gap="4">
            <FormControl isRequired>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                Price
              </FormLabel>
              <Input
                type="text"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
                bg={inputBg}
                color={textColor}
                borderColor={inputBorder}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                Billing Period
              </FormLabel>
              <Select
                name="period"
                value={formData.period}
                onChange={handleInputChange}
                bg={inputBg}
                color={textColor}
                borderColor={inputBorder}
                icon={<ChevronDownIcon />}
              >
                <option value="month">Per Month</option>
                <option value="year">Per Year</option>
                <option value="one-time">One Time</option>
                <option value="free">Free</option>
              </Select>
            </FormControl>
          </Flex>

          {/* Features */}
          <FormControl mb="4">
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              Features (comma separated)
            </FormLabel>
            <Textarea
              name="features"
              placeholder="e.g. Advanced analytics, Priority support, API access"
              value={formData.features}
              onChange={handleInputChange}
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              rows={3}
            />
          </FormControl>

          {/* Status and Popular */}
          <Flex mb="6" gap="4">
            <FormControl>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                Popular Plan
              </FormLabel>
              <Select
                name="isPopular"
                value={formData.isPopular ? 'yes' : 'no'}
                onChange={(e) => setFormData({...formData, isPopular: e.target.value === 'yes'})}
                bg={inputBg}
                color={textColor}
                borderColor={inputBorder}
                icon={<ChevronDownIcon />}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </Select>
            </FormControl>
          </Flex>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="blue"
            width="100%"
            size="lg"
            leftIcon={<AddIcon />}
            mt="4"
          >
            Create Plan
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default AddPlan;