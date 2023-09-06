import { useState } from 'react'
import { InputGroup, Input, InputRightElement, Button } from '@chakra-ui/react'

interface inputhandle  { 
    Handleinput: any,
    value: any,
    variant?: string,
    bg?: string,
    fontSize?: string
}


export default function HandleshowInput({Handleinput, value, variant, bg, fontSize}: inputhandle) {
    const [show, Setshow] = useState(false)

    const HandleShow = () => Setshow((prev) => !prev)

    return(
        <InputGroup>
            <Input 
            value={value}
            onChange={(e) => Handleinput(e)}
            type={show ? 'text' : 'password'}
            variant={variant || ''}
            bg={bg || 'transparent'}
            fontSize={fontSize || 'md'}
            />
            <InputRightElement>
                <Button  h='1.75rem' size='sm' mr={'10px'}  onClick={() => HandleShow()}>
                    {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
    )
}