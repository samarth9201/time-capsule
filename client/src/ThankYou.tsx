import React from 'react'
interface ThankYouProps{
    contract: string
}
const ThankYou = (props: ThankYouProps) => {
    return (
        <div className="text">
            <h2>
                <b>
                    Thank You for yor submission!<br/>
                    Your Submission has been added to Time Capsule.<br/>
                    Your Contract Address is {props.contract}
                </b>
            </h2>
        </div>
    )
}

export default ThankYou
