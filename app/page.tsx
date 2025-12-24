import { Box, Button, Heading, VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack gap={6}>
        <Heading>Time Attack Quiz</Heading>
        <Button colorPalette="teal" size="lg">
          スタート
        </Button>
      </VStack>
    </Box>
  );
}
