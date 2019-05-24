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

    let regex = new RegExp(filter, 'i');

    listFull.forEach(work => {
      if (!work) return;

      if (regex.test(work.name) || regex.test(work.info.block) || regex.test(work.info.room) || regex.test(work.info.section) || regex.test(work.info.timetable)) {
        list.push(work);
      }
    });
  }

  setTimeout(() => {
    processList();
  }, 1e3);
};

let timetableFilter = (value, target) => {
  let selected = document.querySelectorAll('.timetable > div.mdl-color--primary');

  selected.forEach(element => {
    element.classList.remove('mdl-color--primary');
  });

  target.classList.add('mdl-color--primary');

  listFilter.value = value;

  listFilter.focus();

  applyFilter();
};

document.addEventListener('DOMContentLoaded', () => {
  getContent();
});
