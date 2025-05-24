import express,{Express,Request,Response} from 'express'
import dotenv from 'dotenv'
import rootRouter from './Routes/rootRouter';
import { PrismaClient } from './generated/prisma';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { signUpSchema } from './schema/userSchema';


dotenv.config();

const app:Express = express();
const PORT =  process.env.PORT || 5000

app.use(express.json());
app.use('/api',rootRouter)

app.use(errorMiddleware);
export const prismaClient = new PrismaClient({
    log:['query']
}).$extends({
    query: {
        user:{
            create({args,query}){
                args.data = signUpSchema.parse(args.data)
                return query(args)
            }
        }
    }
})

app.listen(PORT,()=>{
    console.log(`App Working on ${PORT}`);
});