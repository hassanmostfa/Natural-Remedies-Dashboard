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
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddPrivcy = () => {
  const [englishTitle, setEnglishTitle] = useState("");
  const [arabicTitle, setArabicTitle] = useState("");
  const [englishDescription, setEnglishDescription] = useState("");
  const [arabicDescription, setArabicDescription] = useState("");
  const [image, setImage] = useState(null);
  const textColor = useColorModeValue("secondaryGray.900", "white");

const navigate = useNavigate();

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
            Add New Privacy & Policy
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
          {/* English Description and Arabic Description Fields */}
          <div className="row col-md-12">
            <div className="mb-3 col-md-6">
              <Text color={textColor} fontSize="sm" fontWeight="700">
                English Privacy Content
                <span className="text-danger mx-1">*</span>
              </Text> 
              <Textarea
                rows = {10}
                id="englishDescription"
                placeholder="Enter English Privacy Content Here ..."
                value={englishDescription}
                onChange={(e) => setEnglishDescription(e.target.value)}
                required
                mt={"8px"}
              />
            </div>
            <div className="mb-3 col-md-6 pr-0">
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Arabic Privacy Content
                <span className="text-danger mx-1">*</span>
              </Text> 
              <Textarea
                rows = {10}
                id="arabicDescription"
                placeholder="اكتب المحتو هنا ..."
                value={arabicDescription}
                onChange={(e) => setArabicDescription(e.target.value)}
                dir="rtl"
                required
                mt={"8px"}
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

export default AddPrivcy;
