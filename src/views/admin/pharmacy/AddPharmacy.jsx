import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  Textarea,
  Icon,
  Radio,
  RadioGroup,
  Stack,
  SimpleGrid,
} from '@chakra-ui/react';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa6';

const AddPharmacy = () => {
  const [formData, setFormData] = useState({
    name: 'Al-Shifa Pharmacy',
    image:
      'https://th.bing.com/th/id/OIP.2tLY6p_5ubR3VvBlrP4iyAHaE8?w=254&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    description: '24/7 pharmacy service with home delivery',
    whatsappNumber: '+96599123456',
    email: 'alshifa2@example.com',
    workingHours: 'From Saturday to Friday 8:00 to 23:00',
    revenueShareType: 'fixed', // 'fixed' or 'percentage'
    revenueShareValue: '15.5', // Percentage or fixed amount
    feesStartDate: '2024-02-01',
    feesEndDate: '2025-02-01',
  });

  const [numberOfBranches, setNumberOfBranches] = useState(0); // State for number of branches
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRevenueShareTypeChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      revenueShareType: value,
      revenueShareValue: '', // Reset value when switching type
    }));
  };

  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      setImage(files[0]);
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

  const handleSend = () => {
    console.log('Pharmacy Data:', formData);
  };

  const handleNumberOfBranchesChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumberOfBranches(value >= 0 ? value : ''); // Ensure the value is non-negative
  };

  return (
    <div className="container add-admin-container w-100">
      <div className="add-admin-card shadow p-4 bg-white w-100">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Text color={textColor} fontSize="22px" fontWeight="700">
            Add New Pharmacy
          </Text>
          <Button
            type="button"
            onClick={() => navigate(-1)}
            colorScheme="teal"
            size="sm"
            leftIcon={<IoMdArrowBack />}
          >
            Back
          </Button>
        </div>
        <form>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {/* Row 1: Pharmacy Name En and Pharmacy Name Ar */}
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Pharmacy Name En <span className="text-danger">*</span>
              </Text>
              <Input name="nameEn" onChange={handleChange} mt={2} />
            </GridItem>
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Pharmacy Name Ar <span className="text-danger">*</span>
              </Text>
              <Input name="nameAr" onChange={handleChange} mt={2} />
            </GridItem>

            {/* Row 2: Email and Iban */}
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Email <span className="text-danger">*</span>
              </Text>
              <Input name="email" onChange={handleChange} mt={2} />
            </GridItem>
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Iban <span className="text-danger">*</span>
              </Text>
              <Input name="iban" onChange={handleChange} mt={2} />
            </GridItem>

            {/* Row 3: Password and WhatsApp Number */}
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Password <span className="text-danger">*</span>
              </Text>
              <Input type="password" name="password" onChange={handleChange} mt={2} />
            </GridItem>
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                WhatsApp Number <span className="text-danger">*</span>
              </Text>
              <Input name="whatsappNumber" onChange={handleChange} mt={2} />
            </GridItem>

            {/* Row 4: Working Hours and Revenue Share Type */}
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Working Hours <span className="text-danger">*</span>
              </Text>
              <Input name="workingHours" onChange={handleChange} mt={2} />
            </GridItem>
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Revenue Share Type <span className="text-danger">*</span>
              </Text>
              <RadioGroup
                onChange={handleRevenueShareTypeChange}
                value={formData.revenueShareType}
                mt={2}
              >
                <Stack direction="row">
                  <Radio value="fixed">Fixed Fees</Radio>
                  <Radio value="percentage">Percentage</Radio>
                </Stack>
              </RadioGroup>
            </GridItem>

            {/* Row 5: Conditional Inputs Based on Revenue Share Type */}
            {formData.revenueShareType === 'percentage' ? (
              <GridItem colSpan={2}>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Percentage <span className="text-danger">*</span>
                </Text>
                <Input
                  type="number"
                  name="revenueShareValue"
                  value={formData.revenueShareValue}
                  onChange={handleChange}
                  mt={2}
                />
              </GridItem>
            ) : (
              <>
                <GridItem>
                  <Text color={textColor} fontSize="sm" fontWeight="700">
                    Fixed Fees <span className="text-danger">*</span>
                  </Text>
                  <Input
                    type="number"
                    name="revenueShareValue"
                    value={formData.revenueShareValue}
                    onChange={handleChange}
                    mt={2}
                  />
                </GridItem>
                <GridItem>
                  <Text color={textColor} fontSize="sm" fontWeight="700">
                    Fees Start Date <span className="text-danger">*</span>
                  </Text>
                  <Input
                    type="date"
                    name="feesStartDate"
                    value={formData.feesStartDate}
                    onChange={handleChange}
                    mt={2}
                  />
                </GridItem>
                <GridItem>
                  <Text color={textColor} fontSize="sm" fontWeight="700">
                    Fees End Date <span className="text-danger">*</span>
                  </Text>
                  <Input
                    type="date"
                    name="feesEndDate"
                    value={formData.feesEndDate}
                    onChange={handleChange}
                    mt={2}
                  />
                </GridItem>
              </>
            )}
          </Grid>

          {/* Row 6: Description En and Description Ar */}
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Description En<span className="text-danger">*</span>
              </Text>
              <Textarea
                name="descriptionEn"
                onChange={handleChange}
                mt={2}
                mb={4}
                width="100%"
              />
            </Box>
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Description Ar<span className="text-danger">*</span>
              </Text>
              <Textarea
                name="descriptionAr"
                onChange={handleChange}
                mt={2}
                mb={4}
                width="100%"
              />
            </Box>
          </Grid>

          {/* Drag-and-Drop Upload Section */}
          <Box
            border="1px dashed"
            borderColor="gray.300"
            borderRadius="md"
            p={4}
            textAlign="center"
            backgroundColor="gray.100"
            cursor="pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            mb={4}
          >
            <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
            <Text color="gray.500" mb={2}>
              Drag & Drop Image Here
            </Text>
            <Text color="gray.500" mb={2}>
              or
            </Text>
            <Button
              variant="outline"
              color="#422afb"
              border="none"
              onClick={() => document.getElementById('fileInput').click()}
            >
              Upload Image
              <input
                type="file"
                id="fileInput"
                hidden
                accept="image/*"
                onChange={handleFileInputChange}
              />
            </Button>
            {image && (
              <Box
                mt={4}
                display={'flex'}
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={image.name}
                  width={80}
                  height={80}
                  borderRadius="md"
                />
              </Box>
            )}
          </Box>

          {/* Input for Number of Branches */}
          <Box mt={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Number of Branches <span className="text-danger">*</span>
            </Text>
            <Input
              type="number"
              value={numberOfBranches}
              onChange={handleNumberOfBranchesChange}
              mt={2}
              min={0}
            />
          </Box>

          {/* Render Inputs Dynamically with Card Styles */}
          {Array.from({ length: numberOfBranches }).map((_, index) => (
            <Box 
              key={index} 
              mt={4} 
              p={4} 
              borderRadius="lg" 
              boxShadow="sm" 
              border="1px solid #ccc"
              bg="white"
            >
              <Text color={textColor} fontSize="md" fontWeight="bold">
                Branch {index + 1}
              </Text>
              
              <SimpleGrid columns={2} mt={4} spacing={4}>
                <Box>
                  <Text color={textColor} fontSize="sm" fontWeight="700">
                    Branch En-Name <span className="text-danger">*</span>
                  </Text>
                  <Input placeholder="Enter Branch En-Name" />
                </Box>

                <Box>
                  <Text color={textColor} fontSize="sm" fontWeight="700">
                    Branch En-Address <span className="text-danger">*</span>
                  </Text>
                  <Input placeholder="Enter Branch En-Address" />
                </Box>

                <Box>
                  <Text color={textColor} fontSize="sm" fontWeight="700">
                    Branch Ar-Name <span className="text-danger">*</span>
                  </Text>
                  <Input placeholder="أدخل اسم الفرع بالعربية" />
                </Box>

                <Box>
                  <Text color={textColor} fontSize="sm" fontWeight="700">
                    Branch Ar-Address <span className="text-danger">*</span>
                  </Text>
                  <Input placeholder="أدخل عنوان الفرع بالعربية" />
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={12} mt={4}>
                <Box gridColumn="span 12">
                  <Text color={textColor} fontSize="sm" fontWeight="700">
                    Location <span className="text-danger">*</span>
                  </Text>
                  <Input placeholder="Enter Branch Location" />
                </Box>
              </SimpleGrid>
            </Box>
          ))}

          {/* Save and Cancel Buttons */}
          <Flex justify="center" mt={6}>
            <Button variant="outline" colorScheme="red" mr={2}>
              Cancel
            </Button>
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
              onClick={handleSend}
            >
              Save
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default AddPharmacy;