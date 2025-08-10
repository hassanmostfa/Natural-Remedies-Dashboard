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
  Badge,
  Avatar,
  HStack,
  VStack,
  Select,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { useEffect } from 'react';
import Card from 'components/card/Card';
import { EditIcon, PlusSquareIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaTrash, FaPlay, FaStar, FaList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useGetVideosQuery, useDeleteVideoMutation } from 'api/videosSlice';

const columnHelper = createColumnHelper();

const Videos = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(15);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const searchBg = useColorModeValue('secondaryGray.300', 'gray.700');
  const searchColor = useColorModeValue('gray.700', 'white');

  // Fetch videos from API with search + pagination
  const { data, isLoading, isFetching, refetch } = useGetVideosQuery({ search: searchQuery, page: currentPage, per_page: perPage }, { refetchOnMountOrArgChange: true });
  const [deleteVideo] = useDeleteVideoMutation();
  const videos = data?.data || [];
  const pagination = data?.pagination || null;


  useEffect(() =>{
    refetch();
  }, [refetch])

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
      cell: (info) => {
        const imageUrl = info.getValue();
        return (
          <Avatar
            src={imageUrl}
            size="md"
            borderRadius="lg"
            fallback={<Icon as={FaPlay} color="blue.500" />}
          />
        );
      },
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
          Video
        </Text>
      ),
      cell: (info) => (
        <VStack align="start" spacing={1}>
          <Text color={textColor} fontWeight="bold" fontSize="sm">
            {info.getValue() || 'No Title'}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={2}>
            {info.row.original.description || 'No description available'}
          </Text>
        </VStack>
      ),
    }),
    columnHelper.accessor('ingredients', {
      id: 'ingredients',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Ingredients
        </Text>
      ),
      cell: (info) => {
        const ingredients = info.getValue();
        const count = Array.isArray(ingredients) ? ingredients.length : 0;
        return (
          <HStack spacing={1}>
            <Icon as={FaList} color="green.500" size="sm" />
            <Text color={textColor} fontSize="sm" fontWeight="medium">
              {count} items
            </Text>
          </HStack>
        );
      },
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
      cell: (info) => {
        const rating = info.getValue() || 0;
        const reviewCount = info.row.original.review_count || 0;
        return (
          <HStack spacing={1}>
            <Icon as={FaStar} color="yellow.400" size="sm" />
            <Text color={textColor} fontSize="sm" fontWeight="medium">
              {rating}
            </Text>
            <Text color="gray.500" fontSize="xs">
              ({reviewCount})
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
      cell: (info) => {
        const status = info.getValue() || 'inactive';
        return (
          <Badge
            colorScheme={status === 'active' ? 'green' : 'red'}
            px="2"
            py="1"
            borderRadius="full"
            fontSize="xs"
          >
            {status}
          </Badge>
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
        <Flex align="center">
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="red.500"
            as={FaTrash}
            cursor="pointer"
            onClick={() => handleDeleteVideo(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => handleEditVideo(info.getValue())}
          />
          {/* View icon can be added here if needed */}
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: videos,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleEditVideo = (id) => {
    navigate(`/admin/edit-video/${id}`);
  };

  const handleDeleteVideo = async (id) => {
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
        await deleteVideo(id).unwrap();
        Swal.fire('Deleted!', 'Video has been deleted.', 'success');
        refetch();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete video.', 'error');
      }
    }
  };

  const handleAddVideo = () => {
    navigate('/admin/add-video');
  };

  if (isLoading) {
    return (
      <Box mt="80px">
        <Card>
          <Text color={textColor} p={8}>Loading videos...</Text>
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
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Videos
          </Text>
          <div className="search-container d-flex align-items-center gap-2">
            <InputGroup w={{ base: "100", md: "400px" }}>
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
                placeholder="Search videos..."
                value={searchQuery}
                 onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </InputGroup>
          </div>
          <Button
            variant='darkBrand'
            color='white'
            fontSize='sm'
            fontWeight='500'
            borderRadius='70px'
            px='24px'
            py='5px'
            onClick={handleAddVideo}
            width={'200px'}
          >
            Add New Video
          </Button>
        </Flex>
        
        <Box>
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
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
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()] ?? null}
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
            <Text color={textColor} fontSize="sm">
              Showing {pagination.from} to {pagination.to} of {pagination.total} results
            </Text>
            <HStack spacing="3">
              <HStack spacing="2">
                <Text fontSize="sm" color={textColor}>Show:</Text>
                <Select
                  size="sm"
                  value={perPage}
                  onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
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
              <HStack spacing="2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  isDisabled={pagination.current_page <= 1}
                  leftIcon={<ChevronLeftIcon />}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                  const pageNum = i + 1;
                  const isCurrent = pageNum === (pagination.current_page || currentPage);
                  return (
                    <Button
                      key={pageNum}
                      size="sm"
                      variant={isCurrent ? 'solid' : 'outline'}
                      colorScheme={isCurrent ? 'blue' : 'gray'}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, pagination.last_page))}
                  isDisabled={pagination.current_page >= pagination.last_page}
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

export default Videos;