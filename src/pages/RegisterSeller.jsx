import React from "react";
import { Link } from "react-router-dom";
import {
  Paper,
  Title,
  Text,
  Container,
  Button,
  Stack,
  Alert,
  Center,
  Image,
  Box
} from "@mantine/core";
import { IconArrowLeft, IconInfoCircle, IconBrandTelegram } from "@tabler/icons-react";
import logo from "../assets/graphics/fafullz-logo.jpg";

function RegisterSeller() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 bg-loginBg bg-cover bg-center bg-no-repeat bg-blend-overlay bg-[#404740]">
      <Container size="xs" p={0}>
        <Paper shadow="xl" radius="md" p="xl" className="bg-[#1A1B1E] text-white">
          <Stack spacing="lg" align="center">
            {/* Logo */}
             <Center>
                <Image src={logo} width={50} height={50} />
            </Center>
            <Title order={2} className="text-white">Rare Vision</Title>
            
            <Title order={3} className="text-white">Sign Up (Seller)</Title>

            <Alert icon={<IconInfoCircle size="1rem" />} title="Information" color="blue" variant="light" className="w-full">
               <Text size="sm">Ready to start selling your products on Fafullz?</Text>
            </Alert>

            <Box className="bg-blue-600 p-4 rounded-md w-full text-center">
                 <Text weight={700} color="white">Contact us today on!</Text>
                 <Text color="white" mt={5}>JabberId: rarevision@yax.im</Text>
            </Box>

            <Button 
                component={Link} 
                to="/" 
                variant="subtle" 
                color="gray" 
                leftIcon={<IconArrowLeft size="1rem" />}
            >
                Back to Login
            </Button>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}

export default RegisterSeller;

