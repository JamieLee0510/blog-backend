const bcrypt = require("bcrypt");

//連接mongodb
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

adminSchema.pre("save", async function (next) {
  try {
    /* 
    Here first checking if the document is new by using a helper of mongoose .isNew, 
    therefore, this.isNew is true if document is new else false, 
    and we only want to hash the password if its a new document, 
    else  it will again hash the password if you save the document again by making 
    some changes in other fields incase your document contains other fields.
    */
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

adminSchema.methods.isValidPassword = async function (reqPassword) {
  try {
    return await bcrypt.compare(reqPassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("Admin", adminSchema);
