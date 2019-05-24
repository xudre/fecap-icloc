let database = firebase.database();
let listFilter = document.getElementById('workFilter');
let list = [];
let listFull;

let getContent = () => {
  let content = database.ref().child('content');

  loading.classList.remove('hidden');

  content.once('value', snap => {
    let blocks = snap.val();

    blocks.forEach(block => {
      block.floor.forEach(floor => {
        floor.room.forEach(room => {
          room.timetable.forEach(timetable => {
            timetable.section.forEach(section => {
              section.work.forEach(work => {
                list.push({
                  'name': work,
                  'info': {
                    'block': block.name,
                    'room': room.name,
                    'timetable': timetable.name,
                    'section': section.name
                  }
                });
              });
            });
          });
        });
      });
    });

    listFull = list;

    processList();
  });
};

let applyFilter = () => {
  let filter = listFilter.value;

  loading.classList.remove('hidden');

  if (/^\s*$/i.test(filter)) {
    list = listFull;
  } else {
    if (filter.length < 3) return;

    list = [];

    listFull.forEach(work => {
      if (!work) return;

      let regex = new RegExp(filter, 'i');

      if (regex.test(work.name) || regex.test(work.info.block) || regex.test(work.info.room) || regex.test(work.info.section)) {
        list.push(work);
      }
    });
  }

  setTimeout(() => {
    processList();
  }, 1e3);
};

document.addEventListener('DOMContentLoaded', () => {
  getContent();
});
