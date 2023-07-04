import express, { Request, Response, response } from "express";
import "reflect-metadata";
import { AppDataSource } from "./db/data";
import { User } from "./entities/User";
const app = express()
app.use(express.json())
const PORT = 3200
const repositpry = AppDataSource.getRepository(User)

app.get("/", async (req: Request, res: Response) => {
    try {
        const result = await repositpry.find()
        console.log({ result })
        return res.json(result)
    } catch (err) {
        console.log(err)
        throw new Error(JSON.stringify(err))
    }
})


app.get("/search/:id",async(req:Request, res:Response)=>{
    try {
        const paramId= req.params
        if(!paramId.id){
            return res.status(400).send("id is missing")
        }
        const result= await repositpry.findOneBy({id:+paramId.id})
        if(!result){
            return res.status(404).send("user not exits with this id")
        }
        return res.status(200).send(result)
    } catch (err:any) {
        console.log(err)
        throw new Error(err)
    }
})



app.post("/add",async(req:Request, res:Response)=>{
    try {
        const userParseData= req.body
        if(!userParseData.name || !userParseData.lname || !userParseData.age || !userParseData.email){
            return res.status(400).json({message:"something missing data"})
        }
        const {name,lname,age, email}= userParseData
        const newUser= new User()
        newUser.name= name
        newUser.lname= lname
        newUser.email= email
        newUser.age= age
      const result=   await repositpry.save(newUser)
      return res.status(200).send(result)
    } catch (err:any) {
        console.log(err)
        throw new Error(err)
    }
})


app.delete("/delete/:id",async(req:Request, res:Response)=>{
    try {
        const paramId= req.params
        if(!paramId.id){
            return res.status(400).send("something missing")
        }
        const result= await repositpry.findOneBy({id:+paramId.id})
        if(!result){
            return res.status(404).send("user is not found with this id")
        }
        return res.status(200).send(result)
    } catch (err:any) {
        console.log(err,"error is handling")
        throw new Error(err)
    }
})

app.patch("/update/:id",async(req:Request, res:Response)=>{
    try {
        const ParamId= req.params
        const userInfo= req.body
        if(!ParamId.id || !userInfo.email){
            return res.status(200).send(!ParamId.id?"id is missing":"userinfo provide for updataion with id")
        }
        const result= await repositpry.findOneBy({id:+ParamId.id})
        if(!result){
            return res.status(400).send("user not found with this id")
        }
        result.email= userInfo.email
        const backResult= await repositpry.save(result)
        console.log({backResult})
        return res.status(200).send("updated successfull")
    } catch (err:any) {
        console.log(err)
        throw new Error(err)
    }
})
AppDataSource.initialize()
    .then((result) => {
        console.log("db is connected to server")
        app.listen(PORT, () => {
            console.log(`server is running at port ${PORT}`)
        })
    })
    .catch(err => console.log("error occured during databases connections", err))
