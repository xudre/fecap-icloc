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

document.addEventListener('DOMContentLoaded', () => {
  let now = new Date();
  let timetable_name = '1º Horário';

  /*
  Primeiro - 8:30 até 10:40
  Segundo - 11:20 até 13:30
  Terceiro - 15:00 até 17:10
  */

  if (now.getDate() === 25) {
    if (now.getHours() >= 15) {
      timetable_name = '3º Horário';
    } else if (now.getHours() >= 11 && now.getMinutes() >= 20) {
      timetable_name = '2º Horário';
    }
  }

  getSections(timetable_name);
});
