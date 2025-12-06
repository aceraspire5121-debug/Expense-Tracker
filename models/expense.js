import mongoose from "mongoose"
import { type } from "os";
const ExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
     time: {
  type: String,
  required: true,
  default: () => {
    const d = new Date(); // ye object return karta hai bo object d me store ho jata hai with all the details date,month,year etc 
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`; // DD-MM-YYYY
  }
},
    category: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    date:{type:Number,required:true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }

});

export const Expense = mongoose.model('Expense', ExpenseSchema);