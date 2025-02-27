import {
    Box,
    Flex,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Checkbox,
  } from '@chakra-ui/react';
  import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
  } from '@tanstack/react-table';
  import React, { useState } from 'react';
  import Card from 'components/card/Card';
  import { FaEye } from 'react-icons/fa6';
  import { IoMdPrint } from 'react-icons/io';
  import { useNavigate } from 'react-router-dom';
  
  const columnHelper = createColumnHelper();
  
  const Orders = () => {
    const [data, setData] = useState([
      {
        orderId: '12345',
        username: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+96599123456',
        pharmacy: 'Al-Shifa Pharmacy',
        address: '123 Main St, City, Country',
        totalPrice: '$150.00',
        paymentMethod: 'Credit Card',
        referenceId: 'REF12345',
        invoiceId: 'INV12345',
        status: 'Pending',
        details: 'View Details',
        date: '2025-02-20',
      },
      {
        orderId: '12346',
        username: 'Jane Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '+96599123457',
        pharmacy: 'Al-Noor Pharmacy',
        address: '456 Elm St, City, Country',
        totalPrice: '$200.00',
        paymentMethod: 'PayPal',
        referenceId: 'REF12346',
        invoiceId: 'INV12346',
        status: 'Completed',
        details: 'View Details',
        date: '2025-02-21',
      },
      {
        orderId: '12347',
        username: 'Emily Johnson',
        email: 'emily.johnson@example.com',
        phoneNumber: '+96599123458',
        pharmacy: 'Al-Razi Pharmacy',
        address: '789 Oak St, City, Country',
        totalPrice: '$250.00',
        paymentMethod: 'Credit Card',
        referenceId: 'REF12347',
        invoiceId: 'INV12347',
        status: 'Shipped',
        details: 'View Details',
        date: '2024-02-28', // Corrected invalid date (February 30th doesn't exist)
      },
    ]);
  
    const navigate = useNavigate();
    const [sorting, setSorting] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure(); // Modal state
    const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order for details
  
    // Filter states
    const [pharmacyFilter, setPharmacyFilter] = useState('');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredData, setFilteredData] = useState(data); // State for filtered data
  
    // State for selected orders
    const [selectedOrders, setSelectedOrders] = useState([]);
  
    // Extract unique pharmacy names for the filter dropdown
    const pharmacyOptions = [...new Set(data.map((order) => order.pharmacy))];
  
    // Extract unique payment method names for the filter dropdown
    const paymentMethodOptions = [...new Set(data.map((order) => order.paymentMethod))];
  
    // Handle pharmacy filter change
    const handlePharmacyFilterChange = (e) => {
      const selectedPharmacy = e.target.value;
      setPharmacyFilter(selectedPharmacy);
      applyFilters(selectedPharmacy, paymentMethodFilter, startDate, endDate);
    };
  
    // Handle payment method filter change
    const handlePaymentMethodFilterChange = (e) => {
      const selectedPaymentMethod = e.target.value;
      setPaymentMethodFilter(selectedPaymentMethod);
      applyFilters(pharmacyFilter, selectedPaymentMethod, startDate, endDate);
    };
  
    // Handle date range filter
    const handleApplyDateFilter = () => {
      applyFilters(pharmacyFilter, paymentMethodFilter, startDate, endDate);
    };
  
    // Apply all filters
    const applyFilters = (pharmacy, paymentMethod, start, end) => {
      const filtered = data.filter((order) => {
        const orderDate = new Date(order.date);
  
        // Date range filter
        const startFilter = start ? new Date(start) : null;
        const endFilter = end ? new Date(end) : null;
        const matchesDate =
          (!startFilter || orderDate >= startFilter) && (!endFilter || orderDate <= endFilter);
  
        // Pharmacy filter
        const matchesPharmacy = !pharmacy || order.pharmacy === pharmacy;
  
        // Payment method filter
        const matchesPaymentMethod = !paymentMethod || order.paymentMethod === paymentMethod;
  
        return matchesDate && matchesPharmacy && matchesPaymentMethod;
      });
  
      setFilteredData(filtered);
    };
  
    // Handle checkbox change
    const handleCheckboxChange = (orderId) => {
      if (selectedOrders.includes(orderId)) {
        setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
      } else {
        setSelectedOrders([...selectedOrders, orderId]);
      }
    };
  
    const handlePrintSelectedOrders = () => {
        const ordersToPrint = data.filter((order) => selectedOrders.includes(order.orderId));
      
        if (ordersToPrint.length === 0) {
          alert('No orders selected for printing.');
          return;
        }
      
        // Create a printable window
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write('<html><head><title>Print Orders</title></head><body>');
        printWindow.document.write('<h1>Selected Orders</h1>');
        printWindow.document.write('<table border="1" style="width:100%; border-collapse: collapse;">');
        printWindow.document.write(`
          <tr>
            <th>Order ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Pharmacy</th>
            <th>Address</th>
            <th>Total Price</th>
            <th>Payment Method</th>
            <th>Reference ID</th>
            <th>Invoice ID</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        `);
      
        ordersToPrint.forEach((order) => {
          printWindow.document.write(`
            <tr>
              <td>${order.orderId}</td>
              <td>${order.username}</td>
              <td>${order.email}</td>
              <td>${order.phoneNumber}</td>
              <td>${order.pharmacy}</td>
              <td>${order.address}</td>
              <td>${order.totalPrice}</td>
              <td>${order.paymentMethod}</td>
              <td>${order.referenceId}</td>
              <td>${order.invoiceId}</td>
              <td>${order.status}</td>
              <td>${order.date}</td>
            </tr>
          `);
        });
      
        printWindow.document.write('</table></body></html>');
        printWindow.document.close();
        printWindow.print();
      };

      
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  
    const columns = [
      // Checkbox column
      columnHelper.accessor('orderId', {
        header: '',
        cell: (info) => (
          <Checkbox
            isChecked={selectedOrders.includes(info.getValue())}
            onChange={() => handleCheckboxChange(info.getValue())}
            colorScheme={'brandScheme'}
            
          />
        ),
      }),
      columnHelper.accessor('orderId', {
        header: 'Order ID',
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
      }),
      columnHelper.accessor('username', {
        header: 'Username',
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
      }),
      columnHelper.accessor('phoneNumber', {
        header: 'Phone Number',
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
      }),
      columnHelper.accessor('pharmacy', {
        header: 'Pharmacy',
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
      }),
      columnHelper.accessor('totalPrice', {
        header: 'Total Price',
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
      }),
      columnHelper.accessor('paymentMethod', {
        header: 'Payment Method',
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
      }),
      columnHelper.accessor('referenceId', {
        header: 'Reference ID',
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
      }),
      columnHelper.accessor('invoiceId', {
        header: 'Invoice ID',
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <Text
            fontWeight="bold"
            textAlign={'center'}
            color={
              info.getValue() === 'Pending'
                ? 'blue.500'
                : info.getValue() === 'Completed'
                ? 'green.500'
                : 'orange.500'
            }
          >
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('details', {
        header: 'Details',
        cell: (info) => (
          <Flex align="center">
            <Icon
              w="18px"
              h="18px"
              me="10px"
              color="blue.500"
              as={FaEye}
              title="View Order Details"
              cursor="pointer"
              onClick={() => {
                setSelectedOrder(info.row.original); // Set selected order
                onOpen(); // Open modal
              }}
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
              All Orders
            </Text>
  
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
              width={'200px'}
              onClick={handlePrintSelectedOrders}
            >
              <Icon as={IoMdPrint} me="10px" />
              Print
            </Button>
          </Flex>
  
          <Flex align="center" justifyContent="space-around" my={'20px'} px="25px" gap={'50px'}>
            {/* Pharmacy Filter */}
            <Select
              placeholder="Filter by Pharmacy"
              background={'gray.100'}
              value={pharmacyFilter}
              onChange={handlePharmacyFilterChange}
              variant="outline"
              fontSize="sm"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ borderColor: 'gray.400' }}
              borderRadius={'15px'}
            >
              {pharmacyOptions.map((pharmacy) => (
                <option key={pharmacy} value={pharmacy}>
                  {pharmacy}
                </option>
              ))}
            </Select>
  
            {/* Payment Method Filter */}
            <Select
              placeholder="Filter by Payment Method"
              background={'gray.100'}
              value={paymentMethodFilter}
              onChange={handlePaymentMethodFilterChange}
              variant="outline"
              fontSize="sm"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ borderColor: 'gray.400' }}
              borderRadius={'15px'}
            >
              {paymentMethodOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Flex>
  
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', margin: '20px' }}>
            {/* Date Range Filter */}
            <Box width={'100%'}>
              <Text color={textColor} mb={'10px'} fontWeight={'bold'} fontSize={'sm'}>
                Date Range Filter
              </Text>
              <Flex>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                  size="sm"
                  borderRadius="15px"
                  padding="20px"
                  bg={'gray.100'}
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                  size="sm"
                  borderRadius="15px"
                  ml="10px"
                  padding="20px"
                  bg={'gray.100'}
                />
                <Button
                  variant="darkBrand"
                  color="white"
                  fontSize="sm"
                  fontWeight="500"
                  borderRadius="70px"
                  px="24px"
                  py="5px"
                  width={'200px'}
                  onClick={handleApplyDateFilter}
                  ml="10px"
                >
                  Apply Filter
                </Button>
              </Flex>
            </Box>
          </div>
  
          <Box overflowX="auto">
            <Table variant="simple" color="gray.500" mb="24px" mt="12px" minWidth="1000px">
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
                              header.getContext()
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
                                cell.getContext()
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
  
        {/* Modal for Order Details */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Order Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedOrder && (
                <Box>
                  <Text><strong>Order ID:</strong> {selectedOrder.orderId}</Text>
                  <Text><strong>Username:</strong> {selectedOrder.username}</Text>
                  <Text><strong>Email:</strong> {selectedOrder.email}</Text>
                  <Text><strong>Phone Number:</strong> {selectedOrder.phoneNumber}</Text>
                  <Text><strong>Pharmacy:</strong> {selectedOrder.pharmacy}</Text>
                  <Text><strong>Address:</strong> {selectedOrder.address}</Text>
                  <Text><strong>Total Price:</strong> {selectedOrder.totalPrice}</Text>
                  <Text><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</Text>
                  <Text><strong>Reference ID:</strong> {selectedOrder.referenceId}</Text>
                  <Text><strong>Invoice ID:</strong> {selectedOrder.invoiceId}</Text>
                  <Text><strong>Status:</strong> {selectedOrder.status}</Text>
                </Box>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="darkBrand"
                color="white"
                fontSize="sm"
                fontWeight="500"
                borderRadius="70px"
                px="24px"
                py="5px"
                width={'200px'}
                onClick={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  };
  
  export default Orders;