import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Text,
  useColorModeValue,
  Icon,

} from "@chakra-ui/react";
import "./AllTypes.css";
import { FaUpload } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddType = () => {
  const [type, setType] = useState("");


  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
const navigate = useNavigate();


  const handleSend = () => {
    const notificationData = {
      type,

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
            Add New Product Type
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
            <div className="mb-3 col-md-12">
              <label htmlFor="type" className="form-label">
                Product Type <span className="text-danger">*</span>
              </label>
              <Input
                type="text"
                id="type"
                placeholder="Enter Product Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              />
            </div>
          </div>
          {/* Action Buttons */}
          <Flex justify="start" mt={4}>
            <Button variant='darkBrand' color='white' fontSize='sm' fontWeight='500' borderRadius='70px' px='24px' py='5px' onClick={handleSend}>
              Send
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default AddType;

