import CTask from '../models/CompletedTasks.js'; 

const fetchTasks = async (req, res, session) => {
  try {
    const shopOrigin = session.shop;
    const TaskDetails = await CTask.find({
      shopOrigin: shopOrigin,
    }).exec();
    res.status = 200;
    res.body = {
      status: true,
      data: {
        ctasks: TaskDetails,
      },
    };

    res.send({
      status: true,
      data: res.body.data
    })
  } catch (error) {
    res.status = 400;
    res.body = {
      status: false,
      msg: 'Unknown error occured',
    };
  }
};

export default fetchTasks;
