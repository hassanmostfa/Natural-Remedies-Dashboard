import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
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
  IconButton,
  Badge,
  Avatar,
  HStack,
  VStack,
  useToast,
  Select,
  Spinner,
  Alert,
  AlertIcon,

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
import { FaEye, FaTrash, FaPlay, FaStar, FaUsers, FaClock, FaDollarSign, FaBookOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useGetCoursesQuery, useDeleteCourseMutation } from 'api/coursesSlice';

const columnHelper = createColumnHelper();

const Courses = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(15);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const searchBg = useColorModeValue('secondaryGray.300', 'gray.700');
  const searchColor = useColorModeValue('gray.700', 'white');

  // API hooks
  const { data: coursesResponse, isLoading, isError, error, refetch } = useGetCoursesQuery({
    title: searchQuery || undefined,
    page: currentPage,
    per_page: perPage,
  }, { refetchOnMountOrArgChange: true });
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  // Extract data from API response
  const coursesData = coursesResponse?.data || [];
  const pagination = coursesResponse?.pagination || null;

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
          fallback={<Icon as={FaPlay} color="blue.500" />}
        />
      ),
    }),
    columnHelper.accessor('title', {
      id: 'title',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Course
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
    columnHelper.accessor('duration', {
      id: 'duration',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Duration
        </Text>
      ),
      cell: (info) => (
        <HStack spacing={2}>
          <Icon as={FaClock} color="blue.500" size="sm" />
          <Text color={textColor} fontSize="sm">
            {info.getValue()}
          </Text>
        </HStack>
      ),
    }),
    columnHelper.accessor('sessionsNumber', {
      id: 'sessionsNumber',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Sessions
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="medium">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('price', {
      id: 'price',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Price
        </Text>
      ),
      cell: (info) => (
        <HStack spacing={1}>
          <Icon as={FaDollarSign} color="green.500" size="sm" />
          <Text color={textColor} fontSize="sm" fontWeight="medium">
            {info.getValue()}
          </Text>
        </HStack>
      ),
    }),
    columnHelper.accessor('plan', {
      id: 'plan',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Plan
        </Text>
      ),
      cell: (info) => (
        <Badge 
          colorScheme="purple"
          px="2"
          py="1"
          borderRadius="full"
          fontSize="xs"
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('average_rating', {
      id: 'rating',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Rating
        </Text>
      ),
      cell: (info) => (
        <HStack spacing={1}>
          <Icon as={FaStar} color="yellow.400" size="sm" />
          <Text color={textColor} fontSize="sm" fontWeight="medium">
            {info.getValue() || 0}
          </Text>
          <Text color="gray.500" fontSize="xs">
            ({info.row.original.review_count || 0})
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
        <Flex align="center">
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="red.500"
            as={FaTrash}
            cursor="pointer"
            onClick={() => handleDeleteCourse(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => handleEditCourse(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="black"
            as={FaBookOpen}
            title='View Course Lessons'
            cursor="pointer"
            onClick={() => handleViewLessons(info.getValue())}
          />
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: coursesData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleViewLessons = (id) => {
    navigate(`/admin/courses/${id}/lessons`);
  };

  const handleEditCourse = (id) => {
    navigate(`/admin/edit-course/${id}`);
  };

  const handleDeleteCourse = async (id) => {
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
      try {
        await deleteCourse(id).unwrap();
        
        toast({
          title: 'Success!',
          description: 'Course has been deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Refetch the data
        refetch();
      } catch (error) {
        console.error('Failed to delete course:', error);
        toast({
          title: 'Error!',
          description: error.data?.message || 'Failed to delete course. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleAddCourse = () => {
    navigate('/admin/add-course');
  };

  // Loading state
  if (isLoading) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Flex justify="center" align="center" h="200px">
              <VStack spacing={4}>
                <Spinner size="xl" color="#422afb" thickness="8px" speed="0.6s" />
                <Text color={textColor} fontSize="lg" fontWeight="bold">Loading courses...</Text>
                <Text color="gray.500" fontSize="sm">Please wait while we fetch the courses data</Text>
              </VStack>
            </Flex>
          </Box>
        </Card>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              <Text>
                {error?.data?.message || 'Failed to load courses data. Please try again.'}
              </Text>
            </Alert>
            <Button
              onClick={() => refetch()}
              colorScheme="blue"
            >
              Retry
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card>
        <Flex
          direction="column"
          w="100%"
          overflowX={{ sm: 'scroll', lg: 'hidden' }}
        >
          {/* Header */}
          <Flex
            px={{ base: "16px", md: "25px" }}
            py="20px"
            justify="space-between"
            align="center"
            borderBottom="1px solid"
            borderColor={borderColor}
            direction={{ base: "column", md: "row" }}
            gap={{ base: 4, md: 0 }}
          >
            <Text color={textColor} fontSize="xl" fontWeight="700">
              Courses Management
            </Text>

            {/* Search and Add Button */}
            <HStack spacing="4" w={{ base: "100%", md: "auto" }}>
              {/* Search Bar */}
              <InputGroup maxW={{ base: "100%", md: "400px" }}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                  placeholder="Search courses by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  bg={searchBg}
                  color={searchColor}
                  borderRadius="70px"
                  fontSize="sm"
                  _placeholder={{ color: 'gray.400' }}
              />
            </InputGroup>

              {/* Add Course Button */}
              <Button
                variant='darkBrand'
                color='white'
                fontSize='sm'
                fontWeight='500'
                borderRadius='70px'
                px='24px'
                py='5px'
                onClick={handleAddCourse}
                w={{ base: "100%", md: "200px" }}
              >
                Add New Course
              </Button>
            </HStack>
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
          {(!coursesData || coursesData.length === 0) && !isLoading && (
            <Flex
              px={{ base: "16px", md: "25px" }}
              py="40px"
              justify="center"
              align="center"
            >
              <Text color={textColor} fontSize="md">
                No courses found with the current search.
              </Text>
            </Flex>
                     )}
        </Flex>
      </Card>


    </Box>
  );
};

export default Courses;
