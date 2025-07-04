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
import { FaEye, FaTrash, FaLeaf, FaSeedling, FaFlask, FaPills, FaMugHot, FaSprayCan } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper();

const Remedies = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Static remedies data
  const staticData = [
    {
      id: 1,
      disease: 'Common Cold',
      remedyType: 'Herbal Tea',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop',
      title: 'Ginger Honey Tea',
      description: 'A soothing herbal tea to relieve cold symptoms and boost immunity',
      ingredients: [
        { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop', name: 'Fresh Ginger' },
        { image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop', name: 'Raw Honey' },
        { image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=50&h=50&fit=crop', name: 'Lemon' }
      ],
      instructions: [
        { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop', name: 'Boil water' },
        { image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop', name: 'Add ginger' },
        { image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=50&h=50&fit=crop', name: 'Strain and serve' }
      ],
      benefits: [
        { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop', name: 'Relieves sore throat' },
        { image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop', name: 'Boosts immunity' },
        { image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=50&h=50&fit=crop', name: 'Reduces inflammation' }
      ],
      precautions: [
        { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop', name: 'Avoid if allergic to ginger' },
        { image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop', name: 'Not for children under 1' }
      ],
      status: 'active',
    },
    {
      id: 2,
      disease: 'Headache',
      remedyType: 'Essential Oil',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop',
      title: 'Lavender Oil Massage',
      description: 'Natural headache relief using lavender essential oil',
      ingredients: [
        { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop', name: 'Lavender Oil' },
        { image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop', name: 'Carrier Oil' }
      ],
      instructions: [
        { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop', name: 'Dilute oil' },
        { image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop', name: 'Apply to temples' },
        { image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=50&h=50&fit=crop', name: 'Massage gently' }
      ],
      benefits: [
        { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop', name: 'Relieves tension' },
        { image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop', name: 'Promotes relaxation' }
      ],
      precautions: [
        { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop', name: 'Avoid eye contact' },
        { image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop', name: 'Test for allergies' }
      ],
      status: 'active',
    },
    {
      id: 3,
      disease: 'Digestive Issues',
      remedyType: 'Herbal Supplement',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100&h=100&fit=crop',
      title: 'Peppermint Capsules',
      description: 'Natural digestive aid using peppermint extract',
      ingredients: [
        { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop', name: 'Peppermint Oil' },
        { image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop', name: 'Gelatin Capsule' }
      ],
      instructions: [
        { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop', name: 'Take with water' },
        { image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop', name: 'Before meals' }
      ],
      benefits: [
        { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop', name: 'Relieves bloating' },
        { image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop', name: 'Soothes stomach' }
      ],
      precautions: [
        { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop', name: 'Not for GERD patients' },
        { image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop', name: 'Consult doctor if pregnant' }
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
          Title
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontWeight="bold">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('disease', {
      id: 'disease',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Disease
        </Text>
      ),
      cell: (info) => (
        <Badge 
          colorScheme="blue"
          px="2"
          py="1"
          borderRadius="full"
          fontSize="xs"
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('remedyType', {
      id: 'remedyType',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Remedy Type
        </Text>
      ),
      cell: (info) => (
        <Badge 
          colorScheme="green"
          px="2"
          py="1"
          borderRadius="full"
          fontSize="xs"
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('description', {
      id: 'description',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Description
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" maxW="200px" noOfLines={2}>
          {info.getValue()}
        </Text>
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
        <Text color={textColor} fontSize="sm">
          {info.getValue().length} items
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
            onClick={() => handleDeleteRemedy(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => navigate(`/admin/edit-remedy/${info.getValue()}`)}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => navigate(`/admin/remedy/details/${info.getValue()}`)}
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
    debugTable: true,
  });

  // Delete function
  const handleDeleteRemedy = async (id) => {
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
        // In a real app, you would call your API here
        Swal.fire('Deleted!', 'The remedy has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Failed to delete remedy:', error);
      Swal.fire('Error!', 'Failed to delete the remedy.', 'error');
    }
  };

  return (
    <div className="container">
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
            Remedies
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
                bg={useColorModeValue("secondaryGray.300", "gray.700")}
                color={useColorModeValue("gray.700", "white")}
                fontWeight="500"
                _placeholder={{ color: "gray.400", fontSize: "14px" }}
                borderRadius="30px"
                placeholder="Search remedies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            onClick={() => navigate('/admin/add-remedy')}
            width={'200px'}
          >
            Add New Remedy
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
      </Card>
    </div>
  );
};

export default Remedies;
