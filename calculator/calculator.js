let string =" ";
let buttons =document.querySelectorAll("button");
// console.log(buttons)
const operators = ['+', '-', '*', '/'];

Array.from(buttons).forEach((item)=>{
    item.addEventListener("click",(el)=>{
        let value=el.target.innerText;
        let disply = document.querySelector("input")
        if(el.target.innerText == '='){
            try{
                string=eval(string)
                disply.value=string;              
            }catch{
                string="invalid input"
                disply.value=string;
            }
            setTimeout(()=>{
                    string=""
                    console.log("good morning")
                },200)
        }
        else if(value == 'AC'){
            string=""
            disply.value=""
        }
        else if(value == 'DEL'){
            string=string.slice(0,string.length-1)
            disply.value=string
        }
        else{
            console.log(el.target.innerText)
            string =string + el.target.innerText;
            disply.value=string;
        }
    })
})


document.addEventListener("keydown", (e) => {
    let disply = document.querySelector("input");
    // console.log(e.key)
    // Numbers and operators
    if (
        (e.key >= "0" && e.key <= "9") ||
        e.key === "+" ||
        e.key === "-" ||
        e.key === "*" ||
        e.key === "/"
    ) {
        string += e.key;
        disply.value = string;
    }

    // Decimal
    else if (e.key === ".") {
        string += ".";
        disply.value = string;
    }

    // Enter = Calculate
    else if (e.key === "Enter") {
        try {
            string = eval(string);
            disply.value = string;
        } catch {
            string = "invalid input";
            disply.value = string;
        }
        setTimeout(()=>{
                    string=""
                    console.log("good morning")
                },200)
    }

    // Backspace = Delete
    else if (e.key === "Backspace") {
        string = string.slice(0, string.length - 1);
        disply.value = string;
    }

    // Escape = AC
    else if (e.key === "Escape") {
        string = "";
        disply.value = "";
    }
});