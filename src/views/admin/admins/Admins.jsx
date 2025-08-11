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
  Spinner,
  Select,
  HStack,
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
import { FaEye, FaTrash } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useGetAdminsQuery, useDeleteAdminMutation } from 'api/adminSlice';

const columnHelper = createColumnHelper();

const Admins = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(15);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const searchBg = useColorModeValue("secondaryGray.300", "gray.700");
  const searchColor = useColorModeValue("gray.700", "white");

  // Delete admin mutation
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  // API call with search and pagination parameters
  const { data: adminsData, isLoading, error, refetch } = useGetAdminsQuery(
    { 
      name: searchQuery,
      page: currentPage,
      per_page: pageSize
    },
    { 
      refetchOnMountOrArgChange: true,
      skip: false
    }
  );

  // Extract admins and pagination info from API response
  const { admins, pagination } = React.useMemo(() => {
    if (adminsData?.success && adminsData?.data) {
      return {
        admins: adminsData.data,
        pagination: {
          current_page: adminsData.pagination?.current_page || 1,
          last_page: adminsData.pagination?.last_page || 1,
          per_page: adminsData.pagination?.per_page || pageSize,
          total: adminsData.pagination?.total || 0,
          from: adminsData.pagination?.from || 0,
          to: adminsData.pagination?.to || 0,
          has_more_pages: adminsData.pagination?.has_more_pages || false
        }
      };
    }
    return {
      admins: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: pageSize,
        total: 0,
        from: 0,
        to: 0,
        has_more_pages: false
      }
    };
  }, [adminsData, pageSize]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };



  // Reset to first page when search query changes
  React.useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  // Debounced search effect
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch();
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentPage, pageSize, refetch]);

  const columns = [
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
        <Flex align="center">
          <Text color={textColor}>
            {info.getValue()}
          </Text>
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
        <Text color={textColor}>
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('phone', {
      id: 'phone',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Phone
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor}>
          {info.getValue()}
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
            cursor={isDeleting ? "not-allowed" : "pointer"}
            opacity={isDeleting ? 0.5 : 1}
            onClick={isDeleting ? undefined : () => handleDeleteAdmin(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => navigate(`/admin/edit-admin/${info.getValue()}`)}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => navigate(`/admin/admin/details/${info.getValue()}`)}
          />
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: admins,
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
  const handleDeleteAdmin = async (id) => {
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
        // Call the delete API
        await deleteAdmin(id).unwrap();
        
        // Show success message
        Swal.fire('Deleted!', 'The admin has been deleted successfully.', 'success');
        
        // Refetch the admins list to update the table
        refetch();
      }
    } catch (error) {
      console.error('Failed to delete admin:', error);
      
      let errorMessage = 'Failed to delete the admin';
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      
      Swal.fire('Error!', errorMessage, 'error');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container">
        <Card
          flexDirection="column"
          w="100%"
          px={{ base: "0px", md: "0px" }}
          overflowX={{ base: 'auto', sm: 'scroll', lg: 'hidden' }}
        >
          <Flex justify="center" align="center" h="200px">
            <Spinner size="lg" color="brand.500" />
            <Text ml="4" color={textColor}>Loading admins...</Text>
          </Flex>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container">
        <Card
          flexDirection="column"
          w="100%"
          px={{ base: "0px", md: "0px" }}
          overflowX={{ base: 'auto', sm: 'scroll', lg: 'hidden' }}
        >
          <Flex justify="center" align="center" h="200px">
            <Text color="red.500">Error loading admins. Please try again.</Text>
          </Flex>
        </Card>
      </div>
    );
  }

  return (
    <Box mt={"80px"}>
      <Card
        flexDirection="column"
        w="100%"
        px={{ base: "0px", md: "0px" }}
        overflowX={{ base: 'auto', sm: 'scroll', lg: 'hidden' }}
      >
                 <Flex 
           px={{ base: "15px", md: "25px" }} 
           mb="8px" 
           flexDirection={{ base: "column", md: "row" }}
           justifyContent="space-between" 
           align={{ base: "stretch", md: "center" }}
           gap={{ base: "15px", md: "0" }}
         >
           <Text
             color={textColor}
             fontSize={{ base: "18px", md: "22px" }}
             fontWeight="700"
             lineHeight="100%"
             textAlign={{ base: "center", md: "left" }}
           >
             Admins
           </Text>
           <Flex 
             direction={{ base: "column", md: "row" }}
             gap={{ base: "10px", md: "15px" }}
             w={{ base: "100%", md: "auto" }}
           >
             <InputGroup w={{ base: "100%", md: "250px" }}>
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
                   icon={<SearchIcon w={{ base: "12px", md: "15px" }} h={{ base: "12px", md: "15px" }} />}
                 />
               </InputLeftElement>
               <Input
                 variant="search"
                 fontSize={{ base: "12px", md: "sm" }}
                 bg={searchBg}
                 color={searchColor}
                 fontWeight="500"
                 _placeholder={{ color: "gray.400", fontSize: { base: "12px", md: "14px" } }}
                 borderRadius="30px"
                 placeholder="Search by name..."
                 value={searchQuery}
                 onChange={handleSearchChange}
               />
             </InputGroup>
             <Button
               variant='darkBrand'
               color='white'
               fontSize={{ base: "xs", md: "sm" }}
               fontWeight='500'
               borderRadius='70px'
               px={{ base: "16px", md: "24px" }}
               py='5px'
               onClick={() => navigate('/admin/add-admin')}
               width={{ base: "100%", md: "200px" }}
             >
               Create New Admin
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
                                 {admins.length === 0 && (
          <Flex justify="center" align="center" h="100px" px={{ base: "15px", md: "25px" }}>
            <Text color={textColor} fontSize={{ base: "sm", md: "md" }} textAlign="center">
              {searchQuery ? 'No admins found matching your search.' : 'No admins found.'}
            </Text>
          </Flex>
        )}

        {/* Pagination Controls */}
        {pagination.total > 0 && (
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
              Showing {pagination.from} to {pagination.to} of {pagination.total} results
            </Text>

            {/* Pagination Controls */}
            <HStack spacing="3">
              {/* Page Size Selector */}
              <HStack spacing="2">
                <Text fontSize="sm" color={textColor}>
                  Show:
                </Text>
                <Select
                  size="sm"
                  value={pageSize}
                  onChange={handlePageSizeChange}
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

              {/* Page Navigation */}
              <HStack spacing="2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  isDisabled={pagination.current_page <= 1}
                  leftIcon={<ChevronLeftIcon />}
                >
                  Previous
                </Button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                  const pageNum = i + 1;
                  const isCurrentPage = pageNum === pagination.current_page;
                  
                  return (
                    <Button
                      key={pageNum}
                      size="sm"
                      variant={isCurrentPage ? "solid" : "outline"}
                      colorScheme={isCurrentPage ? "blue" : "gray"}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
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

export default Admins;