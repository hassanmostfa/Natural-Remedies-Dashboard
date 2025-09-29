import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
  Icon,
  useToast,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
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
import { FaUser, FaMobile, FaDesktop } from 'react-icons/fa';
import { useGetFeedbackQuery } from 'api/feedbackSlice';

const columnHelper = createColumnHelper();

const Feedbacks = () => {
  const toast = useToast();

  const [sorting, setSorting] = React.useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // State for pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(15);

  // API query parameters
  const queryParams = React.useMemo(() => {
    const params = {
      page: currentPage,
      per_page: perPage,
    };
    
    return params;
  }, [currentPage, perPage]);

  // API hooks
  const { data: feedbackResponse, isLoading, isError, refetch } = useGetFeedbackQuery(queryParams, { refetchOnMountOrArgChange: true });

  const feedbacksData = feedbackResponse?.data || [];
  const pagination = feedbackResponse?.pagination || null;

  // Effect to refetch when pagination changes
  React.useEffect(() => {
    refetch();
  }, [currentPage, perPage, refetch]);

  // Rating color mapping
  const getRatingColor = (rating) => {
    const ratingColors = {
      'Amazing': 'green',
      'Excellent': 'green',
      'good': 'blue',
      'Good': 'blue',
      'Okay': 'yellow',
      'Poor': 'orange',
      'Bad': 'red',
      'Very Poor': 'red'
    };
    return ratingColors[rating] || 'gray';
  };

  // Rating icon mapping
  const getRatingIcon = (rating) => {
    const ratingIcons = {
      'Amazing': '⭐⭐⭐⭐⭐',
      'Excellent': '⭐⭐⭐⭐⭐',
      'good': '⭐⭐⭐⭐',
      'Good': '⭐⭐⭐⭐',
      'Okay': '⭐⭐⭐',
      'Poor': '⭐⭐',
      'Bad': '⭐',
      'Very Poor': '⭐'
    };
    return ratingIcons[rating] || '⭐';
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      return 'Invalid date';
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
          #{info.getValue()}
        </Text>
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
        <HStack spacing={2}>
          <Badge 
            colorScheme={getRatingColor(info.getValue())}
            px="3"
            py="1"
            borderRadius="full"
            fontSize="sm"
          >
            {info.getValue()}
          </Badge>
          <Text fontSize="sm">{getRatingIcon(info.getValue())}</Text>
        </HStack>
      ),
    }),
    columnHelper.accessor('message', {
      id: 'message',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Message
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} noOfLines={2} maxW="300px">
          {info.getValue() || 'No message'}
        </Text>
      ),
    }),
    columnHelper.accessor('user', {
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
      cell: (info) => {
        const user = info.getValue();
        return user ? (
          <HStack spacing={2}>
            <Avatar 
              size="sm" 
              name={user.name || user.full_name} 
              src={user.profile_image}
            />
            <VStack spacing={0} align="start">
              <Text color={textColor} fontSize="sm" fontWeight="medium">
                {user.name || user.full_name}
              </Text>
              <Text color="gray.500" fontSize="xs">
                {user.email}
              </Text>
            </VStack>
          </HStack>
        ) : (
          <HStack spacing={2}>
            <Icon as={FaUser} color="gray.400" />
            <Text color="gray.500" fontSize="sm">
              Anonymous
            </Text>
          </HStack>
        );
      },
    }),
    columnHelper.accessor('device', {
      id: 'device',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Device
        </Text>
      ),
      cell: (info) => (
        info.getValue() ? (
          <HStack spacing={2}>
            <Icon as={FaMobile} color="blue.500" />
            <Text color={textColor} fontSize="sm">
              {info.getValue()}
            </Text>
          </HStack>
        ) : (
          <HStack spacing={2}>
            <Icon as={FaDesktop} color="gray.400" />
            <Text color="gray.500" fontSize="sm">
              Unknown
            </Text>
          </HStack>
        )
      ),
    }),
    columnHelper.accessor('app_version', {
      id: 'app_version',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          App Version
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {info.getValue() || 'N/A'}
        </Text>
      ),
    }),
    columnHelper.accessor('created_at', {
      id: 'date',
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
          {formatDate(info.getValue())}
        </Text>
      ),
    }),
  ];

  const table = useReactTable({
    data: feedbacksData,
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
              <Text color={textColor}>Loading feedback...</Text>
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
            <Text color="red.500">Error loading feedback. Please try again.</Text>
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
            Feedback Management
          </Text>
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
                >
                  Next
                </Button>
              </HStack>
            </HStack>
          </Flex>
        )}

        {/* No data message */}
        {(!feedbacksData || feedbacksData.length === 0) && !isLoading && (
          <Flex
            px={{ base: "16px", md: "25px" }}
            py="40px"
            justify="center"
            align="center"
          >
            <Text color={textColor} fontSize="md">
              No feedback found.
            </Text>
          </Flex>
        )}
      </Card>
    </Box>
  );
};

export default Feedbacks;
