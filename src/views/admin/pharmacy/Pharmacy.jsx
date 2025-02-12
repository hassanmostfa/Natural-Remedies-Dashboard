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
  import { EditIcon, PlusSquareIcon} from '@chakra-ui/icons';
  import { FaEye, FaTrash } from 'react-icons/fa6';
  import { useNavigate } from 'react-router-dom';
  import { CiSearch } from "react-icons/ci";
  import { useState } from 'react';
  const columnHelper = createColumnHelper();
  
  const Pharmacy = () => {

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 20;

    const [data, setData] = React.useState([
        {
            name: 'Al-Shifa Pharmacy',
            image:'https://th.bing.com/th/id/OIP.2tLY6p_5ubR3VvBlrP4iyAHaE8?w=254&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
            description: '24/7 pharmacy service with home delivery',
            whatsappNumber: '+96599123456',
            email: 'alshifa2@example.com',
            workingHours: 'From Saturday to Friday 8:00 to 23:00',
            revenueShare: '15.5%',
            fixedFees: '50.00 KD',
            feesStartDate: '2024-02-01',
            feesEndDate: '2025-02-01',
            isActive: true,
          },
        {
            name: 'Al-Shifa Pharmacy',
            image:'https://th.bing.com/th/id/OIP.2tLY6p_5ubR3VvBlrP4iyAHaE8?w=254&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
            description: '24/7 pharmacy service with home delivery',
            whatsappNumber: '+96599123456',
            email: 'alshifa2@example.com',
            workingHours: 'From Saturday to Friday 8:00 to 23:00',
            revenueShare: '15.5%',
            fixedFees: '50.00 KD',
            feesStartDate: '2024-02-01',
            feesEndDate: '2025-02-01',
            isActive: true,
          },
        {
            name: 'Al-Shifa Pharmacy',
            image:'https://th.bing.com/th/id/OIP.2tLY6p_5ubR3VvBlrP4iyAHaE8?w=254&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
            description: '24/7 pharmacy service with home delivery',
            whatsappNumber: '+96599123456',
            email: 'alshifa2@example.com',
            workingHours: 'From Saturday to Friday 8:00 to 23:00',
            revenueShare: '15.5%',
            fixedFees: '50.00 KD',
            feesStartDate: '2024-02-01',
            feesEndDate: '2025-02-01',
            isActive: true,
          },
    ]);
  
    const navigate = useNavigate();
    const [sorting, setSorting] = React.useState([]);
  
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  
    const columns = [
        columnHelper.accessor('name', {
          header: 'Name',
          cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor('image', {
          header: 'Image',
          cell: (info) => (
            <img
              src={info.getValue()}
              alt="Pharmacy"
              width={70}
              height={70}
              style={{ borderRadius: '8px' }}
            />
          ),
        }),
        columnHelper.accessor('whatsappNumber', {
          header: 'WhatsApp',
          cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor('revenueShare', {
          header: 'Revenue Share',
          cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor('fixedFees', {
          header: 'Fixed Fees',
          cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor('isActive', {
          header: 'Active',
          cell: (info) =>
            info.getValue() ? (
              <Text color="green.500">Active</Text>
            ) : (
              <Text color="red.500">Inactive</Text>
            ),
        }),
        columnHelper.accessor('actions', {
          header: 'Actions',
          cell: () => (
            <Flex align="center">
              <Icon w="18px" h="18px" me="10px" color="red.500" as={FaTrash} cursor="pointer" />
              <Icon w="18px" h="18px" me="10px" color="green.500" as={EditIcon} cursor="pointer" />
              <Icon w="18px" h="18px" me="10px" color="blue.500" as={FaEye} cursor="pointer"
              onClick={() => navigate('/admin/pharmacy-branches')}
              />
            </Flex>
          ),
        }),
      ];
    
  
    const table = useReactTable({
      data,
      columns,
      state: {
        sorting,
      },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      debugTable: true,
    });



    const changePage = (page) => {
      setCurrentPage(page);
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
              All Pharmacies
            </Text>

          {/* Search Input */}
          <Box>
              <InputGroup borderRadius="15px" background={"gray.100"} w={{ base: "400", md: "400px" }}>
                  <InputLeftElement pointerEvents="none">
                      <CiSearch color="gray.400" />
                  </InputLeftElement>
                  <Input
                      variant="outline"
                      fontSize="sm"
                      placeholder="Search..."
                      border="1px solid"
                      borderColor="gray.200"
                      _hover={{ borderColor: "gray.400" }}
                      borderRadius={"15px"}
                  />
              </InputGroup>
          </Box>

            <Button
              variant='darkBrand'
              color='white'
              fontSize='sm'
              fontWeight='500'
              borderRadius='70px'
              px='24px'
              py='5px'
              onClick={() => navigate('/admin/add-pharmacy')}
              width={'200px'}
            >
              <PlusSquareIcon me="10px" />
              Create New Pharmacy
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
                {table
                  .getRowModel()
                  .rows.slice(0, 11)
                  .map((row) => {
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

            {/* Pagination */}
            <div className="pagination d-flex justify-content-center">
              {Array.from(
                Array(Math.ceil(data.length / itemsPerPage)).keys()
              ).map((page) => (
                <button
                  className={`btn mx-1 btn-outline-dark ${
                    page === currentPage? 'active' : ''
                  }`}
                  key={page + 1}
                  onClick={() => changePage(page)}
                >
                  {page + 1}
                </button>
              ))}
            </div>
          </Box>
        </Card>
      </div>
    );
  };
  
  export default Pharmacy;