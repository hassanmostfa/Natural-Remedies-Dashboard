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
  HStack,
  VStack,
  useToast,
  Switch,
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
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import { FaTrash, FaEye, FaPlus, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  useGetAdsQuery, 
  useDeleteAdMutation,
  useToggleAdStatusMutation,
  adsApiService,
} from 'api/adsSlice';
import { useDispatch } from 'react-redux';



const columnHelper = createColumnHelper();

const Ads = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(15);
  const [togglingId, setTogglingId] = React.useState(null);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const searchBg = useColorModeValue('secondaryGray.300', 'gray.700');
  const searchColor = useColorModeValue('gray.700', 'white');

  // API hooks
  const { data: adsResponse, isLoading, isError, refetch } = useGetAdsQuery({
    title: searchQuery || undefined,
    page: currentPage,
    per_page: perPage
  }, { refetchOnMountOrArgChange: true });

  const [deleteAd, { isLoading: isDeleting }] = useDeleteAdMutation();
  const [toggleAdStatus] = useToggleAdStatusMutation();

  // Extract data and pagination from response
  const adsData = adsResponse?.data || [];
  const pagination = adsResponse?.pagination || null;

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
        <Image
          src={info.getValue()}
          alt="Ad Preview"
          boxSize="60px"
          objectFit="cover"
          borderRadius="md"
          fallback={<Icon as={FaImage} color="gray.500" boxSize="30px" />}
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
          Title
        </Text>
      ),
      cell: (info) => (
        <VStack align="start" spacing={1}>
          <Text color={textColor} fontWeight="bold" fontSize="sm">
            {info.getValue()}
          </Text>
          <Text color="gray.500" fontSize="xs">
            ID: {info.row.original.id}
          </Text>
        </VStack>
      ),
    }),
    columnHelper.accessor('url', {
      id: 'url',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          URL
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {info.getValue() || 'No URL'}
        </Text>
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
        const id = info.row.original.id;
        const isActive = info.getValue() === 'active';
        const isLoading = togglingId === id;
        const handleToggle = async () => {
          try {
            setTogglingId(id);
            await toggleAdStatus(id).unwrap();
            toast({
              title: 'Status Updated',
              description: `Ad has been ${isActive ? 'deactivated' : 'activated'}.`,
              status: 'success',
              duration: 2000,
              isClosable: true,
            });
            // Optimistically update cache to prevent full list refetch
            dispatch(
              adsApiService.util.updateQueryData(
                'getAds',
                { title: searchQuery || undefined, page: currentPage, per_page: perPage },
                (draft) => {
                  if (!draft?.data) return;
                  const ad = draft.data.find((a) => a.id === id);
                  if (ad) {
                    ad.status = isActive ? 'inactive' : 'active';
                  }
                }
              )
            );
          } catch (error) {
            toast({
              title: 'Error',
              description: error?.data?.message || 'Failed to toggle status',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          } finally {
            setTogglingId(null);
          }
        };
        return (
          <Switch isChecked={isActive} onChange={handleToggle} isDisabled={isLoading} colorScheme="green" />
        );
      },
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
            onClick={() => handleDeleteAd(info.getValue())}
            title="Delete Ad"
          />
          <Icon
            w="18px"
            h="18px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => navigate(`/admin/edit-ad/${info.getValue()}`)}
            title="Edit Ad"
          />
          {/* <Icon
            w="18px"
            h="18px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => navigate(`/admin/view-ad/${info.getValue()}`)}
            title="View Ad"
          /> */}
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: adsData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Delete function
  const handleDeleteAd = async (id) => {
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
        await deleteAd(id).unwrap();

        toast({
          title: 'Ad Deleted',
          description: 'The ad has been successfully deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Refetch the data to get updated list
        refetch();
      }
    } catch (error) {
      console.error('Failed to delete ad:', error);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to delete ad.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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
            <Text color={textColor}>Loading ads...</Text>
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
            <Text color="red.500">Error loading ads. Please try again.</Text>
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
            Ads Management
          </Text>

          <HStack spacing={4} w={{ base: "100%", md: "auto" }}>
            {/* Search Input */}
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
                placeholder="Search ads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            {/* Add Ad Button */}
            <Button
              leftIcon={<FaPlus />}
              variant='darkBrand'
              color='white'
              fontSize='sm'
              fontWeight='500'
              borderRadius='70px'
              px='24px'
              py='5px'
              onClick={() => navigate('/admin/add-ad')}
              w={{ base: "100%", md: "200px" }}
            >
              Add New Ad
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
        {(!adsData || adsData.length === 0) && !isLoading && (
          <Flex
            px={{ base: "16px", md: "25px" }}
            py="40px"
            justify="center"
            align="center"
          >
            <Text color={textColor} fontSize="md">
              No ads found with the current search.
            </Text>
          </Flex>
        )}
      </Card>
    </Box>
  );
};

export default Ads;
