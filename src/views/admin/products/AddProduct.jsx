import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  Icon,
  Select,
  Textarea,
  Switch,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();

  // Handle image upload
  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      setImages([...images, ...files]);
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

  // Handle adding a variant
  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        id: variants.length + 1,
        cost: "",
        price: "",
        quantity: "",
        image: null,
      },
    ]);
  };

  // Handle variant input change
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  // Handle variant image upload
  const handleVariantImageUpload = (index, file) => {
    const updatedVariants = [...variants];
    updatedVariants[index].image = file;
    setVariants(updatedVariants);
  };

  // Handle form submission
  const handleSend = () => {
    const productData = {
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      category,
      brand,
      cost,
      price,
      quantity,
      hasVariants,
      variants: hasVariants ? variants : [],
      images,
    };
    console.log("Product Data:", productData);
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
            Add New Product
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
          {/* Product Name (Arabic and English) */}
          <SimpleGrid columns={2} spacing={4} mb={4}>
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Product Name (Arabic) <span className="text-danger">*</span>
              </Text>
              <Input
                type="text"
                placeholder="أدخل اسم المنتج"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                required
                mt={2}
              />
            </Box>
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Product Name (English) <span className="text-danger">*</span>
              </Text>
              <Input
                type="text"
                placeholder="Enter Product Name"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
                mt={2}
              />
            </Box>
          </SimpleGrid>

          {/* Description (Arabic and English) */}
          <SimpleGrid columns={2} spacing={4} mb={4}>
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Description (Arabic) <span className="text-danger">*</span>
              </Text>
              <Textarea
                placeholder="أدخل وصف المنتج"
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                required
                mt={2}
              />
            </Box>
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Description (English) <span className="text-danger">*</span>
              </Text>
              <Textarea
                placeholder="Enter Product Description"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                required
                mt={2}
              />
            </Box>
          </SimpleGrid>

          {/* Category and Brand */}
          <SimpleGrid columns={2} spacing={4} mb={4}>
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Category <span className="text-danger">*</span>
              </Text>
              <Select
                placeholder="Select Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                mt={2}
              >
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home & Kitchen</option>
              </Select>
            </Box>
            <Box>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                    Brand <span className="text-danger">*</span>
                </Text>
                <Select
                    placeholder="Select Brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                    mt={2}
                >
                    <option value="nike">Nike</option>
                    <option value="adidas">Adidas</option>
                    <option value="puma">Puma</option>
                    <option value="reebok">Reebok</option>
                </Select>
                </Box>
          </SimpleGrid>

          {/* Cost, Price, and Quantity */}
          <SimpleGrid columns={3} spacing={4} mb={4}>
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Cost <span className="text-danger">*</span>
              </Text>
              <Input
                type="number"
                placeholder="Enter Cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
                mt={2}
              />
            </Box>
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Price <span className="text-danger">*</span>
              </Text>
              <Input
                type="number"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                mt={2}
              />
            </Box>
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Quantity <span className="text-danger">*</span>
              </Text>
              <Input
                type="number"
                placeholder="Enter Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                mt={2}
              />
            </Box>
          </SimpleGrid>

          {/* Variants Section */}
          <Box mb={4}>
            <Flex align="center" mb={2}>
              <Text color={textColor} fontSize="sm" fontWeight="700" mr={2}>
                Has Variants
              </Text>
              <Switch
                isChecked={hasVariants}
                onChange={() => setHasVariants(!hasVariants)}
              />
            </Flex>
            {hasVariants && (
              <Box>
                <Button onClick={handleAddVariant} mb={4}>
                  Add Variant
                </Button>
                {variants.map((variant, index) => (
                  <Box key={variant.id} mb={4} p={4} border="1px solid #ccc" borderRadius="md">
                    <Text fontSize="md" fontWeight="bold" mb={2}>
                      Variant {index + 1}
                    </Text>
                    <SimpleGrid columns={3} spacing={4} mb={4}>
                      <Box>
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          Cost <span className="text-danger">*</span>
                        </Text>
                        <Input
                          type="number"
                          placeholder="Enter Cost"
                          value={variant.cost}
                          onChange={(e) =>
                            handleVariantChange(index, "cost", e.target.value)
                          }
                          required
                          mt={2}
                        />
                      </Box>
                      <Box>
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          Price <span className="text-danger">*</span>
                        </Text>
                        <Input
                          type="number"
                          placeholder="Enter Price"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(index, "price", e.target.value)
                          }
                          required
                          mt={2}
                        />
                      </Box>
                      <Box>
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          Quantity <span className="text-danger">*</span>
                        </Text>
                        <Input
                          type="number"
                          placeholder="Enter Quantity"
                          value={variant.quantity}
                          onChange={(e) =>
                            handleVariantChange(index, "quantity", e.target.value)
                          }
                          required
                          mt={2}
                        />
                      </Box>
                    </SimpleGrid>
                    <Box>
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        Variant Image <span className="text-danger">*</span>
                      </Text>
                      <Input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleVariantImageUpload(index, e.target.files[0])
                        }
                        mt={2}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Product Images */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Product Images <span className="text-danger">*</span>
            </Text>
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
            >
              <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
              <Text color="gray.500" mb={2}>
                Drag & Drop Images Here
              </Text>
              <Text color="gray.500" mb={2}>
                or
              </Text>
              <Button
                variant="outline"
                color="#422afb"
                border="none"
                onClick={() => document.getElementById("fileInput").click()}
              >
                Upload Images
                <input
                  type="file"
                  id="fileInput"
                  hidden
                  accept="image/*"
                  onChange={handleFileInputChange}
                  multiple
                />
              </Button>

              {images?.length > 0 && (
  <Box mt={4} display="flex" flexWrap="wrap" gap={2}>
    {images.map((image, index) => (
      <Box key={index} borderRadius="md" overflow="hidden">
        <img
          src={URL.createObjectURL(image)}
          alt={`Product View ${index + 1}`}
          width={80}
          height={80}
          style={{ borderRadius: "8px" }}
        />
      </Box>
    ))}
  </Box>
)}


            </Box>
          </Box>


          {/* Action Buttons */}
          <Flex justify="center" mt={4}>
            <Button variant="outline" colorScheme="red" mr={2}>
              Cancel
            </Button>
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
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

export default AddProduct;