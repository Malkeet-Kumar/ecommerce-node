const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE,
);


module.exports=function sendMail(email,name,body,subject){

    const request=mailjet.post('send', { version: 'v3.1' })
    .request({
        Messages: [
            {
                From: {
                    Email: 'jatin.213029@maimt.com',
                    Name: 'WOW BAZZAR',
                },
                To: [{
                    Email: email,
                    Name:name,
                }],
                Subject: subject,
                HTMLPart:body,
            },
        ],
    })
    return request.then(function(result)
    {
        // console.log(result);
        console.log("email sent");
    })
    .catch(function(error)
    {
        console.log(error);
    })
}


