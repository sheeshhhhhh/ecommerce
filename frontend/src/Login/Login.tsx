import {
    Box,
    Heading,
    Input,
    FormControl,
    FormLabel,
    Flex,
    Button
  } from '@chakra-ui/react'
import { useState } from 'react'
import HandleshowInput from '../../utilities/Showpass'
import { Navigate } from 'react-router-dom'

export default function Login() {
    const [info, Setinfo] = useState({
        email: '',
        password: '',
    })
    const [redirect, Setredirect] = useState(false)


    function Handleemail(e: any) {
        Setinfo({
            ...info,
            email: e.target.value
        })
    }

    function Handlepassword(e: any) {
        Setinfo({
            ...info,
            password: e.target.value
        })
    }

    async function Submit(e: any) {
        e.preventDefault()

        const response =  await fetch('http://localhost:4000/Login', {
            method: 'POST',
            body: JSON.stringify(info),
            headers: {
                "Content-Type" : "application/json",
            },
            credentials: 'include',
        })
        console.log(response)

        if (response.ok) {
            console.log(response)
            Setredirect(true)
        }
    }

    if (redirect || document.cookie) {
        return <Navigate to={'/'}/>
    }
    return(
        <Box>
            <FormControl 
            borderRadius={'lg'} bg={'blackAlpha.300'} h={'400px'} w={'500px'} p={'40px'} m={'auto'}>
                <form onSubmit={Submit}
                >
                    <Flex direction={'column'} gap={'25px'} >
                        <Heading>Log-in</Heading>
                        <Box>
                            <FormLabel>Email</FormLabel>
                            <Input value={info.email}
                            onChange={(e) => Handleemail(e)}
                            type='text'
                            variant='flushed' bg={'white'} fontSize={'20px'} />
                        </Box>
                        <Box>
                            <FormLabel>Password</FormLabel>
                            <HandleshowInput 
                            value={info.password} 
                            Handleinput={Handlepassword}
                            variant={'flushed'}
                            bg={'white'}
                            fontSize={'20px'}
                            />
                        </Box>
                        <Button
                        type='submit'
                        onClick={(e) => Submit(e)}
                        >
                            Login
                        </Button>
                    </Flex>
                </form>
            </FormControl>
        </Box>
    )
}