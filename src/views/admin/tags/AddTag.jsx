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
import "./blog.css";
import { FaUpload } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddTag = () => {
  const [englishTitle, setEnglishTitle] = useState("");
  const [arabicTitle, setArabicTitle] = useState("");
  const [englishDescription, setEnglishDescription] = useState("");
  const [arabicDescription, setArabicDescription] = useState("");
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
            Add New Blog
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
              <Text color={textColor} fontSize="sm" fontWeight="700">
                English Title
                <span className="text-danger mx-1">*</span>
              </Text> 
              <Input
                type="text"
                id="englishTitle"
                placeholder="Enter English Title"
                value={englishTitle}
                onChange={(e) => setEnglishTitle(e.target.value)}
                required
                mt="8px"
              />
            </div>
            <div className="mb-3 col-md-6 pr-0" style={{ paddingRight: "0 !important" }}>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Arabic Title
                <span className="text-danger mx-1">*</span>
              </Text> 
              <Input
                type="text"
                id="arabicTitle"
                placeholder="ادخل عنوان"
                value={arabicTitle}
                onChange={(e) => setArabicTitle(e.target.value)}
                dir="rtl"
                required
                mt="8px"
              />
            </div>
          </div>


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

export default AddTag;
