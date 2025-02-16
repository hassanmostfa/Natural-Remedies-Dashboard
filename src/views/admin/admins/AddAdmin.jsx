import React, { useState } from 'react';
import { Button, Menu, MenuButton, MenuList, MenuItem, Text, useColorModeValue } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import './admins.css';

const AddAdmin = () => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');  
  const [selectedRole, setSelectedRole] = useState('Select a role');

  const handleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted!");
  };

  return (
    <div className="container add-admin-container w-100">
      <div className="add-admin-card shadow p-4 bg-white w-100">
        <Text color={textColor} fontSize="22px" fontWeight="700" mb="20px !important" lineHeight="100%">
          Add New Admin
        </Text>
        <form onSubmit={handleSubmit}>
          {/* First Name and Last Name Fields */}
          <div className="row col-md-12">
            <div className="mb-3 col-md-12">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Name
              <span className="text-danger mx-1">*</span>
            </Text> 
              <input type="text" className="form-control mt-2" id="firstName" placeholder="Enter Admin Name" required />
            </div>
            {/* <div className="mb-3 col-md-6">
              <label htmlFor="lastName" className="form-label">
                Last Name <span className="text-danger">*</span>
              </label>
              <input type="text" className="form-control" id="lastName" placeholder="Enter last name" required />
            </div> */}
          </div>

          {/* Email Field */}
          <div className="mb-3">
          <Text color={textColor} fontSize="sm" fontWeight="700">
              Email
              <span className="text-danger mx-1">*</span>
            </Text> 
            <input type="email" className="form-control mt-2" id="email" placeholder="Enter email" required />
          </div>

          {/* Password Field */}
          <div className="mb-3">
          <Text color={textColor} fontSize="sm" fontWeight="700">
              Password
              <span className="text-danger mx-1">*</span>
            </Text> 
            <input type="password" className="form-control mt-2" id="password" placeholder="Enter password" required />
          </div>

          {/* Role Dropdown - Chakra UI Menu */}
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
            border="1px solid #ddd"  // Add a border
            borderRadius="md"        // Optional: Rounded corners
            _hover={{ bg: 'gray.200' }}
            textAlign={'left'}
            >
            {selectedRole}
            </MenuButton>
              <MenuList width={'100%'}>
                <MenuItem _hover={{ bg: '#38487c', color: 'white' }} onClick={() => handleSelect('Admin')}>
                  Admin
                </MenuItem>
                <MenuItem _hover={{ bg: '#38487c', color: 'white' }} onClick={() => handleSelect('Editor')}>
                  Editor
                </MenuItem>
                <MenuItem _hover={{ bg: '#38487c', color: 'white' }} onClick={() => handleSelect('Viewer')}>
                  Viewer
                </MenuItem>
              </MenuList>
            </Menu>
          </div>

          {/* Submit Button */}
          <Button variant='darkBrand' color='white' fontSize='sm' fontWeight='500' borderRadius='70px' px='24px' py='5px' type='submit'>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
