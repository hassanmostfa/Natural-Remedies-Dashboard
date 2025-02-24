import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Textarea,
  Text,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FaUpload, FaTrash } from "react-icons/fa6"; // Import the trash icon
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddDoctor = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [certifications, setCertifications] = useState("");
  const [languages, setLanguages] = useState("");
  const [aboutEn, setAboutEn] = useState("");
  const [aboutAr, setAboutAr] = useState("");
  const [phones, setPhones] = useState([""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fees, setFees] = useState("");
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const navigate = useNavigate();

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

  const handleCancel = () => {
    setFirstName("");
    setLastName("");
    setCertifications("");
    setLanguages("");
    setAboutEn("");
    setAboutAr("");
    setPhones([""]);
    setEmail("");
    setPassword("");
    setFees("");
    setImage(null);
  };

  const handleSend = () => {
    const doctorData = {
      first_name: firstName,
      last_name: lastName,
      certifications,
      languages,
      about: {
        en: aboutEn,
        ar: aboutAr,
      },
      phones,
      email,
      password,
      fees: parseFloat(fees),
      image,
    };
    console.log("Doctor Data:", doctorData);
    // You can send this data to an API or perform other actions
  };

  const handleAddPhone = () => {
    setPhones([...phones, ""]);
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  const handleDeletePhone = (index) => {
    const newPhones = phones.filter((_, i) => i !== index); // Remove the phone at the specified index
    setPhones(newPhones); // Update the state
  };

  return (
    <div className="container add-admin-container w-100">
      <div className="add-admin-card shadow p-4 bg-white w-100">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            mb="20px !important"
            lineHeight="100%"
          >
            Add New Doctor
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
          {/* Grid Layout for Inputs */}
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {/* First Name Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                First Name
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="text"
                id="first_name"
                placeholder="Enter First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>

            {/* Last Name Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Last Name
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="text"
                id="last_name"
                placeholder="Enter Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>

            {/* Certifications Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Certifications
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="text"
                id="certifications"
                placeholder="Enter Certifications"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>

            {/* Languages Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Languages
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="text"
                id="languages"
                placeholder="Enter Languages"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>

            {/* About (English) Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                About (English)
                <span className="text-danger mx-1">*</span>
              </Text>
              <Textarea
                id="about_en"
                placeholder="Enter About in English"
                value={aboutEn}
                onChange={(e) => setAboutEn(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>

            {/* About (Arabic) Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                About (Arabic)
                <span className="text-danger mx-1">*</span>
              </Text>
              <Textarea
                id="about_ar"
                placeholder="Enter About in Arabic"
                value={aboutAr}
                onChange={(e) => setAboutAr(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>

            {/* Phones Field */}
            <Box gridColumn="1 / -1">
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Phones
                <span className="text-danger mx-1">*</span>
              </Text>
              {phones.map((phone, index) => (
                <Flex key={index} align="center" mt={"8px"} mb={index < phones.length - 1 ? "8px" : "0"}>
                  <Input
                    type="text"
                    placeholder={`Enter Phone ${index + 1}`}
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    required
                    flex="1"
                    mr={2}
                  />
                  <Icon
                    as={FaTrash} // Use the trash icon from react-icons
                    w="30px"
                    h="35px"
                    color="red.500"
                    cursor="pointer"
                    onClick={() => handleDeletePhone(index)} // Handle delete action
                    border={"1px solid #ddd"} 
                    padding={"5px"}
                    borderRadius={"5px"}
                  />
                </Flex>
              ))}
              <Button
                variant="outline"
                colorScheme="teal"
                size="sm"
                mt={2}
                onClick={handleAddPhone}
              >
                Add Another Phone
              </Button>
            </Box>

            {/* Email Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Email
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="email"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>

            {/* Password Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Password
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="password"
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>

            {/* Fees Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Fees
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="number"
                id="fees"
                placeholder="Enter Fees"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                required
                mt={"8px"}
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
            mt={6}
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

          {/* Action Buttons */}
          <Flex justify="center" mt={6}>
            <Button variant="outline" colorScheme="red" onClick={handleCancel} mr={2}>
              Cancel
            </Button>
            <Button
              variant='darkBrand'
              color='white'
              fontSize='sm'
              fontWeight='500'
              borderRadius='70px'
              px='24px'
              py='5px'
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

export default AddDoctor;