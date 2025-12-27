"use client"

import { Grid } from "@chakra-ui/react"
import { RelatedLinkCard } from "./RelatedLinkCard"

type Props = {
	links: string[]
}

export function RelatedLinks({ links }: Props) {
	if (!links || links.length === 0) {
		return null
	}

	return (
		<Grid
			templateColumns="repeat(3, 1fr)"
			gap={4}
			w="full"
		>
			{links.map((link) => (
				<RelatedLinkCard key={link} url={link} />
			))}
		</Grid>
	)
}
