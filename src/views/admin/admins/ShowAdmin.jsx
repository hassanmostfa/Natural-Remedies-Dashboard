import React, { useState, useEffect } from "react";
import {
  Text,
  useColorModeValue,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Flex,
  Button,
  Icon,
  VStack,
  HStack,
  Divider,
  Badge,
  Spinner,
  Card,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAdminProfileQuery } from "api/adminSlice";
import { ChevronLeftIcon, EditIcon } from "@chakra-ui/icons";
import { FaUser, FaEnvelope, FaPhone, FaCalendar } from "react-icons/fa6";

const ShowAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: admin, isLoading: isAdminLoading, isError: isAdminError } =
    useGetAdminProfileQuery(id);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardBg = useColorModeValue("white", "navy.700");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const iconBg = useColorModeValue("blue.50", "blue.900");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  const hoverBg = useColorModeValue("gray.100", "whiteAlpha.100");
  const profileBg = useColorModeValue("blue.50", "blue.900");
  const infoCardBg = useColorModeValue("gray.50", "whiteAlpha.50");

  if (isAdminLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" />
          <Text color={textColor} fontSize="lg">Loading admin details...</Text>
        </VStack>
      </Flex>
    );
  }

  if (isAdminError) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <VStack spacing={4}>
          <Text color="red.500" fontSize="lg">Error loading admin data</Text>
          <Button onClick={() => navigate('/admin/admins')} colorScheme="blue">
            Back to Admins
          </Button>
        </VStack>
      </Flex>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box p={{ base: "20px", md: "40px" }} mt="80px">
             {/* Header */}
       <Flex 
         justify="space-between" 
         align="center" 
         mb="30px"
         flexDirection="row"
         gap="15px"
       >
         <Button
           leftIcon={<ChevronLeftIcon />}
           bg="green.400"
           color="white"
           _hover={{ bg: "green.500" }}
           onClick={() => navigate('/admin/admins')}
           size={{ base: "sm", md: "md" }}
         >
           Back
         </Button>
         
         <Button
           leftIcon={<EditIcon />}
           variant='darkBrand'
           color='white'
           onClick={() => navigate(`/admin/edit-admin/${id}`)}
           size={{ base: "sm", md: "md" }}
         >
           Edit Admin
         </Button>
       </Flex>

      {/* Main Content */}
      <Card
        bg={cardBg}
        borderRadius="xl"
        boxShadow="lg"
        overflow="hidden"
        border="1px solid"
        borderColor={borderColor}
      >
                 {/* Profile Header */}
         <Box
           bg={profileBg}
           p="30px"
           textAlign="center"
         >
          <VStack spacing={4}>
            <Box
              w="80px"
              h="30px"
              borderRadius="full"
              bg={iconBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb="10px"
            >
              <Icon as={FaUser} w="40px" h="40px" color={iconColor} />
            </Box>
            <VStack spacing={2}>
              <Text color={textColor} fontSize="24px" fontWeight="700">
                {admin.data?.name || "Admin Name"}
              </Text>
              <Badge colorScheme="blue" px="12px" py="4px" borderRadius="full">
                Administrator
              </Badge>
            </VStack>
          </VStack>
        </Box>

        {/* Details Section */}
        <Box p="30px">
          <VStack spacing="25px" align="stretch">
            {/* Contact Information */}
            <Box>
              <Text color={textColor} fontSize="18px" fontWeight="600" mb="20px">
                Contact Information
              </Text>
              <VStack spacing="15px" align="stretch">
                <HStack spacing="15px" p="15px" bg={infoCardBg} borderRadius="lg">
                  <Box
                    w="40px"
                    h="40px"
                    borderRadius="full"
                    bg={iconBg}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaEnvelope} w="20px" h="20px" color={iconColor} />
                  </Box>
                  <VStack align="start" spacing={1} flex={1}>
                    <Text color="gray.500" fontSize="sm" fontWeight="500">
                      Email Address
                    </Text>
                    <Text color={textColor} fontSize="md">
                      {admin.data?.email || "N/A"}
                    </Text>
                  </VStack>
                </HStack>

                <HStack spacing="15px" p="15px" bg={infoCardBg} borderRadius="lg">
                  <Box
                    w="40px"
                    h="40px"
                    borderRadius="full"
                    bg={iconBg}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaPhone} w="20px" h="20px" color={iconColor} />
                  </Box>
                  <VStack align="start" spacing={1} flex={1}>
                    <Text color="gray.500" fontSize="sm" fontWeight="500">
                      Phone Number
                    </Text>
                    <Text color={textColor} fontSize="md">
                      {admin.data?.phone || "N/A"}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </Box>
            <Divider />
          </VStack>
        </Box>
      </Card>
    </Box>
  );
};

export default ShowAdmin;
