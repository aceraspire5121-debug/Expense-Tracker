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