import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa6";

const AddBranch = () => {
  const [formData, setFormData] = useState();

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
    console.log("Pharmacy Data:", formData);
  };

  return (
    <div className="container add-admin-container w-100">
      <div className="add-admin-card shadow p-4 bg-white w-100">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Text color={textColor} fontSize="22px" fontWeight="700">
            Add New Branch
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
          <Grid templateColumns="repeat(1, 1fr)" gap={4}>
            {[
              { label: "Name", name: "name" },
              { label: "Address", name: "address" },
            ].map(({ label, name, type = "text" }) => (
              <GridItem key={name}>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  {label} <span className="text-danger">*</span>
                </Text>
                <Input
                  type={type}
                  onChange={handleChange}
                  mt={2}
                />
              </GridItem>
            ))}
          </Grid>

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
            mt={4}
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


          <Flex justify="center" mt={6}>
            <Button variant="outline" colorScheme="red" mr={2}>
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

export default AddBranch;
