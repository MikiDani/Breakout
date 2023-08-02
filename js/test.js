function MyClass(){};

MyClass.prototype.test = function(){
   console.log('TEST');
};

function MyClassFactory(){
  this.instances = [];
};

MyClassFactory.prototype.create = function(){
  let tmp = new MyClass();
  this.instances.push(tmp);
  return tmp;
};

MyClassFactory.prototype.get = function(i){
  return this.instances[i];
};

MyClassFactory.prototype.getAll = function(){
  return this.instances;
};

let factory = new MyClassFactory();

let obj1 = factory.create();
let obj2 = factory.create();
let obj3 = factory.create();

let test1 = factory.get(0);

let test2 = factory.getAll();

for(let t of test2){
  t.test();
}

test1.test();