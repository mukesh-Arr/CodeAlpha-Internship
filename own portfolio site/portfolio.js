const manuicon=document.querySelector(".manu-icon")
const navlinks=document.querySelector(".nav-lonks")

// console.log(navlinks.classList)
// console.log(navlinks.classList[1])

manuicon.addEventListener("click",()=>{
    if(navlinks.classList[1]=="active"){
        navlinks.classList.remove("active")
        // console.log(navlinks.classList.value)   
    }else{
        navlinks.classList.add("active")
        // console.log(navlinks.classList.value)
    }
    
})