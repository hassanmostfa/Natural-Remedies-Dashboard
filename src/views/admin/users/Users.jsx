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
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaEye, FaTrash } from "react-icons/fa6";
import { EditIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import { useNavigate } from "react-router-dom";
const columnHelper = createColumnHelper();

const Users = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      gender: "Male",
      phone: "1234567890",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane@example.com",
      gender: "Female",
      phone: "9876543210",
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
    columnHelper.accessor("email", {
      id: "email",
      header: () => <Text color="gray.400">Email</Text>,
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor("gender", {
      id: "gender",
      header: () => <Text color="gray.400">Gender</Text>,
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor("phone", {
      id: "phone",
      header: () => <Text color="gray.400">Phone</Text>,
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
          <Icon w="18px" h="18px" me="10px" color="blue.500" onClick={() => navigate(`/admin/family-Accounts`)} title="View Family Accounts" as={FaEye} cursor="pointer" />
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
          <Text color={textColor} fontSize="22px" fontWeight="700">Users</Text>
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
  );
};

export default Users;
