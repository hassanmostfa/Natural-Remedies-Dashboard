
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useLoginUserMutation } from "api/userSlice";
import Swal from "sweetalert2";

function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  
  // Use the mutation hook
  const [loginUser, { isLoading, isSuccess, isError, error: apiError }] = useLoginUserMutation();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Trigger the login API request
      const response = await loginUser(formData).unwrap();
      
      if (response) {
        localStorage.setItem('token', response.data.token);
        navigate("/");  // Navigate to homepage on success
      }
      
    } catch (err) {
      setError(apiError?.data?.message || "Invalid credentials");
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error,
        confirmButtonText: 'OK',
        onClose: () => {
          if (!isError) navigate("/");  // Navigate to homepage on success
        }
      });
    }
  };

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "30px" }}
        px={{ base: "25px", md: "0px" }}
        // mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Sign In
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Enter your email and password to sign in!
          </Text>
        </Box>
        <form onSubmit={handleSubmit}>
          <Flex
            zIndex='2'
            direction='column'
            w={{ base: "100%", md: "420px" }}
            maxW='100%'
            background='transparent'
            borderRadius='15px'
            mx={{ base: "auto", lg: "unset" }}
            me='auto'
            mb={{ base: "20px", md: "auto" }}>
            {/* <Button
              fontSize='sm'
              me='0px'
              mb='26px'
              py='15px'
              h='50px'
              borderRadius='16px'
              bg={googleBg}
              color={googleText}
              fontWeight='500'
              _hover={googleHover}
              _active={googleActive}
              _focus={googleActive}>
              <Icon as={FcGoogle} w='20px' h='20px' me='10px' />
              Sign in with Google
            </Button> */}
            {/* <Flex align='center' mb='25px'>
              <HSeparator />
              <Text color='gray.400' mx='14px'>
                or
              </Text>
              <HSeparator />
            </Flex> */}
            <FormControl>
              <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'>
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant='auth'
                fontSize='sm'
                ms={{ base: "0px", md: "0px" }}
                type='email'
                placeholder='mail@simmmple.com'
                mb='24px'
                fontWeight='500'
                size='lg'
                name='email'
                value={formData.email}
                onChange={handleChange}
              />
              <FormLabel
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                display='flex'>
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size='md'>
                <Input
                  isRequired={true}
                  fontSize='sm'
                  placeholder='Min. 8 characters'
                  mb='24px'
                  size='lg'
                  type={show ? "text" : "password"}
                  variant='auth'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                />
                <InputRightElement display='flex' alignItems='center' mt='4px'>
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              <Flex justifyContent='space-between' align='center' mb='24px'>
                <FormControl display='flex' alignItems='center'>
                  <Checkbox
                    id='remember-login'
                    colorScheme='brandScheme'
                    me='10px'
                  />
                  <FormLabel
                    htmlFor='remember-login'
                    mb='0'
                    fontWeight='normal'
                    color={textColor}
                    fontSize='sm'>
                    Keep me logged in
                  </FormLabel>
                </FormControl>
                {/* <NavLink to='/auth/forgot-password'>
                  <Text
                    color={textColorBrand}
                    fontSize='sm'
                    w='124px'
                    fontWeight='500'>
                    Forgot password?
                  </Text>
                </NavLink> */}
              </Flex>
              <Button
                fontSize='sm'
                variant='brand'
                fontWeight='500'
                w='100%'
                h='50'
                mb='24px'
               type="submit"
                >
                Sign In
              </Button>
            </FormControl>
          </Flex>
        </form>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
