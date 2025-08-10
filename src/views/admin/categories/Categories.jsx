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
   import { useGetBodySystemsQuery, useDeleteBodySystemMutation } from 'api/bodySystemsSlice';

   const columnHelper = createColumnHelper();

   const Categories = () => {
   const navigate = useNavigate();
   const [sorting, setSorting] = React.useState([]);
   const [searchQuery, setSearchQuery] = React.useState('');

   const textColor = useColorModeValue('secondaryGray.900', 'white');
   const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
   const searchBg = useColorModeValue("secondaryGray.300", "gray.700");
   const searchColor = useColorModeValue("gray.700", "white");

   // Delete body system mutation
   const [deleteBodySystem, { isLoading: isDeleting }] = useDeleteBodySystemMutation();

   // API call with search parameters
   const { data: bodySystemsData, isLoading, error, refetch } = useGetBodySystemsQuery(
     { title: searchQuery },
     { 
       refetchOnMountOrArgChange: true,
       pollingInterval: 30000 // Refetch every 30 seconds
     }
   );

   // Extract body systems from API response
   const bodySystems = React.useMemo(() => {
     if (bodySystemsData?.data) {
       return bodySystemsData.data;
     }
     return [];
   }, [bodySystemsData]);

 

   // Handle search input change
   const handleSearchChange = (e) => {
     setSearchQuery(e.target.value);
   };

   // Debounced search effect
   React.useEffect(() => {
     const timeoutId = setTimeout(() => {
       refetch();
     }, 500); // Debounce search by 500ms

     return () => clearTimeout(timeoutId);
   }, [searchQuery, refetch]);

   const columns = [
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
               onClick={isDeleting ? undefined : () => handleDeleteCategory(info.getValue())}
            />
            <Icon
               w="18px"
               h="18px"
               me="10px"
               color="green.500"
               as={EditIcon}
               cursor="pointer"
               onClick={() => navigate(`/admin/edit-body-system/${info.getValue()}`)}
            />
         </Flex>
         ),
      }),
   ];

   const table = useReactTable({
      data: bodySystems,
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
   const handleDeleteCategory = async (id) => {
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
           await deleteBodySystem(id).unwrap();
           
           // Show success message
           Swal.fire('Deleted!', 'The body system has been deleted successfully.', 'success');
           
           // Refetch the body systems list to update the table
           refetch();
         }
      } catch (error) {
         console.error('Failed to delete body system:', error);
         
         let errorMessage = 'Failed to delete the body system';
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
             <Text color={textColor}>Loading body systems...</Text>
           </Flex>
         </Card>
       </div>
     );
   }

   // Error state
   if (error) {
     return (
       <Box  mt={"80px"}>
         <Card
           flexDirection="column"
           w="100%"
           px="0px"
           overflowX={{ sm: 'scroll', lg: 'hidden' }}
         >
           <Flex justify="center" align="center" h="200px">
             <Text color="red.500">Error loading body systems. Please try again.</Text>
           </Flex>
         </Card>
       </Box>
     );
   }

   return (
      <Box  mt={"80px"}>
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
            Body Systems
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
               placeholder="Search body systems..."
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
            onClick={() => navigate('/admin/add-category')}
            w={{ base: "100%", md: "200px" }}
         >
            Add New Body System
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
      </Box>
   );
   };

   export default Categories;
