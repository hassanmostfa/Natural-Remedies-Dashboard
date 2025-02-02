import React from 'react';
import './admins.css';
import { Button , useColorModeValue , Text} from '@chakra-ui/react';

const AddAdmin = () => {

    const textColor = useColorModeValue('secondaryGray.900', 'white');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log("Form submitted!");
  };

  return (
    <div className="container add-admin-container w-100">
      <div className="add-admin-card p-4 bg-white  w-100">
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
            <div className="row col-md-12">
                {/* First Name */}
                <div className="mb-3 col-md-6">
                <label htmlFor="firstName" className="form-label">
                    First Name <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    placeholder="Enter first name"
                    required
                />
                </div>

                {/* Last Name */}
                <div className="mb-3 col-md-6">
                <label htmlFor="lastName" className="form-label">
                    Last Name <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    placeholder="Enter last name"
                    required
                />
                </div>
            </div>

            {/* Email Field */}
            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                Email <span className="text-danger">*</span>
                </label>
                <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                required
                />
            </div>

            {/* Password Field */}
            <div className="mb-3">
                <label htmlFor="password" className="form-label">
                Password <span className="text-danger">*</span>
                </label>
                <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                required
                />
            </div>

            {/* Role Dropdown */}
            <div className="mb-3">
                <label htmlFor="role" className="form-label">
                Role <span className="text-danger">*</span>
                </label>
                <select className="form-select" id="role" required>
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
                </select>
            </div>

            {/* Submit Button */}
            <Button type="submit" colorScheme="brand" size="sm" mt="20px">
                Submit 
            </Button>
            </form>

      </div>
    </div>
  );
};

export default AddAdmin;