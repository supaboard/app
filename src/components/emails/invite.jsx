import { Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components"
import * as React from "react"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL : ""

export const InvitationEmail = ({team_name, role}) => (
	<Html>
		<Head />
		<Preview>You&apos;ve been invited to join Supaboard</Preview>
		<Body style={main}>
			<Container style={container}>
				<Img
					src={`${baseUrl}/img/full-logo.png`}
					width="240"
					height="57"
					alt="Supabaord"
					style={logo}
				/>
				<Heading style={heading}>Your Supaboard invitation</Heading>
				<Text style={paragraph}>
					<>
						{team_name && (
							<>
								You&apos;ve been invited to join {team_name} on Supaboard. Click the button below create an account and get started.
							</>
						)}
						{(!team_name || team_name == "") && (
							<>You&apos;ve been invited to join a team on Supaboard. Click the button below create an account and get started.</>
						)}
					</>
				</Text>
				<Section style={buttonContainer}>
					<Button pY={11} pX={23} style={button} href="https://supaboard.co/register">
						Join team
					</Button>
				</Section>
				<Hr style={hr} />
				<Text style={smallparagraph}>
					This email was likely sent  from a team member. If this is not the case, you can safely ignore it.
				</Text>
				<Link href="https://supaboard.co" style={reportLink}>
					Supaboard.co
				</Link>
			</Container>
		</Body>
	</Html>
)

export default InvitationEmail

const logo = {
	borderRadius: 21,
	width: 42,
	height: 42,
}

const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Oxygen-Sans,Ubuntu,Cantarell,\"Helvetica Neue\",sans-serif",
}

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
	width: "560px",
}

const heading = {
	fontSize: "24px",
	letterSpacing: "-0.5px",
	lineHeight: "1.3",
	fontWeight: "400",
	color: "#484848",
	padding: "17px 0 0",
}

const paragraph = {
	margin: "0 0 15px",
	fontSize: "15px",
	lineHeight: "1.4",
	color: "#3c4149",
}

const smallparagraph = {
	margin: "0 0 15px",
	fontSize: "12px",
	lineHeight: "1.4",
	color: "#b4becc",
}

const buttonContainer = {
	padding: "27px 0 27px",
}

const button = {
	backgroundColor: "#444",
	borderRadius: "3px",
	fontWeight: "600",
	color: "#fff",
	fontSize: "15px",
	textDecoration: "none",
	textAlign: "center",
	display: "block",
}

const reportLink = {
	fontSize: "12px",
	color: "#b4becc",
}

const hr = {
	borderColor: "#dfe1e4",
	margin: "42px 0 26px",
}
