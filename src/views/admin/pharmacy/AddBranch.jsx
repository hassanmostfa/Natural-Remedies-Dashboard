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
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddBranch = () => {
  const [formData, setFormData] = useState({});

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {[
              { label: "En-Name", name: "name" },
              { label: "En-Address", name: "address" },
              { label: "Ar-Name", name: "name_ar" },
              { label: "Ar-Address", name: "address_ar" },
            ].map(({ label, name, type = "text" }) => (
              <GridItem key={name}>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  {label} <span className="text-danger">*</span>
                </Text>
                <Input
                  type={type}
                  name={name}
                  onChange={handleChange}
                  mt={2}
                />
              </GridItem>
            ))}
          </Grid>

          <Grid templateColumns="repeat(1, 1fr)" gap={4} mt={4}>
            {[
              { label: "Location Link", name: "location_link" },
            ].map(({ label, name, type = "text" }) => (
              <GridItem key={name}>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  {label} <span className="text-danger">*</span>
                </Text>
                <Input
                  type={type}
                  name={name}
                  onChange={handleChange}
                  mt={2}
                />
              </GridItem>
            ))}
          </Grid>

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
