"use client";

import { Box, Grid, HStack, Text } from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";
import { RelatedLinkCard } from "./RelatedLinkCard";

type Props = {
  links: string[];
};

export function RelatedLinks({ links }: Props) {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <Box w="full" mt={4} pt={6} borderTop="2px dashed" borderColor="gray.200">
      {/* Section Header */}
      <HStack mb={3} color="gray.500" gap={2}>
        <LuExternalLink size={16} />
        <Text fontSize="sm" fontWeight="medium">
          もっと調べる（正解が載ってるかも！？）
        </Text>
      </HStack>

      {/* Link Cards Grid */}
      <Grid templateColumns="repeat(3, 1fr)" gap={3} w="full">
        {links.map((link) => (
          <RelatedLinkCard key={link} url={link} />
        ))}
      </Grid>
    </Box>
  );
}
