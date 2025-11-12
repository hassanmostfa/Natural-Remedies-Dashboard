import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  Icon,
  Progress,
} from '@chakra-ui/react';
import { FaUpload, FaFileAlt } from 'react-icons/fa';

const PdfUploadContainer = ({ 
  value, 
  uploadKey, 
  onUpload, 
  onClear, 
  placeholder = "Upload PDF",
  isUploading = false,
  isDragging = false,
  progress = 0,
  onDragOver,
  onDragLeave,
  onDrop,
  disabled = false
}) => {
  return (
    <Box
      border="1px dashed"
      borderColor={isDragging ? 'brand.500' : 'gray.300'}
      borderRadius="md"
      p={4}
      textAlign="center"
      backgroundColor={isDragging ? 'brand.50' : 'white'}
      cursor="default"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      position="relative"
      minH="140px"
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
            <Text color="white" fontSize="lg" fontWeight="bold">Uploading PDF...</Text>
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
      
      {value ? (
        <Flex direction="column" align="center">
          <Icon as={FaFileAlt} color="red.500" boxSize="50px" mb={2} />
          <Text color="gray.700" mb={2}>PDF uploaded successfully</Text>
          <Button
            variant="outline"
            colorScheme="red"
            size="sm"
            onClick={onClear}
          >
            Remove PDF
          </Button>
        </Flex>
      ) : (
        <>
          <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
          <Text color="gray.500" mb={2}>
            Drag & Drop PDF Here
          </Text>
          <Text color="gray.500" mb={2}>
            or
          </Text>
          <Button
            variant="outline"
            border="none"
            onClick={onUpload}
            isLoading={isUploading}
            loadingText="Uploading..."
            bg={isUploading ? "blue.500" : "transparent"}
            color={isUploading ? "white" : "#422afb"}
            size="sm"
            disabled={disabled}
          >
            {placeholder}
          </Button>
        </>
      )}
    </Box>
  );
};

export default PdfUploadContainer;
