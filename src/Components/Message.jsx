import React from 'react'
import {HStack,Avatar,Text, VStack} from '@chakra-ui/react'
const Message = ({name,text,uri,user="other"}) => {
  return (
    <HStack alignSelf={user==="me"?'flex-end':'flex-start'} borderRadius="base" bg="gray.100" paddingY="2" paddingX={user==="me"?"4":"2"}>
        {
            user==="other" && < Avatar size='sm' src={uri}/>
        }
        <VStack>
        <Text alignSelf={'flex-start'} fontSize={"x-small"}>{name}</Text>
        <Text>
            {text}
        </Text>
        </VStack>
        {
            user==="me" && <Avatar size='sm' src={uri}/>
        }
    </HStack>
  )
  
}

export default Message