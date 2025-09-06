import {
  Box,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Spinner,
  VStack,
  Text,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Divider,
  Image,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import MiniStatistics from "components/card/MiniStatistics";
import {
  MdOutlineGroup,
  MdAssignment,
  MdTrendingUp,
  MdAccountBalance,
  MdLocalHospital,
  MdSchool,
  MdArticle,
  MdPeople,
  MdStar,
  MdVideoLibrary,
  MdAttachMoney,
  MdShoppingCart,
  MdReviews,
  MdPersonAdd,
  MdBook,
  MdSubscriptions,
} from "react-icons/md";
import { useGetStatsQuery } from "api/staticsSlice";
import * as React from "react";

export default function UserReports() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardBg = useColorModeValue("white", "navy.800");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");
  const tableHoverBg = useColorModeValue("gray.50", "gray.700");

  // API hook for statistics
  const { data: statsResponse, isLoading, isError } = useGetStatsQuery();
  const statsData = statsResponse?.data;

  // Create overview cards from API response
  const overviewCards = React.useMemo(() => {
    if (!statsData?.overview) return [];
    
    return [
      { 
        name: "Total Users", 
        value: statsData.overview.total_users?.toString() || "0", 
        icon: MdPeople,
        color: "blue.500"
      },
      { 
        name: "Active Users", 
        value: statsData.overview.active_users?.toString() || "0", 
        icon: MdPersonAdd,
        color: "green.500"
      },
      { 
        name: "Total Courses", 
        value: statsData.overview.total_courses?.toString() || "0", 
        icon: MdBook,
        color: "purple.500"
      },
      { 
        name: "Total Revenue", 
        value: `$${statsData.overview.total_revenue?.toFixed(2) || "0.00"}`, 
        icon: MdAttachMoney,
        color: "orange.500"
      },
      { 
        name: "Monthly Revenue", 
        value: `$${statsData.overview.monthly_revenue?.toFixed(2) || "0.00"}`, 
        icon: MdTrendingUp,
        color: "teal.500"
      },
      { 
        name: "Active Subscriptions", 
        value: statsData.overview.total_subscriptions?.toString() || "0", 
        icon: MdSubscriptions,
        color: "pink.500"
      },
      { 
        name: "Pending Reviews", 
        value: statsData.overview.pending_reviews?.toString() || "0", 
        icon: MdReviews,
        color: "yellow.500"
      },
      { 
        name: "Active Courses", 
        value: statsData.overview.active_courses?.toString() || "0", 
        icon: MdSchool,
        color: "cyan.500"
      },
    ];
  }, [statsData]);

  // Loading state
  if (isLoading) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <VStack spacing={4} justify="center" align="center" h="200px">
          <Spinner size="xl" color="#422afb" thickness="4px" />
          <Text color={textColor}>Loading dashboard statistics...</Text>
        </VStack>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <VStack spacing={4} justify="center" align="center" h="200px">
          <Text color="red.500">Error loading dashboard statistics. Please try again.</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Overview Statistics Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4}} gap="20px" mb="30px">
        {overviewCards.map((card, index) => (
          <MiniStatistics
            key={index}
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={<Icon w="32px" h="32px" as={card.icon} color={card.color} />}
              />
            }
            name={card.name}
            value={card.value}
          />
        ))}
      </SimpleGrid>

      {/* Revenue Section */}
      {statsData?.revenue && (
        <Card bg={cardBg} mb="30px">
          <CardHeader>
            <Heading size="md" color={textColor}>Revenue Analytics</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4}} gap="20px">
              <Stat>
                <StatLabel>Total Revenue</StatLabel>
                <StatNumber color="green.500">${statsData.revenue.total_revenue?.toFixed(2)}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Course Revenue</StatLabel>
                <StatNumber color="blue.500">${statsData.revenue.course_revenue}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Subscription Revenue</StatLabel>
                <StatNumber color="purple.500">${statsData.revenue.subscription_revenue}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Average Course Price</StatLabel>
                <StatNumber color="orange.500">${statsData.revenue.average_course_price}</StatNumber>
              </Stat>
            </SimpleGrid>
          </CardBody>
        </Card>
      )}

      {/* Users Analytics */}
      {statsData?.users && (
        <Card bg={cardBg} mb="30px">
          <CardHeader>
            <Heading size="md" color={textColor}>Users Analytics</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3}} gap="20px" mb="20px">
              <Stat>
                <StatLabel>Total Users</StatLabel>
                <StatNumber color="blue.500">{statsData.users.total_users}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {statsData.users.new_users_this_month} this month
                </StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Active Users</StatLabel>
                <StatNumber color="green.500">{statsData.users.active_users}</StatNumber>
                <StatHelpText>
                  {statsData.users.inactive_users} inactive
                </StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Verified Users</StatLabel>
                <StatNumber color="purple.500">{statsData.users.verified_users}</StatNumber>
                <StatHelpText>
                  {statsData.users.users_with_subscriptions} with subscriptions
                </StatHelpText>
              </Stat>
            </SimpleGrid>
            
            {/* Users by Plan */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb="10px" color={textColor}>Users by Subscription Plan</Text>
              <SimpleGrid columns={{ base: 1, md: 3}} gap="10px">
                {statsData.users.users_by_plan?.map((plan, index) => (
                  <HStack key={index} justify="space-between" p="10px" bg={boxBg} borderRadius="md">
                    <Text fontWeight="medium" color={textColor}>{plan.subscription_plan}</Text>
                    <Badge colorScheme="blue" fontSize="sm">{plan.count} users</Badge>
                  </HStack>
                ))}
              </SimpleGrid>
            </Box>
          </CardBody>
        </Card>
      )}

      {/* Courses Section */}
      {statsData?.courses && (
        <Card bg={cardBg} mb="30px">
          <CardHeader>
            <Heading size="md" color={textColor}>Courses Analytics</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4}} gap="20px" mb="20px">
              <Stat>
                <StatLabel>Total Courses</StatLabel>
                <StatNumber color="purple.500">{statsData.courses.total_courses}</StatNumber>
                <StatHelpText>{statsData.courses.active_courses} active</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Total Purchases</StatLabel>
                <StatNumber color="green.500">{statsData.courses.total_purchases}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Course Revenue</StatLabel>
                <StatNumber color="orange.500">${statsData.courses.total_course_revenue}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Avg Lessons/Course</StatLabel>
                <StatNumber color="teal.500">{statsData.courses.average_lessons_per_course}</StatNumber>
              </Stat>
            </SimpleGrid>

            {/* Popular Courses */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb="10px" color={textColor}>Most Popular Courses</Text>
              <SimpleGrid columns={{ base: 1, md: 2}} gap="15px">
                {statsData.courses.most_popular_courses?.slice(0, 4).map((course, index) => (
                  <Box key={index} p="15px" bg={boxBg} borderRadius="md">
                    <HStack spacing="10px">
                      {course.image && (
                        <Image 
                          src={course.image} 
                          alt={course.title}
                          boxSize="50px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      )}
                      <Box flex="1">
                        <Text fontWeight="bold" fontSize="sm" color={textColor} noOfLines={1}>
                          {course.title}
                        </Text>
                        <Text fontSize="xs" color="gray.500" noOfLines={1}>
                          {course.description}
                        </Text>
                        <HStack mt="5px">
                          <Badge colorScheme="green" fontSize="xs">${course.price}</Badge>
                          <Badge colorScheme="blue" fontSize="xs">{course.plan}</Badge>
                          <Text fontSize="xs" color="gray.500">{course.purchases_count} purchases</Text>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </CardBody>
        </Card>
      )}

      {/* Recent Activity */}
      {statsData?.recent_activity && (
        <SimpleGrid columns={{ base: 1, lg: 2}} gap="20px" mb="30px">
          {/* Recent Users */}
          <Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <CardHeader pb="0">
              <Heading size="md" color={textColor} display="flex" alignItems="center" gap="2">
                <Icon as={MdPeople} color="blue.500" />
                Recent Users
              </Heading>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr bg={tableHeaderBg}>
                      <Th color={textColor} fontWeight="bold" textTransform="none" fontSize="sm">Name</Th>
                      <Th color={textColor} fontWeight="bold" textTransform="none" fontSize="sm">Email</Th>
                      <Th color={textColor} fontWeight="bold" textTransform="none" fontSize="sm">Joined</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {statsData.recent_activity.recent_users?.slice(0, 5).map((user, index) => (
                      <Tr 
                        key={user.id} 
                        _hover={{ 
                          bg: tableHoverBg,
                          transform: "translateY(-1px)",
                          borderLeftColor: "blue.500"
                        }}
                        transition="all 0.2s"
                        borderLeft="3px solid transparent"
                      >
                        <Td>
                          <HStack>
                            <Box 
                              w="8" 
                              h="8" 
                              bg="blue.100" 
                              borderRadius="full" 
                              display="flex" 
                              alignItems="center" 
                              justifyContent="center"
                              color="blue.600"
                              fontWeight="bold"
                              fontSize="sm"
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </Box>
                            <Text fontWeight="medium" color={textColor}>{user.name}</Text>
                          </HStack>
                        </Td>
                        <Td fontSize="sm" color="gray.600">{user.email}</Td>
                        <Td fontSize="sm" color="gray.500">
                          <Badge colorScheme="gray" variant="subtle">
                            {new Date(user.created_at).toLocaleDateString()}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>

          {/* Recent Course Purchases */}
          <Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <CardHeader pb="0">
              <Heading size="md" color={textColor} display="flex" alignItems="center" gap="2">
                <Icon as={MdShoppingCart} color="green.500" />
                Recent Course Purchases
              </Heading>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr bg={tableHeaderBg}>
                      <Th color={textColor} fontWeight="bold" textTransform="none" fontSize="sm">User</Th>
                      <Th color={textColor} fontWeight="bold" textTransform="none" fontSize="sm">Course</Th>
                      <Th color={textColor} fontWeight="bold" textTransform="none" fontSize="sm">Amount</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {statsData.recent_activity.recent_course_purchases?.slice(0, 5).map((purchase) => (
                      <Tr 
                        key={purchase.id}
                        _hover={{ 
                          bg: tableHoverBg,
                          transform: "translateY(-1px)",
                          borderLeftColor: "green.500"
                        }}
                        transition="all 0.2s"
                        borderLeft="3px solid transparent"
                      >
                        <Td>
                          <HStack>
                            <Box 
                              w="8" 
                              h="8" 
                              bg="green.100" 
                              borderRadius="full" 
                              display="flex" 
                              alignItems="center" 
                              justifyContent="center"
                              color="green.600"
                              fontWeight="bold"
                              fontSize="sm"
                            >
                              {purchase.user.name.charAt(0).toUpperCase()}
                            </Box>
                            <Text fontWeight="medium" color={textColor}>{purchase.user.name}</Text>
                          </HStack>
                        </Td>
                        <Td fontSize="sm" color="gray.600" maxW="200px" noOfLines={1}>
                          {purchase.course.title}
                        </Td>
                        <Td fontSize="sm">
                          <Badge colorScheme="green" variant="solid" px="3" py="1" borderRadius="full">
                            ${purchase.amount_paid}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

      {/* Recent Reviews */}
      {statsData?.recent_activity?.recent_reviews && (
        <Card bg={cardBg} mb="30px" borderRadius="xl" boxShadow="lg">
          <CardHeader pb="0">
            <Heading size="md" color={textColor} display="flex" alignItems="center" gap="2">
              <Icon as={MdReviews} color="yellow.500" />
              Recent Reviews
            </Heading>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr bg={tableHeaderBg}>
                    <Th color={textColor} fontWeight="bold" textTransform="none" fontSize="sm">User</Th>
                    <Th color={textColor} fontWeight="bold" textTransform="none" fontSize="sm">Type</Th>
                    <Th color={textColor} fontWeight="bold" textTransform="none" fontSize="sm">Rating</Th>
                    <Th color={textColor} fontWeight="bold" textTransform="none" fontSize="sm">Message</Th>
                    <Th color={textColor} fontWeight="bold" textTransform="none" fontSize="sm">Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {statsData.recent_activity.recent_reviews?.slice(0, 5).map((review) => (
                    <Tr 
                      key={review.id}
                      _hover={{ 
                        bg: tableHoverBg,
                        transform: "translateY(-1px)",
                        borderLeftColor: "yellow.500"
                      }}
                      transition="all 0.2s"
                      borderLeft="3px solid transparent"
                    >
                      <Td>
                        <HStack>
                          <Box 
                            w="8" 
                            h="8" 
                            bg="yellow.100" 
                            borderRadius="full" 
                            display="flex" 
                            alignItems="center" 
                            justifyContent="center"
                            color="yellow.600"
                            fontWeight="bold"
                            fontSize="sm"
                          >
                            {review.user.name.charAt(0).toUpperCase()}
                          </Box>
                          <Text fontWeight="medium" color={textColor}>{review.user.name}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <Badge 
                          colorScheme="blue" 
                          variant="subtle" 
                          px="3" 
                          py="1" 
                          borderRadius="full"
                          textTransform="capitalize"
                        >
                          {review.type}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack>
                          <Text fontWeight="bold" color={textColor}>{review.rate}</Text>
                          <Icon as={MdStar} color="yellow.400" />
                        </HStack>
                      </Td>
                      <Td fontSize="sm" maxW="200px" noOfLines={1} color="gray.600">
                        {review.message}
                      </Td>
                      <Td>
                        <Badge 
                          colorScheme={review.status === 'accepted' ? 'green' : review.status === 'pending' ? 'yellow' : 'red'}
                          variant="solid"
                          px="3" 
                          py="1" 
                          borderRadius="full"
                          textTransform="capitalize"
                        >
                          {review.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      )}
    </Box>
  );
}
