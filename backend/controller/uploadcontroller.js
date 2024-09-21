const uploadfunc = async (req, res) => {
  try {
    res.send("this is the response from the uploadcontroller");
  } catch (err) {
    console.log(err);
  }
};
const uploadfunc2 = async (req, res) => {
  try {
    res.send("this is the response from the uplod func2");
  } catch (err) {
    console.log(err);
  }
};
module.exports = { uploadfunc, uploadfunc2 };
