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
  Image,
  Avatar,
  HStack,
  VStack,
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
import { FaEye, FaTrash, FaPlay, FaStar, FaList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper();

const Videos = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Static videos data
  const staticData = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      videoLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Natural Healing Tea Preparation',
      description: 'Learn how to prepare effective natural healing teas for common ailments',
      ingredients: [
        { name: 'Fresh Ginger Root', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop' },
        { name: 'Raw Honey', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop' },
        { name: 'Lemon', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=50&h=50&fit=crop' }
      ],
      instructions: [
        { title: 'Boil water', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop' },
        { title: 'Add ginger', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop' },
        { title: 'Strain and serve', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=50&h=50&fit=crop' }
      ],
      benefits: [
        { title: 'Relieves sore throat', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop' },
        { title: 'Boosts immunity', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop' },
        { title: 'Reduces inflammation', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=50&h=50&fit=crop' }
      ],
      reviews: {
        rating: 4.8,
        count: 156,
        comments: [
          { user: 'John D.', rating: 5, comment: 'Excellent video! Very informative and well-explained.' },
          { user: 'Maria S.', rating: 4, comment: 'Great content, learned a lot about natural healing.' }
        ]
      },
      relatedVideos: [2, 3],
             status: 'active',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100&h=100&fit=crop',
      videoLink: 'https://www.youtube.com/watch?v=example2',
      title: 'Essential Oil Massage Techniques',
      description: 'Master the art of therapeutic essential oil massage for relaxation and healing',
      ingredients: [
        { name: 'Lavender Oil', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop' },
        { name: 'Carrier Oil', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop' }
      ],
      instructions: [
        { title: 'Dilute oil', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop' },
        { title: 'Apply to temples', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop' },
        { title: 'Massage gently', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=50&h=50&fit=crop' }
      ],
      benefits: [
        { title: 'Relieves tension', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop' },
        { title: 'Promotes relaxation', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop' }
      ],
      reviews: {
        rating: 4.9,
        count: 89,
        comments: [
          { user: 'Alex K.', rating: 5, comment: 'Incredible massage techniques. Highly recommended!' },
          { user: 'Emma W.', rating: 5, comment: 'Perfect for stress relief.' }
        ]
      },
      relatedVideos: [1, 3],
             status: 'active',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop',
      videoLink: 'https://www.youtube.com/watch?v=example3',
      title: 'Herbal Remedy Preparation Guide',
      description: 'Complete guide to preparing effective herbal remedies at home',
      ingredients: [
        { name: 'Peppermint Oil', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop' },
        { name: 'Gelatin Capsules', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop' }
      ],
      instructions: [
        { title: 'Take with water', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop' },
        { title: 'Before meals', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop' }
      ],
      benefits: [
        { title: 'Relieves bloating', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop' },
        { title: 'Soothes stomach', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop' }
      ],
      reviews: {
        rating: 4.7,
        count: 203,
        comments: [
          { user: 'David L.', rating: 4, comment: 'Great practical guide for herbal remedies.' },
          { user: 'Sophie M.', rating: 5, comment: 'Changed my approach to natural healing!' }
        ]
      },
      relatedVideos: [1, 2],
             status: 'active',
    },
  ];

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return staticData;
    return staticData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

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
          Video
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
      cell: (info) => (
        <HStack spacing={1}>
          <Icon as={FaList} color="green.500" size="sm" />
          <Text color={textColor} fontSize="sm" fontWeight="medium">
            {info.getValue().length} items
          </Text>
        </HStack>
      ),
    }),
    columnHelper.accessor('reviews.rating', {
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
            {info.getValue()}
          </Text>
          <Text color="gray.500" fontSize="xs">
            ({info.row.original.reviews.count})
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
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => handleViewVideo(info.getValue())}
          />
        </Flex>
      ),
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

  const handleViewVideo = (id) => {
    navigate(`/admin/video/details/${id}`);
  };

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
        // In a real app, you would call your API here
        // await api.delete(`/videos/${id}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        Swal.fire(
          'Deleted!',
          'Video has been deleted.',
          'success'
        );

        // Refresh the data or remove from state
        // setVideos(videos.filter(video => video.id !== id));
      } catch (error) {
        console.error('Failed to delete video:', error);
        Swal.fire(
          'Error!',
          'Failed to delete video.',
          'error'
        );
      }
    }
  };

  const handleAddVideo = () => {
    navigate('/admin/add-video');
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
              Videos Management
            </Text>
            <Button
              leftIcon={<PlusSquareIcon />}
              colorScheme="blue"
              onClick={handleAddVideo}
            >
              Add Video
            </Button>
          </Flex>

          <Flex
            align={{ sm: 'flex-start', lg: 'center' }}
            justify="space-between"
            w="100%"
            px="22px"
            pb="20px"
          >
            <InputGroup maxW="400px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
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

export default Videos;
