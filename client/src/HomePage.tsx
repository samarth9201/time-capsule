import React from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import Web3 from 'web3'
import useIpfsFactory from './ipfs'
import ThankYou from './ThankYou'

interface HomeProps {
    web3: Web3,
    factory: any,
    setBody: React.Dispatch<any>
}

const HomePage = (props: HomeProps) => {

    const [firstName, setFirstName] = React.useState<string>()
    const [lastName, setLastName] = React.useState<string>()
    const [email, setEmail] = React.useState<string>()

    const [video, setVideo] = React.useState<any>(null)
    const { ipfs } = useIpfsFactory()

    const changeFirstName = (event: any) =>{
        setFirstName(event.target.value)
    }

    const changeLastName = (event: any) =>{
        setLastName(event.target.value)
    }

    const changeEmail = (event: any) =>{
        setEmail(event.target.value)
    }

    const uploadChange = (event: any) => {
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = (encodedFile) => {
            setVideo(reader.result)
        }
    }

    const uploadClick = async () => {
        var alerted = false
        try {
            if (props.web3 === null) {
                throw Error("Not connected to Wallet")
            }
            const hash = await ipfs.add(video)
            if (hash === "") {
                console.log("Hash is null")
            }
            else {
                console.log("Hash : ", hash);
                const accounts = await props.web3.eth.getAccounts()
                var contract = await props.factory.methods.getContract(hash.path).call()
                
                if(contract !== "0x0000000000000000000000000000000000000000"){
                    console.log("Error : " + contract);
                    
                    alerted=true
                    alert("File already uploaded")
                    throw Error()
                }

                await props.factory.methods.addHash(firstName, lastName, hash.path).send({from: accounts[0]})
                contract = await props.factory.methods.getContract(hash.path).call()

                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        FirstName: firstName,
                        LastName: lastName,
                        Email: email,
                        ContractAddress: contract
                    })
                }
                alert("Video is being added to IPFS")

                const response = await fetch('http://localhost:5000/api/users/add', requestOptions)

                console.log(response);
                
                props.setBody(<ThankYou></ThankYou>)
            }
        }
        catch (error) {
            console.log(error)
            if(!alerted){
                alert("There was an error uploading video")
            }
        }
    }

    return (
        <div className="Home">
            <Container>
                <Form>
                    <Row>
                        <Col>
                            <b><Form.Label>First Name :</Form.Label></b>
                            <Form.Control onChange={changeFirstName} placeholder="First Name" />
                        </Col>
                        <Col>
                            <b><Form.Label>Last Name :</Form.Label></b>
                            <Form.Control onChange={changeLastName} placeholder="Last Name" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <b><Form.Label>Email</Form.Label></b>
                            <Form.Control onChange={changeEmail} placeholder="Email" />
                        </Col>
                    </Row>
                    <Row>
                        <input type="file" onChange={uploadChange} />
                    </Row>
                </Form>
            </Container>
            <div>
                <Button onClick={uploadClick}>Upload</Button>
            </div>
        </div>
    )
}

export default HomePage
