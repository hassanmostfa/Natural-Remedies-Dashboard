import React, { useState } from "react";
import {
Box,
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
Switch,
Button
} from "@chakra-ui/react";
import {
createColumnHelper,
flexRender,
getCoreRowModel,
getSortedRowModel,
useReactTable,
} from "@tanstack/react-table";
import { FaEye, FaTrash } from "react-icons/fa6";
import { EditIcon , PlusSquareIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import { useNavigate } from "react-router-dom";
const columnHelper = createColumnHelper();

const PromoCodes = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([
        {
        id: 1,
        name: "cls5225",
        amount: 100,
        type: "percentage",
        end_date: "2025-12-31",
        max_usage: 10,
        usage_count: 5,
        status: "Active",
        },
        {
        id: 2,
        name: "cli5555",
        amount: 100,
        type: "percentage",
        end_date: "2025-12-31",
        max_usage: 10,
        usage_count: 5,
        status: "Inactive",
        },
    ]);
    
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    
    // Function to toggle status
    const toggleStatus = (id) => {
        setData((prevData) =>
        prevData.map((user) =>
            user.id === id
            ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
            : user
        )
        );
    };
    
    const columns = [
        columnHelper.accessor("id", {
        id: "id",
        header: () => <Text color="gray.400">ID</Text>,
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor("name", {
        id: "name",
        header: () => <Text color="gray.400">Name</Text>,
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor("amount", {
        id: "amount",
        header: () => <Text color="gray.400">Amount</Text>,
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor("type", {
        id: "type",
        header: () => <Text color="gray.400">Type</Text>,
        cell: (info) => <Text  color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor("end_date", {
        id: "end_date",
        header: () => <Text color="gray.400">End Date</Text>,
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor("max_usage", {
        id: "max_usage",
        header: () => <Text color="gray.400">Max Usage</Text>,
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor("usage_count", {
        id: "usage_count",
        header: () => <Text color="gray.400">Usage Count</Text>,
        cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor("status", {
        id: "status",
        header: () => <Text color="gray.400">Status</Text>,
        cell: (info) => {
            const isActive = info.getValue() === "Active";
            return (
            <Switch
                colorScheme="green"
                isChecked={isActive}
                onChange={() => toggleStatus(info.row.original.id)}
            />
            );
        },
        }),
        columnHelper.accessor("actions", {
        id: "actions",
        header: () => <Text color="gray.400">Actions</Text>,
        cell: (info) => (
            <Flex>
            <Icon w="18px" h="18px" me="10px" color="red.500" as={FaTrash} cursor="pointer" />
            <Icon w="18px" h="18px" me="10px" color="green.500" as={EditIcon} cursor="pointer" />
            </Flex>
        ),
        }),
    ];
    
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });
return (
    <div className="container">
        <Card flexDirection="column" w="100%" px="0px" overflowX="auto">
            <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
            <Text color={textColor} fontSize="22px" fontWeight="700">Promo Codes</Text>
            <Button
            variant='darkBrand'
            color='white'
            fontSize='sm'
            fontWeight='500'
            borderRadius='70px'
            px='24px'
            py='5px'
            onClick={() => navigate('/admin/add-promo-code')}
            width={'200px'}
            >
              
            <PlusSquareIcon me="10px" />
            Add Promo Code
          </Button>
            </Flex>
            <Box>
            <Table variant="simple" color="gray.500" mb="24px" mt="12px">
                <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <Th key={header.id} borderColor={borderColor}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        </Th>
                    ))}
                    </Tr>
                ))}
                </Thead>
                <Tbody>
                {table.getRowModel().rows.map((row) => (
                    <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                        <Td key={cell.id} borderColor="transparent">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Td>
                    ))}
                    </Tr>
                ))}
                </Tbody>
            </Table>
            </Box>
        </Card>
        </div>
)
}

export default PromoCodes