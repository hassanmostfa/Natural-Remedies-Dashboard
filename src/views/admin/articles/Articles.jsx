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
  IconButton,
  Avatar,
  HStack,
  VStack,
  Badge,
  useToast,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Grid,
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
import { EditIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaEye, FaTrash, FaLeaf, FaList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useGetArticlesQuery, useDeleteArticleMutation } from 'api/articlesSlice';

const columnHelper = createColumnHelper();

const Articles = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlans, setSelectedPlans] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(15);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const searchBg = useColorModeValue('secondaryGray.300', 'gray.700');
  const searchColor = useColorModeValue('gray.700', 'white');
  const modalBg = useColorModeValue('white', 'gray.800');
  const modalContainerBg = useColorModeValue('gray.50', 'gray.700');
  const planItemBg = useColorModeValue('white', 'gray.600');

  // API calls
  const { data: articlesResponse, isLoading, isError, refetch } = useGetArticlesQuery(
    { 
      search: searchQuery || undefined,
      page: currentPage,
      per_page: perPage
    },
    { refetchOnMountOrArgChange: true }
  );
  
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();

  // Extract data from API response
  const articlesData = articlesResponse?.data || [];
  const pagination = articlesResponse?.pagination || null;

  // Debug: Log the API response structure
  React.useEffect(() => {
    if (articlesResponse) {
      console.log('Articles API Response:', articlesResponse);
      console.log('Articles Data:', articlesData);
      console.log('Pagination:', pagination);
    }
  }, [articlesResponse, articlesData, pagination]);

  // Transform API data to match table structure
  const articles = React.useMemo(() => {
    console.log('Transforming articlesData:', articlesData);
    if (!articlesData || !Array.isArray(articlesData)) return [];
    
    const transformed = articlesData.map(article => ({
      id: article.id,
      title: article.title,
      image: article.image,
      description: article.description,
      plan: article.plan,
      status: article.status,
      rating: article.average_rating,
      reviewCount: article.review_count,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
    }));
    
    console.log('Transformed articles:', transformed);
    return transformed;
  }, [articlesData]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page size change
  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle page navigation
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle plans click to show popup
  const handlePlansClick = (plans) => {
    setSelectedPlans(plans);
    onOpen();
  };

  // Effect to reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Effect to refetch when search or pagination changes
  React.useEffect(() => {
    refetch();
  }, [searchQuery, currentPage, perPage, refetch]);

  // Sync current page with API response
  React.useEffect(() => {
    if (pagination && pagination.current_page !== currentPage) {
      setCurrentPage(pagination.current_page);
    }
  }, [pagination, currentPage]);

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
          fallback={<Icon as={FaLeaf} color="green.500" />}
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
          Article
        </Text>
      ),
      cell: (info) => (
        <VStack align="start" spacing={1}>
          <Text color={textColor} fontWeight="bold" fontSize="sm">
            {info.getValue()}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={2}>
            {info.row.original.description && info.row.original.description.length > 100 
              ? `${info.row.original.description.substring(0, 100)}...` 
              : info.row.original.description}
          </Text>
        </VStack>
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
      cell: (info) => {
        const plan = info.getValue();
        const planLabel = plan === 'rookie' ? 'Rookie' : 
                         plan === 'skilled' ? 'Skilled' : 
                         plan === 'master' ? 'Master' : 
                         plan === 'basic' ? 'Basic' :
                         plan === 'premium' ? 'Premium' :
                         plan === 'pro' ? 'Pro' : plan;
        
        const getBadgeColor = (plan) => {
          switch (plan) {
            case 'rookie':
            case 'basic':
              return 'green';
            case 'skilled':
            case 'premium':
              return 'blue';
            case 'master':
            case 'pro':
              return 'purple';
            default:
              return 'gray';
          }
        };
        
        return (
          <Badge
            colorScheme={getBadgeColor(plan)}
            px="3"
            py="1"
            borderRadius="full"
            fontSize="xs"
            fontWeight="600"
            cursor="pointer" 
            onClick={() => handlePlansClick([plan])}
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "md",
              transition: "all 0.2s"
            }}
            transition="all 0.2s"
          >
            {planLabel}
          </Badge>
        );
      },
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
          <Icon as={FaLeaf} color="yellow.500" size="sm" />
          <Text color={textColor} fontSize="sm" fontWeight="medium">
            {info.getValue() || 0}
          </Text>
        </HStack>
      ),
    }),

    columnHelper.accessor('reviewCount', {
      id: 'reviewCount',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Reviews
        </Text>
      ),
      cell: (info) => (
        <HStack spacing={1}>
          <Icon as={FaList} color="blue.500" size="sm" />
          <Text color={textColor} fontSize="sm" fontWeight="medium">
            {info.getValue() || 0}
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
            onClick={() => handleDeleteArticle(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => handleEditArticle(info.getValue())}
          />
          {/* <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => handleViewArticle(info.getValue())}
          /> */}
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: articles,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Debug: Log table data
  React.useEffect(() => {
    console.log('Table data:', articles);
    console.log('Table rows:', table.getRowModel().rows);
  }, [articles, table]);

  const handleViewArticle = (id) => {
    navigate(`/admin/article/details/${id}`);
  };

  const handleEditArticle = (id) => {
    navigate(`/admin/edit-article/${id}`);
  };

  // Delete function
  const handleDeleteArticle = async (id) => {
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
        await deleteArticle(id).unwrap();
        
        toast({
          title: 'Article deleted',
          description: 'The article has been successfully deleted.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        refetch();
      }
    } catch (error) {
      console.error('Failed to delete article:', error);
      
      let errorMessage = 'Failed to delete the article';
      if (error?.data?.message) {
        errorMessage = error.data.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddArticle = () => {
    navigate('/admin/add-article');
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
            <Text color={textColor}>Loading articles...</Text>
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
            <Text color="red.500">Error loading articles. Please try again.</Text>
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
            Articles
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
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearchChange}
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
            onClick={handleAddArticle}
            w={{ base: "100%", md: "200px" }}
          >
            Add New Article
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

        {/* Plans Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent 
            bg={modalBg}
            borderRadius="xl"
            boxShadow="2xl"
            mx={4}
          >
            <ModalHeader 
              borderBottom="1px solid" 
              borderColor={borderColor}
              pb={4}
              textAlign="center"
            >
              <VStack spacing={2}>
                <Icon as={FaList} color="green.500" boxSize={6} />
                <Text fontSize="lg" fontWeight="600">
                  Article Subscription Plan
                </Text>
              </VStack>
            </ModalHeader>
            <ModalCloseButton 
              top={4} 
              right={4}
              bg="gray.100"
              _hover={{ bg: "gray.200" }}
              borderRadius="full"
            />
            <ModalBody py={6}>
              <VStack spacing={4} align="stretch">
                <Text 
                  color="gray.600" 
                  fontSize="sm" 
                  textAlign="center"
                  mb={2}
                >
                  This article is available for the following subscription plan:
                </Text>
                
                <Box 
                  bg={modalContainerBg}
                  p={4}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <VStack spacing={3} align="stretch">
                    {selectedPlans && selectedPlans.length > 0 ? (
                      selectedPlans.map((plan, index) => (
                      <Flex
                        key={index}
                        align="center"
                        justify="space-between"
                        p={3}
                        bg={planItemBg}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor={borderColor}
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "lg",
                          transition: "all 0.2s"
                        }}
                        transition="all 0.2s"
                      >
                        <HStack spacing={3}>
                          <Box
                            w={3}
                            h={3}
                            borderRadius="full"
                            bg={plan === 'skilled' ? 'blue.500' : plan === 'master' ? 'purple.500' : 'green.500'}
                          />
                          <Text 
                            fontSize="md" 
                            fontWeight="600"
                            textTransform="capitalize"
                            color={textColor}
                          >
                            {plan}
                          </Text>
                        </HStack>
                        
                        <Badge
                          colorScheme={
                            plan === 'skilled' ? 'blue' : 
                            plan === 'master' ? 'purple' : 
                            'green'
                          }
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="600"
                        >
                          {plan === 'skilled' ? 'Skilled' : 
                           plan === 'master' ? 'Master' : 
                           'Rookie'}
                        </Badge>
                      </Flex>
                      ))
                    ) : (
                      <Text color="gray.500" textAlign="center" py={4}>
                        No plans assigned to this article
                      </Text>
                    )}
                  </VStack>
                </Box>
                
                <Text 
                  color="gray.500" 
                  fontSize="xs" 
                  textAlign="center"
                  mt={2}
                >
                  Users with this subscription level can access this article
                </Text>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Show Article Details Modal */}
        {/* Removed as per edit hint */}

        {/* No data message */}
        {(!articlesData || articlesData.length === 0) && !isLoading && (
          <Flex
            px={{ base: "16px", md: "25px" }}
            py="40px"
            justify="center"
            align="center"
          >
            <VStack spacing={3}>
              <Text color={textColor} fontSize="md">
                {searchQuery 
                  ? `No articles found matching "${searchQuery}".`
                  : "No articles found."
                }
              </Text>

              <Button
                colorScheme="blue"
                onClick={handleAddArticle}
                size="sm"
              >
                Add First Article
              </Button>
            </VStack>
          </Flex>
        )}

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
                  onChange={handlePerPageChange}
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
                  onClick={() => handlePageChange(currentPage - 1)}
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
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage >= (pagination.last_page || 1) || !pagination.has_more_pages}
                  rightIcon={<ChevronRightIcon />}
                >
                  Next
                </Button>
              </HStack>
            </HStack>
          </Flex>
        )}
      </Card>
    </Box>
  );
};


export default Articles;
