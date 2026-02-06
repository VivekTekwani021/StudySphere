const cron = require("node-cron");
const Roadmap = require("../models/Roadmap.model");

cron.schedule("0 2 * * *", async () => {
  console.log("Running daily roadmap cron");

  const roadmaps = await Roadmap.find({ status: "active" });

  for (const r of roadmaps) {
    r.days.forEach(d=>{
      if(!d.isCompleted && new Date(d.date) < new Date()){
        d.backlog = true;
      }
    });

    await r.save();
  }
});
