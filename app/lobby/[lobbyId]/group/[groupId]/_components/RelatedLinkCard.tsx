"use client";

import { Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

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
        bg="white"
        border="3px solid"
        borderColor="rgba(255, 136, 0, 0.3)"
        borderRadius="lg"
        overflow="hidden"
      >
        <Skeleton h="120px" />
        <Box p={3}>
          <Skeleton h="20px" mb={2} />
          <Skeleton h="16px" />
        </Box>
      </Box>
    );
  }

  return (
    <a href={ogpData?.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", width: "100%" }}>
      <Box
        w="full"
        bg="white"
        border="3px solid"
        borderColor="rgba(255, 136, 0, 0.3)"
        borderRadius="lg"
        overflow="hidden"
        cursor="pointer"
        transition="all 0.2s ease"
        _hover={{
          borderColor: "#FF8800",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 15px rgba(255, 136, 0, 0.2)",
        }}
      >
        {/* Image */}
        <Box position="relative" w="full" h="120px" bg="#FFF8F0">
          <Image src={ogpData?.image} alt={ogpData?.title} w="full" h="full" objectFit="cover" />
        </Box>

        {/* Content */}
        <Box p={3}>
          <Text fontSize="sm" fontWeight="bold" color="#333" lineClamp={2} lineHeight="1.3" mb={1}>
            {ogpData?.title}
          </Text>
          {ogpData?.description && (
            <Text fontSize="xs" color="#666" lineClamp={2} lineHeight="1.3">
              {ogpData.description}
            </Text>
          )}
        </Box>
      </Box>
    </a>
  );
}
