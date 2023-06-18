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
    Input,
    Textarea,
    useToast,
    Spinner,
    InputGroup,
    InputLeftElement
} from '@chakra-ui/react';
import Link from 'next/link';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
} from '@chakra-ui/react'
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
    FiEdit2,
    FiFile
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Logo from '../../../public/assets/logo.png'
import Image from 'next/image';
import { useAccount, useChainId, useNetwork, } from 'wagmi';
import { sendMail } from '@/lib/utils';

interface LinkItemProps {
    name: string;
    icon: IconType;
    route: string;
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Inbox', icon: FiMail, route: '/' },
    { name: 'Sent', icon: FiSend, route: '/sent' },
    // { name: 'Starred', icon: FiStar, route: '/starred' },
    // { name: 'Bin', icon: FiCompass, route: '/bin' },
    // { name: 'Support', icon: FiSettings, route: '/support' },
];

export default function MainLayout({
    children,
}: {
    children: ReactNode;
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    return (
        <Box minH="100vh" bg={'white'}>
            <SidebarContent
                onclose={() => onClose}
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
                    <SidebarContent onclose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }}>
                {children}
            </Box>
        </Box >
    );
}

interface SidebarProps extends BoxProps {
    onclose: () => void;
}

const SidebarContent = ({ onclose, ...rest }: SidebarProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const account = useAccount()
    const chainId = useChainId()
    const toast = useToast()
    const network = useNetwork()
    const [loading, setLoading] = React.useState(false)
    const [to, setTo] = React.useState('')
    const [subject, setSubject] = React.useState('')
    const [message, setMessage] = React.useState('')
    const acceptedFileTypes = '.jpg, .jpeg, .png, .pdf';
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const [file, setFile] = React.useState(null)
    const connectWalletToast = () => {
        toast({
            title: 'Please connect your wallet first.',
            status: 'info',
            duration: 9000,
            isClosable: false,
        })
    }

    const changeNetworkToast = () => {
        toast({
            title: 'Please change network to Polygon Mumbai Testnet.',
            status: 'info',
            duration: 9000,
            isClosable: false,
        })
    }

    const handleSendMail = async () => {
        setLoading(true)
        try {
            await sendMail(account.address as string, to, subject, message)
            toast({
                title: 'Mail sent successfully.',
                status: 'success',
                duration: 9000,
                isClosable: false,
            })
        } catch (err) {
            toast({
                title: 'Failed to send mail.',
                description: "Please try again.",
                status: 'error',
                duration: 9000,
                isClosable: false,
            })
            console.log(err)
        } finally {
            setLoading(false)
            onClose()
        }
    }

    return (
        <Box
            transition="3s ease"
            bg={'white'}
            borderRight="1px"
            borderRightColor={'white'}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <div className=''>
                    <Image src={Logo} alt="Logo" width={125} />
                </div>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onclose} />
            </Flex>
            <div className='flex justify-center'>
                <Button leftIcon={<FiEdit2 />} p={"6"} shadow={'lg'} m={'4'} _hover={{ bg: '#7ec4ba', color: 'white', }} rounded={'xl'}
                    onClick={account.isConnected ? network.chain?.id == 80001 ? onOpen : changeNetworkToast : connectWalletToast}>
                    Compose
                </Button>
                <Modal
                    initialFocusRef={initialRef}
                    finalFocusRef={finalRef}
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalOverlay />
                    <ModalContent className='bg-white'>
                        <ModalHeader>Send Email</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl>
                                <FormLabel>To</FormLabel>
                                <Input ref={initialRef} placeholder='Wallet Address/ENS' onChange={(e) => setTo(e.target.value)} />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Subject</FormLabel>
                                <Input placeholder='' onChange={(e) => setSubject(e.target.value)} />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Message</FormLabel>
                                <Textarea placeholder='Leave your message here!!' onChange={(e) => setMessage(e.target.value)} />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <InputGroup width={'130px'} m={'1'}>
                                <InputLeftElement pointerEvents="none" children={<Icon as={FiFile} />} />
                                <input style={{ "display": "none" }} type="file" accept={acceptedFileTypes} onChange={(e) => setFile(e.target.files[0])} />
                                <Input
                                    placeholder="Attach file"
                                    value={file?.name}
                                    readOnly
                                    //@ts-ignore
                                    onClick={() => document.querySelector('input[type=file]').click()}
                                    cursor='pointer'
                                />
                            </InputGroup>
                            <Button colorScheme='blue' color={'gray.700'} _hover={{ color: "white", backgroundColor: "#2280a8" }} mr={3} onClick={handleSendMail}>
                                {loading ? <Spinner size='xs' /> : 'Send'}
                            </Button>
                            <Button colorScheme='red' color={'gray.700'} _hover={{ color: "white", backgroundColor: "#b0192d" }} onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
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
        <Link href={route} style={{ textDecoration: 'none' }} >
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
            bg={'white'}
            borderBottomWidth="1px"
            borderBottomColor={'white'}
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