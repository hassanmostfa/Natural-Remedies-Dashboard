import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  VStack,
  Icon,
  Progress,
} from '@chakra-ui/react';
import { FaUpload, FaImage } from 'react-icons/fa';

const ImageUploadContainer = ({ 
  value, 
  uploadKey, 
  onUpload, 
  onClear, 
  placeholder = "Upload Image",
  size = "sm",
  isUploading = false,
  isDragging = false,
  progress = 0,
  onDragOver,
  onDragLeave,
  onDrop,
  preview = null
}) => {
  // Determine if we have an image to show (either preview or existing value)
  const hasImage = preview || value;
  
  // Set height based on size
  const getMinHeight = () => {
    switch(size) {
      case 'xs': return '60px';
      case 'sm': return '100px';
      case 'md': return '140px';
      case 'lg': return '180px';
      default: return '100px';
    }
  };
  
  return (
    <Box
      border="1px dashed"
      borderColor={isDragging ? 'brand.500' : 'gray.300'}
      borderRadius="md"
      p={size === 'xs' ? 2 : size === 'sm' ? 3 : 4}
      textAlign="center"
      backgroundColor={isDragging ? 'brand.50' : 'white'}
      cursor="default"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      position="relative"
      minH={getMinHeight()}
    >
      {/* Progress bar overlay - shown when uploading - ALWAYS ON TOP */}
      {isUploading && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          backgroundColor="rgba(0, 0, 0, 0.9)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
          zIndex="50"
          backdropFilter="blur(5px)"
          border="2px solid #422afb"
        >
                      <VStack spacing="3" w="full" px={6}>
              <Text color="white" fontSize="lg" fontWeight="bold">Uploading Image...</Text>
              <Progress 
                value={progress} 
                size="lg" 
                colorScheme="blue" 
                borderRadius="full"
                w="full"
                bg="rgba(255, 255, 255, 0.2)"
              />
              <Text color="white" fontSize="md" opacity="0.9">{progress}%</Text>
            </VStack>
        </Box>
      )}
      
              {hasImage ? (
          <Flex direction="column" align="center">
            <Image
              src={preview || value}
              alt="Preview"
              maxH={size === 'xs' ? '40px' : size === 'sm' ? '70px' : size === 'md' ? '100px' : '130px'}
              mb={2}
              borderRadius="md"
              fallback={<Icon as={FaImage} color="gray.500" boxSize={size === 'xs' ? '20px' : size === 'sm' ? '30px' : size === 'md' ? '40px' : '50px'} />}
            />
            <Button
              variant="outline"
              colorScheme="red"
              size="xs"
              onClick={onClear}
            >
              Remove
            </Button>
          </Flex>
        ) : (
          <>
            <Icon as={FaUpload} 
              w={size === 'xs' ? 3 : size === 'sm' ? 4 : size === 'md' ? 6 : 8} 
              h={size === 'xs' ? 3 : size === 'sm' ? 4 : size === 'md' ? 6 : 8} 
              color="#422afb" 
              mb={1} 
            />
            <Text color="gray.500" mb={1} fontSize={size === 'xs' ? 'xs' : size === 'sm' ? 'xs' : 'sm'}>
              Drag & Drop
            </Text>
            <Button
              variant="outline"
              border="none"
              onClick={onUpload}
              isLoading={isUploading}
              loadingText="Uploading..."
              bg={isUploading ? "blue.500" : "transparent"}
              color={isUploading ? "white" : "#422afb"}
              size={size === 'xs' ? 'xs' : 'sm'}
            >
              {placeholder}
            </Button>
          </>
        )}
    </Box>
  );
};

export default ImageUploadContainer;
