const User = require('../models/user');
const ForgotPasswordRequests = require('../models/ForgotPasswordRequests');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY; 
const transEmailApi = new Sib.TransactionalEmailsApi();

const { v4 : uuidv4 } = require('uuid');

exports.forgotpassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({message:'user does not exist'})
        }
        const id=uuidv4();
        await ForgotPasswordRequests.create({id , isActive : true , userId: user._id});

        const sender = { email: 'dummy@gmail.com' };
        const receivers = [{ email }];
        await transEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Hi there!! Reset your password',
            htmlContent: `<a href = 'http://localhost:8000/password/resetpassword/${id}'>Reset your password</a>`
        });
        res.status(200).json({ message: 'Reset email sent successfully' });
    } catch (error) {
        console.error('Failed to send reset email:', error);
        res.status(500).json({ error: 'Failed to send reset email' });
    }
};

exports.resetPassword = async (req, res) => {
    try{
        const id = req.params.id;

        const passwordDetails = await ForgotPasswordRequests.findOne({id })
        if (!passwordDetails || !passwordDetails.isActive) {
            return res.status(400).json({ error: 'Invalid or expired reset link' });
        }
        await ForgotPasswordRequests.updateOne({id },{ isActive : false});
        res.send(`
        <html>
            <form action='/password/updatePassword/${id}' method='get'>
                <label for='newPassword'>Enter Password</label>
                <input type='password' name='newPassword' required>
                <button>Reset</button>
            </form>
        </html>
    `);
    }catch(error){
        console.error('Failed to reset email:', error);
        res.status(500).json({ error: 'Failed to  reset email' });
    }
}

exports.updatePassword = async(req,res) => {
    try{
        const newPassword = req.query.newPassword;
        const requestId = req.params.id;

        const passwordDetails = await ForgotPasswordRequests.findOne({id: requestId});

        const user = await User.findById( passwordDetails.userId );
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(201).send('<html><h3>Successfully updated the new password</h3></html>');
    }catch(error){
        console.error('Failed to update email:', error);
        res.status(500).json({ error: 'Failed to  update email' });
    }
}