"use client";

import { Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuExternalLink } from "react-icons/lu";

type OGPData = {
  url: string;
  title: string;
  description: string;
  image: string;
};

type Props = {
  url: string;
};

export function RelatedLinkCard({ url }: Props) {
  const [ogpData, setOgpData] = useState<OGPData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOGP = async () => {
      try {
        const response = await fetch(`/api/ogp?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        setOgpData(data);
      } catch (error) {
        console.error("Failed to fetch OGP:", error);
        setOgpData({
          url,
          title: url,
          description: "",
          image: "/images/default-link-card.png",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOGP();
  }, [url]);

  if (isLoading) {
    return (
      <Box
        w="full"
        bg="#F8F9FA"
        border="2px solid"
        borderColor="gray.200"
        borderRadius="md"
        overflow="hidden"
      >
        <Skeleton h="80px" />
        <Box p={2}>
          <Skeleton h="16px" mb={1} />
          <Skeleton h="12px" />
        </Box>
      </Box>
    );
  }

  return (
    <a href={ogpData?.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", width: "100%" }}>
      <Box
        w="full"
        bg="#F8F9FA"
        border="2px solid"
        borderColor="gray.200"
        borderRadius="md"
        overflow="hidden"
        cursor="pointer"
        transition="all 0.2s ease"
        position="relative"
        _hover={{
          borderColor: "#4A90D9",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(74, 144, 217, 0.15)",
        }}
      >
        {/* External Link Icon Badge */}
        <Flex
          position="absolute"
          top={2}
          right={2}
          zIndex={1}
          w="24px"
          h="24px"
          bg="white"
          borderRadius="full"
          align="center"
          justify="center"
          boxShadow="0 1px 3px rgba(0,0,0,0.15)"
        >
          <LuExternalLink size={12} color="#4A90D9" />
        </Flex>

        {/* Image */}
        <Box position="relative" w="full" h="80px" bg="#E8ECF0">
          <Image src={ogpData?.image} alt={ogpData?.title} w="full" h="full" objectFit="cover" />
        </Box>

        {/* Content */}
        <Box p={2}>
          <Text fontSize="xs" fontWeight="semibold" color="#444" lineClamp={2} lineHeight="1.3">
            {ogpData?.title}
          </Text>
        </Box>
      </Box>
    </a>
  );
}
