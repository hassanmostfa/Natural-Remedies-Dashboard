import {
  Box,
  Button,
  Flex,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  HStack,
  VStack,
  Badge,
  useToast,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import Card from 'components/card/Card';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, PlusSquareIcon, SearchIcon } from '@chakra-ui/icons';
import { FaEye, FaTrash, FaLeaf, FaList, FaThermometerHalf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  useGetDiseasesQuery, 
  useDeleteDiseaseMutation 
} from 'api/diseasesSlice';

const columnHelper = createColumnHelper();

const Disease = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSymptoms, setSelectedSymptoms] = React.useState([]);
  const [selectedDiseaseName, setSelectedDiseaseName] = React.useState('');
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(15);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const searchBg = useColorModeValue('secondaryGray.300', 'gray.700');
  const searchColor = useColorModeValue('gray.700', 'white');

  // API hooks
  const { data: diseasesResponse, isLoading, isError, refetch } = useGetDiseasesQuery({
    name: searchQuery || undefined,
    page: currentPage,
    per_page: perPage
  }, { refetchOnMountOrArgChange: true });

  const [deleteDisease, { isLoading: isDeleting }] = useDeleteDiseaseMutation();

  // Extract data and pagination from response
  const diseasesData = diseasesResponse?.data || [];
  const pagination = diseasesResponse?.pagination || null;

  // Effect to reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Effect to refetch when search or pagination changes
  React.useEffect(() => {
    refetch();
  }, [searchQuery, currentPage, perPage, refetch]);

  const columns = [
    columnHelper.accessor('image', {
      id: 'image',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Image
        </Text>
      ),
      cell: (info) => (
        <Avatar
          src={info.getValue()}
          size="md"
          borderRadius="lg"
          fallback={<Icon as={FaThermometerHalf} color="red.500" />}
        />
      ),
    }),
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Disease
        </Text>
      ),
      cell: (info) => (
        <VStack align="start" spacing={1}>
          <Text color={textColor} fontWeight="bold" fontSize="sm">
            {info.getValue()}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={2}>
            {info.row.original.description}
          </Text>
        </VStack>
      ),
    }),
    
    columnHelper.accessor('symptoms', {
      id: 'symptoms',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Symptoms
        </Text>
      ),
      cell: (info) => (
        <HStack 
          spacing={1} 
          cursor="pointer"
          onClick={() => handleSymptomsClick(info.getValue(), info.row.original.name)}
          _hover={{ opacity: 0.7 }}
          transition="opacity 0.2s"
        >
          <Icon as={FaList} color="orange.500" size="sm" />
          <Text color={textColor} fontSize="sm" fontWeight="medium">
            {info.getValue()?.length || 0} symptoms
          </Text>
        </HStack>
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
      cell: (info) => (
        <Badge 
          colorScheme={info.getValue() === 'active' ? 'green' : 'red'}
          px="2"
          py="1"
          borderRadius="full"
          fontSize="xs"
        >
          {info.getValue()}
        </Badge>
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
        <Flex align="center" gap={2}>
          <Icon
            w="18px"
            h="18px"
            color="red.500"
            as={FaTrash}
            cursor="pointer"
            onClick={() => handleDeleteDisease(info.getValue())}
            title="Delete Disease"
          />
          <Icon
            w="18px"
            h="18px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => handleEditDisease(info.getValue())}
            title="Edit Disease"
          />
          {/* <Icon
            w="18px"
            h="18px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => handleViewDisease(info.getValue())}
            title="View Disease"
          /> */}
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: diseasesData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleViewDisease = (id) => {
    navigate(`/admin/disease/details/${id}`);
  };

  const handleEditDisease = (id) => {
    navigate(`/admin/edit-disease/${id}`);
  };

  const handleDeleteDisease = async (id) => {
    try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        await deleteDisease(id).unwrap();

        toast({
          title: 'Disease Deleted',
          description: 'The disease has been successfully deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Refetch the data to get updated list
        refetch();
      }
      } catch (error) {
        console.error('Failed to delete disease:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to delete disease.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddDisease = () => {
    navigate('/admin/add-disease');
  };

  const handleSymptomsClick = (symptoms, diseaseName) => {
    setSelectedSymptoms(symptoms || []);
    setSelectedDiseaseName(diseaseName);
    onOpen();
  };

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
            <Text color={textColor}>Loading diseases...</Text>
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
            <Text color="red.500">Error loading diseases. Please try again.</Text>
          </Flex>
        </Card>
      </Box>
    );
  }

  return (
    <Box mt="80px">
      <Card
        flexDirection="column"
          w="100%"
        px="0px"
          overflowX={{ sm: 'scroll', lg: 'hidden' }}
        >
          <Flex
          px={{ base: "16px", md: "25px" }}
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
            Diseases
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
                placeholder="Search diseases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Box>

          <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            onClick={handleAddDisease}
            w={{ base: "100%", md: "200px" }}
          >
            Add New Disease
          </Button>
          </Flex>

        <Box>
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
                <select
                  size="sm"
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
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
        {(!diseasesData || diseasesData.length === 0) && !isLoading && (
          <Flex
            px={{ base: "16px", md: "25px" }}
            py="40px"
            justify="center"
            align="center"
          >
            <Text color={textColor} fontSize="md">
              No diseases found with the current search.
            </Text>
          </Flex>
        )}

        {/* Symptoms Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex align="center" gap={3}>
                <Icon as={FaThermometerHalf} color="red.500" />
                <Text>Symptoms - {selectedDiseaseName}</Text>
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedSymptoms.length > 0 ? (
                <List spacing={3}>
                  {selectedSymptoms.map((symptom, index) => (
                    <ListItem key={index}>
                      <Flex align="center" gap={3}>
                        <ListIcon as={FaList} color="orange.500" />
                        <Text color={textColor} fontSize="md">
                          {symptom}
                        </Text>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Flex justify="center" align="center" py={8}>
                  <Text color="gray.500" fontSize="md">
                    No symptoms available for this disease.
                  </Text>
        </Flex>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Card>
    </Box>
  );
};

export default Disease;
