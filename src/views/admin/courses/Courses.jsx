import {
  Box,
  Button,
  Flex,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Badge,
  Image,
  Avatar,
  HStack,
  VStack,
  Progress,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import Card from 'components/card/Card';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, PlusSquareIcon, SearchIcon } from '@chakra-ui/icons';
import { FaEye, FaTrash, FaPlay, FaStar, FaUsers, FaClock, FaDollarSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper();

const Courses = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Static courses data
  const staticData = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      title: 'Natural Healing Fundamentals',
      description: 'Learn the basics of natural healing and herbal medicine',
      duration: '8 weeks',
      sessionsNumber: 24,
      price: 99.99,
      plan: 'Master Plan',
      overview: 'Comprehensive course covering natural healing principles, herbal medicine basics, and practical applications for common health issues.',
      courseContent: [
        { title: 'Introduction to Herbal Medicine', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop' },
        { title: 'Essential Oils and Aromatherapy', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop' },
        { title: 'Natural Remedies for Common Ailments', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=50&h=50&fit=crop' }
      ],
      instructors: [
        { name: 'Dr. Sarah Johnson', description: 'Certified Herbalist with 15+ years experience', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop' }
      ],
      reviews: {
        rating: 4.8,
        count: 156,
        comments: [
          { user: 'John D.', rating: 5, comment: 'Excellent course! Very informative and well-structured.' },
          { user: 'Maria S.', rating: 4, comment: 'Great content, learned a lot about natural healing.' }
        ]
      },
      relatedCourses: [2, 3],
      status: 'active',
      enrolledStudents: 342,
      selectedRemedies: ['Ginger Honey Tea', 'Lavender Oil Massage'],
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100&h=100&fit=crop',
      title: 'Advanced Herbal Formulations',
      description: 'Master the art of creating effective herbal remedies',
      duration: '12 weeks',
      sessionsNumber: 36,
      price: 149.99,
      plan: 'Premium Plan',
      overview: 'Advanced course focusing on creating custom herbal formulations, understanding herb interactions, and developing professional-grade remedies.',
      courseContent: [
        { title: 'Herb Interactions and Safety', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop' },
        { title: 'Formulation Techniques', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop' },
        { title: 'Quality Control and Testing', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=50&h=50&fit=crop' }
      ],
      instructors: [
        { name: 'Dr. Michael Chen', description: 'Pharmaceutical researcher specializing in herbal medicine', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop' },
        { name: 'Prof. Lisa Rodriguez', description: 'Botany professor with expertise in medicinal plants', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop' }
      ],
      reviews: {
        rating: 4.9,
        count: 89,
        comments: [
          { user: 'Alex K.', rating: 5, comment: 'Incredible depth of knowledge. Highly recommended!' },
          { user: 'Emma W.', rating: 5, comment: 'Perfect for advanced practitioners.' }
        ]
      },
      relatedCourses: [1, 3],
      status: 'active',
      enrolledStudents: 156,
      selectedRemedies: ['Peppermint Capsules'],
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop',
      title: 'Holistic Wellness Practices',
      description: 'Integrate natural healing into daily wellness routines',
      duration: '6 weeks',
      sessionsNumber: 18,
      price: 79.99,
      plan: 'Basic Plan',
      overview: 'Practical course teaching how to incorporate natural healing practices into daily life for overall wellness and prevention.',
      courseContent: [
        { title: 'Daily Wellness Routines', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop' },
        { title: 'Seasonal Health Practices', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50&h=50&fit=crop' },
        { title: 'Mind-Body Connection', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=50&h=50&fit=crop' }
      ],
      instructors: [
        { name: 'Dr. Emily Watson', description: 'Wellness coach and certified nutritionist', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop' }
      ],
      reviews: {
        rating: 4.7,
        count: 203,
        comments: [
          { user: 'David L.', rating: 4, comment: 'Great practical tips for daily wellness.' },
          { user: 'Sophie M.', rating: 5, comment: 'Changed my approach to health completely!' }
        ]
      },
      relatedCourses: [1, 2],
      status: 'active',
      enrolledStudents: 289,
      selectedRemedies: ['Ginger Honey Tea', 'Lavender Oil Massage', 'Peppermint Capsules'],
    },
  ];

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return staticData;
    return staticData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  const columns = [
    columnHelper.accessor('image', {
      id: 'image',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Image
        </Text>
      ),
      cell: (info) => (
        <Avatar
          src={info.getValue()}
          size="md"
          borderRadius="lg"
          fallback={<Icon as={FaPlay} color="blue.500" />}
        />
      ),
    }),
    columnHelper.accessor('title', {
      id: 'title',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Course
        </Text>
      ),
      cell: (info) => (
        <VStack align="start" spacing={1}>
          <Text color={textColor} fontWeight="bold" fontSize="sm">
            {info.getValue()}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={2}>
            {info.row.original.description}
          </Text>
        </VStack>
      ),
    }),
    columnHelper.accessor('duration', {
      id: 'duration',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Duration
        </Text>
      ),
      cell: (info) => (
        <HStack spacing={2}>
          <Icon as={FaClock} color="blue.500" size="sm" />
          <Text color={textColor} fontSize="sm">
            {info.getValue()}
          </Text>
        </HStack>
      ),
    }),
    columnHelper.accessor('sessionsNumber', {
      id: 'sessionsNumber',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Sessions
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="medium">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('price', {
      id: 'price',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Price
        </Text>
      ),
      cell: (info) => (
        <HStack spacing={1}>
          <Icon as={FaDollarSign} color="green.500" size="sm" />
          <Text color={textColor} fontSize="sm" fontWeight="medium">
            {info.getValue()}
          </Text>
        </HStack>
      ),
    }),
    columnHelper.accessor('plan', {
      id: 'plan',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Plan
        </Text>
      ),
      cell: (info) => (
        <Badge 
          colorScheme="purple"
          px="2"
          py="1"
          borderRadius="full"
          fontSize="xs"
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('reviews.rating', {
      id: 'rating',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Rating
        </Text>
      ),
      cell: (info) => (
        <HStack spacing={1}>
          <Icon as={FaStar} color="yellow.400" size="sm" />
          <Text color={textColor} fontSize="sm" fontWeight="medium">
            {info.getValue()}
          </Text>
          <Text color="gray.500" fontSize="xs">
            ({info.row.original.reviews.count})
          </Text>
        </HStack>
      ),
    }),
    columnHelper.accessor('enrolledStudents', {
      id: 'enrolledStudents',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Students
        </Text>
      ),
      cell: (info) => (
        <HStack spacing={1}>
          <Icon as={FaUsers} color="purple.500" size="sm" />
          <Text color={textColor} fontSize="sm" fontWeight="medium">
            {info.getValue()}
          </Text>
        </HStack>
      ),
    }),
    columnHelper.accessor('selectedRemedies', {
      id: 'selectedRemedies',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Remedies
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {info.getValue().length} items
        </Text>
      ),
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Status
        </Text>
      ),
      cell: (info) => (
        <Badge 
          colorScheme={info.getValue() === 'active' ? 'green' : 'red'}
          px="2"
          py="1"
          borderRadius="full"
          fontSize="xs"
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('id', {
      id: 'actions',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Actions
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="red.500"
            as={FaTrash}
            cursor="pointer"
            onClick={() => handleDeleteCourse(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => handleEditCourse(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => handleViewCourse(info.getValue())}
          />
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleViewCourse = (id) => {
    navigate(`/admin/course/details/${id}`);
  };

  const handleEditCourse = (id) => {
    navigate(`/admin/edit-course/${id}`);
  };

  const handleDeleteCourse = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        // In a real app, you would call your API here
        // await api.delete(`/courses/${id}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        Swal.fire(
          'Deleted!',
          'Course has been deleted.',
          'success'
        );

        // Refresh the data or remove from state
        // setCourses(courses.filter(course => course.id !== id));
      } catch (error) {
        console.error('Failed to delete course:', error);
        Swal.fire(
          'Error!',
          'Failed to delete course.',
          'error'
        );
      }
    }
  };

  const handleAddCourse = () => {
    navigate('/admin/add-course');
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card>
        <Flex
          direction="column"
          w="100%"
          overflowX={{ sm: 'scroll', lg: 'hidden' }}
        >
          <Flex
            align={{ sm: 'flex-start', lg: 'center' }}
            justify="space-between"
            w="100%"
            px="22px"
            pb="20px"
            mb="10px"
            boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.06)"
          >
            <Text color={textColor} fontSize="xl" fontWeight="600">
              Courses Management
            </Text>
            <Button
              leftIcon={<PlusSquareIcon />}
              colorScheme="blue"
              onClick={handleAddCourse}
            >
              Add Course
            </Button>
          </Flex>

          <Flex
            align={{ sm: 'flex-start', lg: 'center' }}
            justify="space-between"
            w="100%"
            px="22px"
            pb="20px"
          >
            <InputGroup maxW="400px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Flex>

          <Box overflowX="auto">
            <Table variant="simple" color="gray.500" mb="24px">
              <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th
                        key={header.id}
                        pe="10px"
                        borderColor={borderColor}
                        cursor="pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <Flex
                          justifyContent="space-between"
                          align="center"
                          fontSize={{ sm: '10px', lg: '12px' }}
                          color="gray.400"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Flex>
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Td
                        key={cell.id}
                        fontSize={{ sm: '14px' }}
                        minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                        borderColor="transparent"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};

export default Courses;
