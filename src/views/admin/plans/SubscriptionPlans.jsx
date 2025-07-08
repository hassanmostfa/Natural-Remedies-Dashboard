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
import { FaEye, FaTrash, FaCrown, FaAward, FaSeedling, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const columnHelper = createColumnHelper();

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Static subscription transactions data
  const staticData = [
    {
      id: 1,
      user: {
        name: 'Ahmed Hassan',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        email: 'ahmed.h@example.com'
      },
      plan: {
        name: 'Skilled',
        price: '$9.99',
        period: 'monthly',
        icon: FaAward,
        colorScheme: 'blue'
      },
      subscriptionDate: '2024-01-15T10:30:00Z',
      expirationDate: '2024-02-15T10:30:00Z',
      status: 'active',
      paymentMethod: 'Credit Card',
      amount: '$9.99',
      autoRenew: true,
    },
    {
      id: 2,
      user: {
        name: 'Fatima Mahmoud',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        email: 'fatima.m@example.com'
      },
      plan: {
        name: 'Master',
        price: '$29.99',
        period: 'yearly',
        icon: FaCrown,
        colorScheme: 'purple'
      },
      subscriptionDate: '2024-01-10T14:20:00Z',
      expirationDate: '2025-01-10T14:20:00Z',
      status: 'active',
      paymentMethod: 'PayPal',
      amount: '$249.00',
      autoRenew: true,
    },
    {
      id: 3,
      user: {
        name: 'Omar Khalid',
        image: 'https://randomuser.me/api/portraits/men/75.jpg',
        email: 'omar.k@example.com'
      },
      plan: {
        name: 'Rookie',
        price: '$0',
        period: 'lifetime',
        icon: FaSeedling,
        colorScheme: 'green'
      },
      subscriptionDate: '2024-01-05T09:15:00Z',
      expirationDate: null,
      status: 'active',
      paymentMethod: 'Free',
      amount: '$0.00',
      autoRenew: false,
    },
    {
      id: 4,
      user: {
        name: 'Sarah Johnson',
        image: 'https://randomuser.me/api/portraits/women/63.jpg',
        email: 'sarah.j@example.com'
      },
      plan: {
        name: 'Skilled',
        price: '$9.99',
        period: 'monthly',
        icon: FaAward,
        colorScheme: 'blue'
      },
      subscriptionDate: '2023-12-20T16:45:00Z',
      expirationDate: '2024-01-20T16:45:00Z',
      status: 'expired',
      paymentMethod: 'Credit Card',
      amount: '$9.99',
      autoRenew: false,
    },
    {
      id: 5,
      user: {
        name: 'Mohammed Ali',
        image: 'https://randomuser.me/api/portraits/men/81.jpg',
        email: 'mohammed.ali@example.com'
      },
      plan: {
        name: 'Master',
        price: '$29.99',
        period: 'yearly',
        icon: FaCrown,
        colorScheme: 'purple'
      },
      subscriptionDate: '2024-01-12T11:30:00Z',
      expirationDate: '2025-01-12T11:30:00Z',
      status: 'active',
      paymentMethod: 'Credit Card',
      amount: '$249.00',
      autoRenew: true,
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
    columnHelper.accessor('plan.name', {
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
        const plan = info.row.original.plan;
        return (
          <HStack spacing={2}>
            <Icon as={plan.icon} color={`${plan.colorScheme}.500`} boxSize="16px" />
            <VStack align="start" spacing={0}>
              <Text color={textColor} fontWeight="bold" fontSize="sm">
                {plan.name}
              </Text>
              <Text color="gray.500" fontSize="xs">
                {plan.price} / {plan.period}
              </Text>
            </VStack>
          </HStack>
        );
      },
    }),
    columnHelper.accessor('subscriptionDate', {
      id: 'subscriptionDate',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Subscription Date
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {new Date(info.getValue()).toLocaleDateString()}
        </Text>
      ),
    }),
    columnHelper.accessor('expirationDate', {
      id: 'expirationDate',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Expiration Date
        </Text>
      ),
      cell: (info) => {
        const date = info.getValue();
        if (!date) {
          return <Badge colorScheme="green" fontSize="xs">Lifetime</Badge>;
        }
        const expirationDate = new Date(date);
        const now = new Date();
        const isExpired = expirationDate < now;
        const daysLeft = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));
        
        return (
          <VStack align="start" spacing={0}>
            <Text color={textColor} fontSize="sm">
              {expirationDate.toLocaleDateString()}
            </Text>
            {!isExpired && (
              <Text 
                color={daysLeft <= 7 ? 'red.500' : daysLeft <= 30 ? 'orange.500' : 'green.500'} 
                fontSize="xs"
              >
                {daysLeft} days left
              </Text>
            )}
          </VStack>
        );
      },
    }),
    columnHelper.accessor('amount', {
      id: 'amount',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Amount
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontWeight="bold" fontSize="sm">
          {info.getValue()}
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
            onClick={() => handleDeleteSubscription(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => handleEditSubscription(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => handleViewSubscription(info.getValue())}
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

  const handleViewSubscription = (id) => {
    navigate(`/admin/subscription/details/${id}`);
  };

  const handleEditSubscription = (id) => {
    navigate(`/admin/edit-subscription/${id}`);
  };

  const handleDeleteSubscription = async (id) => {
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
        // await api.delete(`/subscriptions/${id}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        Swal.fire(
          'Deleted!',
          'Subscription has been deleted.',
          'success'
        );

        // Refresh the data or remove from state
        // setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      } catch (error) {
        console.error('Failed to delete subscription:', error);
        Swal.fire(
          'Error!',
          'Failed to delete subscription.',
          'error'
        );
      }
    }
  };

  const handleExportSubscriptions = () => {
    try {
      const filename = `subscriptions_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Prepare data for export
      const exportData = filteredData.map(sub => ({
        'User Name': sub.user.name,
        'Email': sub.user.email,
        'Plan': sub.plan.name,
        'Plan Price': sub.plan.price,
        'Plan Period': sub.plan.period,
        'Subscription Date': new Date(sub.subscriptionDate).toLocaleDateString(),
        'Expiration Date': sub.expirationDate ? new Date(sub.expirationDate).toLocaleDateString() : 'Lifetime',
        'Amount Paid': sub.amount,
        'Status': sub.status,
        'Auto Renew': sub.autoRenew ? 'Yes' : 'No',
        'Payment Method': sub.paymentMethod,
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Subscriptions');

      // Generate Excel file and download
      XLSX.writeFile(workbook, filename);
      
      Swal.fire({
        title: 'Success!',
        text: 'Subscriptions data has been exported successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Failed to export subscriptions:', error);
      Swal.fire('Error!', 'Failed to export subscriptions data.', 'error');
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
              Subscription Transactions
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
                placeholder="Search subscriptions..."
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
              <option value="active">Active</option>
              <option value="expired">Expired</option>
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

export default SubscriptionPlans;