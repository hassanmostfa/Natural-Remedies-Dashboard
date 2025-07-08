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
  HStack,
  VStack,
  Badge,
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
import Card from 'components/card/Card';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, PlusSquareIcon, SearchIcon } from '@chakra-ui/icons';
import { FaEye, FaTrash, FaQuestion, FaList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper();

const Faqs = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Static FAQs data
  const staticData = [
    {
      id: 1,
      question: 'How do I use natural remedies safely?',
      answer: 'Always consult with a healthcare professional before trying new remedies, especially if you have existing health conditions or are taking medications. Start with small doses and monitor your body\'s response.',
      category: 'safety',
      status: 'active',
      order: 1,
    },
    {
      id: 2,
      question: 'What are the benefits of herbal teas?',
      answer: 'Herbal teas offer various benefits including improved digestion, better sleep, stress relief, and immune system support. Different herbs have different properties, so choose based on your specific needs.',
      category: 'benefits',
      status: 'active',
      order: 2,
    },
    {
      id: 3,
      question: 'How long does it take for natural remedies to work?',
      answer: 'The effectiveness timeline varies depending on the remedy and individual factors. Some remedies like peppermint for digestion work within minutes, while others may take days or weeks for full benefits.',
      category: 'usage',
      status: 'active',
      order: 3,
    },
    {
      id: 4,
      question: 'Can I use natural remedies during pregnancy?',
      answer: 'Many natural remedies are not recommended during pregnancy. Always consult with your healthcare provider before using any herbs, supplements, or natural treatments while pregnant or breastfeeding.',
      category: 'safety',
      status: 'active',
      order: 4,
    },
    {
      id: 5,
      question: 'What\'s the difference between essential oils and herbal extracts?',
      answer: 'Essential oils are concentrated volatile compounds extracted from plants, while herbal extracts contain a broader range of plant compounds. Essential oils are typically used in aromatherapy, while extracts are often taken internally.',
      category: 'education',
      status: 'active',
      order: 5,
    },
    {
      id: 6,
      question: 'How do I store natural remedies properly?',
      answer: 'Store herbs and natural remedies in cool, dry places away from direct sunlight. Use airtight containers and check expiration dates. Essential oils should be stored in dark glass bottles in a cool location.',
      category: 'storage',
      status: 'inactive',
      order: 6,
    },
  ];

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    let filtered = staticData;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    return filtered;
  }, [searchQuery]);

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
          #
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontWeight="bold" fontSize="sm">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('question', {
      id: 'question',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Question
        </Text>
      ),
      cell: (info) => (
        <VStack align="start" spacing={1}>
          <Text color={textColor} fontWeight="bold" fontSize="sm">
            {info.getValue()}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={2}>
            {info.row.original.answer}
          </Text>
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
            onClick={() => handleDeleteFaq(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => handleEditFaq(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => handleViewFaq(info.getValue())}
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

  const handleViewFaq = (id) => {
    navigate(`/admin/faq/details/${id}`);
  };

  const handleEditFaq = (id) => {
    navigate(`/admin/edit-faq/${id}`);
  };

  const handleDeleteFaq = async (id) => {
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
        // await api.delete(`/faqs/${id}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        Swal.fire(
          'Deleted!',
          'FAQ has been deleted.',
          'success'
        );

        // Refresh the data or remove from state
        // setFaqs(faqs.filter(faq => faq.id !== id));
      } catch (error) {
        console.error('Failed to delete FAQ:', error);
        Swal.fire(
          'Error!',
          'Failed to delete FAQ.',
          'error'
        );
      }
    }
  };

  const handleAddFaq = () => {
    navigate('/admin/add-faq');
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
              FAQs Management
            </Text>
            <Button
              leftIcon={<PlusSquareIcon />}
              colorScheme="blue"
              onClick={handleAddFaq}
            >
              Add FAQ
            </Button>
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
                placeholder="Search FAQs..."
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

export default Faqs;
