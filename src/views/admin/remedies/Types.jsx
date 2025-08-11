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
   HStack,
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
 import { FaEye, FaTrash } from 'react-icons/fa';
 import { useNavigate } from 'react-router-dom';
 import Swal from 'sweetalert2';
 import {
   useGetRemedyTypesQuery,
   useDeleteRemedyTypeMutation
 } from 'api/remediesTypesSlice';
 
 const columnHelper = createColumnHelper();
 
 const RemedyTypes = () => {
   const navigate = useNavigate();
   const [sorting, setSorting] = React.useState([]);
   const [searchQuery, setSearchQuery] = React.useState('');
   const [currentPage, setCurrentPage] = React.useState(1);
   const [pageSize, setPageSize] = React.useState(15);
 
   const textColor = useColorModeValue('secondaryGray.900', 'white');
   const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
   const searchBg = useColorModeValue("secondaryGray.300", "gray.700");
   const searchColor = useColorModeValue("gray.700", "white");
 
   // Delete remedy type mutation
   const [deleteRemedyType, { isLoading: isDeleting }] = useDeleteRemedyTypeMutation();
 
   // API call with search and pagination parameters
   const { data: remedyTypesData, isLoading, error, refetch } = useGetRemedyTypesQuery(
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
 
   // Extract remedy types and pagination info from API response
   const { remedyTypes, pagination } = React.useMemo(() => {
     if (remedyTypesData?.success && remedyTypesData?.data) {
       return {
         remedyTypes: remedyTypesData.data,
         pagination: {
           current_page: remedyTypesData.pagination?.current_page || 1,
           last_page: remedyTypesData.pagination?.last_page || 1,
           per_page: remedyTypesData.pagination?.per_page || pageSize,
           total: remedyTypesData.pagination?.total || 0,
           from: remedyTypesData.pagination?.from || 0,
           to: remedyTypesData.pagination?.to || 0,
           has_more_pages: remedyTypesData.pagination?.has_more_pages || false
         }
       };
     }
     return {
       remedyTypes: [],
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
   }, [remedyTypesData, pageSize]);
 
   // Handle search input change
   const handleSearchChange = (e) => {
     setSearchQuery(e.target.value);
     setCurrentPage(1); // Reset to first page when searching
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
         <Text color={textColor} fontWeight="bold">
           {info.getValue()}
         </Text>
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
             cursor={isDeleting ? "not-allowed" : "pointer"}
             opacity={isDeleting ? 0.5 : 1}
             onClick={isDeleting ? undefined : () => handleDeleteRemedyType(info.getValue())}
           />
           <Icon
             w="18px"
             h="18px"
             me="10px"
             color="green.500"
             as={EditIcon}
             cursor="pointer"
             onClick={() => navigate(`/admin/edit-remedy-type/${info.getValue()}`)}
           />
          
         </Flex>
       ),
     }),
   ];
 
   const table = useReactTable({
     data: remedyTypes,
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
   const handleDeleteRemedyType = async (id) => {
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
         await deleteRemedyType(id).unwrap();
         
         // Show success message
         Swal.fire('Deleted!', 'The remedy type has been deleted successfully.', 'success');
         
         // Refetch the remedy types list to update the table
         refetch();
       }
     } catch (error) {
       console.error('Failed to delete remedy type:', error);
       
       let errorMessage = 'Failed to delete the remedy type';
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
           px="0px"
           overflowX={{ sm: 'scroll', lg: 'hidden' }}
         >
           <Flex justify="center" align="center" h="200px">
             <Text color={textColor}>Loading remedy types...</Text>
           </Flex>
         </Card>
       </div>
     );
   }
 
   // Error state
   if (error) {
     return (
       <Box mt={"80px"}>
         <Card
           flexDirection="column"
           w="100%"
           px="0px"
           overflowX={{ sm: 'scroll', lg: 'hidden' }}
         >
           <Flex justify="center" align="center" h="200px">
             <Text color="red.500">Error loading remedy types. Please try again.</Text>
           </Flex>
         </Card>
       </Box>
     );
   }
 
   return (
     <Box mt={"80px"}>
       <Card
         flexDirection="column"
         w="100%"
         px="0px"
         overflowX={{ sm: 'scroll', lg: 'hidden' }}
       >
         <Flex
           px={{ base: "16px", md: "25px" }}
           mb="8px"
           direction={{ base: "column", md: "row" }}
           justifyContent="space-between"
           align={{ base: "stretch", md: "center" }}
           gap={{ base: 4, md: 0 }}
         >
           {/* Title */}
           <Text
             color={textColor}
             fontSize="22px"
             fontWeight="700"
             lineHeight="100%"
           >
             Remedy Types
           </Text>
 
           {/* Search Input */}
           <Box w={{ base: "100%", md: "auto" }}>
             <InputGroup w={{ base: "100%", md: "400px" }}>
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
                 placeholder="Search remedy types..."
                 value={searchQuery}
                 onChange={handleSearchChange}
               />
             </InputGroup>
           </Box>
 
           {/* Button */}
           <Button
             variant="darkBrand"
             color="white"
             fontSize="sm"
             fontWeight="500"
             borderRadius="70px"
             px="24px"
             py="5px"
             onClick={() => navigate('/admin/add-remedy-type')}
             w={{ base: "100%", md: "200px" }}
           >
             Add New Remedy Type
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

         {remedyTypes.length === 0 && (
           <Flex justify="center" align="center" h="100px" px={{ base: "15px", md: "25px" }}>
             <Text color={textColor} fontSize={{ base: "sm", md: "md" }} textAlign="center">
               {searchQuery ? 'No remedy types found matching your search.' : 'No remedy types found.'}
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
 
 export default RemedyTypes;