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
  MdOutlineLocalPharmacy,
  MdOutlineMedicalServices,
  MdOutlineStore,
  MdOutlineShoppingCart,
  MdOutlineEventNote,
  MdOutlinePerson,
  MdOutlineBrandingWatermark,
} from "react-icons/md";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import CheckTable from "views/admin/default/components/CheckTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import ComplexTable from "views/admin/default/components/ComplexTable";
import Tasks from "views/admin/default/components/Tasks";
import MiniCalendar from "components/calendar/MiniCalendar";
import { columnsDataCheck, columnsDataComplex } from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";

import { AiOutlineProduct } from "react-icons/ai";
import { LuShoppingBasket } from "react-icons/lu";
import { LuLayers3 } from "react-icons/lu";
import { MdFamilyRestroom } from "react-icons/md";


export default function UserReports() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const cardData = [
    { name: "Total Admins", value: "25", icon: MdOutlineGroup },
    { name: "Total Pharmacy", value: "150", icon: MdOutlineLocalPharmacy },
    { name: "Total Doctors", value: "75", icon: MdOutlineMedicalServices },
    { name: "Total Clinics", value: "40", icon: MdOutlineStore },
    { name: "Total Orders", value: "5,235", icon: MdOutlineShoppingCart },
    { name: "Total Appointments", value: "2,345", icon: MdOutlineEventNote },
    { name: "Total Users", value: "10,000", icon: MdOutlinePerson },
    { name: "Total Brands", value: "320", icon: MdOutlineBrandingWatermark },
    { name: "Total Products", value: "1,000", icon: LuShoppingBasket },
    { name: "Total Product Types", value: "5", icon: AiOutlineProduct },
    { name: "Total Categories", value: "100", icon: LuLayers3 },
    { name: "Total Family Accounts", value: "5", icon: MdFamilyRestroom },
  ];

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Updated Cards Section */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="20px" mb="20px">
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

      {/* Existing Components Below */}
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} title="Highest Requested Pharmacy" />
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} title="Highest Booked Doctors" />
      </SimpleGrid>
    </Box>
  );
}
