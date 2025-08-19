import {
  Box,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Spinner,
  VStack,
  Text,
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
} from "react-icons/md";
import { useGetStaticsQuery } from "api/staticsSlice";
import * as React from "react";

export default function UserReports() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");

  // API hook for statistics
  const { data: statsData, isLoading, isError } = useGetStaticsQuery();

  // Create card data from API response
  const cardData = React.useMemo(() => {
    if (!statsData) return [];
    
    return [
      { name: "Total Admins", value: statsData.admins?.toString() || "0", icon: MdOutlineGroup },
      { name: "Registered Users", value: statsData.users?.toString() || "0", icon: MdPeople },
      { name: "Total Remedies", value: statsData.remedies?.toString() || "0", icon: MdLocalHospital },
      { name: "Remedy Types", value: statsData.remedy_types?.toString() || "0", icon: MdAssignment },
      { name: "Published Articles", value: statsData.articles?.toString() || "0", icon: MdArticle },
      { name: "Video Content", value: statsData.videos?.toString() || "0", icon: MdVideoLibrary },
      { name: "Instructors", value: statsData.instructors?.toString() || "0", icon: MdOutlineGroup },
      { name: "Feedback", value: statsData.feedback?.toString() || "0", icon: MdStar },
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
      {/* Statistics Cards Section */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 2}} gap="20px" mb="20px">
        {cardData.map((card, index) => (
          <MiniStatistics
            key={index}
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={<Icon w="32px" h="32px" as={card.icon} color={brandColor} />}
              />
            }
            name={card.name}
            value={card.value}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
