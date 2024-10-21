const returnData = (error, res) => {
  console.log(error); // for developer to know what is a problem
  res.send("Problem occurred"); // user Only gets the info that something went wrong
};

export default returnData;
