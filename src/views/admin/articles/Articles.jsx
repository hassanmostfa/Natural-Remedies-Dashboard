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
import { FaEye, FaTrash, FaLeaf, FaList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper();

const Articles = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Static articles data
  const staticData = [
    {
      id: 1,
      title: 'Natural Healing with Herbs',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      description: 'Discover the powerful healing properties of common herbs and how to use them effectively for various ailments.',
      plants: [
        { 
          title: 'Chamomile', 
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop',
          description: 'Calming herb for sleep and digestion'
        },
        { 
          title: 'Lavender', 
          image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop',
          description: 'Relaxing herb for stress relief'
        },
        { 
          title: 'Peppermint', 
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=50&h=50&fit=crop',
          description: 'Refreshing herb for digestion and headaches'
        }
      ],
      status: 'active',
    },
    {
      id: 2,
      title: 'Essential Oils for Wellness',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100&h=100&fit=crop',
      description: 'Learn about the therapeutic benefits of essential oils and how to incorporate them into your daily wellness routine.',
      plants: [
        { 
          title: 'Tea Tree Oil', 
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop',
          description: 'Antibacterial and antifungal properties'
        },
        { 
          title: 'Eucalyptus Oil', 
          image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop',
          description: 'Respiratory support and muscle relief'
        }
      ],
      status: 'active',
    },
    {
      id: 3,
      title: 'Medicinal Plants Guide',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop',
      description: 'A comprehensive guide to medicinal plants, their properties, and traditional uses in natural medicine.',
      plants: [
        { 
          title: 'Aloe Vera', 
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop',
          description: 'Healing gel for skin conditions and burns'
        },
        { 
          title: 'Ginger', 
          image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop',
          description: 'Anti-inflammatory and digestive aid'
        },
        { 
          title: 'Turmeric', 
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=50&h=50&fit=crop',
          description: 'Powerful anti-inflammatory and antioxidant'
        }
      ],
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
            {info.row.original.description}
          </Text>
        </VStack>
      ),
    }),
    
    columnHelper.accessor('plants', {
      id: 'plants',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Plants
        </Text>
      ),
      cell: (info) => (
        <HStack spacing={1}>
          <Icon as={FaList} color="green.500" size="sm" />
          <Text color={textColor} fontSize="sm" fontWeight="medium">
            {info.getValue().length} plants
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
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => handleViewArticle(info.getValue())}
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

  const handleViewArticle = (id) => {
    navigate(`/admin/article/details/${id}`);
  };

  const handleEditArticle = (id) => {
    navigate(`/admin/edit-article/${id}`);
  };

  const handleDeleteArticle = async (id) => {
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
        // await api.delete(`/articles/${id}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        Swal.fire(
          'Deleted!',
          'Article has been deleted.',
          'success'
        );

        // Refresh the data or remove from state
        // setArticles(articles.filter(article => article.id !== id));
      } catch (error) {
        console.error('Failed to delete article:', error);
        Swal.fire(
          'Error!',
          'Failed to delete article.',
          'error'
        );
      }
    }
  };

  const handleAddArticle = () => {
    navigate('/admin/add-article');
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
              Articles Management
            </Text>
            <Button
              leftIcon={<PlusSquareIcon />}
              colorScheme="blue"
              onClick={handleAddArticle}
            >
              Add Article
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
                placeholder="Search articles..."
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

export default Articles;
