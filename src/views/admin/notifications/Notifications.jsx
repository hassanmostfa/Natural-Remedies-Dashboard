import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  Badge,
  Spinner,
  Center,
  Image,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaPlus } from 'react-icons/fa6';
import { useGetNotificationsQuery } from 'api/notificationsSlice';

const Notifications = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage] = React.useState(10);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const bgBrand = useColorModeValue('brand.500', 'brand.400');

  // Fetch notifications
  const { 
    data: notificationsData, 
    isLoading, 
    isError,
    error,
    refetch 
  } = useGetNotificationsQuery({ 
    page: currentPage, 
    per_page: perPage 
  });

  const notifications = notificationsData?.data || [];
  const pagination = notificationsData?.pagination || {};

  const handleAddNotification = () => {
    navigate('/admin/notifications/add');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'user':
        return 'blue';
      case 'guest':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <Box mt="90px">
        <Card>
          <Center py="20">
            <VStack spacing="4">
              <Spinner size="xl" color={bgBrand} thickness="4px" />
              <Text color={textColor}>Loading notifications...</Text>
            </VStack>
          </Center>
        </Card>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box mt="90px">
        <Card>
          <Center py="20">
            <VStack spacing="4">
              <Icon as={FaBell} boxSize="50px" color="red.500" />
              <Text color={textColor} fontSize="xl" fontWeight="bold">
                Error Loading Notifications
              </Text>
              <Text color="gray.500">
                {error?.data?.message || 'Failed to load notifications'}
              </Text>
              <Button onClick={refetch} colorScheme="blue">
                Try Again
              </Button>
            </VStack>
          </Center>
        </Card>
      </Box>
    );
  }

  return (
    <Box mt="90px">
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex px="25px" mb="20px" justifyContent="space-between" align="center">
          <Flex align="center" gap="3">
            <Icon as={FaBell} boxSize="24px" color={bgBrand} />
            <Text
              color={textColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
            >
              Notifications
            </Text>
            <Badge colorScheme="blue" fontSize="md" px="3" py="1" borderRadius="full">
              {pagination.total || 0}
            </Badge>
          </Flex>
          <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            leftIcon={<FaPlus />}
            onClick={handleAddNotification}
            _hover={{
              bg: 'blue.600',
            }}
          >
            Add Notification
          </Button>
        </Flex>

        {notifications.length === 0 ? (
          <Center py="20">
            <VStack spacing="4">
              <Icon as={FaBell} boxSize="50px" color="gray.300" />
              <Text color={textColor} fontSize="xl" fontWeight="bold">
                No Notifications Yet
              </Text>
              <Text color="gray.500">
                Get started by sending your first notification
              </Text>
              <Button
                leftIcon={<FaPlus />}
                colorScheme="blue"
                onClick={handleAddNotification}
              >
                Add Notification
              </Button>
            </VStack>
          </Center>
        ) : (
          <>
            <TableContainer>
              <Table variant="simple" color={textColor}>
                <Thead>
                  <Tr>
                    <Th borderColor={borderColor}>NOTIFICATION</Th>
                    <Th borderColor={borderColor}>MESSAGE</Th>
                    <Th borderColor={borderColor}>TYPE</Th>
                    <Th borderColor={borderColor}>STATUS</Th>
                    <Th borderColor={borderColor}>DATE</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {notifications.map((notification) => (
                    <Tr key={notification.id}>
                      <Td borderColor={borderColor}>
                        <HStack spacing="3">
                          {notification.image ? (
                            <Image
                              src={notification.image}
                              alt={notification.title}
                              boxSize="50px"
                              objectFit="cover"
                              borderRadius="md"
                              fallback={
                                <Avatar
                                  size="sm"
                                  icon={<FaBell />}
                                  bg={bgBrand}
                                  color="white"
                                />
                              }
                            />
                          ) : (
                            <Avatar
                              size="sm"
                              icon={<FaBell />}
                              bg={bgBrand}
                              color="white"
                            />
                          )}
                          <Text fontWeight="600" color={textColor}>
                            {notification.title}
                          </Text>
                        </HStack>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Text fontSize="sm" color={textColor}>
                          {notification.description}
                        </Text>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Badge colorScheme={getTypeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Badge colorScheme={notification.seen ? 'green' : 'orange'}>
                          {notification.seen ? 'Seen' : 'Pending'}
                        </Badge>
                      </Td>
                      <Td borderColor={borderColor}>
                        <VStack align="start" spacing="0">
                          <Text fontSize="sm" color={textColor}>
                            {notification.created_at_human}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </Text>
                        </VStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <Flex px="25px" py="20px" justifyContent="space-between" align="center">
                <Text color="gray.500" fontSize="sm">
                  Showing {pagination.from} to {pagination.to} of {pagination.total} notifications
                </Text>
                <HStack spacing="2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {[...Array(pagination.last_page)].map((_, index) => {
                    const page = index + 1;
                    // Show only a few page numbers around the current page
                    if (
                      page === 1 ||
                      page === pagination.last_page ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          size="sm"
                          variant={currentPage === page ? 'solid' : 'outline'}
                          colorScheme={currentPage === page ? 'blue' : 'gray'}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <Text key={page} color="gray.500">...</Text>;
                    }
                    return null;
                  })}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage === pagination.last_page}
                  >
                    Next
                  </Button>
                </HStack>
              </Flex>
            )}
          </>
        )}
      </Card>
    </Box>
  );
};

export default Notifications;
