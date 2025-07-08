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
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from '@chakra-ui/icons';
import { FaCheck, FaTimes, FaStar, FaUser, FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper();

const Reviews = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Static reviews data
  const staticData = [
    {
      id: 1,
      user: {
        name: 'Ahmed Hassan',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        email: 'ahmed.h@example.com'
      },
      rating: 5,
      title: 'Excellent Natural Remedies',
      comment: 'This app has been a lifesaver! The natural remedies are effective and easy to follow. Highly recommend for anyone looking for alternative health solutions.',
      itemType: 'remedy',
      itemName: 'Ginger Tea for Digestion',
      status: 'pending', // pending, approved, rejected
      createdAt: '2024-01-15T10:30:00Z',
      helpfulCount: 12,
    },
    {
      id: 2,
      user: {
        name: 'Fatima Mahmoud',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        email: 'fatima.m@example.com'
      },
      rating: 4,
      title: 'Great Course Content',
      comment: 'The herbal medicine course was very informative. Learned a lot about different herbs and their properties. Would love to see more advanced courses.',
      itemType: 'course',
      itemName: 'Herbal Medicine Basics',
      status: 'approved',
      createdAt: '2024-01-14T15:45:00Z',
      helpfulCount: 8,
    },
    {
      id: 3,
      user: {
        name: 'Omar Khalid',
        image: 'https://randomuser.me/api/portraits/men/75.jpg',
        email: 'omar.k@example.com'
      },
      rating: 3,
      title: 'Decent but could be better',
      comment: 'The remedies work but the instructions could be clearer. Some ingredients are hard to find locally. Overall okay experience.',
      itemType: 'remedy',
      itemName: 'Lavender Oil for Sleep',
      status: 'rejected',
      createdAt: '2024-01-13T09:20:00Z',
      helpfulCount: 3,
    },
    {
      id: 4,
      user: {
        name: 'Sarah Johnson',
        image: 'https://randomuser.me/api/portraits/women/63.jpg',
        email: 'sarah.j@example.com'
      },
      rating: 5,
      title: 'Amazing Video Tutorials',
      comment: 'The video tutorials are so well made! Clear instructions and professional quality. The peppermint tea recipe helped with my headaches immediately.',
      itemType: 'video',
      itemName: 'Peppermint Tea Preparation',
      status: 'approved',
      createdAt: '2024-01-12T14:15:00Z',
      helpfulCount: 25,
    },
    {
      id: 5,
      user: {
        name: 'Mohammed Ali',
        image: 'https://randomuser.me/api/portraits/men/81.jpg',
        email: 'mohammed.ali@example.com'
      },
      rating: 2,
      title: 'Not what I expected',
      comment: 'The remedy didn\'t work for me at all. Waste of time and money. Would not recommend.',
      itemType: 'remedy',
      itemName: 'Chamomile for Anxiety',
      status: 'pending',
      createdAt: '2024-01-11T11:30:00Z',
      helpfulCount: 1,
    },
  ];

  // Filter data based on search query and status filter
  const filteredData = React.useMemo(() => {
    let filtered = staticData;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    return filtered;
  }, [searchQuery, statusFilter]);

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
    columnHelper.accessor('helpfulCount', {
      id: 'helpful',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Helpful
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {info.getValue()}
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
      cell: (info) => {
        const review = info.row.original;
        return (
          <Flex align="center" gap={2}>
            {review.status === 'pending' && (
              <>
                <Icon
                  w="18px"
                  h="18px"
                  color="green.500"
                  as={FaCheck}
                  cursor="pointer"
                  onClick={() => handleApproveReview(review.id)}
                  title="Approve Review"
                />
                <Icon
                  w="18px"
                  h="18px"
                  color="red.500"
                  as={FaTimes}
                  cursor="pointer"
                  onClick={() => handleRejectReview(review.id)}
                  title="Reject Review"
                />
              </>
            )}
            <Icon
              w="18px"
              h="18px"
              color="blue.500"
              as={FaEye}
              cursor="pointer"
              onClick={() => handleViewReview(review.id)}
              title="View Details"
            />
            <Icon
              w="18px"
              h="18px"
              color="red.500"
              as={FaTrash}
              cursor="pointer"
              onClick={() => handleDeleteReview(review.id)}
              title="Delete Review"
            />
          </Flex>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: filteredData,
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
        // In a real app, you would call your API here
        // await api.patch(`/reviews/${id}`, { status: 'approved' });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
          title: 'Review Approved',
          description: 'The review is now visible on the mobile app.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Update local state (in real app, you'd refresh from API)
        // setReviews(reviews.map(review => 
        //   review.id === id ? { ...review, status: 'approved' } : review
        // ));
      }
    } catch (error) {
      console.error('Failed to approve review:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve review.',
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
        // In a real app, you would call your API here
        // await api.patch(`/reviews/${id}`, { status: 'rejected' });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
          title: 'Review Rejected',
          description: 'The review will not appear on the mobile app.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });

        // Update local state (in real app, you'd refresh from API)
        // setReviews(reviews.map(review => 
        //   review.id === id ? { ...review, status: 'rejected' } : review
        // ));
      }
    } catch (error) {
      console.error('Failed to reject review:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject review.',
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
        // In a real app, you would call your API here
        // await api.delete(`/reviews/${id}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
          title: 'Review Deleted',
          description: 'The review has been permanently deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Update local state (in real app, you'd refresh from API)
        // setReviews(reviews.filter(review => review.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card>
        <Flex
          direction="column"
          w="100%"
          overflowX={{ sm: 'scroll', lg: 'hidden' }}
        >
          <Flex
            align={{ sm: 'flex-start', lg: 'center' }}
            justify="space-between"
            w="100%"
            px="22px"
            pb="20px"
            mb="10px"
            boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.06)"
          >
            <Text color={textColor} fontSize="xl" fontWeight="600">
              Reviews Management
            </Text>
          </Flex>

          <Flex
            align={{ sm: 'flex-start', lg: 'center' }}
            justify="space-between"
            w="100%"
            px="22px"
            pb="20px"
            gap={4}
          >
            <InputGroup maxW="400px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Select
              maxW="200px"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </Flex>

          <Box overflowX="auto">
            <Table variant="simple" color="gray.500" mb="24px">
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
        </Flex>
      </Card>
    </Box>
  );
};

export default Reviews;
