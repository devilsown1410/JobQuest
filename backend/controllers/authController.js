import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { usersCollection } from '../db.js';

export const register = async(req,res)=>{
  const{ username, email, password, userType } = req.body;
  try{
    const existingUser  = await usersCollection.findOne({ email });
    if(existingUser){
      return res.status(400).json({ message: 'User  already exists' });
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser  = { username, email, password: hashedPassword, userType };
    await usersCollection.insertOne(newUser);
    const token = jwt.sign({ email },process.env.JWT_SECRET,{ expiresIn: '1h' });
    res.status(201).json({ token, user: newUser  });
  }catch(error){
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const login = async(req,res)=>{
  const{ email, password } = req.body;
  try{
    const user = await usersCollection.findOne({ email });
    if(!user){
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ email },process.env.JWT_SECRET,{ expiresIn: '1h' });
    res.status(200).json({ token, user });
  }catch(error){
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};