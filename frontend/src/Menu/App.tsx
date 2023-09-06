import { useEffect, useState } from 'react'
import { useToast, Button, Box, Flex, Container, Text, Image, Input,
   Badge, chakra, shouldForwardProp, LinkBox, LinkOverlay  } from '@chakra-ui/react'
import { motion, isValidMotionProp } from 'framer-motion'
import { Navigate } from 'react-router-dom'

const Motion = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
})

interface item {
  _id: string,
  title: string,
  category: string,
  description: string,
  url: string,
}

function App() {
  const [search, Setsearch] = useState('')
  const [pick, Setpick] = useState('')
  const toast = useToast()
  const [item, Setitem] = useState([])
  const category = ['mansion', 'house', 'villa', 'hotel']

  useEffect(() => {
    const result = async () =>  { 
      await fetch('http://localhost:4000/', {
      headers: {
        "Conten-Type": "application/json"
      }
    }).then((res) => res.json().then((res) => { 
      Setitem(res)
    }))
  }
     result()
  }, [])


  if (!document.cookie) return <Navigate to={'/login'} />
  return (
    <Box w={'100vw'} h={'100vh'} bg={'gray.200'}>
      <Flex gap={'35px'} marginBottom={'30px'}>
        <Input value={search} onChange={(e) => Setsearch(e.target.value)} bg={'white'}
        placeholder='Search' size={'md'} fontWeight={'bold'} fontSize={'20px'} w={'350px'}/>
        <Flex gap={'20px'} >
          {category.map((item) => {
            return (
              <Box key={item} >
                <Button _focus={{ background: '#a3a3a3' }}
                onClick={() => Setpick(item)}>{item}</Button>
              </Box>
            )
          })}
        </Flex>
      </Flex>
      <Flex >
      {item && item.map((item: item) => {
      return (
      <Motion 
      key={item._id}
      layout
      borderRadius={'lg'} width={'500px'} height={'350px'} margin={'auto'} bg={'white'} border={'1px solid black'}  p={'20px'}>
        <LinkBox>
        <Flex direction={'column'} gap={'20px'} >
          <Flex gap={'20px'} title='Title' px={'16px'}>
              <Text fontWeight={'bold'} h={'30px'} fontSize={'20px'} >
                <LinkOverlay href={"/item/" + item._id} >
                  {item?.title}
                </LinkOverlay>
              </Text>
            <Badge alignSelf={'center'} colorScheme='teal'>
              {item?.category}
            </Badge>
          </Flex>
          <Flex gap={'15px'}>
              <Image 
                borderRadius={'md'}
                boxSize={'250px'} 
                objectFit='cover'
                src={item?.url}
              />
            <Flex direction={'column'} justifyContent={'space-between'} w={'100%'}>
              <Box title='Description'>
                <Container fontWeight={'bold'} px={'0'}>
                  {item?.description}
                </Container>
              </Box>
            {<Button
              marginBottom={'10px'}
              title={'Open item'}
              onClick={() =>
                toast({
                  description: `you order ${item?.title} has been added`,
                  status: 'success',
                  duration: 1000,
                  containerStyle: {
                    fontWeight: 'bold',
                  },
                })
              }>
              add to Cart
            </Button> }
            </Flex>
          </Flex>
        </Flex>
        </LinkBox>
      </Motion>
      )
    })}
      </Flex>
      
    </Box>
  )
}



export default App
