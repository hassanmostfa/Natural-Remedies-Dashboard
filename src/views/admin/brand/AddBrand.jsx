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
import "./brand.css";
import { FaUpload } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddBrand = () => {
  const [name, setName] = useState("");
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
    setName("");
    setImage(null);
  };

  const handleSend = () => {
    const brandData = {
      name,
      image,
    };
    console.log("Brand Data:", brandData);
    // You can send this data to an API or perform other actions
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
            Add New Brand
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
          {/* Name Field */}
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Brand En-Name
              <span className="text-danger mx-1">*</span>
            </Text> 
            <Input
              type="text"
              id="en_name"
              placeholder="Enter Brand En-Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              mt={"8px"}
            />
          </div>

          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Product Ar-Type
              <span className="text-danger mx-1">*</span>
            </Text> 
            <Input
              type="text"
              id="ar_name"
              placeholder="Enter Brand Ar-Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              mt={"8px"}
            />
          </div>
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


          {/* Action Buttons */}
          <Flex justify="center" mt={4}>
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

export default AddBrand;
