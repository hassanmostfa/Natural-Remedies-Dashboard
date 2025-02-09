import React, { useState } from "react";
import {
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,

} from "@chakra-ui/react";
import "./about.css";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddAbout = () => {

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();


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
            Add New About
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
              Phone
              <span className="text-danger mx-1">*</span>
            </Text> 
            <Input
              type="text"
              id="phone"
              placeholder="Enter phone"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              mt="8px"
            />
          </div>

          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Location
              <span className="text-danger mx-1">*</span>
            </Text> 
            <Input
              type="text"
              id="location"
              placeholder="Enter Location"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              mt="8px"
            />
          </div>
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Map URL
              <span className="text-danger mx-1">*</span>
            </Text> 
            <Input
              type="text"
              id="map_url"
              placeholder="Enter Inside Link"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              mt="8px"
            />
          </div>

         
          {/* Action Buttons */}
          <Flex justify="flex-start" mt={4}>
          
            <Button
              variant='darkBrand'
              color='white'
              fontSize='sm'
              fontWeight='500'
              borderRadius='70px'
              px='24px'
              py='5px'
              onClick={handleSend}
              mt='30px'
            >
              Save
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default AddAbout;
