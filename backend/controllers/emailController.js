import transporter from "../utils/nodemailer.js";
import dotenv from "dotenv";
dotenv.config();
const sendEmail = async (data) => {
    const {to,subject,text}=data;
    const mailOptions={
        from :process.env.MAIL_USERNAME,
        to,
        subject,
        text
    };
    try{
        await transporter.sendMail(mailOptions);
    }
    catch(error){
        console.log("Error sending email",error);
    }
}
export default sendEmail;