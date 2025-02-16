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
Button,
} from "@chakra-ui/react";
import {
createColumnHelper,
flexRender,
getCoreRowModel,
getSortedRowModel,
useReactTable,
} from "@tanstack/react-table";
import { FaEye, FaTrash } from "react-icons/fa6";
import { EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import { useNavigate } from "react-router-dom";

const columnHelper = createColumnHelper();

const Products = () => {
const navigate = useNavigate();
const [data, setData] = useState([
{
    id: 1,
    name: "Product 1",
    category: "Electronics",
    price: 100,
    discountPrice: 80,
    stock: 50,
    status: "Active",
    publish: true,
},
{
    id: 2,
    name: "Product 2",
    category: "Clothing",
    price: 50,
    discountPrice: 40,
    stock: 100,
    status: "Inactive",
    publish: false,
},
{
    id: 3,
    name: "Product 3",
    category: "Home & Kitchen",
    price: 200,
    discountPrice: 180,
    stock: 20,
    status: "Active",
    publish: true,
},
]);

const textColor = useColorModeValue("secondaryGray.900", "white");
const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

// Function to toggle status
const toggleStatus = (id) => {
setData((prevData) =>
    prevData.map((product) =>
    product.id === id
        ? { ...product, status: product.status === "Active" ? "Inactive" : "Active" }
        : product
    )
);
};

// Function to toggle publish
const togglePublish = (id) => {
setData((prevData) =>
    prevData.map((product) =>
    product.id === id ? { ...product, publish: !product.publish } : product
    )
);
};

// Function to handle delete
const handleDelete = (id) => {
setData((prevData) => prevData.filter((product) => product.id !== id));
};

const columns = [
columnHelper.accessor("id", {
    id: "id",
    header: () => <Text color="gray.400">Product ID</Text>,
    cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
}),
columnHelper.accessor("name", {
    id: "name",
    header: () => <Text color="gray.400">Product Name</Text>,
    cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
}),
columnHelper.accessor("category", {
    id: "category",
    header: () => <Text color="gray.400">Category</Text>,
    cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
}),
columnHelper.accessor("price", {
    id: "price",
    header: () => <Text color="gray.400">Price</Text>,
    cell: (info) => <Text color={textColor}>${info.getValue()}</Text>,
}),
columnHelper.accessor("discountPrice", {
    id: "discountPrice",
    header: () => <Text color="gray.400">Discount Price</Text>,
    cell: (info) => <Text color={textColor}>${info.getValue()}</Text>,
}),
columnHelper.accessor("stock", {
    id: "stock",
    header: () => <Text color="gray.400">Stock</Text>,
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
columnHelper.accessor("publish", {
    id: "publish",
    header: () => <Text color="gray.400">Publish</Text>,
    cell: (info) => {
    const isPublished = info.getValue();
    return (
        <Switch
        colorScheme="blue"
        isChecked={isPublished}
        onChange={() => togglePublish(info.row.original.id)}
        />
    );
    },
}),
columnHelper.accessor("actions", {
    id: "actions",
    header: () => <Text color="gray.400">Actions</Text>,
    cell: (info) => (
    <Flex>
        <Icon
        w="18px"
        h="18px"
        me="10px"
        color="blue.500"
        as={FaEye}
        cursor="pointer"
        onClick={() => navigate(`/admin/products/${info.row.original.id}`)}
        />
        <Icon
        w="18px"
        h="18px"
        me="10px"
        color="green.500"
        as={EditIcon}
        cursor="pointer"
        onClick={() => navigate(`/admin/edit-product/${info.row.original.id}`)}
        />
        <Icon
        w="18px"
        h="18px"
        me="10px"
        color="red.500"
        as={FaTrash}
        cursor="pointer"
        onClick={() => handleDelete(info.row.original.id)}
        />
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
        <Text color={textColor} fontSize="22px" fontWeight="700">
        Products
        </Text>
        <Button
        variant="darkBrand"
        color="white"
        fontSize="sm"
        fontWeight="500"
        borderRadius="70px"
        px="24px"
        py="5px"
        onClick={() => navigate("/admin/add-product")}
        width={"200px"}
        >
        <PlusSquareIcon me="10px" />
        Add Product
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
);
};

export default Products;