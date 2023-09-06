import { Box, Button, Flex, Input, ModalBody, ModalCloseButton, ModalContent, Modal, ModalFooter, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { useState } from 'react'
import { useToast } from "@chakra-ui/react"
import { json } from "react-router-dom"

interface myschedule {
    _id: string,
    ownerid: string,
    date: string,
    time: string,
    visitor: string,
}

export default function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [myschedule, Setmyschedule] = useState([])
    const toast = useToast()
    async function logout() {
        const response = await fetch('http://localhost:4000/Logout', {
            method: 'POST',
            credentials: 'include',
        }) 
        if (response.ok) {
            document.location.reload()
        }
    } 

    async function myshedule() {
        try {
            await fetch('http://localhost:4000/myschedule', {
                method: 'GET',
                credentials: 'include'
            })
            .then(res => res.json()
            .then(res => Setmyschedule(res)))

        } catch (error) {
            toast({
                description: 'something is wrong with schedule backend',
                status: "warning"        
            })
        }
    }
    
    return(
        <Box>
            <Flex
            gap={'20px'}
            >
                <Button
                onClick={() => logout()}
                >
                    Logout
                </Button>
                <Button
                onClick={() => {
                    onOpen()
                    myshedule()}}
                >
                    see my schedule to house
                </Button>
            </Flex>
            <Modal  isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontWeight='bold' mb='1rem'>
                            My Schedule
                        </Text>
                        <Flex direction={'column'}>
                            {myschedule && myschedule.map((item: myschedule) => {
                                // making the exact time 
                                const time = item.time.split(":")
                                let hours = parseInt(time[0])
                                let minutes = parseInt(time[1])
                                let origtime
                                if (hours > 12) {
                                    hours = hours - 12
                                    if (hours < 10) origtime = (`0${hours}:${minutes}`)
                                    else origtime = (`${hours} : ${minutes}`)
                                }
                                return( 
                                    <Flex gap={'20px'}>
                                        <Text>{item.visitor}</Text>
                                        <Text>{item.date}</Text>
                                        {origtime ? <Text>{origtime} PM</Text> : <Text>{item.time} AM</Text>}
                                        <Text> </Text>
                                    </Flex>
                                    )
                            })}
                        </Flex>
                    </ModalBody>
                    <Flex
                    justifyContent={'center'} 
                    padding={'20px'}
                    >
                        <Button
                        mx={'auto'}
                        onClick={() => {
                            onClose()}}
                        >Set schedule</Button>
                    </Flex>
            </ModalContent>
            </Modal>
        </Box>
    )
}