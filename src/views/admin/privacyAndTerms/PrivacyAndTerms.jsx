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
import { FaEye, FaTrash, FaShieldAlt, FaFileContract } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper();

const PrivacyAndTerms = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Static Privacy and Terms data
  const staticData = [
    {
      id: 1,
      title: 'Privacy Policy',
      type: 'privacy',
      status: 'active',
      lastUpdated: '2024-01-15',
      content: 'This Privacy Policy describes how we collect, use, and protect your personal information when you use our natural remedies application...',
    },
    {
      id: 2,
      title: 'Terms of Service',
      type: 'terms',
      status: 'active',
      lastUpdated: '2024-01-15',
      content: 'By using our natural remedies application, you agree to these terms and conditions. Please read them carefully before using our services...',
    },
    {
      id: 3,
      title: 'Cookie Policy',
      type: 'privacy',
      status: 'active',
      lastUpdated: '2024-02-01',
      content: 'This Cookie Policy explains how we use cookies and similar technologies to provide, customize, evaluate, improve, promote and protect our services...',
    },
    {
      id: 4,
      title: 'User Agreement',
      type: 'terms',
      status: 'inactive',
      lastUpdated: '2024-01-20',
      content: 'This User Agreement outlines the terms and conditions for using our natural remedies platform, including user responsibilities and platform rules...',
    },
    {
      id: 5,
      title: 'Data Protection Policy',
      type: 'privacy',
      status: 'active',
      lastUpdated: '2024-01-10',
      content: 'Our Data Protection Policy ensures that your personal data is processed in accordance with applicable data protection laws and regulations...',
    },
    {
      id: 6,
      title: 'Refund Policy',
      type: 'terms',
      status: 'active',
      lastUpdated: '2024-01-05',
      content: 'This Refund Policy outlines the conditions under which users may be eligible for refunds for subscription services and digital content...',
    },
  ];

  // Filter data based on search query and type filter
  const filteredData = React.useMemo(() => {
    let filtered = staticData;
    
    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
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
  }, [searchQuery, typeFilter]);

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
          {info.getValue()}
        </Text>
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
          <Text color="gray.500" fontSize="xs" noOfLines={2}>
            {info.row.original.content}
          </Text>
        </VStack>
      ),
    }),
    
    columnHelper.accessor('type', {
      id: 'type',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Type
        </Text>
      ),
      cell: (info) => {
        const typeColors = {
          privacy: 'blue',
          terms: 'green'
        };
        
        const typeIcons = {
          privacy: FaShieldAlt,
          terms: FaFileContract
        };
        
        return (
          <HStack spacing={2}>
            <Icon as={typeIcons[info.getValue()]} color={`${typeColors[info.getValue()]}.500`} />
            <Badge 
              colorScheme={typeColors[info.getValue()] || 'gray'}
              px="2"
              py="1"
              borderRadius="full"
              fontSize="xs"
              textTransform="capitalize"
            >
              {info.getValue()}
            </Badge>
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
    
    columnHelper.accessor('lastUpdated', {
      id: 'lastUpdated',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Last Updated
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {new Date(info.getValue()).toLocaleDateString()}
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
      cell: (info) => (
        <Flex align="center">
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="red.500"
            as={FaTrash}
            cursor="pointer"
            onClick={() => handleDeletePolicy(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => handleEditPolicy(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => handleViewPolicy(info.getValue())}
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

  const handleViewPolicy = (id) => {
    navigate(`/admin/policy/details/${id}`);
  };

  const handleEditPolicy = (id) => {
    navigate(`/admin/edit-policy/${id}`);
  };

  const handleDeletePolicy = async (id) => {
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
        // await api.delete(`/policies/${id}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        Swal.fire(
          'Deleted!',
          'Policy has been deleted.',
          'success'
        );

        // Refresh the data or remove from state
        // setPolicies(policies.filter(policy => policy.id !== id));
      } catch (error) {
        console.error('Failed to delete policy:', error);
        Swal.fire(
          'Error!',
          'Failed to delete policy.',
          'error'
        );
      }
    }
  };

  const handleAddPolicy = () => {
    navigate('/admin/add-policy');
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
              Privacy & Terms Management
            </Text>
            <Button
              leftIcon={<PlusSquareIcon />}
              colorScheme="blue"
              onClick={handleAddPolicy}
            >
              Add Policy
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
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Select
              maxW="200px"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="privacy">Privacy</option>
              <option value="terms">Terms</option>
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

export default PrivacyAndTerms;
