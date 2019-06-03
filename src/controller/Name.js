//a module
//use commonjs
module.exports = 'commonjs-Amelia';

//es6暴露方法
// export const name = 'es6-Amelia'


module.exports = {
    name : 'Amelia',
    setname : ()=>{
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve('Await :Amy')
            },2000)
        })
    }
}