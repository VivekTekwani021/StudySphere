// exports.processBacklogs = (roadmap) => {
//   const today = new Date();
//   today.setHours(0,0,0,0);

//   roadmap.days.forEach((d) => {
//     const dDate = new Date(d.date);
//     dDate.setHours(0,0,0,0);

//     if (dDate < today && !d.isCompleted) {
//       d.backlog = true;
//     } else {
//       d.backlog = false;
//     }
//   });

//   return roadmap;
// };

exports.processBacklogs = (roadmap) => {
  const today = new Date();
  today.setHours(0,0,0,0);

  let backlogTasks = [];

  roadmap.days.forEach((d) => {
    const dDate = new Date(d.date);
    dDate.setHours(0,0,0,0);

    if (dDate < today && !d.isCompleted) {
      d.backlog = true;

      d.tasks.forEach((t) => {
        if (!t.completed) backlogTasks.push(t.title);
      });

    } else {
      d.backlog = false;
    }
  });

  // push backlog into today
  const todayDay = roadmap.days.find(d=>{
    const dDate = new Date(d.date);
    dDate.setHours(0,0,0,0);
    return dDate.getTime() === today.getTime();
  });

  if (todayDay && backlogTasks.length) {
    backlogTasks.slice(0,2).forEach(t=>{
      todayDay.tasks.push({
        title: "[BACKLOG] " + t,
        completed:false
      });
    });
  }

  return roadmap;
};
