import React, { useState } from 'react';
import { Button, Menu, MenuButton, MenuList, MenuItem, Text, useColorModeValue } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const AddPromoCode = () => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  // State Management
  const [promoType, setPromoType] = useState('Select Type');

  // Handle Promo Type Selection
  const handleSelectType = (type) => {
    setPromoType(type);
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Promo Code Submitted!");
  };

  return (
    <div className="container add-promo-container w-100">
      <div className="add-promo-card shadow p-4 bg-white w-100">
        <Text color={textColor} fontSize="22px" fontWeight="700" mb="20px !important" lineHeight="100%">
          Add New Promo Code
        </Text>
        <form onSubmit={handleSubmit}>
          {/* Name & Amount Fields */}
          <div className="row col-md-12">
            <div className="mb-3 col-md-6">
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Promo Code Name
                <span className="text-danger mx-1">*</span>
              </Text> 
              <input type="text" className="form-control mt-2" id="promoName" placeholder="Enter promo code name" required />
            </div>
            <div className="mb-3 col-md-6">
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Amount
                <span className="text-danger mx-1">*</span>
              </Text> 
              <input type="number" className="form-control mt-2" id="amount" placeholder="Enter amount" required />
            </div>
          </div>

          {/* Type Dropdown - Chakra UI Menu */}
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Type
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
                {promoType}
              </MenuButton>
              <MenuList width="100%">
                <MenuItem _hover={{ bg: '#38487c', color: 'white' }} onClick={() => handleSelectType('Fixed')}>
                  Fixed
                </MenuItem>
                <MenuItem _hover={{ bg: '#38487c', color: 'white' }} onClick={() => handleSelectType('Percentage')}>
                  Percentage
                </MenuItem>
              </MenuList>
            </Menu>
          </div>

          {/* End Date Field */}
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">
              End Date <span className="text-danger">*</span>
            </label>
            <input type="date" className="form-control" id="endDate" required />
          </div>

          {/* Max Usage & Count Usage Fields */}
          <div className="row col-md-12">
            <div className="mb-3 col-md-6">
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Max Usage
                <span className="text-danger mx-1">*</span>
              </Text> 
              <input type="number" className="form-control mt-2" id="maxUsage" placeholder="Enter max usage" required />
            </div>
            <div className="mb-3 col-md-6">
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Count Usage
                <span className="text-danger mx-1">*</span>
              </Text> 
              <input type="number" className="form-control mt-2" id="countUsage" placeholder="Enter count usage" required />
            </div>
          </div>

          {/* Submit Button */}
          <Button variant="darkBrand" mt={"20px"} color="white" fontSize="sm" fontWeight="500" borderRadius="70px" px="24px" py="5px" type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddPromoCode;
