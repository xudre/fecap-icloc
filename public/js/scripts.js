// https://stackoverflow.com/a/10142256/1867501
Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}

let loading = document.getElementById('loading');

let processList = (cap) => {
  if (!cap) cap = 99999;

  let workList = document.getElementById('workList');
  let workTpl  = document.getElementById('workTemplate');

  workList.innerHTML = '';

  for (let i = 0; i < cap; i++) {
    let work = list[i];

    if (!work) continue;

    let workItem = workTpl.cloneNode(true);

    workItem.removeAttribute('id');
    workItem.removeAttribute('data-upgraded');

    let h3 = workItem.querySelector('h3');
    let h4 = workItem.querySelector('h4');
    let h5 = workItem.querySelector('h5');

    h3.innerHTML = `${work.info.block} - ${work.info.room}`;
    h4.innerHTML = `${work.name}`;
    h5.innerHTML = `${work.info.section} - ${work.info.timetable}`;

    componentHandler.upgradeElement(workItem);

    workList.appendChild(workItem);
  }

  loading.classList.add('hidden');
};
