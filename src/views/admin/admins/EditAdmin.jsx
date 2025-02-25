import React, { useState, useEffect } from 'react';
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
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateUserMutation } from 'api/userSlice';
import { useGetUserProfileQuery } from 'api/userSlice';

const EditAdmin = () => {
  const { id } = useParams();
  const { data: roles, isLoading: isRolesLoading, isError: isRolesError } = useGetRolesQuery();
  const { data: admin, isLoading: isAdminLoading, isError: isAdminError } = useGetUserProfileQuery(id);
  const [editAdmin, { isLoading: isCreating }] = useUpdateUserMutation();
  const navigate = useNavigate();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [selectedRole, setSelectedRole] = useState('Select a role');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
  });

  // Update formData when admin data is available
  useEffect(() => {
    if (admin?.data) {
      setFormData({
        name: admin.data?.name,
        email: admin.data?.email,
        password: '', // Password is not pre-filled for security reasons
        roleId: admin.data?.roleId,
      });
      // Set the selected role name
      const role = roles?.data?.find((r) => r.id === admin.data?.roleId);
      if (role) {
        setSelectedRole(role?.name);
      }
    }
  }, [admin , roles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelect = (role) => {
    setSelectedRole(role.name);
    setFormData({ ...formData, roleId: role.id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a copy of formData
    const dataToSend = { ...formData };

    // Remove the password field if it's empty
    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    try {
      const response = await editAdmin({ id, user: dataToSend }).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Admin updated successfully',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal-popup', // Add a custom class for the popup
          title: 'custom-swal-title', // Add a custom class for the title
          content: 'custom-swal-content', // Add a custom class for the content
          confirmButton: 'custom-swal-confirm-button', // Add a custom class for the confirm button
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/admin/undefined/admins'); // Redirect to the admins page after successful submission
        }
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.data?.message || 'Failed to update admin',
        confirmButtonText: 'OK',
      });
    }
  };

  if (isAdminLoading || isRolesLoading) {
    return <div>Loading...</div>;
  }

  if (isAdminError || isRolesError) {
    return <div>Error loading data</div>;
  }

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
          Edit Admin
        </Text>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
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
              value={formData.name}
              onChange={handleInputChange}
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
              className="form-control mt-2"
              id="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
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
              className="form-control mt-2"
              id="password"
              placeholder="Enter new password (leave blank to keep current)"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {/* Role Dropdown */}
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Role
              <span className="text-danger mx-1">*</span>
            </Text>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                width="100%"
                bg="white"
                border="1px solid #ddd"
                borderRadius="md"
                _hover={{ bg: 'gray.200' }}
                textAlign="left"
              >
                {selectedRole}
              </MenuButton>
              <MenuList width="100%">
                {roles?.data?.map((role) => (
                  <MenuItem key={role.id} onClick={() => handleSelect(role)}>
                    {role.name}
                  </MenuItem>
                ))}
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
            isLoading={isCreating}
          >
            Update Admin
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditAdmin;