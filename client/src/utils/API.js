import axios from "axios";

export default {
  // ============================
  // BILL FUNCTIONS
  // ============================

  // Gets all bills
  getBills: function() {
    return axios.get("/api/bills");
  },
  // Gets the bill with the given id
  getBill: function(id) {
    return axios.get("/api/bills/" + id);
  },
  // Deletes the bill with the given id
  deleteBill: function(id) {
    return axios.delete("/api/bills/" + id);
  },
  // Saves a bill to the database
  saveBill: function(billData) {
    console.log(billData);
    return axios.post("/api/bills", billData);
  },
  // Updates a bill to the database
  updateBill: function(id) {
      return axios.put("/api/bills", id);
  },



  // ============================
  // SPENDING FUNCTIONS
  // ============================

  // Gets all spending
  getAllSpending: function() {
    return axios.get("/api/spending");
  },
  // Gets the spending with the given id
  getSpending: function(id) {
    return axios.get("/api/spending/" + id);
  },
  // Deletes the spending with the given id
  deleteSpending: function(id) {
    return axios.delete("/api/spending/" + id);
  },
  // Saves a spending to the database
  saveSpending: function(spendingData) {
    console.log(spendingData)
    return axios.post("/api/spending", spendingData);
  },
  // Updates a spending to the database
  updateSpending: function(id) {
      return axios.put("/api/spending", id);
  },


  
  // ============================
  // USER FUNCTIONS
  // ============================

  // Gets all users
  getUsers: function() {
    return axios.get("/api/users");
  },
  // Gets the user with the given id
  getUser: function(id) {
    return axios.get("/api/users/" + id);
  },
  // Deletes the user with the given id
  deleteUser: function(id) {
    return axios.delete("/api/users/" + id);
  },
  // Saves a user to the database
  saveUser: function(userData) {
    // console.log(userData);
    return axios.put("/api/users", userData);
  },
  // Updates a user to the database
  updateUser: function(id) {
    return axios.put("/api/users", id);
  },

  // ============================
  // INCOME FUNCTIONS
  // ============================

  getIncomes: function() {
    return axios.get("/api/incomes");
  },
  // Gets the bill with the given id
  getIncome: function(id) {
    return axios.get("/api/incomes/" + id);
  },
  // Deletes the bill with the given id
  deleteIncome: function(id) {
    return axios.delete("/api/incomes/" + id);
  },
  saveIncome: function(incomeData) {
    console.log(incomeData);
    return axios.put("/api/incomes", incomeData);
  },
  // Updates a spending to the database
  updateIncome: function(id) {
    return axios.put("/api/incomes", id);
  }
};
