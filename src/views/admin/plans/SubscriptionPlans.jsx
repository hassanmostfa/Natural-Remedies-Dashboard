import {
  Box,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Badge,
  SimpleGrid,
  VStack,
  Divider,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { FaSeedling, FaCrown, FaAward, FaCheck, FaGift } from 'react-icons/fa6';

const SubscriptionPlans = () => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const cardBg = useColorModeValue('white', 'gray.700');

  // Updated subscription plans data
  const staticData = [
    {
      id: 1,
      name: 'Rookie',
      price: '$0',
      period: 'Lifetime Access',
      subtitle: 'Perfect for beginners exploring natural remedies.',
      features: [
        'Access limited remedy library',
        'Watch free educational videos',
        'Add up to 10 items to your Kit',
        'Basic profile & preferences',
        'Standard notifications'
      ],
      status: 'active',
      icon: FaSeedling,
      colorScheme: 'green',
      isPopular: false,
    },
    {
      id: 2,
      name: 'Skilled',
      price: '$9.99',
      period: 'month or $99/year',
      subtitle: 'For those ready to go deeper into holistic healing.',
      features: [
        'Unlock all remedies',
        'Unlock all videos',
        'Add Unlimited remedies to kit',
        'AI Remedy Search',
        'Priority content access',
        'Smart search & filters',
        'Ad-free experience'
      ],
      status: 'active',
      icon: FaAward,
      colorScheme: 'blue',
      isPopular: true,
      trial: '3-Day Free Trial',
      savings: 'Save 17% with yearly plan',
    },
    {
      id: 3,
      name: 'Master',
      price: '$29.99',
      period: 'month or $249/year',
      subtitle: 'For serious users, practitioners, or holistic educators.',
      features: [
        'All Skilled features, plus:',
        'AI Remedy Assistant – get tailored suggestions based on symptoms',
        'Unlock all premium health courses',
        'Course progress tracking',
        'Remedy Scheduler',
        'Community badge and VIP perks'
      ],
      status: 'active',
      icon: FaCrown,
      colorScheme: 'purple',
      isPopular: false,
      trial: '3-Day Free Trial',
      savings: 'Save 30% with yearly plan',
    },
  ];



  const PlanCard = ({ plan }) => (
    <Card
      p="6"
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      position="relative"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
    >
      {plan.isPopular && (
        <Badge
          position="absolute"
          top="4"
          right="0"
          transform="rotate(90deg)"
          colorScheme="yellow"
          borderRadius="full"
          px="1"
          py="1"
          fontSize="xs"
          fontWeight="bold"
        >
          Popular
        </Badge>
      )}
      
      <VStack spacing="4" align="stretch">
        {/* Header */}
        <Flex align="center" gap="3">
          <Icon 
            as={plan.icon} 
            color={`${plan.colorScheme}.500`} 
            boxSize="24px"
          />
          <VStack align="start" spacing="0">
            <Text color={textColor} fontSize="xl" fontWeight="bold">
              {plan.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {plan.subtitle}
            </Text>
          </VStack>
        </Flex>

        <Divider />

        {/* Price */}
        <VStack spacing="1">
          <Text fontSize="3xl" fontWeight="bold" color={textColor}>
            {plan.price}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {plan.period}
          </Text>
          {plan.trial && (
            <Badge colorScheme="green" fontSize="xs" px="2" py="1">
              {plan.trial}
            </Badge>
          )}
        </VStack>

        <Divider />

        {/* Features */}
        <VStack spacing="2" align="start">
          {plan.features.map((feature, index) => (
            <Flex key={index} align="center" gap="2">
              <Icon as={FaCheck} color="green.500" boxSize="14px" />
              <Text fontSize="sm" color={textColor}>
                {feature}
              </Text>
            </Flex>
          ))}
        </VStack>

        {/* Savings */}
        {plan.savings && (
          <Box
            bg={`${plan.colorScheme}.50`}
            p="3"
            borderRadius="md"
            border="1px solid"
            borderColor={`${plan.colorScheme}.200`}
          >
            <Flex align="center" gap="2">
              <Icon as={FaGift} color={`${plan.colorScheme}.500`} boxSize="16px" />
              <Text fontSize="sm" color={`${plan.colorScheme}.700`} fontWeight="medium">
                {plan.savings}
              </Text>
            </Flex>
          </Box>
        )}
      </VStack>
    </Card>
  );

  return (
    <div className="container">
        <Box px="25px" pb="25px">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
            {staticData.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </SimpleGrid>
        </Box>
    </div>
  );
};

export default SubscriptionPlans;