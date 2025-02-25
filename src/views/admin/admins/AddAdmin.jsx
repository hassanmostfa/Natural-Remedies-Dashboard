import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import './admins.css';
import { useGetRolesQuery } from 'api/roleSlice';
import { useCreateUserMutation } from 'api/userSlice';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddAdmin = () => {
  const { data: roles, isLoading, isError } = useGetRolesQuery();
  const [createAdmin, { isLoading: isCreating }] = useCreateUserMutation();
  const navigate = useNavigate();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [selectedRole, setSelectedRole] = useState('Select a role');
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSelect =  (role) => {
    setSelectedRole(role.name);
    setFormData({ ...formData, roleId: role.id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await createAdmin(formData).unwrap();
       Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Admin added successfully',
              confirmButtonText: 'OK',
              onClose: () => {
                navigate('/admin/undefined/admins'); // Redirect to the roles page after successful submission
              }
            }).then((result) => {
              if (result.isConfirmed) {
                navigate('/admin/undefined/admins'); // Redirect to the roles page after successful submission
              }
            });
    }catch(error){
      Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.data.message,
              confirmButtonText: 'OK',
            });
    }
  };

  return (
    <div className="container add-admin-container w-100">
      <div className="add-admin-card shadow p-4 bg-white w-100">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          mb="20px !important"
          lineHeight="100%"
        >
          Add New Admin
        </Text>
        <form onSubmit={handleSubmit}>
          {/* First Name and Last Name Fields */}
          <div className="mb-3 col-md-12">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Name
              <span className="text-danger mx-1">*</span>
            </Text>
            <input
              type="text"
              name="name"
              className="form-control mt-2"
              id="name"
              placeholder="Enter Admin Name"
              onChange={(e) => handleInputChange(e)}
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Email
              <span className="text-danger mx-1">*</span>
            </Text>
            <input
              type="email"
              name="email"
              onChange={(e) => handleInputChange(e)}
              className="form-control mt-2"
              id="email"
              placeholder="Enter email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Password
              <span className="text-danger mx-1">*</span>
            </Text>
            <input
              type="password"
              name="password"
              onChange={(e) => handleInputChange(e)}
              className="form-control mt-2"
              id="password"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Role Dropdown - Chakra UI Menu */}
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Role
              <span className="text-danger mx-1">*</span>
            </Text>

            <Menu >
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                width="100%"
                bg="white"
                border="1px solid #ddd" // Add a border
                borderRadius="md" // Optional: Rounded corners
                _hover={{ bg: 'gray.200' }}
                textAlign={'left'}
              >
                {selectedRole}
              </MenuButton>
              <MenuList width={'100%'}>
                {isLoading ? (
                  <MenuItem>Loading...</MenuItem>
                ) : isError ? (
                  <MenuItem>Error fetching roles</MenuItem>
                ) : roles?.length == 0 ? (
                  <MenuItem>No roles found</MenuItem>
                ) : (
                  roles.data?.map((role) => (
                    <MenuItem
                      key={role.id}
                      onClick={() => handleSelect(role)}
                      _hover={{ bg: '#38487c', color: 'white' }}
                    >
                      {role.name}
                    </MenuItem>
                  ))
                )}
              </MenuList>
            </Menu>
          </div>

          {/* Submit Button */}
          <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
