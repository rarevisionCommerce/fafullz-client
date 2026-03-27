import React from 'react';
import TwoFaAuthPage from './TwoFaAuthPage';
import { Text, Container } from '@mantine/core';
import { Link } from 'react-router-dom';
import logo from '../../assets/graphics/fafullz-logo.jpg';

function TwoFaPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-6" style={{ backgroundColor: '#1A1B1E' }}>
      <Container size="sm" w="100%">
        <div className="flex flex-col items-center mb-8 animate__animated animate__fadeInDown">
          <Link to="/" className="flex flex-col items-center gap-3" style={{ textDecoration: 'none' }}>
            <img src={logo} alt="FAFullz Logo" className="w-16 h-16 rounded-xl shadow-lg border border-[#373A40]" />
            <Text 
                size={36} 
                weight={900} 
                variant="gradient" 
                gradient={{ from: 'blue', to: 'purple', deg: 45 }}
                sx={{ fontFamily: 'Greycliff CF, sans-serif', letterSpacing: '1px' }}
            >
                FAFullz
            </Text>
          </Link>
          <Text color="dimmed" size="md" mt="xs" align="center" className="tracking-wide">
            Secure Two-Factor Authentication Portal
          </Text>
        </div>

        <TwoFaAuthPage />
        
        <div className="mt-10 text-center animate__animated animate__fadeInUp">
           <Text color="dimmed" size="sm">
             &copy; {new Date().getFullYear()} FAFullz. All rights reserved.
           </Text>
        </div>
      </Container>
    </div>
  );
}

export default TwoFaPage;