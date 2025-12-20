import React, { useState } from "react";
import QRCode from "qrcode.react";
import btcIcon from "../assets/graphics/btc.png";
import solIcon from "../assets/graphics/sol.svg";
import liteIcon from "../assets/graphics/lite.png";
import usdtIcon from "../assets/graphics/usdc.png";
import { Alert, Stack, Text, Group, CopyButton, ActionIcon, Tooltip, Box } from "@mantine/core";
import { IconCopy, IconCheck, IconInfoCircle } from "@tabler/icons-react";

function QrCodeGenerator({ data }) {
  if (!data) return null;

  const iconObj = {
    btc: btcIcon,
    usdterc20: usdtIcon,
    ltc: liteIcon,
    sol: solIcon,
  };

  const currencyname = (name) => {
    if (name === "ltc") return "litecoin";
    if (name === "btc") return "bitcoin";
    if (name === "sol") return "Solana";
    if (name === "usdterc20") return 'tether';
    return "name";
  };

  const coinURI = `${currencyname(data?.pay_currency)}:${data?.pay_address}?amount=${data?.pay_amount}`;
  const qrCodeSize = 200;
  const iconSize = 40;

  // Style for the icon image overlay
  const iconStyle = {
    position: "absolute",
    top: `calc(50% - ${iconSize / 2}px)`,
    left: `calc(50% - ${iconSize / 2}px)`,
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    borderRadius: "50%",
    backgroundColor: "white",
    zIndex: 100,
  };

  return (
    <Stack align="center" spacing="md" w="100%">
        {data?.pay_currency === 'usdterc20' && (
            <Alert icon={<IconInfoCircle size="1rem"/>} color="blue" variant="light" title="Network Warning">
                Only send USDT to this address from <strong>ERC20</strong>. Sending from other networks will result in loss of funds.
            </Alert>
        )}
        
        <Box style={{ position: "relative", display: "inline-block", marginTop: 10 }}>
          <QRCode size={qrCodeSize} value={coinURI} renderAs="canvas" includeMarginLevel={true} />
          {iconObj[data?.pay_currency] && (
               <img src={iconObj[data?.pay_currency]} alt="Icon" style={iconStyle} />
          )}
        </Box>

        <Stack spacing="xs" w="100%">
            {/* Address Section */}
            <div>
                <Text size="sm" weight={700} color="dimmed" transform="uppercase">{data?.pay_currency} Address</Text>
                <Group position="apart" noWrap spacing="xs" bg="gray.1" p="xs" style={{ borderRadius: '6px' }}>
                    <Text size="sm" style={{ wordBreak: 'break-all', lineHeight: 1.2 }} weight={500} color="dark">
                        {data?.pay_address}
                    </Text>
                    <CopyButton value={data?.pay_address} timeout={2000}>
                        {({ copied, copy }) => (
                            <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="left">
                                <ActionIcon color={copied ? 'teal' : 'blue'} onClick={copy} variant="filled" size="sm">
                                    {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                </Group>
            </div>

            {/* Amount Section */}
             <div>
                <Text size="sm" weight={700} color="dimmed" transform="uppercase">Amount</Text>
                <Group position="apart" noWrap spacing="xs" bg="gray.1" p="xs" style={{ borderRadius: '6px' }}>
                    <Text size="sm" weight={700} color="dark">
                        {data?.pay_amount} <span style={{ textTransform: 'uppercase' }}>{data?.pay_currency}</span>
                    </Text>
                    <CopyButton value={data?.pay_amount} timeout={2000}>
                        {({ copied, copy }) => (
                            <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="left">
                                <ActionIcon color={copied ? 'teal' : 'blue'} onClick={copy} variant="filled" size="sm">
                                     {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                </Group>
            </div>
        </Stack>
    </Stack>
  );
}

export default QrCodeGenerator;
