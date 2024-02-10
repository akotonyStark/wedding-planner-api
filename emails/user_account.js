const sgMail = require('@sendgrid/mail')
require("dotenv").config();

//console.log("API_KEY", process.env.SENDGRID_API_KEY)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const verifiedSender = process.env.VERIFIED_SENDER

const templates = {
    // password_reset_confirm: "d-a02ad738dfc8404c8da016b46a7548sd",
    password_reset        : "d-be666a6744e146d5a76710ddc2cf8514",
    // confirm_account       : "d-68c570dd12044d894e07566bf951964",
    welcome: "d-d5e1375688c343d7903feea9e4426ae1",
    coupple_invitation: "d-ebc4d646f1fd47a99884b1108019ed22"
};


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: verifiedSender,
        subject: 'Thanks for signing up!',
        template_id: templates.welcome,
        dynamic_template_data: {
            name: name,
         }
        //text: `<strong>Hey ${name}, Welcome to the Xperience Bliss. We hope you enjoy your journey with us.</strong>`
    })
        .then(() => {
            console.log('Welcome email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}


const sendInvitation = (partnerEmail, partnerName, inviterName ) => {
    sgMail.send({
        to: partnerEmail,
        from: verifiedSender,
        subject: 'Invitation to Join your partner!',
        template_id: templates.coupple_invitation,
        dynamic_template_data: {
            name: inviterName,
            partnerName: partnerName,
         }
        })
        .then(() => {
            console.log('Couple invitation Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

//cancellation email
const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: verifiedSender,
        subject: 'Account cancellation!',
        html: `<i><h2>Goodbye ${name},</h2> We're sorry to see you go. Is there anything you would have liked us to do</i>`
    })
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}


//share tasks email
const sendSharedTasksEmail = (recipientEmail, senderName, tasks, message) => {
    sgMail.send({
        to: recipientEmail,
        from: verifiedSender,
        subject: 'Invitation to assist your friend on Wedding Planner!',
        html:   `<i>
                    <h2>Hello, your friend ${senderName}, needs your assistance</h2>
                    <span>They would like for you to assist them with the following tasks in lieu of their upcoming wedding</span>
                    <h3>Message From ${senderName}: </h3>
                    <span>${message}</span>

                    <h4>Tasks:</h4>
                    <ol>
                        ${tasks.map((task) => {
                            return `<li>${task}</li>`
                        })}
                    </ol>
                </i>
                `
    })
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

    //password reset email
    const sendPasswordResetEmail = (email, name) => {
        sgMail.send({
            to: email,
            from: verifiedSender,
            subject: 'Password Reset!',
            template_id: templates.password_reset,
            dynamic_template_data: {
                name: name,
             }
            })
            .then(() => {
                console.log('Success Email sent')
            })
            .catch((error) => {
                console.error(error)
            })
    }

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail,
    sendInvitation, sendSharedTasksEmail, sendPasswordResetEmail
}
