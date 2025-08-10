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
  Avatar,
  HStack,
  VStack,
  Badge,
  Select,
  useToast,
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
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaCheck, FaTimes, FaStar, FaUser, FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  useGetReviewsQuery, 
  useUpdateReviewMutation, 
  useDeleteReviewMutation 
} from 'api/reviewsSlice';

const columnHelper = createColumnHelper();

const Reviews = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [sorting, setSorting] = React.useState([]);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(15);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // API hooks with proper query parameters
  const { data: reviewsResponse, isLoading, isError, refetch } = useGetReviewsQuery({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    page: currentPage,
    per_page: perPage
  }, { refetchOnMountOrArgChange: true });

  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  // Extract data and pagination from response
  const reviewsData = reviewsResponse?.data || [];

  // Transform API data to match component structure
  const reviews = React.useMemo(() => {
    if (!reviewsData || !Array.isArray(reviewsData)) return [];
    
    return reviewsData.map(review => ({
      id: review.id,
      user: {
        name: review.user?.name || 'Unknown User',
        image: review.user?.profile_image || null,
        email: review.user?.email || 'No email'
      },
      rating: review.rate || 0,
      title: review.message ? (review.message.substring(0, 50) + (review.message.length > 50 ? '...' : '')) : 'No title',
      comment: review.message || 'No comment',
      itemType: review.type || 'unknown',
      itemName: review.type && review.element_id ? 
        `${review.type.charAt(0).toUpperCase() + review.type.slice(1)} #${review.element_id}` : 
        'Unknown Item',
      status: review.status === 'accepted' ? 'approved' : review.status === 'rejected' ? 'rejected' : 'pending',
      createdAt: review.created_at || new Date().toISOString(),
      helpfulCount: review.likes_count || 0,
    }));
  }, [reviewsData]);

  // Effect to reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, typeFilter]);

  // Effect to refetch when filters or pagination changes
  React.useEffect(() => {
    refetch();
  }, [statusFilter, typeFilter, currentPage, perPage, refetch]);

  const columns = [
    columnHelper.accessor('user.image', {
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
        <HStack spacing={3}>
          <Avatar
            src={info.getValue()}
            size="sm"
            name={info.row.original.user.name}
          />
          <VStack align="start" spacing={0}>
            <Text color={textColor} fontWeight="bold" fontSize="sm">
              {info.row.original.user.name}
            </Text>
            <Text color="gray.500" fontSize="xs">
              {info.row.original.user.email}
            </Text>
          </VStack>
        </HStack>
      ),
    }),
    columnHelper.accessor('rating', {
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
          <Text color={textColor} fontWeight="bold">
            {info.getValue()}/5
          </Text>
        </HStack>
      ),
    }),
    columnHelper.accessor('title', {
      id: 'review',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Review
        </Text>
      ),
      cell: (info) => (
        <VStack align="start" spacing={1}>
          <Text color={textColor} fontWeight="bold" fontSize="sm">
            {info.getValue()}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={2}>
            {info.row.original.comment}
          </Text>
          <HStack spacing={2}>
            <Badge colorScheme="blue" size="sm">
              {info.row.original.itemType}
            </Badge>
            <Text color="gray.400" fontSize="xs">
              {info.row.original.itemName}
            </Text>
          </HStack>
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
      cell: (info) => (
        <Badge 
          colorScheme={
            info.getValue() === 'approved' ? 'green' : 
            info.getValue() === 'rejected' ? 'red' : 'yellow'
          }
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
      cell: (info) => {
        const review = info.row.original;
        return (
          <HStack spacing={2}>
            {review.status === 'pending' ? (
              <>
                <Button
                  size="sm"
                  bg="green.100"
                  color="green.700"
                  borderColor="green.300"
                  variant="outline"
                  onClick={() => handleApproveReview(review.id)}
                  leftIcon={<Icon as={FaCheck} />}
                  isLoading={isUpdating}
                  _hover={{ bg: "green.200", borderColor: "green.400" }}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  bg="red.100"
                  color="red.700"
                  borderColor="red.300"
                  variant="outline"
                  onClick={() => handleRejectReview(review.id)}
                  leftIcon={<Icon as={FaTimes} />}
                  isLoading={isUpdating}
                  _hover={{ bg: "red.200", borderColor: "red.400" }}
                >
                  Reject
                </Button>
              </>
            ) : (
              <Text color="gray.400" fontSize="sm">
                —
              </Text>
            )}
          </HStack>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: reviews,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleApproveReview = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Approve Review?',
        text: "This review will be visible on the mobile app.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, approve it!'
      });

      if (result.isConfirmed) {
        await updateReview({ 
          id, 
          submissionData: { status: 'accepted' } 
        }).unwrap();

        toast({
          title: 'Review Approved',
          description: 'The review is now visible on the mobile app.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Refetch the data to get updated status
        refetch();
      }
    } catch (error) {
      console.error('Failed to approve review:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to approve review.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRejectReview = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Reject Review?',
        text: "This review will not be visible on the mobile app.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, reject it!'
      });

      if (result.isConfirmed) {
        await updateReview({ 
          id, 
          submissionData: { status: 'rejected' } 
        }).unwrap();

        toast({
          title: 'Review Rejected',
          description: 'The review will not appear on the mobile app.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });

        // Refetch the data to get updated status
        refetch();
      }
    } catch (error) {
      console.error('Failed to reject review:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to reject review.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleViewReview = (id) => {
    navigate(`/admin/review/details/${id}`);
  };

  const handleDeleteReview = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Delete Review?',
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await deleteReview(id).unwrap();

        toast({
          title: 'Review Deleted',
          description: 'The review has been permanently deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Refetch the data to get updated list
        refetch();
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to delete review.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Flex justify="center" align="center" h="200px">
            <Text color={textColor}>Loading reviews...</Text>
          </Flex>
        </Card>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Card>
          <Flex justify="center" align="center" h="200px">
            <Text color="red.500">Error loading reviews. Please try again.</Text>
          </Flex>
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
            Reviews Management
          </Text>

          {/* Filters moved to the right */}
          <HStack spacing={4}>
            <Select
              size="sm"
              w={{ base: "200px", md: "180px" }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              bg="white"
              borderColor="gray.300"
              _hover={{ borderColor: "gray.400" }}
            >
              <option value="all">All Types</option>
              <option value="remedy">Remedies</option>
              <option value="course">Courses</option>
              <option value="video">Videos</option>
              <option value="article">Articles</option>
            </Select>

            <Select
              size="sm"
              w="200px"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              bg="white"
              borderColor="gray.300"
              _hover={{ borderColor: "gray.400" }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </Select>
          </HStack>
        </Flex>

        {/* Table */}
        <Box>
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
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
                          header.getContext()
                        )}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      fontSize={{ sm: '14px' }}
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                      borderColor="transparent"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Pagination Controls */}
        {reviewsResponse?.pagination && (
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
              Showing {reviewsResponse.pagination?.from || 0} to {reviewsResponse.pagination?.to || 0} of {reviewsResponse.pagination?.total || 0} results
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
                {Array.from({ length: Math.min(5, reviewsResponse.pagination?.last_page || 1) }, (_, i) => {
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
                  isDisabled={currentPage >= (reviewsResponse.pagination?.last_page || 1)}
                  rightIcon={<ChevronRightIcon />}
                >
                  Next
                </Button>
              </HStack>
            </HStack>
          </Flex>
        )}

        {/* No data message */}
        {(!reviews || reviews.length === 0) && !isLoading && (
          <Flex
            px={{ base: "16px", md: "25px" }}
            py="40px"
            justify="center"
            align="center"
          >
            <Text color={textColor} fontSize="md">
              No reviews found with the current filters.
            </Text>
          </Flex>
        )}
      </Card>
    </Box>
  );
};

export default Reviews;
