import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Card,
  Icon,
  Badge,
  Select,
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
import { useNavigate } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaSave, FaEdit, FaEye, FaTrash, FaSearch, FaReply } from 'react-icons/fa';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper();

const ContactUs = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Static contact messages data
  const staticData = [
    {
      id: 1,
      user: {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
      },
      subject: 'Question about herbal remedies',
      message: 'Hi, I have a question about the ginger tea remedy for colds. Can you tell me more about the dosage and how long I should take it?',
      status: 'unread',
      priority: 'medium',
      date: '2024-01-15T10:30:00Z',
      category: 'general'
    },
    {
      id: 2,
      user: {
        name: 'Mohammed Ali',
        email: 'mohammed.ali@example.com',
        phone: '+1 (555) 987-6543',
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
      },
      subject: 'Allergy to chamomile tea',
      message: 'I tried the chamomile tea for sleep but I think I might be allergic. I got a rash after drinking it. What should I do?',
      status: 'read',
      priority: 'high',
      date: '2024-01-14T16:45:00Z',
      category: 'medical'
    },
    {
      id: 3,
      user: {
        name: 'Emily Chen',
        email: 'emily.chen@example.com',
        phone: '+1 (555) 456-7890',
        avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
      },
      subject: 'Subscription inquiry',
      message: 'I would like to upgrade my subscription to the premium plan. Can you help me with the process?',
      status: 'replied',
      priority: 'low',
      date: '2024-01-13T09:15:00Z',
      category: 'billing'
    },
    {
      id: 4,
      user: {
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        phone: '+1 (555) 321-0987',
        avatar: 'https://randomuser.me/api/portraits/men/89.jpg'
      },
      subject: 'App not working properly',
      message: 'The app keeps crashing when I try to view the remedies. I\'ve tried restarting it but the issue persists.',
      status: 'unread',
      priority: 'high',
      date: '2024-01-12T14:20:00Z',
      category: 'technical'
    },
    {
      id: 5,
      user: {
        name: 'Lisa Rodriguez',
        email: 'lisa.rodriguez@example.com',
        phone: '+1 (555) 654-3210',
        avatar: 'https://randomuser.me/api/portraits/women/23.jpg'
      },
      subject: 'Thank you for the help',
      message: 'The lavender oil remedy worked perfectly for my headache. Thank you so much for the recommendation!',
      status: 'replied',
      priority: 'low',
      date: '2024-01-11T11:30:00Z',
      category: 'feedback'
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

  const handleViewMessage = (id) => {
    navigate(`/admin/message/details/${id}`);
  };

  const handleReplyMessage = (id) => {
    navigate(`/admin/message/reply/${id}`);
  };

  const handleDeleteMessage = async (id) => {
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
        // await api.delete(`/messages/${id}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        Swal.fire(
          'Deleted!',
          'Message has been deleted.',
          'success'
        );

        // Refresh the data or remove from state
        // setMessages(messages.filter(msg => msg.id !== id));
      } catch (error) {
        console.error('Failed to delete message:', error);
        Swal.fire(
          'Error!',
          'Failed to delete message.',
          'error'
        );
      }
    }
  };

  const columns = [
    columnHelper.accessor('user.name', {
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
            src={info.row.original.user.avatar}
            size="sm"
            name={info.getValue()}
          />
          <VStack align="start" spacing={0}>
            <Text color={textColor} fontWeight="bold" fontSize="sm">
              {info.getValue()}
            </Text>
            <Text color="gray.500" fontSize="xs">
              {info.row.original.user.email}
            </Text>
          </VStack>
        </HStack>
      ),
    }),
    columnHelper.accessor('subject', {
      id: 'subject',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Subject
        </Text>
      ),
      cell: (info) => (
        <VStack align="start" spacing={1}>
          <Text color={textColor} fontWeight="bold" fontSize="sm">
            {info.getValue()}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={2}>
            {info.row.original.message}
          </Text>
        </VStack>
      ),
    }),
    columnHelper.accessor('priority', {
      id: 'priority',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Priority
        </Text>
      ),
      cell: (info) => {
        const priorityColors = {
          high: 'red',
          medium: 'orange',
          low: 'green'
        };
        
        return (
          <Badge 
            colorScheme={priorityColors[info.getValue()] || 'gray'}
            px="2"
            py="1"
            borderRadius="full"
            fontSize="xs"
            textTransform="capitalize"
          >
            {info.getValue()}
          </Badge>
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
        const statusColors = {
          unread: 'red',
          read: 'blue',
          replied: 'green'
        };
        
        return (
          <Badge 
            colorScheme={statusColors[info.getValue()] || 'gray'}
            px="2"
            py="1"
            borderRadius="full"
            fontSize="xs"
            textTransform="capitalize"
          >
            {info.getValue()}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('date', {
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
            onClick={() => handleDeleteMessage(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => handleViewMessage(info.getValue())}
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
              Contact Messages
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
                <FaSearch color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search messages..."
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
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
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

export default ContactUs;
