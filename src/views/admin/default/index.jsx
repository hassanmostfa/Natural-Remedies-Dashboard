import {
  Box,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import MiniStatistics from "components/card/MiniStatistics";
import {
  MdOutlineGroup,
  MdOutlineShoppingCart,
  MdAssignment,
  MdPayment,
  MdTrendingUp,
  MdAccountBalance,
  MdLocalHospital,
  MdSchool,
  MdArticle,
  MdPeople,
  MdStar,
  MdVideoLibrary,
} from "react-icons/md";
import CheckTable from "views/admin/default/components/CheckTable";
import { columnsDataCheck } from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import SubscriptionGrowth from "views/admin/default/components/SubscriptionGrowth";
import PaymentTransactions from "views/admin/default/components/PaymentTransactions";
import TotalRevenue from "views/admin/default/components/TotalRevenue";
import SubscriptionTable from "views/admin/default/components/SubscriptionTable";
import PaymentTable from "views/admin/default/components/PaymentTable";

import { LuShoppingBasket } from "react-icons/lu";

export default function UserReports() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const cardData = [
    { name: "Total Admins", value: "25", icon: MdOutlineGroup },
    { name: "Active Subscriptions", value: "1,247", icon: MdTrendingUp },
    { name: "Total Revenue", value: "$266.8K", icon: MdAccountBalance },
    { name: "Payment Success Rate", value: "94.1%", icon: MdPayment },
    { name: "Total Remedies", value: "342", icon: MdLocalHospital },
    { name: "Active Courses", value: "18", icon: MdSchool },
    { name: "Published Articles", value: "156", icon: MdArticle },
    { name: "Registered Users", value: "8,934", icon: MdPeople },
    { name: "Average Rating", value: "4.7", icon: MdStar },
    { name: "Video Content", value: "89", icon: MdVideoLibrary },
    { name: "Remedy Types", value: "24", icon: MdAssignment },
    { name: "Instructors", value: "12", icon: MdOutlineGroup },
  ];

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Updated Cards Section */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="20px" mb="20px">
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

      {/* Subscription Growth and Payment Transactions */}
      {/* <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <SubscriptionGrowth />
        <PaymentTransactions />
      </SimpleGrid> */}

      {/* Total Revenue */}
      {/* <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        <TotalRevenue />
      </SimpleGrid> */}

      {/* Subscription and Payment Tables */}
      {/* <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <SubscriptionTable />
        <PaymentTable />
      </SimpleGrid> */}
    </Box>
  );
}
