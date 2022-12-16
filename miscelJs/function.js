////
// function actionVerb(param1, param2, etc) {
//     return
// }

/// FUNCTION DECLARATION
// age = prompt(`age?`, 0)
// function checkAge(age) {
//     return (age > 18) ? true: "Did parents allow?"
// }

/// FUNCTION EXPRESSION

// alert(checkAge(age))

// age = prompt(`age?`, 0)
// let checkAge = function() {
//     return (age>18)? true:false
// };

// let func = checkAge;

// alert(checkAge())


/// ARROW FUNCTION
// Arrow functions:

// Do not have this
// Do not have arguments
// Can’t be called with new

// let ask = (question, yes, no) => {
//     if (confirm(question)) yes();
//     else no();
//   }
  
//   ask(
//     "Do you agree?",
//     ()  => { alert("You agreed."); },
//     ()  => { alert("You canceled the execution."); }
//   );

// let group = {
//     title: "Our Group",
//     students: ["John", "Pete", "Alice"],
  
//     showList() {
//       this.students.forEach(
//         student => alert(this.title + ': ' + student)
//       );
//     }
//   };
  
//   group.showList();

function defer(func, ms) { // this function takes another func and defer it by x ms
    return function() { //return a function expression without name 
        setTimeout(() => func.apply(this, arguments), ms) // this is an arrow function without name and argument
    };
}

function sayHi(name) {
    alert(`Hi ${name}`)
}

let sayHiDeferred = defer(sayHi, 2000);

sayHiDeferred("Anh")