import React from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import Web3 from 'web3'

const HashContract = require("./contracts/HashContract.json")

interface OpenCapsuleProps {
    web3: Web3,
    factory: any,
    setBody: React.Dispatch<any>
}

const OpenCapsule = (props: OpenCapsuleProps) => {

    const [contractAddress, setContractAddress] = React.useState("")

    const changeAddress = (event: any) =>{
        setContractAddress(event.target.value)
    }

    const handleSubmit = async () =>{
        try{
            const hashContract = new props.web3.eth.Contract(
                HashContract.abi,
                contractAddress
            )
    
            const hash = await hashContract.methods.getHash().call()
    
            window.open(`https://ipfs.io/ipfs/${hash}`)
            console.log(hash)
        }
        catch(error){
            alert("Cannot Open Capsule")
        }
    }

    return (
        <div className="OpenCapsule">
            <Container>
                <Form>
                    <b><Form.Label>Enter Contract Address</Form.Label></b>
                    <Form.Control placeholder="Contract Address" onChange={changeAddress}/>
                    <div>
                        <Button onClick={handleSubmit}>Open Capsule</Button>
                    </div>
                </Form>
            </Container>
        </div>
    )
}

export default OpenCapsule
