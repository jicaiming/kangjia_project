//as an entry
const Name = require('./controller/Name');
const aaaTpl = require('./views/aa.art');

// import {name} from'./controller/name'
// console.log(name);

async function getName(){
    // console.log(Name.name)
    const name = await Name.setname()
    console.log(name)
}
getName()

// console.log(template)
const newStr = template.render('<div>{{title}}</div>',{title:'watcher test'})
console.log(newStr)