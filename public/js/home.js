let database = firebase.database();
let listCap = 5;
let list = [];

let getSections = (timetable_name) => {
  let content = database.ref().child('content');

  loading.classList.remove('hidden');

  content.once('value', snap => {
    let blocks = snap.val();

    blocks.forEach(block => {
      block.floor.forEach(floor => {
        floor.room.forEach(room => {
          room.timetable.forEach(timetable => {
            if (timetable.name === timetable_name) {
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
            }
          });
        });
      });
    });

    list.shuffle();

    processList(listCap);
  });
};

getSections('1º Horário');
