import { Link, Navigate, useParams } from "react-router-dom";
import React, { FormEvent, useEffect, useState,    } from 'react'
import { Box, Flex, Heading, Image, Button, Stack, Container, Badge, ModalOverlay, ModalContent, Modal, ModalHeader, ModalCloseButton, ModalBody, Input, ModalFooter, useDisclosure, Text } from '@chakra-ui/react'
    

export default function Item() {
    let { id } = useParams()
    const [info, Setinfo] = useState<iteminfo>()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ schedule, Setschedule] = useState({
        date: '',
        time: ''
    })

    interface iteminfo {
        _id: string,
        title: string,
        category: string,
        description: string,
        url: string,
        owner: boolean,
        ownerid: string
    }

    useEffect(() => {
        try {
            fetch(`http://localhost:4000/Item/${id}`, {
                method: 'GET',
                credentials: 'include'
            }).then((res) => res.json().then(res => Setinfo(res)))
        } catch (error) {
            alert('something is wrong with the site please refresh it')
        }
    }, [])

    async function setschedule(e: FormEvent) {
        e.preventDefault()
        try {
            const data = {
                ownerid : info?.ownerid,
                schedule,
            }
            if (!data.ownerid || !data.schedule) return
            const response = await fetch('http://localhost:4000/schedule', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-type': 'application/json'},
                credentials: 'include'
            })

            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    if (!document.cookie) return <Navigate to={'/Login'}/>
    if (info) return (
        <Box>
            <Flex direction={'column'} align={'center'} marginTop={'60px'}>
                <Flex alignItems={'center'} gap={'15px'}>
                    <Image
                    objectFit={'cover'}
                    boxSize={'600px'}
                    src={info.url}
                    alt="house photo"/>
                    <Flex direction={'column'} justifyContent={'space-between'} gap={'20px'}>
                        <Stack alignItems={'center'}
                        spacing={['5px', '15px']}  direction={['column', 'row']} >
                            <Box>
                                <Heading>{info.title}</Heading>
                            </Box>
                            <Box>
                                <Badge>
                                    {info.category}
                                </Badge>
                            </Box>
                        </Stack>
                        <Container
                        margin={'auto'}
                        boxSize={'450px'}
                        >
                            {info.description}
                        </Container>
                        <Button
                        onClick={onOpen}>
                            Schedule a Visit
                        </Button>
                        {info.owner && <Link to={'/Menu/edit'}>Edit</Link>}
                    </Flex>
                </Flex>
            </Flex>

            <Modal  isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <form
                onSubmit={setschedule}
                >
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <Text fontWeight='bold' mb='1rem'>
                        Please be fill in time as it is not gonna be accepted if no time is inputed
                    </Text>
                    </ModalBody>
                    <ModalFooter>
                    <Input 
                    type="date" 
                    value={schedule.date}
                    onChange={(e) => Setschedule({
                        ...schedule,
                        date: e.target.value
                    })}
                    />
                    <Input 
                    type="time"
                    value={schedule.time} 
                    onChange={(e) => Setschedule({
                        ...schedule,
                        time: e.target.value
                    })}
                    />
                    </ModalFooter>
                    <Flex
                    justifyContent={'center'} 
                    padding={'20px'}
                    >
                        <Button
                        mx={'auto'}
                        type="submit"
                        onClick={(e) => {
                            onClose()
                            setschedule(e)}}
                        >Set schedule</Button>
                    </Flex>
                </form>
            </ModalContent>
            </Modal>
        </Box>  
    )
}

