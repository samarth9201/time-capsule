const User = require('./models/user')
const nodemailer = require('nodemailer')
const fs = require('fs')
const handlebars = require('handlebars')

var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

const transporter = nodemailer.createTransport({
    host: 'smtp.google.com',
    port: 465,
    secure: true,
    service: 'Gmail',

    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

const handleMails = async () => {
    const users = await User.find({
        "createdAt": {
            $lte: new Date(Date.now() - 2 * 60 * 1000)  // 2 * 60 => 2 minutes
        },
        "Reminded": "false"
    })

    readHTMLFile(__dirname + '/static/mail.html', async (err, html) => {

        users.forEach(async (user) => {

            var template = handlebars.compile(html)
            var replacements = {
                firstname: user.FirstName,
                contractaddress: user.ContractAddress
            }

            var htmlToSend = template(replacements)

            var mail = {
                from: process.env.EMAIL,
                subject: "Time to Open Time Capsule",
                text: "You can now open the time capsule",
                html: htmlToSend,
                attachments: [{
                    filename: 'PortlandStateUniversityLogo.png',
                    path: __dirname + '/static/portland_state_university.png',
                    cid: 'logo'
                }]
            }

            mail.to = user.Email

            transporter.sendMail(mail, (error) => {
                if (!error) {
                    User.updateOne({_id: user._id},{Reminded: true}, (err, res) =>{
                        console.log(res);
                    })
                    console.log(`Email sent to ${user.FirstName}`)
                }
                else {
                    console.log("An error occured while sending email")
                    console.log(error);
                }
            })
        })
    })
}
module.exports = handleMails