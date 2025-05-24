import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prismaClient } from '..';
import { BadRequest } from '../exceptions/bad-request';
import { ErrorCode} from '../exceptions/root';
import { UnprocessableEnity } from '../exceptions/validations';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return next(new BadRequest('Please provide email, password, and name', ErrorCode.PASSWORD_EMAIL_NOT_FILL));
  }

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new BadRequest('User already exists', ErrorCode.USER_ALREADY_EXIT));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ message: 'User created successfully', user: safeUser });

  } catch (err: any) {
    console.error('Signup Error:', err);
    next(
      new UnprocessableEnity(
        err?.cause?.issues,
        'Unprocessable entity',
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};


export const login = async(req:Request,res:Response) =>{
   const JWT_SECRET = process.env.JWT_SECRET;
   const {email,password} = req.body;

   //Input validation

   if(!email||!password){
     res.status(400).json({ message: 'Please provide email and password' });
    return;
   }

   try {
    const user = await prismaClient.user.findUnique({ where: { email } });
    if(!user){
       res.status(401).json({ message: 'User doesnt exits' });
      return;

    };

    const isPasswordValid =  await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    };

    //Generate jwt token 
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!,{expiresIn:'1h'})

    // Exclude password before sending response
    const { password: _, ...userData } = user;

    res.status(200).json({ message: 'Login successful', token, user: userData });
   } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Something went wrong', error: err });
   }
}