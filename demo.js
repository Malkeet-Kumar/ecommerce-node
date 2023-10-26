function Hello(name,age){
    var name,age;
    name=this.name;
    age=this.age;
};
Hello.prototype.getName=()=>{
return this.name;
}
Hello.prototype.setName=function(name,age){
    this.name=name;
    this.age=age;
}
var abc=new Hello('a',21);
console.log(abc.setName('a',21));
console.log(abc.getName());
console.log(Hello.prototype);