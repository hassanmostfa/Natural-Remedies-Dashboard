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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, SearchIcon, ArrowBackIcon, ChevronRightIcon as BreadcrumbChevron } from '@chakra-ui/icons';
import { FaTrash, FaPlay, FaClock, FaVideo, FaFileAlt, FaQuestionCircle, FaTasks, FaGripVertical, FaImage, FaLeaf, FaList, FaListOl } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useGetLessonsQuery, useDeleteLessonMutation } from 'api/lessonsSlice';
import { useGetCourseQuery } from 'api/coursesSlice';

const columnHelper = createColumnHelper();

const Lessons = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { courseId, id, course_id } = params;
  
  // Try to get course ID from different possible parameter names
  const actualCourseId = courseId || id || course_id;
  
  // Debug: Log the params to check what's available
  React.useEffect(() => {
    console.log('All URL params:', params);
    console.log('courseId:', courseId);
    console.log('id:', id);
    console.log('course_id:', course_id);
    console.log('Actual course ID being used:', actualCourseId);
  }, [params, courseId, id, course_id, actualCourseId]);
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
  const { data: courseResponse, isLoading: isLoadingCourse } = useGetCourseQuery(actualCourseId);
  const { data: lessonsResponse, isLoading, isError, error, refetch } = useGetLessonsQuery({
    course_id: actualCourseId,
    search: searchQuery || undefined,
    page: currentPage,
    per_page: perPage,
  }, { refetchOnMountOrArgChange: true });
  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();

  // Extract data from API response
  const lessonsData = lessonsResponse?.data || [];
  const pagination = lessonsResponse?.pagination || null;
  const courseData = courseResponse?.data || null;



  // Effect to reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Effect to refetch when search or pagination changes
  React.useEffect(() => {
    refetch();
  }, [searchQuery, currentPage, perPage, refetch]);

  // Get content block type icon (based on the most prominent type in the lesson)
  const getLessonTypeIcon = (lesson) => {
    if (!lesson.content_blocks || lesson.content_blocks.length === 0) return FaPlay;
    
    // Get the first content block type or most common type
    const types = lesson.content_blocks.map(block => block.type);
    const firstType = types[0];
    
    switch (firstType?.toLowerCase()) {
      case 'video':
        return FaVideo;
      case 'text':
        return FaFileAlt;
      case 'image':
        return FaImage;
      case 'remedy':
        return FaLeaf;
      case 'ingredients':
        return FaList;
      case 'instructions':
        return FaListOl;
      default:
        return FaPlay;
    }
  };

  // Get lesson type color
  const getLessonTypeColor = (lesson) => {
    if (!lesson.content_blocks || lesson.content_blocks.length === 0) return 'gray.500';
    
    const firstType = lesson.content_blocks[0]?.type;
    
    switch (firstType?.toLowerCase()) {
      case 'video':
        return 'red.500';
      case 'text':
        return 'blue.500';
      case 'image':
        return 'purple.500';
      case 'remedy':
        return 'green.500';
      case 'ingredients':
        return 'orange.500';
      case 'instructions':
        return 'teal.500';
      default:
        return 'gray.500';
    }
  };

  // Get lesson type label
  const getLessonTypeLabel = (lesson) => {
    if (!lesson.content_blocks || lesson.content_blocks.length === 0) return 'Mixed';
    
    const types = lesson.content_blocks.map(block => block.type);
    const uniqueTypes = [...new Set(types)];
    
    if (uniqueTypes.length === 1) {
      return uniqueTypes[0].charAt(0).toUpperCase() + uniqueTypes[0].slice(1);
    } else {
      return `Mixed (${uniqueTypes.length})`;
    }
  };

  // Get lesson type badge color scheme
  const getLessonTypeBadgeColor = (lesson) => {
    if (!lesson.content_blocks || lesson.content_blocks.length === 0) return 'gray';
    
    const firstType = lesson.content_blocks[0]?.type;
    
    switch (firstType?.toLowerCase()) {
      case 'video':
        return 'red';
      case 'text':
        return 'blue';
      case 'image':
        return 'purple';
      case 'remedy':
        return 'green';
      case 'ingredients':
        return 'orange';
      case 'instructions':
        return 'teal';
      default:
        return 'gray';
    }
  };

  const columns = [
    columnHelper.accessor('order', {
      id: 'order',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Order
        </Text>
      ),
      cell: (info) => (
        <HStack spacing={2}>
          <Icon as={FaGripVertical} color="gray.400" cursor="grab" />
          <Text color={textColor} fontSize="sm" fontWeight="bold">
            {info.row.index + 1}
          </Text>
        </HStack>
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
          Lesson
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
    columnHelper.accessor('content_blocks', {
      id: 'type',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Content Type
        </Text>
      ),
      cell: (info) => {
        const lesson = info.row.original;
        return (
          <HStack spacing={2}>
            <Icon 
              as={getLessonTypeIcon(lesson)} 
              color={getLessonTypeColor(lesson)} 
              size="sm" 
            />
            <Badge 
              colorScheme={getLessonTypeBadgeColor(lesson)}
              px="2"
              py="1"
              borderRadius="full"
              fontSize="xs"
            >
              {getLessonTypeLabel(lesson)}
            </Badge>
          </HStack>
        );
      },
    }),
    columnHelper.accessor('content_blocks', {
      id: 'content_count',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Content Blocks
        </Text>
      ),
      cell: (info) => {
        const contentBlocks = info.getValue() || [];
        return (
          <HStack spacing={2}>
            <Icon as={FaTasks} color="blue.500" size="sm" />
            <Text color={textColor} fontSize="sm" fontWeight="medium">
              {contentBlocks.length} block{contentBlocks.length !== 1 ? 's' : ''}
            </Text>
          </HStack>
        );
      },
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
          colorScheme={info.getValue() === 'active' ? 'green' : 
                     info.getValue() === 'draft' ? 'yellow' : 'red'}
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
            onClick={() => handleDeleteLesson(info.getValue())}
            title="Delete Lesson"
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => handleEditLesson(info.getValue())}
            title="Edit Lesson"
          />
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: lessonsData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleEditLesson = (id) => {
    navigate(`/admin/courses/${actualCourseId}/lessons/${id}/edit`);
  };

  const handleDeleteLesson = async (id) => {
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
        await deleteLesson(id).unwrap();
        
        toast({
          title: 'Success!',
          description: 'Lesson has been deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Refetch the data
        refetch();
      } catch (error) {
        console.error('Failed to delete lesson:', error);
        toast({
          title: 'Error!',
          description: error.data?.message || 'Failed to delete lesson. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleAddLesson = () => {
    navigate(`/admin/courses/${actualCourseId}/lessons/add`);
  };

  const handleBackToCourses = () => {
    navigate('/admin/courses');
  };

  // Loading state
  if (isLoading || isLoadingCourse) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Box p={6}>
            <Flex justify="center" align="center" h="200px">
              <VStack spacing={4}>
                <Spinner size="xl" color="#422afb" thickness="8px" speed="0.6s" />
                <Text color={textColor} fontSize="lg" fontWeight="bold">Loading lessons...</Text>
                <Text color="gray.500" fontSize="sm">Please wait while we fetch the lessons data</Text>
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
                {error?.data?.message || 'Failed to load lessons data. Please try again.'}
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
          {/* Breadcrumb and Header */}
          <Box px={{ base: "16px", md: "25px" }} py="20px">
            <Breadcrumb spacing="8px" separator={<BreadcrumbChevron color="gray.500" />} mb={4}>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={handleBackToCourses} color="blue.500" _hover={{ textDecoration: 'underline' }}>
                  Courses
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink color={textColor} fontWeight="medium">
                  {courseData?.title || 'Course'} Lessons
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <Flex
              justify="space-between"
              align="center"
              direction={{ base: "column", md: "row" }}
              gap={{ base: 4, md: 0 }}
            >
              <VStack align="start" spacing={1}>
                <Text color={textColor} fontSize="xl" fontWeight="700">
                  Lessons Management
                </Text>
                {courseData && (
                  <Text color="gray.500" fontSize="sm">
                    Course: {courseData.title} • {lessonsData.length} lesson{lessonsData.length !== 1 ? 's' : ''}
                  </Text>
                )}
              </VStack>

              {/* Search and Add Button */}
              <HStack spacing="4" w={{ base: "100%", md: "auto" }}>
                {/* Back Button */}
                <Button
                  leftIcon={<ArrowBackIcon />}
                  variant="outline"
                  onClick={handleBackToCourses}
                  size="sm"
                  w={200}
                  display={{ base: "none", md: "flex" }}
                >
                  Back to Courses
                </Button>

                {/* Search Bar */}
                <InputGroup maxW={{ base: "100%", md: "300px" }}>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search lessons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    bg={searchBg}
                    color={searchColor}
                    borderRadius="70px"
                    fontSize="sm"
                    _placeholder={{ color: 'gray.400' }}
                  />
                </InputGroup>

                {/* Add Lesson Button */}
                <Button
                  variant='darkBrand'
                  color='white'
                  fontSize='sm'
                  fontWeight='500'
                  borderRadius='70px'
                  px='24px'
                  py='5px'
                  onClick={handleAddLesson}
                  w={{ base: "100%", md: "200px" }}
                >
                  Add New Lesson
                </Button>
              </HStack>
            </Flex>
          </Box>

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
          {(!lessonsData || lessonsData.length === 0) && !isLoading && (
            <Flex
              px={{ base: "16px", md: "25px" }}
              py="40px"
              justify="center"
              align="center"
            >
              <VStack spacing={3}>
                <Text color={textColor} fontSize="md">
                  {searchQuery 
                    ? `No lessons found matching "${searchQuery}" for this course.`
                    : "No lessons found for this course."
                  }
                </Text>

                <Button
                  colorScheme="blue"
                  onClick={handleAddLesson}
                  size="sm"
                >
                  Add First Lesson
                </Button>
              </VStack>
            </Flex>
          )}
        </Flex>
      </Card>
    </Box>
  );
};

export default Lessons;
