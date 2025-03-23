import express from "express";
import { getAllDoctors } from "../services/doctorServices";
const router = express.Router();

router.get('/', async (req, res) =>{
    try {
        const response = await getAllDoctors()
        if(response.success){
            if(response.data.length === 0){
                return res.status(200).send('No records found')
            }
            return res.status(200).send(response.data)
        }
        else{
            throw new Error('Error in fetching all doctors api controller')
        }
    } catch (error) {
        return res.status(400).send({message: error.message || 'Error in fetching all doctors api controller'})
    }
})

export default router;