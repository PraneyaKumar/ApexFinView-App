import mongoose from "mongoose";
import { loadType } from "mongoose-currency";

const Schema = mongoose.Schema;
loadType(mongoose);

const daySchema = new Schema(
  {
    date: String,
    revenue: {
      type: mongoose.Types.Currency,
      currency: "INR",
      get: (v) => v / 100,  // divide by 100 as 'mongoose.Types.Currency' multiplies it by 100
    },
    expenses: {
      type: mongoose.Types.Currency,
      currency: "INR",
      get: (v) => v / 100,
    },
  },
  { toJSON: { getters: true } }     // set this to be able to use get -> 'get: (v) => v / 100'
);

const monthSchema = new Schema(
  {
    month: String,
    revenue: {
      type: mongoose.Types.Currency,
      currency: "INR",
      get: (v) => v / 100,
    },
    expenses: {
      type: mongoose.Types.Currency,
      currency: "INR",
      get: (v) => v / 100,
    },
    operationalExpenses: {
      type: mongoose.Types.Currency,
      currency: "INR",
      get: (v) => v / 100,
    },
    nonOperationalExpenses: {
      type: mongoose.Types.Currency,
      currency: "INR",
      get: (v) => v / 100,
    },
  },
  { toJSON: { getters: true } }
);

const KPISchema = new Schema(
  {
    totalProfit: {
      type: mongoose.Types.Currency,
      currency: "INR",
      get: (v) => v / 100,
    },
    totalRevenue: {
      type: mongoose.Types.Currency,
      currency: "INR",
      get: (v) => v / 100,
    },
    totalExpenses: {
      type: mongoose.Types.Currency,
      currency: "INR",
      get: (v) => v / 100,
    },
    expensesByCategory: {
      type: Map,
      of: {
        type: mongoose.Types.Currency,
        currency: "INR",
        get: (v) => v / 100,
      },
    },
    monthlyData: [monthSchema],
    dailyData: [daySchema],
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
      // Add a transform function
      transform: function (doc, ret) {
        // `ret` is the object that will be sent as JSON
        if (ret.expensesByCategory && ret.expensesByCategory["$*"] !== undefined) {
          // Check if expensesByCategory exists and has the "$*" key
          delete ret.expensesByCategory["$*"]; // Remove the unwanted key
        }
        // You can do other transformations here if needed
        return ret; // Return the modified object
      },
    },
  }
);

const KPI = mongoose.model("KPI", KPISchema);

export default KPI;