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
import "./notification.css";
import { FaUpload } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddNotification = () => {
  const [englishTitle, setEnglishTitle] = useState("");
  const [arabicTitle, setArabicTitle] = useState("");
  const [englishDescription, setEnglishDescription] = useState("");
  const [arabicDescription, setArabicDescription] = useState("");
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
    setEnglishTitle("");
    setArabicTitle("");
    setEnglishDescription("");
    setArabicDescription("");
    setImage(null);
  };

  const handleSend = () => {
    const notificationData = {
      englishTitle,
      arabicTitle,
      englishDescription,
      arabicDescription,
      image,
    };
    console.log("Notification Data:", notificationData);
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
            Add New Notification
            </Text>
            <Button
            type="button"
            onClick={() => navigate(-1)}
            colorScheme="teal"
            size="sm"
            // mt="20px"
            leftIcon={<IoMdArrowBack />}
            >
            Back
            </Button>
        </div>
        <form>
          {/* English Title and Arabic Title Fields */}
          <div className="row col-md-12">
            <div className="mb-3 col-md-6">
              <label htmlFor="englishTitle" className="form-label">
                English Title <span className="text-danger">*</span>
              </label>
              <Input
                type="text"
                id="englishTitle"
                placeholder="Enter English Title"
                value={englishTitle}
                onChange={(e) => setEnglishTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 col-md-6 pr-0" style={{ paddingRight: "0 !important" }}>
              <label htmlFor="arabicTitle" className="form-label">
                Arabic Title <span className="text-danger">*</span>
              </label>
              <Input
                type="text"
                id="arabicTitle"
                placeholder="ادخل عنوان"
                value={arabicTitle}
                onChange={(e) => setArabicTitle(e.target.value)}
                dir="rtl"
                required
              />
            </div>
          </div>

          {/* English Description and Arabic Description Fields */}
          <div className="row col-md-12">
            <div className="mb-3 col-md-6">
              <label htmlFor="englishDescription" className="form-label">
                English Description <span className="text-danger">*</span>
              </label>
              <Textarea
                id="englishDescription"
                placeholder="Enter English Description"
                value={englishDescription}
                onChange={(e) => setEnglishDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 col-md-6 pr-0">
              <label htmlFor="arabicDescription" className="form-label">
                Arabic Description <span className="text-danger">*</span>
              </label>
              <Textarea
                id="arabicDescription"
                placeholder="ادخل الوصف"
                value={arabicDescription}
                onChange={(e) => setArabicDescription(e.target.value)}
                dir="rtl"
                required
              />
            </div>
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
            //   leftIcon={<FaUpload />}
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
            <Button variant='darkBrand' color='white' fontSize='sm' fontWeight='500' borderRadius='70px' px='24px' py='5px' onClick={handleSend}>
              Send
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default AddNotification;
