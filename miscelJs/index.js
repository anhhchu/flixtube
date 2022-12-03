let user = prompt("Who's there", "");

if (user === "Admin") {
    let login = prompt("Password", "");
    if (login === "The Master") {
        alert("Welcome!")
    } else if (login ===null || login === '') {
        alert("Canceled")
    } else {
        alert("Wrong password")
    } 
} else if (user === null || user === '') {
    alert ("Canceled")       
} else {
    alert ("I don't know you")
}