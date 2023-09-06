import { useState } from 'react'
import { Navigate } from "react-router-dom";
import {Box, Flex, Input, Image, Button, Stack, Select, Editable, EditableTextarea, EditablePreview} from '@chakra-ui/react'


export default function Sell() {
    const [optons, Setoptions] = useState('')
    const [info, Setinfo] = useState({
        title: '',
        category: '',
        description: '',
    })
    const [file, Setfile] = useState('')
    const [redirect, Setredirect] = useState(false)
    const category = ['mansion', 'house', 'villa', 'hotel']

    function Handletitle(e: any) {
        Setinfo({
            ...info,
            title: e.target.value
        })
    }
    function Handlecategory(e: any) {
        Setinfo({
            ...info,
            category: e.target.value
        })
    }

    function Handledescription(e: any) {
        Setinfo({
            ...info,
            description: e.target.value
        })

        console.log(info.description)
    }

    const handleFileChange = (e: any) => {
        // uplouding photo
        // i don't understand fully
        if (e.target.files) {
          Setfile(e.target.files[0]);
        }
      };
    async function Createnewpost(e: any) {
        e.preventDefault()
        // making object data
        const data = new FormData()
        data.set('title', info.title)
        data.set('category', info.category)
        data.set('description', info.description)
        data.set('file', file)

        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials: 'include'
        }) 
        
        if (response.ok) {
            Setredirect(true)
        }
    }


    if(!document.cookie) return <Navigate to={'/login'} />
    if(redirect) return <Navigate to={'/Menu'} />
    return(
        <Box h={'100vh'} display={'grid'} justifyContent={'center'}>
            <form onSubmit={Createnewpost}>
                <Flex>
                    <Box boxSize={'500px'}>
                        <Input type='file'
                        onChange={ev => handleFileChange(ev)}/>
                    </Box>
                    <Flex direction={'column'} gap={'30px'}>
                        <Stack spacing={['5px', '15px']}  direction={['column', 'row']}>
                            <Input value={info.title}
                            onChange={(e) => Handletitle(e)}
                            ></Input>
                            <Select variant={''}
                            onChange={(e) => Handlecategory(e)}>
                                {category.map((item) =>
                                {return <option
                                onClick={() => Setoptions(item)}
                                >{item}</option>})}
                            </Select>
                        </Stack>
                        <Editable placeholder='Description'>
                            <EditablePreview boxSize={'300px'} />
                            <EditableTextarea value={info.description}
                            onChange={(e) => Handledescription(e)}
                            boxSize={'300px'}
                            resize={'none'} >
                            </EditableTextarea>
                        </Editable>
                    </Flex>
                    <Button w={'80px'}
                    h={'30px'}
                    onClick={(e) => Createnewpost(e)}
                    type='submit'>
                        Submit
                    </Button>
                </Flex>
            </form>
        </Box>
    )
}