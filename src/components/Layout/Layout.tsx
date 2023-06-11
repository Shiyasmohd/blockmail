import React, { ReactNode } from 'react';
import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Button,
    Divider,
} from '@chakra-ui/react';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
    FiMail,
    FiSend,
    FiEdit2
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Logo from '../../../public/assets/logo.png'
import Image from 'next/image';

interface LinkItemProps {
    name: string;
    icon: IconType;
    route: string;
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Inbox', icon: FiMail, route: '/' },
    { name: 'Sent', icon: FiSend, route: '/sent' },
    { name: 'Starred', icon: FiStar, route: '/starred' },
    { name: 'Bin', icon: FiCompass, route: '/bin' },
    // { name: 'Support', icon: FiSettings, route: '/support' },
];

export default function MainLayout({
    children,
}: {
    children: ReactNode;
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                {children}
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <div className=''>
                    <Image src={Logo} alt="Logo" width={125} />
                </div>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            <div className='flex justify-center'>
                <Button leftIcon={<FiEdit2/>} p={"6"} shadow={'lg'} m={'4'} _hover={{bg: '#7ec4ba',color: 'white',}} rounded={'xl'}>
                    Compose
                </Button>
            </div>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} route={link.route}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

interface NavItemProps extends FlexProps {
    icon: IconType;
    route: string;
    children: ReactText;
}
const NavItem = ({ icon, route, children, ...rest }: NavItemProps) => {
    return (
        <Link href={route} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: '#7ec4ba',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <HStack spacing={{ base: '0', md: '6' }}>
                { }
                <Flex alignItems={'center'}>
                    <Menu>
                        {<ConnectButton />}
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};