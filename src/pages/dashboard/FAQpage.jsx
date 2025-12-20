import React from "react";
import { Accordion, Paper, Title, Text, Container, List, ThemeIcon } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

function FAQpage() {
  return (
    <div className="bg-gray-900 min-h-screen py-10 px-4">
       <Container size="md">
        <Title order={1} align="center" mb="xl" className="text-white">
            <Text span color="green" inherit>FAQ</Text> Frequently Asked Questions
        </Title>
        
        <Paper shadow="sm" radius="md" p="md" style={{ backgroundColor: '#1f2937' }}>
            <Accordion variant="separated" radius="md" styles={{
                item: { backgroundColor: '#111827', border: '1px solid #374151', '&[data-active]': { backgroundColor: '#1f2937' } },
                control: { color: '#e5e7eb', '&:hover': { backgroundColor: '#374151' } },
                content: { color: '#d1d5db' },
                label: { fontWeight: 600 }
            }}>
                <Accordion.Item value="rules">
                    <Accordion.Control>Rules</Accordion.Control>
                    <Accordion.Panel>
                        <List spacing="sm" size="sm" center>
                            <List.Item>1. All your balance, replenished by any method, is a part of the Fafullz website and is non-refundable (non-returnable) outside Fafullz.</List.Item>
                            <List.Item>2. We are not responsible for your links passability (negotiability).</List.Item>
                            <List.Item>3. Save all purchases to your device, we wipe sold items data from time to time.</List.Item>
                            <List.Item>4. In case of insults or threats, your account will be blocked without refunds.</List.Item>
                            <List.Item>5. There is no moneyback out of Fafullz.</List.Item>
                        </List>
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="seller-rules">
                    <Accordion.Control>Seller Rules</Accordion.Control>
                    <Accordion.Panel>
                        <Text size="lg" weight={500} mb="md" color="white">
                            We think that it will be fair for you to open seller-2-buyer disclosure terms via Fafullz.
                        </Text>
                        <hr className="border-gray-600 mb-4" />
                        <Title order={4} color="white" mb="sm">Rules for seller:</Title>
                         <List spacing="sm" size="sm" center>
                            <List.Item>1. All your balance, replenished by any method, is a part of the Fafullz website and is non-refundable (non-returnable) outside Fafullz.</List.Item>
                            <List.Item>2. We are not responsible for your links passability (negotiability).</List.Item>
                            <List.Item>3. Save all purchases to your device, we wipe sold items data from time to time.</List.Item>
                            <List.Item>4. In case of insults or threats, your account will be blocked without refunds.</List.Item>
                             <List.Item>5. There is no moneyback out of Fafullz.</List.Item>
                        </List>
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="ssn-dob-rules">
                    <Accordion.Control>Purchase rules for SSN/DOB</Accordion.Control>
                    <Accordion.Panel>
                        <Text size="md" mb="sm">
                             We are not responsible for your links passability (negotiability) and successfull/unsuccessfull rate.
                        </Text>
                        <Text size="md" mb="xs" weight={500} color="white">
                             Refund for SSN is performed only if you have reason like:
                        </Text>
                        <List type="ordered" withPadding spacing="xs">
                            <List.Item>Holder died</List.Item>
                            <List.Item>PO Box</List.Item>
                            <List.Item>Incorrect main Fullz</List.Item>
                        </List>
                    </Accordion.Panel>
                </Accordion.Item>

                 <Accordion.Item value="google-voice-rules">
                    <Accordion.Control>Purchase rules for Google Voice, TextNow/Mail</Accordion.Control>
                    <Accordion.Panel>
                         <List type="ordered" withPadding spacing="xs">
                            <List.Item>After the purchase you must change password to your own and setup recovery e-mail to your own. Do it at the first login!</List.Item>
                            <List.Item>We provide limited warranty — 24 hours since purchase!</List.Item>
                        </List>
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="account-market-rules">
                    <Accordion.Control>Purchase rules for buying accounts (Account market):</Accordion.Control>
                    <Accordion.Panel>
                         <List type="ordered" withPadding spacing="md">
                            <List.Item>We provide limited warranty — 24 hours since purchase!</List.Item>
                            <List.Item>Please use clean USA IP-address. Verify how clean it is by clicking "Check IP" tab.</List.Item>
                            <List.Item>
                                If you faced with some issues and want to claim a refund, you need to:
                                <List withPadding mt="xs" type="unordered">
                                    <List.Item>provide a proof that you've used cookies (for example, upload screenshot to imgur.com)</List.Item>
                                    <List.Item>provide IP-address that you used for login-purposes</List.Item>
                                </List>
                            </List.Item>
                             <List.Item>You need to change the email password and account password immediately after the purchase.</List.Item>
                        </List>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Paper>
       </Container>
    </div>
  );
}

export default FAQpage;
