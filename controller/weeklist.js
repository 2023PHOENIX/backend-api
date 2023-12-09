const { User, weeklist } = require("../model/User.js");

const createWeekList = async (req, res) => {
  // TODO: working for the creating new weeklist
  const email = req.email;
  const { todo, isNewWeekList, index } = req.body;
  try {
    const user = await User.findOne({ email });

    //  ? i have two choices weather to create new weeklist or append in previous weeklist

    if (isNewWeekList === true && user.weekList.length <= 1) {
      user.weekList.push({ list: [todo], status: "active" });
    } else if (index >= 0 && isNewWeekList === false) {
      user.weekList[index].list.push(todo);
    } else if (user.weekList.length == 2) {
      return res
        .status(401)
        .send({ message: "you can't have more than 2 weeklist at a time." });
    }

    await user.save();
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ message: "internal server error" });
  }
  res.send({
    message: "ok",
  });
};
const checkTime = (createdTime) => {
  const timeDiff = (Date.now() - createdTime) / (1000 * 60 * 60);
  if (timeDiff > 24) return false;
  return true;
};
// ! BUG: check for the time to 24hr is completed or not
const updateWeekList = async (req, res) => {
  //NOTE: check for update is possible or not.
  const query = req.body;
  const { weekListArrayIndex, weekListObjectIndex } = req.params;
  const uniqueId = req._id;
  try {
    const user = await User.findOne({ _id: uniqueId });

    const checkListData =
      user.weekList[weekListArrayIndex]?.list[weekListObjectIndex];
    if (checkListData) {
      const isAvailable = checkTime(checkListData.createdAt);
      if (isAvailable === false) {
        user.weekList[weekListArrayIndex].status = "inactive";
        return res
          .status(401)
          .send({ message: "you can't update the checklist 24hr passed" });
      } else {
        checkListData.updatedAt = Date.now();

        // ? I can change title and checked.
        // * if user sends title to update we will update the title
        // * if user sends checked to update we will update the checked value
        if ("title" in query) {
          checkListData.desc = query.title;
        } else if ("checked" in query) {
          checkListData.checked = query.checked;
          if (query.checked === true) {
            checkListData.completedAt = Date.now();
          }
        }

        const activeCheckedItem = user.weekList[weekListArrayIndex].list.filter(
          (l) => l.checked === false,
        );
        console.log("-------------------------------------------");
        console.log(activeCheckedItem.length);
        console.log("-------------------------------------------");
        if (activeCheckedItem.length == 0) {
          user.weekList[weekListArrayIndex].status = "completed";
        }
        await user.save();

        // console.log(checkListData);
        return res.send({ message: "checklist has been updated" });
      }
    }
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ message: "internal server error" });
  }

  // res.send({ message: "ok" });
};
// ! BUG: check for the time to 24hr is completed or not
// ? deleting the weeklist from the DB
const deleteWeekList = async (req, res) => {
  const email = req.email;
  const { weekListArrayIndex } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    console.log(weekListArrayIndex);
    if (!checkTime(user.weekList[weekListArrayIndex].createdAt)) {
      user.weeklist[weekListArrayIndex].status = "inactive";
      return res
        .status(401)
        .send({ message: "can't delete the weeklist because it passed 24hrs" });
    }
    user.weekList.splice(weekListArrayIndex, 1);
    await user.save();

    return res.status(200).send({ message: "Week list deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "internal server errror" });
  }
};

// ! BUG: check for the time to 24hr is completed or not
// WARNING:  not sure about the deleting checklist work after 24hrs or not.
const deleteWeekListTask = async (req, res) => {
  const email = req.email;
  const { weekListArrayIndex, weekListTaskIndex } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const weekList = user.weekList[weekListArrayIndex];

    if (weekList) {
      weekList.list.splice(weekListTaskIndex, 1);
      await user.save();

      return res
        .status(200)
        .send({ message: "Week list task deleted successfully" });
    } else {
      return res.status(404).send({ message: "Week list not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// * return all the weeklist with time left.

const fetchAllWeekList = async (req, res) => {
  const email = req.email;

  const user = await User.findOne({ email });

  const weekListArray = user.weekList;

  const resultArray = [];
  for (weeklist of weekListArray) {
    const current = Date.now();
    const createdAt = new Date(weeklist.createdAt).getTime();
    const timeDiff = (current - createdAt) / 1000;

    if (timeDiff < 24 * 60 * 60) {
      const hours = Math.floor(timeDiff / 3600);
      const minutes = Math.floor((timeDiff % 3600) / 60);
      const seconds = Math.floor(timeDiff % 60);

      resultArray.push({
        data: weeklist.list,
        timeLeft: {
          hours,
          minutes,
          seconds,
        },
      });
    } else {
      console.log("More than 24 hours have passed since creation.");
      resultArray.push({
        weeklist,
        message: "More than 24 hours have passed since creation",
      });
    }
  }
  return res.status(200).send({
    message: "Success",
    resultArray,
  });
};

// ^ fetch specific weeklist by ID.
const fetchWeekListByID = async (req, res) => {
  const id = req.params.id; // Corrected to access the 'id' parameter

  console.log(id);

  try {
    // Assuming WeekList is your Mongoose model
    const user = await User.findOne({ email: req.email });

    const result = user.weekList.find((w) => w._id.equals(id));

    if (result) {
      res.status(200).send({ message: "ok", data: result });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "internal server error" });
  }
};

const fetchActiveWeekList = async (req, res) => {
  const users = await User.find({});

  const activeCheckedItems = [];

  users.forEach((user) => {
    user.weekList.forEach((weekList) => {
      weekList.list.forEach((item) => {
        if (item.checked) {
          // Include additional fields if needed
          const activeCheckedItem = {
            userId: user._id,
            weekListId: weekList._id,
            itemId: item._id,
            desc: item.desc,
            // Include other fields as needed
          };
          activeCheckedItems.push(activeCheckedItem);
        }
      });
    });
  });

  res.send({ message: "ok", data: activeCheckedItems });
};

module.exports = {
  createWeekList,
  updateWeekList,
  deleteWeekList,
  deleteWeekListTask,
  fetchAllWeekList,
  fetchWeekListByID,
  fetchActiveWeekList,
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
