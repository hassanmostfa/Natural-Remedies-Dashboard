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
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import { FaEye, FaTrash, FaDownload } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

// Function to export data to Excel
const exportToExcel = (data, filename) => {
  // Prepare data for export
  const exportData = data.map(user => ({
    'ID': user.id,
    'Name': user.name,
    'Email': user.email,
    'Subscription Plan': user.subscriptionPlan,
    'Status': user.status
  }));

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

  // Generate Excel file and download
  XLSX.writeFile(workbook, filename);
};

const columnHelper = createColumnHelper();

const Users = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Static user data
  const staticUsers = [
    {
      id: 1,
      name: 'Mohammed Ali',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      email: 'mohammed.ali@example.com',
      subscriptionPlan: 'Premium',
      status: 'active',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      email: 'sarah.j@example.com',
      subscriptionPlan: 'Basic',
      status: 'active',
    },
    {
      id: 3,
      name: 'Ahmed Hassan',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      email: 'ahmed.h@example.com',
      subscriptionPlan: 'Pro',
      status: 'expired',
    },
    {
      id: 4,
      name: 'Fatima Mahmoud',
      image: 'https://randomuser.me/api/portraits/women/63.jpg',
      email: 'fatima.m@example.com',
      subscriptionPlan: 'Basic',
      status: 'active',
    },
    {
      id: 5,
      name: 'Omar Khalid',
      image: 'https://randomuser.me/api/portraits/men/81.jpg',
      email: 'omar.k@example.com',
      subscriptionPlan: 'Premium',
      status: 'suspended',
    },
  ];

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return staticUsers;
    return staticUsers.filter((user) =>
      Object.values(user).some((value) =>
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
          Photo
        </Text>
      ),
      cell: (info) => (
        <Image
          src={info.getValue()}
          borderRadius="full"
          boxSize="40px"
          objectFit="cover"
          alt="User"
        />
      ),
    }),
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Name
        </Text>
      ),
      cell: (info) => (
        <Flex direction="column">
          <Text color={textColor} fontWeight="bold">
            {info.getValue()}
          </Text>
          <Badge 
            colorScheme={
              info.row.original.status === 'active' ? 'green' : 
              info.row.original.status === 'expired' ? 'orange' : 'red'
            }
            width="fit-content"
            mt="1"
          >
            {info.row.original.status}
          </Badge>
        </Flex>
      ),
    }),
    columnHelper.accessor('email', {
      id: 'email',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Email
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('subscriptionPlan', {
      id: 'subscription',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Subscription Plan
        </Text>
      ),
      cell: (info) => (
        <Badge
          colorScheme={
            info.getValue() === 'Premium' ? 'purple' : 
            info.getValue() === 'Pro' ? 'blue' : 'gray'
          }
          px="3"
          py="1"
          borderRadius="full"
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
            onClick={() => handleDeleteUser(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => navigate(`/admin/edit-user/${info.getValue()}`)}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => navigate(`/admin/user/${info.getValue()}`)}
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
  const handleDeleteUser = async (id) => {
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
        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      Swal.fire('Error!', 'Failed to delete the user.', 'error');
    }
  };

  // Export function
  const handleExportUsers = () => {
    try {
      const filename = `users_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      exportToExcel(filteredData, filename);
      
      Swal.fire({
        title: 'Success!',
        text: 'Users data has been exported successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Failed to export users:', error);
      Swal.fire('Error!', 'Failed to export users data.', 'error');
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
            Users Management
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
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </div>
          <Flex gap={3}>
            <Button
              leftIcon={<FaDownload />}
              variant='outline'
              colorScheme='green'
              fontSize='sm'
              fontWeight='500'
              borderRadius='70px'
              px='24px'
              py='5px'
              onClick={handleExportUsers}
              width={'180px'}
            >
              Export Excel
            </Button>
            <Button
              variant='darkBrand'
              color='white'
              fontSize='sm'
              fontWeight='500'
              borderRadius='70px'
              px='24px'
              py='5px'
              onClick={() => navigate('/admin/add-user')}
              width={'200px'}
            >
              Add New User
            </Button>
          </Flex>
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

export default Users;