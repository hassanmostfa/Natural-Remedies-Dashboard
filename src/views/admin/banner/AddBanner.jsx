import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  Icon,

} from "@chakra-ui/react";
import "./banner.css";
import { FaUpload } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddBanner = () => {

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const textColor = useColorModeValue("secondaryGray.900", "white");

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
            Add New Banner
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
              Title
              <span className="text-danger mx-1">*</span>
            </Text> 
            <Input
              type="text"
              id="title"
              placeholder="Enter Ad Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              mt="8px"
            />
          </div>

          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              External Link
              <span className="text-danger mx-1">*</span>
            </Text> 
            <Input
              type="text"
              id="outside_link"
              placeholder="Enter Outside Link"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              mt="8px"
            />
          </div>
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Enternal Link
              <span className="text-danger mx-1">*</span>
            </Text> 
            <Input
              type="text"
              id="inside_link"
              placeholder="Enter Inside Link"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              mt="8px"
            />
          </div>

          {/* Drag-and-Drop Upload Section */}
          <Box
            border={`2px dashed `}
            borderRadius="md"
            p={4}
            textAlign="center"
            backgroundColor={isDragging ? "blue.50" : "transparent"}
            cursor="pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            mb={4}
          >
            <Icon as={FaUpload} w={8} h={8} color="gray.500" mb={2} />
            <Text color="gray.500" mb={2}>
              Drag & Drop Image Here
            </Text>
            <Text color="gray.500" mb={2}>
              or
            </Text>
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={() => document.getElementById("fileInput").click()}
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
              <Box mt={4} display={"flex"} justifyContent="center" alignItems="center">
                <img src={URL.createObjectURL(image)} alt={image.name} width={80} height={80} borderRadius="md" />
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

export default AddBanner;
