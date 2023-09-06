import { 
    Box, 
    Button,
    Flex, 
    Heading,  
    FormControl, 
    FormLabel,
    Input, 
} from "@chakra-ui/react"
import { useState } from 'react'
import HandleshowInput from "../../utilities/Showpass"
import { Navigate } from "react-router-dom"


export default function Register() {
    const [info, Setinfo] = useState({
        username: '',
        email: '',
        password: '',
        conpassword: '',
    })
    const [redirect, Setredirect] = useState(false)

    function Handleusername(e: any) {
        Setinfo({
            ...info,
            username: e.target.value
        })
    }

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

    function Handleconpassword(e: any) {
        Setinfo({
            ...info,
            conpassword: e.target.value
        })
    }

    async function Register(e: any) {
        e.preventDefault()

        const response = await fetch('http://localhost:4000/Register', {
            method: 'POST',
            body: JSON.stringify({
                username: info.username,
                email: info.email,
                password: info.password,
            }),
            headers: {
                "Content-Type" : "application/json",
            },
        })

        if (response.ok) {
            Setredirect(true)
        }
    }

    if(redirect || document.cookie) {
        return <Navigate to={'/login'} />
    }
    return(
        <Box>
            <FormControl>
                <form>
                    <Flex direction={"column"}>
                        <Heading>Register</Heading>
                        <Box>
                            <FormLabel>Username</FormLabel>
                            <Input variant={'flushed'} bg={'white'} fontSize={'20px'}
                            value={info.username} type="text"
                            onChange={(e) => Handleusername(e)}
                            />
                        </Box>
                        <Box>
                            <FormLabel>Email</FormLabel>
                            <Input variant={'flushed'} bg={'white'} fontSize={'20px'}
                            value={info.email} type="text"
                            onChange={(e) => Handleemail(e)}
                            />
                        </Box>
                        <Box>
                            <FormLabel>password</FormLabel>
                            <HandleshowInput variant={'flushed'} bg={'white'} fontSize={'20px'}
                            Handleinput={Handlepassword}
                            value={info.password}/>
                        </Box>
                        <Box>
                            <FormLabel>password</FormLabel>
                            <HandleshowInput variant={'flushed'} bg={'white'} fontSize={'20px'}
                            Handleinput={Handleconpassword}
                            value={info.conpassword}/>
                        </Box>
                        <Button type="submit"
                        onClick={(e) => Register(e)}
                        >
                            Make an account
                        </Button>
                    </Flex>
                </form>
            </FormControl>
        </Box>
    )
}