import {
  Box,
  Button,
  Flex,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  useToast,
  IconButton,
  Avatar,
  Divider,
  Heading,
  Icon,
  Image,
  Badge,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Grid,
  GridItem,
  Tag,
  TagLabel,
  TagLeftIcon,
  Container,
  Stack,
  AspectRatio,
  useBreakpointValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRightIcon, EditIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { FaLeaf, FaHeart, FaExclamationTriangle, FaBookOpen, FaShieldAlt, FaEye, FaEdit } from 'react-icons/fa';
import { useGetRemedyQuery } from 'api/remediesSlice';
import { Link as RouterLink } from 'react-router-dom';

const ShowRemedy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Fetch the remedy data by ID using RTK Query
  const { data: remedyData, isLoading: isRemedyLoading, isError: isRemedyError } = useGetRemedyQuery(id);
  
  // Color mode values
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const cardBg = useColorModeValue('white', 'navy.700');
  const brandBg = useColorModeValue('brand.50', 'brand.900');
  const brandColor = useColorModeValue('brand.500', 'brand.300');
  const mutedText = useColorModeValue('gray.600', 'gray.400');
  const bgColor = useColorModeValue('gray.50', 'navy.900');

  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleEdit = () => {
    navigate(`/admin/remedies/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/admin/remedies');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'all':
        return 'blue';
      case 'rookie':
        return 'green';
      case 'skilled':
        return 'orange';
      case 'master':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getPlanLabel = (plan) => {
    switch (plan) {
      case 'all':
        return 'All Plans';
      case 'rookie':
        return 'Rookie';
      case 'skilled':
        return 'Skilled';
      case 'master':
        return 'Master';
      default:
        return plan;
    }
  };

  if (isRemedyLoading) {
    return (
      <Box mt="80px" p={6}>
        <Card>
          <CardBody>
            <Flex justifyContent="center" alignItems="center" height="200px">
              <VStack spacing={4}>
                <Icon as={FaLeaf} w={8} h={8} color={brandColor} />
                <Text color={textColor}>Loading remedy details...</Text>
              </VStack>
            </Flex>
          </CardBody>
        </Card>
      </Box>
    );
  }

  if (isRemedyError || !remedyData?.data) {
    return (
      <Box mt="80px" p={6}>
        <Card>
          <CardBody>
            <Flex justifyContent="center" alignItems="center" height="200px">
              <VStack spacing={4}>
                <Icon as={FaExclamationTriangle} w={8} h={8} color="red.500" />
                <Text color={textColor}>Failed to load remedy details</Text>
                <Button onClick={handleBack} colorScheme="blue" variant="outline">
                  Go Back
                </Button>
              </VStack>
            </Flex>
          </CardBody>
        </Card>
      </Box>
    );
  }

  const remedy = remedyData.data;

  return (
    <Box mt="80px" bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={8}>
        {/* Breadcrumb */}
        <Breadcrumb 
          spacing="8px" 
          separator={<ChevronRightIcon color="gray.500" />}
          mb={6}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/admin/remedies" color={mutedText}>
              Remedies
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text color={textColor}>{remedy.title}</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Hero Section */}
        <Card mb={8} overflow="hidden" boxShadow="xl">
          <Box
            bgGradient="linear(to-r, gray.700, gray.800)"
            p={8}
            color="white"
            position="relative"
          >
            <Box
              position="absolute"
              top="0"
              right="0"
              bottom="0"
              left="0"
              bgImage={remedy.main_image_url ? `url(${remedy.main_image_url})` : 'none'}
              bgSize="cover"
              bgPosition="center"
              opacity="0.1"
            />
            <Flex
              position="relative"
              zIndex="1"
              direction={{ base: 'column', lg: 'row' }}
              align={{ base: 'start', lg: 'center' }}
              justify="space-between"
              gap={6}
            >
              <VStack align="start" spacing={4} flex="1">
                <HStack spacing={4} wrap="wrap">
                  <Badge
                    colorScheme={getStatusColor(remedy.status)}
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                  >
                    {remedy.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge
                    colorScheme={getPlanColor(remedy.visible_to_plan)}
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                  >
                    {getPlanLabel(remedy.visible_to_plan)}
                  </Badge>
                </HStack>
                <Heading size="2xl" fontWeight="bold">
                  {remedy.title}
                </Heading>
                <Text fontSize="lg" opacity="0.9" maxW="600px">
                  {remedy.description}
                </Text>
                <HStack spacing={6} pt={2} wrap="wrap">
                  {remedy.diseases && remedy.diseases.length > 0 && (
                    <HStack spacing={2}>
                      <Icon as={FaHeart} color="red.300" />
                      <VStack spacing={1} align="start">
                        {remedy.diseases.slice(0, 3).map((disease, index) => (
                          <Text key={disease.id || index} fontSize="sm">{disease.name}</Text>
                        ))}
                        {remedy.diseases.length > 3 && (
                          <Text fontSize="xs" color="gray.400">+{remedy.diseases.length - 3} more diseases</Text>
                        )}
                      </VStack>
                    </HStack>
                  )}
                  {remedy.remedy_types && remedy.remedy_types.length > 0 && (
                    <HStack spacing={2}>
                      <Icon as={FaLeaf} color="green.300" />
                      <VStack spacing={1} align="start">
                        {remedy.remedy_types.slice(0, 3).map((type, index) => (
                          <Text key={type.id || index} fontSize="sm">{type.name}</Text>
                        ))}
                        {remedy.remedy_types.length > 3 && (
                          <Text fontSize="xs" color="gray.400">+{remedy.remedy_types.length - 3} more types</Text>
                        )}
                      </VStack>
                    </HStack>
                  )}
                  {remedy.body_systems && remedy.body_systems.length > 0 && (
                    <HStack spacing={2}>
                      <Icon as={FaShieldAlt} color="blue.300" />
                      <VStack spacing={1} align="start">
                        {remedy.body_systems.slice(0, 3).map((system, index) => (
                          <Text key={system.id || index} fontSize="sm">{system.title}</Text>
                        ))}
                        {remedy.body_systems.length > 3 && (
                          <Text fontSize="xs" color="gray.400">+{remedy.body_systems.length - 3} more systems</Text>
                        )}
                      </VStack>
                    </HStack>
                  )}
                </HStack>
              </VStack>
              
              <VStack spacing={4} align="end">
                <HStack spacing={3}>
                  <Button
                    leftIcon={<ArrowBackIcon />}
                    variant="outline"
                    color="white"
                    borderColor="whiteAlpha.300"
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                
                </HStack>
                
              </VStack>
            </Flex>
          </Box>
        </Card>

                 {/* Main Image */}
         {remedy.main_image_url && (
           <Card mb={8} overflow="hidden">
             <AspectRatio ratio={21 / 9}>
               <Image
                 src={remedy.main_image_url}
                 alt={remedy.title}
                 objectFit="cover"
                 fallback={<Icon as={FaLeaf} color="green.500" boxSize="100px" />}
               />
             </AspectRatio>
           </Card>
         )}

        {/* Content Grid */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Main Content */}
          <VStack spacing={8} align="stretch">
            {/* Ingredients */}
            {remedy.ingredients && remedy.ingredients.length > 0 && (
              <Card>
                <CardHeader>
                  <HStack spacing={3}>
                    <Icon as={FaLeaf} color="green.500" />
                    <Heading size="md" color={textColor}>Ingredients</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {remedy.ingredients.map((ingredient, index) => (
                      <HStack key={index} p={4} bg={brandBg} borderRadius="lg" spacing={4}>
                        {ingredient.image_url && (
                          <Image
                            src={ingredient.image_url}
                            alt={ingredient.name}
                            boxSize="60px"
                            objectFit="cover"
                            borderRadius="md"
                            fallback={<Icon as={FaLeaf} color="green.500" boxSize="30px" />}
                          />
                        )}
                        <Text fontWeight="medium" color={textColor}>
                          {ingredient.name}
                        </Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </CardBody>
              </Card>
            )}

            {/* Instructions */}
            {remedy.instructions && remedy.instructions.length > 0 && (
              <Card>
                <CardHeader>
                  <HStack spacing={3}>
                    <Icon as={FaBookOpen} color="blue.500" />
                    <Heading size="md" color={textColor}>Instructions</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {remedy.instructions.map((instruction, index) => (
                      <HStack key={index} p={4} bg={brandBg} borderRadius="lg" spacing={4}>
                        <Badge
                          colorScheme="blue"
                          variant="solid"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="sm"
                        >
                          {index + 1}
                        </Badge>
                        {instruction.image_url && (
                          <Image
                            src={instruction.image_url}
                            alt={instruction.name}
                            boxSize="60px"
                            objectFit="cover"
                            borderRadius="md"
                            fallback={<Icon as={FaBookOpen} color="blue.500" boxSize="30px" />}
                          />
                        )}
                        <Text color={textColor} flex="1">
                          {instruction.name}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Benefits */}
            {remedy.benefits && remedy.benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <HStack spacing={3}>
                    <Icon as={FaHeart} color="red.500" />
                    <Heading size="md" color={textColor}>Benefits</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {remedy.benefits.map((benefit, index) => (
                      <HStack key={index} p={4} bg={brandBg} borderRadius="lg" spacing={4}>
                        {benefit.image_url && (
                          <Image
                            src={benefit.image_url}
                            alt={benefit.name}
                            boxSize="60px"
                            objectFit="cover"
                            borderRadius="md"
                            fallback={<Icon as={FaHeart} color="red.500" boxSize="30px" />}
                          />
                        )}
                        <Text color={textColor}>
                          {benefit.name}
                        </Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </CardBody>
              </Card>
            )}

            {/* Precautions */}
            {remedy.precautions && remedy.precautions.length > 0 && (
              <Card>
                <CardHeader>
                  <HStack spacing={3}>
                    <Icon as={FaExclamationTriangle} color="orange.500" />
                    <Heading size="md" color={textColor}>Precautions</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {remedy.precautions.map((precaution, index) => (
                      <HStack key={index} p={4} bg="orange.50" borderRadius="lg" spacing={4}>
                        {precaution.image_url && (
                          <Image
                            src={precaution.image_url}
                            alt={precaution.name}
                            boxSize="60px"
                            objectFit="cover"
                            borderRadius="md"
                            fallback={<Icon as={FaExclamationTriangle} color="orange.500" boxSize="30px" />}
                          />
                        )}
                        <Text color={textColor}>
                          {precaution.name}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            )}
          </VStack>

          {/* Sidebar */}
          <VStack spacing={6} align="stretch">
            {/* Quick Info Card */}
            <Card>
              <CardHeader>
                <Heading size="sm" color={textColor}>Quick Info</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text color={mutedText} fontSize="sm">Status</Text>
                    <Badge
                      colorScheme={getStatusColor(remedy.status)}
                      variant="solid"
                      fontSize="xs"
                    >
                      {remedy.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </HStack>
                  
                  <HStack justify="space-between">
                    <Text color={mutedText} fontSize="sm">Visible To</Text>
                    <Badge
                      colorScheme={getPlanColor(remedy.visible_to_plan)}
                      variant="outline"
                      fontSize="xs"
                    >
                      {getPlanLabel(remedy.visible_to_plan)}
                    </Badge>
                  </HStack>
                  
                  {remedy.diseases && remedy.diseases.length > 0 && (
                    <HStack justify="space-between">
                      <Text color={mutedText} fontSize="sm">Diseases</Text>
                      <VStack align="end" spacing={1}>
                        {remedy.diseases.slice(0, 2).map((disease, index) => (
                          <Text key={disease.id || index} fontSize="sm" color={textColor}>
                            {disease.name}
                          </Text>
                        ))}
                        {remedy.diseases.length > 2 && (
                          <Text fontSize="xs" color="gray.400">
                            +{remedy.diseases.length - 2} more
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  )}
                  
                  {remedy.remedy_types && remedy.remedy_types.length > 0 && (
                    <HStack justify="space-between">
                      <Text color={mutedText} fontSize="sm">Types</Text>
                      <VStack align="end" spacing={1}>
                        {remedy.remedy_types.slice(0, 2).map((type, index) => (
                          <Text key={type.id || index} fontSize="sm" color={textColor}>
                            {type.name}
                          </Text>
                        ))}
                        {remedy.remedy_types.length > 2 && (
                          <Text fontSize="xs" color="gray.400">
                            +{remedy.remedy_types.length - 2} more
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  )}
                  
                  {remedy.body_systems && remedy.body_systems.length > 0 && (
                    <HStack justify="space-between">
                      <Text color={mutedText} fontSize="sm">Body Systems</Text>
                      <VStack align="end" spacing={1}>
                        {remedy.body_systems.slice(0, 2).map((system, index) => (
                          <Text key={system.id || index} fontSize="sm" color={textColor}>
                            {system.title}
                          </Text>
                        ))}
                        {remedy.body_systems.length > 2 && (
                          <Text fontSize="xs" color="gray.400">
                            +{remedy.body_systems.length - 2} more
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  )}
                  
                  <Divider />
                  
                  <HStack justify="space-between">
                    <Text color={mutedText} fontSize="sm">Created</Text>
                    <Text fontSize="sm" color={textColor}>
                      {new Date(remedy.created_at).toLocaleDateString()}
                    </Text>
                  </HStack>
                  
                  <HStack justify="space-between">
                    <Text color={mutedText} fontSize="sm">Updated</Text>
                    <Text fontSize="sm" color={textColor}>
                      {new Date(remedy.updated_at).toLocaleDateString()}
                    </Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <Heading size="sm" color={textColor}>Actions</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={3} align="stretch">
                  <Button
                    leftIcon={<EditIcon />}
                    colorScheme="blue"
                    variant="solid"
                    onClick={handleEdit}
                    size="lg"
                  >
                    Edit Remedy
                  </Button>
                  
                  <Button
                    leftIcon={<ArrowBackIcon />}
                    variant="outline"
                    onClick={handleBack}
                    size="lg"
                  >
                    Back to List
                  </Button>
                  
                  {remedy.product_link && (
                    <Button
                      as="a"
                      href={remedy.product_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      leftIcon={<FaEye />}
                      colorScheme="green"
                      variant="outline"
                      size="lg"
                    >
                      View Product
                    </Button>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Grid>
      </Container>
    </Box>
  );
};

export default ShowRemedy;
