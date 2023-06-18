import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    useDisclosure,
    Icon,
    Flex,
} from '@chakra-ui/react'
import { IconType } from 'react-icons';
//model to show mail 
const ModalComponent = (props:any) =>{
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
        <div
            onClick={onOpen}
            key={props.index}
            className="bg-[#f6f8fc] hover:bg-[white] cursor-pointer"
            >
            <div className="flex p-4">
                <div className="font-bold px-5 " style={{ width: "240px" }}>{props.mail.from}</div>

                <div className="flex px-5" style={{ width: "260px" }}><div className="font-bold px-5">Sub:</div>{props.mail.subject}</div>
                <div className="font-bold px-5">Body:</div>
                <div className="px-5">
                    {props.mail.body.split(" ").slice(0, 2).join(" ")}
                    {props.mail.body.split(" ").length > 2 ? "..." : ""}
                </div>
            </div>
            <hr className="border-t-2 border-gray-300" />
        </div>
            <Modal
                isCentered
                onClose={onClose}
                isOpen={isOpen}
                motionPreset='slideInBottom'
            >
                <ModalOverlay />
                <ModalContent width={'2xl'}>
                    <ModalHeader color={"gray.500"} pb={'0px'}>{props.header}</ModalHeader>
                    <ModalCloseButton color={'gray.800'} />
                    <ModalBody >
                        <Flex flexDir={'column'} m="5px auto"  >
                            <Text color={'gray.500'} p={'5px'}><Text fontWeight={'semibold'}>From:</Text>{props.mail.from}</Text>
                            <Text color={'gray.500'} p={'5px'}><Text fontWeight={'semibold'}>Subject:</Text>{props.mail.subject}</Text>
                            <Text color={'gray.500'} p={'5px'}><Text fontWeight={'semibold'}>Body:</Text>{props.mail.body}</Text>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
        
    )
}

export default ModalComponent;