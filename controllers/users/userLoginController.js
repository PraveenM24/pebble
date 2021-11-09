const Login = require('../../models/users/userLoginModel')
const bcrypt = require('bcrypt')

const getAllData = (req, res, next) => {
    Login.find({}, (err, data) => {
        if (err) {
            return res.json({
                Error: err
            });
        }
        return res.json(data);
    })
};

const getOneData = (req, res, next) => {
    let id = req.params.id;

    Login.findOne({
        _id: id
    }, (err, data) => {
        if (err || !data) {
            return res.json({
                message: "Data not found"
            });
        } else return res.json(data);
    })
};

const randString = () => {
    const len = 8
    let randStr = ''
    for (let i = 0; i < len; i++) {
        const ch = Math.floor((Math.random() * 10) + 1)
        randStr += ch
    }
    return randStr
};

const sendConfirmationMail = (email, uniqueString) => {
    const mailjet = require('node-mailjet')
        .connect('46dda229ba3eedf81dfa8f6620d2b9b7', '943f6bb84ff84788fc59320120e7da13')
    const request = mailjet
        .post("send", {
            'version': 'v3.1'
        })
        .request({
            "Messages": [{
                "From": {
                    "Email": "admin@pebblewellness.in",
                    "Name": "Pebble"
                },
                "To": [{
                    "Email": email,
                }],
                "Subject": "Email Confirmation",
                "HTMLPart": `<html>
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <table style="background: #ffffff; border: 0px; border-radius: 4px; width: 99.6672%; overflow: hidden; margin-top: 30px;" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr>
                            <td class="" style="width: 100%;" align="center">
                                <table dir="ltr" style="border: 0; width: 100%;" cellspacing="0" cellpadding="0">
                                    <tbody>
                                        <tr>
                                            <td class="tw-card-body"
                                                style="padding: 20px 35px; text-align: left; color: #6f6f6f; font-family: sans-serif; border-top: 0;">
                                                <h3 class="tw-h1"
                                                    style="font-size: 24px; font-weight: bold; mso-line-height-rule: exactly; line-height: 32px; margin: 0 0 20px; color: #474747;">
                                                    Hello,</h3>
                                                <p class=""
                                                    style="margin: 20px 0; font-size: 16px; mso-line-height-rule: exactly; line-height: 24px;">
                                                    <span style="font-weight: 400;">Thank you for
                                                        joining
                                                        <strong>Pebble</strong>,</span><br /><br /><span style="font-weight: 400;">To
                                                        complete the
                                                        registration process, please confirm your
                                                        email address to activate your
                                                        account</span>.</p>
                                                <table style="border: 0; width: 100%;" cellspacing="0" cellpadding="0">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <table class="button mobile-w-full"
                                                                    style="border: 0px; border-radius: 7px; margin: 0px auto; width: 525px; background-color: #008bcb; height: 50px;"
                                                                    cellspacing="0" cellpadding="0" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="button__td "
                                                                                style="border-radius: 7px; text-align: center; width: 523px;margin: 0 auto">
                                                                                <a class="button__a"
                                                                                    style="border-radius: 4px; color: #ffffff; display: block; font-family: sans-serif; font-size: 18px; font-weight: bold; mso-height-rule: exactly; line-height: 1.1; padding: 14px 18px; text-decoration: none; text-transform: none; border: 0;"
                                                                                    href="https://pebble-test.herokuapp.com/users/verify/${uniqueString}"
                                                                                    target="_blank" rel="noopener">Confirm
                                                                                    email</a>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div class=""
                                                    style="border-top: 0; font-size: 1px; mso-line-height-rule: exactly; line-height: 1px; max-height: 0; margin: 20px 0; overflow: hidden;">
                                                    ​</div>
                                                <p class=""
                                                    style="margin: 20px 0; font-size: 16px; mso-line-height-rule: exactly; line-height: 24px;">
                                                    Contact our support team
                                                    <i><b>@pebblecontact.team@gmail.com</b></i> if you
                                                    have any
                                                    questions or concerns.</p>
                                                <p class="tw-signoff"
                                                    style="margin: 45px 0 5px; font-size: 16px; mso-line-height-rule: exactly; line-height: 24px;">
                                                    Thanks, <br />Team Pebble</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td class=""
                                style="padding: 25px 0; text-align: center; color: #6e6e6e; font-family: sans-serif; font-size: 11px; ">
                                <p class="" style="margin: 5px 0 0;">2021 &copy; Pebble, All
                                    rights reserved.</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </html>`

            }]
        })
    request
        .then((result) => {
            console.log(result.body)
        })
        .catch((err) => {
            console.log(err.statusCode)
        })
};

const newData = (req, res) => {
    const uniqueString = randString()
    const email = req.body.email
    const orgPassword = req.body.password

    Login.findOne({
        email: email
    }, (err, data) => {
        if (err) {
            return res.json({
                Error: err
            });
        } else if(data) {
            return res.json({
                message: "Email already exists"
            });
        } else {
            bcrypt.hash(orgPassword, 10, function(err, hashedPassword) {
                if(err) return res.json({
                    Error: err
                }); 
                const newData = new Login({
                    email: req.body.email,
                    password: hashedPassword,
                    userID: req.body.userID,
                    verified: false,
                    uniqueString: uniqueString,
                })
                sendConfirmationMail(email, uniqueString)
                newData.save((err, data) => {
                    if (err) return res.json({
                        Error: err
                    });
                    return res.json(data);
                })
            });
        }
    })
};

const updateData = (req, res, next) => {
    Login.findOne({
        _id: req.params.id
    }, (err, data) => {
        if (err || !data) {
            return res.json({
                message: "Data not found"
            });
        }
        if (req.body.email) {
            data.email = req.body.email
        }
        if (req.body.password) {
            const orgPassword = req.body.password
            bcrypt.hash(orgPassword, 10, function(err, hashedPassword) {
                data.password = hashedPassword
            });
        }
        if (req.body.verified) {
            data.verified = req.body.verified
        }

        data.save()
        return res.json(data)
    })
};

const deleteAllData = (req, res, next) => {
    Login.deleteMany({}, err => {
        if (err) {
            return res.json({
                message: "Complete delete failed"
            });
        }
        return res.json({
            message: "Complete delete successful"
        });
    })
};

const deleteOneData = (req, res, next) => {
    let id = req.params.id;

    Login.deleteOne({
        _id: id
    }, (err, data) => {
        if (err || !data) {
            return res.json({
                message: "Data doesn't exist."
            });
        } else return res.json({
            message: "Data deleted."
        });
    })
};

const verifyUser = (req, res, next) => {
    Login.findOne({
        uniqueString: req.params.uniqueString
    }, (err, data) => {
        if (err || !data) {
            return res.json({
                message: "Data not found"
            });
        }
        data.verified = true

        data.save()
        return res.sendFile(process.cwd() + '/emailConfirmation.html')
    })
};

module.exports = {
    getAllData,
    getOneData,
    newData,
    updateData,
    deleteAllData,
    deleteOneData,
    verifyUser
};