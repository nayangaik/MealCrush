import {Resend} from 'resend';
import dotenv from 'dotenv';
dotenv.config();

dotenv.config();

if(!process.env.RESEND_API){

    throw new Error("RESEND_API is not defined in environment variables");
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({  sendTo, subject, html }) => { 

    try {
        
        const data = await resend.emails.send({
            from: 'MealCrush <onboarding@resend.dev>',
             to: sendTo,
             subject: subject,
             html: html
        });

        return data;
   }
   catch(error){

         console.log("Error in sendEmail", error);

   }
   
}
export default sendEmail;