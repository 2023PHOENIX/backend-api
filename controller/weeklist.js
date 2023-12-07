const User = require("../model/User.js");

const createWeekList = async (req, res) => {
  // TODO: working for the creating new weeklist
  const email = req.email;

  const user = await User.findOne({ email });

  const { todo, isNewWeekList, index } = req.body;
  //  ? i have two choices weather to create new weeklist or append in previous weeklist

  if (user.weekList.length <= 2) {
    if (isNewWeekList === true) {
      console.log("---hit---");
      user.weekList.push([todo]);
    } else if (index) {
      user.weekList[index].push(todo);
    }

    // console.log(user.weekList[index]);
    await user.save();
  } else {
    return res
      .status(401)
      .send({ message: "you can't have more than 2 weeklist at a time." });
  }

  res.send({
    message: "ok",
  });
};

const updateWeekList = async (req, res) => {
  //NOTE: check for update is possible or not.
  const query = req.body;
  const { weekListArrayIndex, weekListObjectIndex } = req.params;
  const uniqueId = req._id;
  const user = await User.findOne({ _id: uniqueId });

  const checkListData = user.weekList[weekListArrayIndex][weekListObjectIndex];
  if (checkListData) {
    const timeDifference =
      (Date.now() - checkListData.createdAt) / (1000 * 60 * 60);
    if (timeDifference > 24) {
      return res.status(401).send({
        message:
          "can't update the checkList from weeklist because it already have passed 24hrs",
      });
    } else {
      checkListData.updatedAt = Date.now();
      // ? I can change title and checked.
      // * if user sends title to update we will update the title
      // * if user sends checked to update we will update the checked value
      if ("title" in query) {
        checkListData.desc = query.title;
      } else if ("checked" in query) {
        checkListData.checked = query.checked;
      }
      const newUser = await user.save();

      console.log(checkListData);
      return res.send({ message: "checklist has been updated" });
    }
  }

  res.send({ message: "ok" });
};

// ? deleting the weeklist from the DB
const deleteWeekList = async (req, res) => {
  const email = req.email;
  const { weekListArrayIndex } = req.params; // & this will provide me the index of weeklist need to be deleted from DB.
  const user = await User.findOne({ email });
  user.weekList.splice(weekListArrayIndex, 1);
  await user.save();
  res.send({ message: "ok" });
};

const deleteWeekListTask = async (req, res) => {
  const email = req.email;
  const { weekListArrayIndex, weekListTaskIndex } = req.params;
  const user = await User.findOne({ email });
  console.log(user.weekList[weekListArrayIndex]);
  console.log("------------------------");
  user.weekList[weekListArrayIndex].splice(weekListTaskIndex, 1);

  console.log("------------------------");
  console.log(user.weekList[weekListArrayIndex]);

  await user.save();

  res.send({ message: "ok" });
};

module.exports = {
  createWeekList,
  updateWeekList,
  deleteWeekList,
  deleteWeekListTask,
};

/* HACK:  create an schema weeklist {
 *
 * [ currentUser ] :
 *                   [[{ desc , created Time , isCompleted},{}],[{},{},{}]]
 *
 *             fit this into currentUser
 *
 *
 *
 * } */
