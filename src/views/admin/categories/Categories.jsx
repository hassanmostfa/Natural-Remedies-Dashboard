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

   const columnHelper = createColumnHelper();

   const Categories = () => {
   const navigate = useNavigate();
   const [sorting, setSorting] = React.useState([]);
   const [searchQuery, setSearchQuery] = React.useState('');

   const textColor = useColorModeValue('secondaryGray.900', 'white');
   const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

   // Static categories data
   const staticData = [
      {
         id: 1,
         name: 'Digestive Health',
         description: 'Remedies for stomach, gut, and digestive system issues',
         status: 'active',
         colorScheme: 'green',
         remediesCount: 23,
      },
      {
         id: 2,
         name: 'Respiratory Health',
         description: 'Natural solutions for breathing, lungs, and respiratory problems',
         status: 'active',
         colorScheme: 'blue',
         remediesCount: 18,
      },
      {
         id: 3,
         name: 'Immune System',
         description: 'Boosters and strengtheners for the body\'s natural defenses',
         status: 'active',
         colorScheme: 'purple',
         remediesCount: 31,
      },
      {
         id: 4,
         name: 'Pain Relief',
         description: 'Natural alternatives for managing various types of pain',
         status: 'active',
         colorScheme: 'orange',
         remediesCount: 15,
      },
      {
         id: 5,
         name: 'Sleep & Relaxation',
         description: 'Herbs and remedies to promote better sleep and calmness',
         status: 'active',
         colorScheme: 'teal',
         remediesCount: 12,
      },
      {
         id: 6,
         name: 'Skin Health',
         description: 'Natural treatments for various skin conditions and beauty',
         status: 'inactive',
         colorScheme: 'pink',
         remediesCount: 8,
      },
      {
         id: 7,
         name: 'Energy & Vitality',
         description: 'Natural boosters for energy, stamina, and overall vitality',
         status: 'active',
         colorScheme: 'yellow',
         remediesCount: 19,
      },
      {
         id: 8,
         name: 'Women\'s Health',
         description: 'Specialized remedies for women\'s health and wellness',
         status: 'active',
         colorScheme: 'red',
         remediesCount: 14,
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
      columnHelper.accessor('name', {
         id: 'name',
         header: () => (
         <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
         >
            Category Name
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
               cursor="pointer"
               onClick={() => handleDeleteCategory(info.getValue())}
            />
            <Icon
               w="18px"
               h="18px"
               me="10px"
               color="green.500"
               as={EditIcon}
               cursor="pointer"
               onClick={() => navigate(`/admin/edit-category/${info.getValue()}`)}
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
         // In a real app, you would call your API here
         Swal.fire('Deleted!', 'The category has been deleted.', 'success');
         }
      } catch (error) {
         console.error('Failed to delete category:', error);
         Swal.fire('Error!', 'Failed to delete the category.', 'error');
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
               Categories
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
                  placeholder="Search categories..."
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
               onClick={() => navigate('/admin/add-category')}
               width={'200px'}
            >
               Add New Category
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

   export default Categories;
