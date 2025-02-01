import {
    Flex,
    Box,
    Card,
    Text,
    Input,
    Checkbox,
    Stack,
    useColorModeValue,
    Button,
    SimpleGrid,
  } from '@chakra-ui/react';
  import * as React from 'react';
  import './roles.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
  const AddRole = () => {
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const navigate = useNavigate();
    // Sample data for categories and subcategories
    const [categories, setCategories] = React.useState([
      {
        id: 1,
        name: 'Admin Management',
        subcategories: [
          {
            id: 1,
            name: 'Users',
            permissions: {
              add: false,
              edit: false,
              view: false,
              delete: false,
            },
          },
          {
            id: 2,
            name: 'Alerts',
            permissions: {
              add: false,
              edit: false,
              view: false,
              delete: false,
            },
          },
        ],
      },
      {
        id: 2,
        name: 'Teacher Management',
        subcategories: [
          {
            id: 3,
            name: 'Documents',
            permissions: {
              add: false,
              edit: false,
              view: false,
              delete: false,
            },
          },
          {
            id: 4,
            name: 'Zones',
            permissions: {
              add: false,
              edit: false,
              view: false,
              delete: false,
            },
          },
        ],
      },
      {
        id: 3,
        name: 'POS Management',
        subcategories: [
          {
            id: 5,
            name: 'Inventory',
            permissions: {
              add: false,
              edit: false,
              view: false,
              delete: false,
            },
          },
          {
            id: 6,
            name: 'Stocks',
            permissions: {
              add: false,
              edit: false,
              view: false,
              delete: false,
            },
          },
        ],
      },
    ]);
  
    // Handle permission change
    const handlePermissionChange = (categoryId, subcategoryId, permission) => {
      const updatedCategories = categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            subcategories: category.subcategories.map((subcategory) => {
              if (subcategory.id === subcategoryId) {
                return {
                  ...subcategory,
                  permissions: {
                    ...subcategory.permissions,
                    [permission]: !subcategory.permissions[permission],
                  },
                };
              }
              return subcategory;
            }),
          };
        }
        return category;
      });
      setCategories(updatedCategories);
    };
  
    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Role Name:', e.target.roleName.value);
      console.log('Categories:', categories);
    };
  
    return (
        <div className="container">
            <Card
                flexDirection="column"
                w="100%"
                px="20px"
                py="20px"
                overflowX={{ sm: 'scroll', lg: 'hidden' }}
            >
                <Flex
                justifyContent="space-between"
                align="center"
                w="100%"
                mb="20px"
                >
                <Text
                color={textColor}
                fontSize="22px"
                fontWeight="700"
                // mb="20px"
                lineHeight="100%"
                >
                Add New Rule
                </Text>
                <Button
                    type="button"
                    onClick={() => navigate(-1)}
                    colorScheme="teal"
                    size="sm"
                    // mt="20px"
                    leftIcon={<IoMdArrowBack />}
                >
                    Back
                </Button>
                </Flex>
                <form onSubmit={handleSubmit}>
                {/* Rule Name Input */}
                <Box mb="20px">
                    <Text fontSize="sm" fontWeight="600" mb="8px">
                    Rule Name
                    </Text>
                    <Input
                    name="roleName"
                    placeholder="Enter role name"
                    size="sm"
                    width={'50%'}
                    required
                    />
                </Box>
        
                {/* Categories and Subcategories */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing="20px">
                    {categories.map((category) => (
                    <Card key={category.id} p="16px" >
                        <Text fontSize="lg" borderBottom={'1px solid #ddd'} paddingBottom={'5px'} fontWeight="700" mb="16px" backdropBlur={'10px'} >
                        {category.name}
                        </Text>
        
                        {category.subcategories.map((subcategory) => (
                        <Box key={subcategory.id} mb="12px" display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                            <Text fontSize="md" fontWeight="600" mb="8px">
                            {subcategory.name}
                            </Text>
        
                            <Stack direction="row" spacing={4}>
                            <Checkbox
                                isChecked={subcategory.permissions.add}
                                onChange={() =>
                                handlePermissionChange(
                                    category.id,
                                    subcategory.id,
                                    'add',
                                )
                                }
                            >
                                Add
                            </Checkbox>
                            <Checkbox
                                isChecked={subcategory.permissions.edit}
                                onChange={() =>
                                handlePermissionChange(
                                    category.id,
                                    subcategory.id,
                                    'edit',
                                )
                                }
                            >
                                Edit
                            </Checkbox>
                            <Checkbox
                                isChecked={subcategory.permissions.view}
                                onChange={() =>
                                handlePermissionChange(
                                    category.id,
                                    subcategory.id,
                                    'view',
                                )
                                }
                            >
                                View
                            </Checkbox>
                            <Checkbox
                                isChecked={subcategory.permissions.delete}
                                onChange={() =>
                                handlePermissionChange(
                                    category.id,
                                    subcategory.id,
                                    'delete',
                                )
                                }
                            >
                                Delete
                            </Checkbox>
                            </Stack>
                        </Box>
                        ))}
                    </Card>
                    ))}
                </SimpleGrid>
        
                {/* Submit Button */}
                
                    
                    <Button type="submit" colorScheme="brand" size="sm" mt="20px">
                        Submit 
                    </Button>
                
                </form>
            </Card>
        </div>
    );
  };
  
  export default AddRole;