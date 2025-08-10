import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Card,
  Icon,
  Badge,
  Select,
  Avatar,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from '@chakra-ui/icons';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaSave, FaEdit, FaEye, FaTrash, FaReply } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { 
  useGetContactUsMessagesQuery, 
  useDeleteContactUsMessageMutation 
} from 'api/contactUsSlice';

const columnHelper = createColumnHelper();

const ContactUs = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(15);
  const [selectedMessage, setSelectedMessage] = React.useState(null);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const searchBg = useColorModeValue('secondaryGray.300', 'gray.700');
  const searchColor = useColorModeValue('gray.700', 'white');

  // API query parameters
  const queryParams = React.useMemo(() => {
    const params = {
      page: currentPage,
      per_page: perPage,
    };
    
    if (searchQuery.trim()) {
      params.name = searchQuery.trim();
    }
    
    return params;
  }, [currentPage, perPage, searchQuery]);

  // API hooks
  const { data: contactUsResponse, isLoading, isError, refetch } = useGetContactUsMessagesQuery(queryParams, { refetchOnMountOrArgChange: true });
  const [deleteContactUsMessage, { isLoading: isDeleting }] = useDeleteContactUsMessageMutation();

  const contactUsData = contactUsResponse?.data || [];
  const pagination = contactUsResponse?.pagination || null;

  // Effect to reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Effect to refetch when search or pagination changes
  React.useEffect(() => {
    refetch();
  }, [searchQuery, currentPage, perPage, refetch]);

  const handleViewMessage = (id) => {
    const message = contactUsData.find(msg => msg.id === id);
    if (message) {
      setSelectedMessage(message);
      onOpen();
    }
  };

  const handleReplyMessage = (id) => {
    navigate(`/admin/message/reply/${id}`);
  };

  const handleDeleteMessage = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await deleteContactUsMessage(id).unwrap();

        toast({
          title: 'Message Deleted',
          description: 'The contact message has been successfully deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Refetch the data to get updated list
        refetch();
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to delete message.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const columns = [
    columnHelper.accessor('id', {
      id: 'id',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          ID
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontWeight="bold" fontSize="sm">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('name', {
      id: 'user',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          User
        </Text>
      ),
      cell: (info) => (
        <VStack align="start" spacing={1}>
          <Text color={textColor} fontWeight="bold" fontSize="sm">
            {info.getValue()}
          </Text>
          <Text color="gray.500" fontSize="xs">
            {info.row.original.email}
          </Text>
          {info.row.original.phone && (
            <Text color="gray.500" fontSize="xs">
              {info.row.original.phone}
            </Text>
          )}
        </VStack>
      ),
    }),
    columnHelper.accessor('subject', {
      id: 'subject',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Subject
        </Text>
      ),
      cell: (info) => (
        <VStack align="start" spacing={1}>
          <Text color={textColor} fontWeight="bold" fontSize="sm">
            {info.getValue()}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={2}>
            {info.row.original.message}
          </Text>
        </VStack>
      ),
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Status
        </Text>
      ),
      cell: (info) => {
        const statusColors = {
          new: 'red',
          read: 'blue',
          archived: 'green'
        };
        
        return (
          <Badge 
            colorScheme={statusColors[info.getValue()] || 'gray'}
            px="2"
            py="1"
            borderRadius="full"
            fontSize="xs"
            textTransform="capitalize"
          >
            {info.getValue()}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('created_at', {
      id: 'created_at',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Date
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {new Date(info.getValue()).toLocaleDateString()}
        </Text>
      ),
    }),
    columnHelper.accessor('id', {
      id: 'actions',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Actions
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="red.500"
            as={FaTrash}
            cursor="pointer"
            onClick={() => handleDeleteMessage(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => handleViewMessage(info.getValue())}
          />
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: contactUsData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Loading state
  if (isLoading) {
    return (
      <Box mt="80px">
        <Card
          flexDirection="column"
          w="100%"
          px="0px"
          overflowX={{ sm: 'scroll', lg: 'hidden' }}
        >
          <Flex justify="center" align="center" h="200px">
            <VStack spacing={4}>
              <Spinner size="xl" color="#422afb" thickness="4px" />
              <Text color={textColor}>Loading contact messages...</Text>
            </VStack>
          </Flex>
        </Card>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box mt="80px">
        <Card
          flexDirection="column"
          w="100%"
          px="0px"
          overflowX={{ sm: 'scroll', lg: 'hidden' }}
        >
          <Flex justify="center" align="center" h="200px">
            <Text color="red.500">Error loading contact messages. Please try again.</Text>
          </Flex>
        </Card>
      </Box>
    );
  }

  return (
    <Box mt="80px" py="20px">
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex
          px={{ base: "16px", md: "25px" }}
          py="30px"
          mb="8px"
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
          align={{ base: "stretch", md: "center" }}
          gap={{ base: 4, md: 0 }}
        >
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Contact Messages Management
          </Text>

          <Box w={{ base: "100%", md: "auto" }}>
            <InputGroup w={{ base: "100%", md: "400px" }}>
              <InputLeftElement>
                <IconButton
                  bg="inherit"
                  borderRadius="inherit"
                  _hover="none"
                  _active={{
                    bg: "inherit",
                    transform: "none",
                    borderColor: "transparent",
                  }}
                  _focus={{
                    boxShadow: "none",
                  }}
                  icon={<SearchIcon w="15px" h="15px" />}
                />
              </InputLeftElement>
              <Input
                variant="search"
                fontSize="sm"
                bg={searchBg}
                color={searchColor}
                fontWeight="500"
                _placeholder={{ color: "gray.400", fontSize: "14px" }}
                borderRadius="30px"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Box>


        </Flex>

        <Box p="20px">
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Th
                        key={header.id}
                        colSpan={header.colSpan}
                        pe="10px"
                        borderColor={borderColor}
                        cursor="pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <Flex
                          justifyContent="space-between"
                          align="center"
                          fontSize={{ sm: '10px', lg: '12px' }}
                          color="gray.400"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted()] ?? null}
                        </Flex>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Td
                          key={cell.id}
                          fontSize={{ sm: '14px' }}
                          minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                          borderColor="transparent"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>

        {/* Pagination Controls */}
        {pagination && (
          <Flex
            px={{ base: "16px", md: "25px" }}
            py="20px"
            justify="space-between"
            align="center"
            borderTop="1px solid"
            borderColor={borderColor}
            direction={{ base: "column", md: "row" }}
            gap={{ base: 4, md: 0 }}
          >
            {/* Page Info */}
            <Text color={textColor} fontSize="sm">
              Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total || 0} results
            </Text>

            {/* Pagination Controls */}
            <HStack spacing="3">
              {/* Page Size Selector */}
              <HStack spacing="2">
                <Text fontSize="sm" color={textColor}>
                  Show:
                </Text>
                <Select
                  size="sm"
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  w="70px"
                  bg={searchBg}
                  color={searchColor}
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </Select>
              </HStack>

              {/* Page Navigation */}
              <HStack spacing="2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  isDisabled={currentPage <= 1}
                  leftIcon={<ChevronLeftIcon />}
                >
                  Previous
                </Button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, pagination.last_page || 1) }, (_, i) => {
                  const pageNum = i + 1;
                  const isCurrentPage = pageNum === currentPage;
                  
                  return (
                    <Button
                      key={pageNum}
                      size="sm"
                      variant={isCurrentPage ? "solid" : "outline"}
                      colorScheme={isCurrentPage ? "blue" : "gray"}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  isDisabled={currentPage >= (pagination.last_page || 1)}
                  rightIcon={<ChevronRightIcon />}
                >
                  Next
                </Button>
              </HStack>
            </HStack>
          </Flex>
        )}

        {/* No data message */}
        {(!contactUsData || contactUsData.length === 0) && !isLoading && (
          <Flex
            px={{ base: "16px", md: "25px" }}
            py="40px"
            justify="center"
            align="center"
          >
            <Text color={textColor} fontSize="md">
              No contact messages found with the current search.
            </Text>
          </Flex>
        )}

        {/* View Message Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Text color={textColor} fontSize="xl" fontWeight="bold">
                Contact Message Details
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedMessage && (
                <VStack spacing={4} align="stretch">
                  {/* Message ID */}
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={1}>
                      Message ID:
                    </Text>
                    <Text color={textColor} fontWeight="bold">
                      #{selectedMessage.id}
                    </Text>
                  </Box>

                  <Divider />

                  {/* User Information */}
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={2}>
                      Contact Information:
                    </Text>
                    <VStack spacing={2} align="stretch">
                      <HStack>
                        <Text fontSize="sm" fontWeight="bold" color={textColor} minW="80px">
                          Name:
                        </Text>
                        <Text fontSize="sm" color={textColor}>
                          {selectedMessage.name}
                        </Text>
                      </HStack>
                      <HStack>
                        <Text fontSize="sm" fontWeight="bold" color={textColor} minW="80px">
                          Email:
                        </Text>
                        <Text fontSize="sm" color={textColor}>
                          {selectedMessage.email}
                        </Text>
                      </HStack>
                      {selectedMessage.phone && (
                        <HStack>
                          <Text fontSize="sm" fontWeight="bold" color={textColor} minW="80px">
                            Phone:
                          </Text>
                          <Text fontSize="sm" color={textColor}>
                            {selectedMessage.phone}
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Subject */}
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={1}>
                      Subject:
                    </Text>
                    <Text color={textColor} fontWeight="bold">
                      {selectedMessage.subject}
                    </Text>
                  </Box>

                  <Divider />

                  {/* Message Content */}
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={2}>
                      Message:
                    </Text>
                    <Box
                      p={4}
                      bg="gray.50"
                      borderRadius="md"
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <Text color={textColor} lineHeight="1.6" whiteSpace="pre-wrap">
                        {selectedMessage.message}
                      </Text>
                    </Box>
                  </Box>

                  <Divider />

                  {/* Status and Dates */}
                  <HStack spacing={6}>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        Status:
                      </Text>
                      <Badge 
                        colorScheme={
                          selectedMessage.status === 'new' ? 'red' :
                          selectedMessage.status === 'read' ? 'blue' :
                          selectedMessage.status === 'archived' ? 'green' : 'gray'
                        }
                        px="2"
                        py="1"
                        borderRadius="full"
                        fontSize="xs"
                        textTransform="capitalize"
                      >
                        {selectedMessage.status}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        Received:
                      </Text>
                      <Text fontSize="sm" color={textColor}>
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </Text>
                    </Box>
                  </HStack>
                </VStack>
              )}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    </Box>
  );
};

export default ContactUs;
