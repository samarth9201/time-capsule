import React from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import Web3 from 'web3'
import { createPow, powTypes } from "@textile/powergate-client"
import ThankYou from './ThankYou'

const host = "http://0.0.0.0:6002"
const pow = createPow({ host })

interface HomeProps {
    web3: Web3,
    factory: any,
    setBody: React.Dispatch<any>
}

const HomePage = (props: HomeProps) => {

    const [firstName, setFirstName] = React.useState<string>()
    const [lastName, setLastName] = React.useState<string>()
    const [email, setEmail] = React.useState<string>()
    const [loading, setLoading] = React.useState(false)

    const [file, setFile] = React.useState<any>(null)

    const changeFirstName = (event: any) => {
        setFirstName(event.target.value)
    }

    const changeLastName = (event: any) => {
        setLastName(event.target.value)
    }

    const changeEmail = (event: any) => {
        setEmail(event.target.value)
    }

    const uploadChange = (event: any) => {
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = (encodedFile) => {
            setFile(reader.result)
        }
    }

    const uploadClick = async () => {
        var alerted = false
        try {

            setLoading(true)
            if (props.web3 === null) {
                throw Error("Not connected to Wallet")
            }
            const { user } = await pow.admin.users.create()
            if (user !== undefined) {
                pow.setToken(user.token)
                const cid = await pow.data.stage(file)
                const hash = cid.cid
            
                const { jobId } = await pow.storageConfig.apply(cid.cid, {
                    override: true
                })

                // watch the job status to see the storage process progressing
                pow.storageJobs.watch((job) => {
                    if (job.status === powTypes.JobStatus.JOB_STATUS_CANCELED) {
                        console.log("job canceled")
                    } else if (job.status === powTypes.JobStatus.JOB_STATUS_FAILED) {
                        console.log("job failed")
                    } else if (job.status === powTypes.JobStatus.JOB_STATUS_SUCCESS) {
                        console.log("job success!")
                    }
                }, jobId)

                // watch all log events for a cid
                pow.data.watchLogs((logEvent) => {
                    console.log(`received event for cid ${logEvent.cid}`)
                }, cid.cid)

                if (hash === "") {
                    console.log("Hash is null")
                }
                else {
                    console.log("Hash : ", hash);
                    const accounts = await props.web3.eth.getAccounts()
                    var contract = await props.factory.methods.getContract(hash).call()

                    if (contract !== "0x0000000000000000000000000000000000000000") {
                        console.log("Error : " + contract);

                        alerted = true
                        alert("File already uploaded")
                        throw Error()
                    }

                    await props.factory.methods.addHash(firstName, lastName, hash).send({ from: accounts[0] })
                    contract = await props.factory.methods.getContract(hash).call()

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

                    const response = await fetch('http://localhost:5000/api/users/add', requestOptions)

                    console.log(response);
                    alert("File is being added to IPFS")

                    props.setBody(<ThankYou contract={contract}></ThankYou>)
                }
            }
            else {
                throw new Error("Powergate not active")
            }


            setLoading(false)
        }
        catch (error) {
            console.log(error)
            if (!alerted) {
                alert("There was an error uploading file")
            }
            setLoading(false)
        }
    }

    if (loading === false) {
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
    else {
        return (
            <div className="loading">
                <h2>
                    <b>
                        Submitting your file
                </b>
                </h2>
                <img alt="Loading" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
            </div>
        )
    }
}

export default HomePage
