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
  Select,
  Icon,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa6";

const AddPrescription = () => {
  const [formData, setFormData] = useState({
    user: "",
    phoneNumber: "",
    uploadDate: "",
    status: "new",
    assignedPharmacy: "pending",
    image: null,
  });

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      setFormData((prevData) => ({ ...prevData, image: files[0] }));
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
    handleImageUpload(e.dataTransfer.files);
  };

  const handleFileInputChange = (e) => {
    handleImageUpload(e.target.files);
  };

  const handleSubmit = () => {
    console.log("Prescription Data:", formData);
  };

  return (
    <div className="container add-prescription-container w-100">
      <div className="add-prescription-card shadow p-4 bg-white w-100">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Text color={textColor} fontSize="22px" fontWeight="700">
            Add New Prescription
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
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                User <span className="text-danger">*</span>
              </Text>
              <Select
                name="user"
                value={formData.user}
                onChange={handleChange}
                mt={2}
              >
                <option value="" disabled hidden>
                  Select User
                </option>
                <option value="John Doe">John Doe</option>
                <option value="Jane Doe">Jane Doe</option>
              </Select>
            </GridItem>

            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Phone Number <span className="text-danger">*</span>
              </Text>
              <Input
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                mt={2}
              />
            </GridItem>

            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Upload Date <span className="text-danger">*</span>
              </Text>
              <Input
                name="uploadDate"
                type="date"
                value={formData.uploadDate}
                onChange={handleChange}
                mt={2}
              />
            </GridItem>

            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Status <span className="text-danger">*</span>
              </Text>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                mt={2}
              >
                <option value="new">New</option>
                <option value="assigned">Assigned</option>
                <option value="checkout">Checkout</option>
              </Select>
            </GridItem>

            {/* <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Assigned Pharmacy <span className="text-danger">*</span>
              </Text>
              <Input
                name="assignedPharmacy"
                type="text"
                value={formData.assignedPharmacy}
                onChange={handleChange}
                mt={2}
                placeholder="Pending until assigned"
                readOnly
              />
            </GridItem> */}
          </Grid>

          {/* Drag-and-Drop Upload Section */}
          <Box
            border="2px dashed gray"
            borderRadius="md"
            p={4}
            textAlign="center"
            backgroundColor={isDragging ? "blue.50" : "transparent"}
            cursor="pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            mt={4}
            mb={4}
          >
            <Icon as={FaUpload} w={8} h={8} color="gray.500" mb={2} />
            <Text color="gray.500" mb={2}>
              Drag & Drop Prescription Image Here
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

            {formData.image && (
              <Box mt={4} display="flex" justifyContent="center">
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Prescription"
                  width={100}
                  height={100}
                  style={{ borderRadius: "8px", objectFit: "cover" }}
                />
              </Box>
            )}
          </Box>

          <Flex justify="center" mt={6}>
            <Button variant="outline" colorScheme="red" mr={2}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default AddPrescription;
