import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Text,
  HStack,
  IconButton,
  Icon,
  Badge,
  Grid,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { FaPlay, FaVideo, FaFileAlt, FaImage, FaLeaf, FaList, FaUpload } from 'react-icons/fa';
import ImageUploadContainer from 'components/upload/ImageUploadContainer';
import PdfUploadContainer from 'components/upload/PdfUploadContainer';

const ContentBlockForm = ({
  block,
  index,
  textColor,
  borderColor,
  contentImagePreviews,
  contentImageUploading,
  contentImageDragging,
  contentImageProgress,
  availableRemedies,
  onUpdateBlock,
  onRemoveBlock,
  onMoveBlock,
  onAddContentItem,
  onUpdateContentItem,
  onRemoveContentItem,
  onContentImageUpload,
  onContentItemImageUpload,
  onClearContentImage,
  onClearContentItemImage,
  onContentImageDragOver,
  onContentImageDragLeave,
  onContentImageDrop,
  onPdfUpload,
  onPdfDragOver,
  onPdfDragLeave,
  onPdfDrop,
  formDataContentBlocks,
}) => {
  const contentTypeOptions = [
    { value: 'content', label: 'Content', icon: FaList, color: 'cyan.500' },
    { value: 'text', label: 'Text', icon: FaFileAlt, color: 'blue.500' },
    { value: 'video', label: 'Video', icon: FaVideo, color: 'red.500' },
    { value: 'remedy', label: 'Remedy', icon: FaLeaf, color: 'green.500' },
    { value: 'tip', label: 'Tip', icon: FaFileAlt, color: 'yellow.500' },
    { value: 'image', label: 'Image', icon: FaImage, color: 'purple.500' },
    { value: 'pdf', label: 'PDF', icon: FaFileAlt, color: 'red.600' },
  ];

  const typeOption = contentTypeOptions.find(opt => opt.value === block.type);
  
  return (
    <Box key={index} p={4} border="1px" borderColor={borderColor} borderRadius="lg" mb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <HStack spacing={3}>
          <Icon as={typeOption?.icon} color={typeOption?.color} />
          <Badge colorScheme={block.type === 'video' ? 'red' : block.type === 'text' ? 'blue' : 'purple'}>
            {typeOption?.label}
          </Badge>
          <Text fontWeight="medium" color={textColor}>Block {index + 1}</Text>
        </HStack>
        <HStack spacing={2}>
          <Button size="sm" onClick={() => onMoveBlock(index, 'up')} isDisabled={index === 0}>
            ↑
          </Button>
          <Button size="sm" onClick={() => onMoveBlock(index, 'down')} isDisabled={index === formDataContentBlocks.length - 1}>
            ↓
          </Button>
          <IconButton
            aria-label="Remove block"
            icon={<CloseIcon />}
            size="sm"
            colorScheme="red"
            variant="ghost"
            onClick={() => onRemoveBlock(index)}
          />
        </HStack>
      </Flex>

      {/* Type-specific fields */}
      {block.type === 'content' && (
        <VStack spacing={4} align="stretch">
          <Box>
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontWeight="medium" color={textColor}>Content Items</Text>
              <Button
                size="sm"
                leftIcon={<AddIcon />}
                onClick={() => onAddContentItem(
                  index, 
                  'content',
                  { title: '', image_url: '' }
                )}
              >
                Add Item
              </Button>
            </Flex>
            
            {block.content && (
              <VStack spacing={3} align="stretch">
                {(block.content.items || []).map((item, itemIndex) => (
                  <Box key={itemIndex} p={3} border="1px" borderColor="gray.200" borderRadius="md">
                    <Grid templateColumns="1fr auto" gap={3} alignItems="start" mb={3}>
                      <FormControl>
                        <FormLabel fontSize="xs" color={textColor}>Title</FormLabel>
                        <Input
                          value={item.title || ''}
                          onChange={(e) => onUpdateContentItem(
                            index, 
                            itemIndex, 
                            'content',
                            'title',
                            e.target.value
                          )}
                          placeholder="Enter title"
                          size="sm"
                        />
                      </FormControl>
                      <IconButton
                        aria-label="Remove item"
                        icon={<CloseIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => onRemoveContentItem(
                          index, 
                          itemIndex, 
                          'content'
                        )}
                        mt={6}
                      />
                    </Grid>
                    <FormControl>
                      <FormLabel fontSize="xs" color={textColor}>Image</FormLabel>
                      <ImageUploadContainer
                        value={item.image_url}
                        uploadKey={`${index}-${itemIndex}-content`}
                        onUpload={() => document.getElementById(`item-image-${index}-${itemIndex}-content`).click()}
                        onClear={() => onClearContentItemImage(index, itemIndex, 'content')}
                        placeholder="Upload Image"
                        size="md"
                        isUploading={contentImageUploading[`${index}-${itemIndex}-content`]}
                        isDragging={contentImageDragging[`${index}-${itemIndex}-content`]}
                        progress={contentImageProgress[`${index}-${itemIndex}-content`] || 0}
                        preview={contentImagePreviews[`${index}-${itemIndex}-content`]}
                        onDragOver={(e) => {
                          e.preventDefault();
                          onContentImageDragOver(e, index, `${itemIndex}-content`);
                        }}
                        onDragLeave={() => onContentImageDragLeave(index, `${itemIndex}-content`)}
                        onDrop={(e) => onContentImageDrop(e, index, `${itemIndex}-content`, (files) => {
                          onContentItemImageUpload(files, index, itemIndex, 'content');
                        })}
                      />
                      <input
                        type="file"
                        id={`item-image-${index}-${itemIndex}-content`}
                        hidden
                        accept="image/*"
                        onChange={(e) => onContentItemImageUpload(e.target.files, index, itemIndex, 'content')}
                        disabled={contentImageUploading[`${index}-${itemIndex}-content`]}
                      />
                    </FormControl>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        </VStack>
      )}

      {block.type === 'text' && (
        <FormControl>
          <FormLabel fontSize="sm" color={textColor}>Content</FormLabel>
          <Box border="1px" borderColor="gray.200" borderRadius="md">
            <ReactQuill
              theme="snow"
              value={block.content?.html_content || ''}
              onChange={(value) => onUpdateBlock(index, 'content', { 
                ...block.content, 
                html_content: value 
              })}
              placeholder="Enter content..."
              style={{ height: '200px' }}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'align': [] }],
                  ['link', 'blockquote', 'code-block'],
                  ['clean']
                ],
              }}
            />
          </Box>
        </FormControl>
      )}

      {block.type === 'video' && (
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>Video URL</FormLabel>
            <Input
              value={block.video_url || ''}
              onChange={(e) => onUpdateBlock(index, 'video_url', e.target.value)}
              placeholder="Enter video URL"
              size="sm"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>Video Title</FormLabel>
            <Input
              value={block.title || ''}
              onChange={(e) => onUpdateBlock(index, 'title', e.target.value)}
              placeholder="Enter video title"
              size="sm"
            />
          </FormControl>
        </VStack>
      )}

      {block.type === 'remedy' && (
        <FormControl>
          <FormLabel fontSize="sm" color={textColor}>Select Remedy</FormLabel>
          <Select
            value={block.remedy_id || ''}
            onChange={(e) => onUpdateBlock(index, 'remedy_id', e.target.value)}
            placeholder="Choose a remedy"
            size="sm"
          >
            {availableRemedies.map(remedy => (
              <option key={remedy.id} value={remedy.id}>
                {remedy.title}
              </option>
            ))}
          </Select>
        </FormControl>
      )}

      {block.type === 'tip' && (
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>Tip Image</FormLabel>
            <ImageUploadContainer
              value={block.image_url}
              uploadKey={`${index}-image_url`}
              onUpload={() => document.getElementById(`content-image-${index}-image_url`).click()}
              onClear={() => onClearContentImage(index, 'image_url')}
              placeholder="Upload Tip Image"
              size="md"
              isUploading={contentImageUploading[`${index}-image_url`]}
              isDragging={contentImageDragging[`${index}-image_url`]}
              progress={contentImageProgress[`${index}-image_url`] || 0}
              preview={contentImagePreviews[`${index}-image_url`]}
              onDragOver={(e) => onContentImageDragOver(e, index, 'image_url')}
              onDragLeave={() => onContentImageDragLeave(index, 'image_url')}
              onDrop={(e) => onContentImageDrop(e, index, 'image_url')}
            />
            <input
              type="file"
              id={`content-image-${index}-image_url`}
              hidden
              accept="image/*"
              onChange={(e) => onContentImageUpload(e.target.files, index, 'image_url')}
              disabled={contentImageUploading[`${index}-image_url`]}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>Tip Content</FormLabel>
            <Box border="1px" borderColor="gray.200" borderRadius="md">
              <ReactQuill
                theme="snow"
                value={block.content?.html_content || ''}
                onChange={(value) => onUpdateBlock(index, 'content', { 
                  ...block.content, 
                  html_content: value 
                })}
                placeholder="Enter tip content..."
                style={{ height: '150px' }}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['link', 'blockquote', 'code-block'],
                    ['clean']
                  ],
                }}
              />
            </Box>
          </FormControl>
        </VStack>
      )}

      {block.type === 'image' && (
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>Image</FormLabel>
            <ImageUploadContainer
              value={block.image_url}
              uploadKey={`${index}-image_url`}
              onUpload={() => document.getElementById(`content-image-${index}-image_url`).click()}
              onClear={() => onClearContentImage(index, 'image_url')}
              placeholder="Upload Image"
              size="md"
              isUploading={contentImageUploading[`${index}-image_url`]}
              isDragging={contentImageDragging[`${index}-image_url`]}
              progress={contentImageProgress[`${index}-image_url`] || 0}
              preview={contentImagePreviews[`${index}-image_url`]}
              onDragOver={(e) => onContentImageDragOver(e, index, 'image_url')}
              onDragLeave={() => onContentImageDragLeave(index, 'image_url')}
              onDrop={(e) => onContentImageDrop(e, index, 'image_url')}
            />
            <input
              type="file"
              id={`content-image-${index}-image_url`}
              hidden
              accept="image/*"
              onChange={(e) => onContentImageUpload(e.target.files, index, 'image_url')}
              disabled={contentImageUploading[`${index}-image_url`]}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>Link URL (Optional)</FormLabel>
            <Input
              value={block.link_url || ''}
              onChange={(e) => onUpdateBlock(index, 'link_url', e.target.value)}
              placeholder="Enter link URL (optional)"
              size="sm"
            />
          </FormControl>
        </VStack>
      )}

      {block.type === 'pdf' && (
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>PDF File</FormLabel>
            <PdfUploadContainer
              value={block.pdf_url}
              uploadKey={`${index}-pdf_url`}
              onUpload={() => document.getElementById(`pdf-upload-${index}`).click()}
              onClear={() => {
                onUpdateBlock(index, 'pdf_url', '');
                onUpdateBlock(index, 'content', { 
                  ...block.content,
                  pdf_url: '' 
                });
              }}
              placeholder="Upload PDF"
              isUploading={contentImageUploading[`${index}-pdf_url`]}
              isDragging={contentImageDragging[`${index}-pdf_url`]}
              progress={contentImageProgress[`${index}-pdf_url`] || 0}
              onDragOver={(e) => onPdfDragOver && onPdfDragOver(e, index, 'pdf_url')}
              onDragLeave={() => onPdfDragLeave && onPdfDragLeave(index, 'pdf_url')}
              onDrop={(e) => onPdfDrop && onPdfDrop(e, index, 'pdf_url')}
              disabled={contentImageUploading[`${index}-pdf_url`]}
            />
            <input
              type="file"
              id={`pdf-upload-${index}`}
              hidden
              accept=".pdf"
              onChange={(e) => onPdfUpload(e.target.files, index)}
              disabled={contentImageUploading[`${index}-pdf_url`]}
            />
          </FormControl>
        </VStack>
      )}
    </Box>
  );
};

export default ContentBlockForm;
