let photoes =document.querySelectorAll(".photos img")
// console.log(photoes)
let phot = document.querySelector(".photos")
// console.log("photos")
let full = document.querySelector(".full")
let fullimg = document.querySelector(".full img")
// console.log(fullimg.src)
let shad = document.querySelector(".backShadow")
// console.log(shad)

let count=0;
function lightbox(n){
    count=n;
    // console.log(photoes[n].src)
    fullimg.src=photoes[n].src;
    // console.log(fullimg.src)
    full.classList.add("fullshow")
    shad.classList.add("backShadowshow")
}

let but = document.querySelector(".ero")
// console.log("but")
but.addEventListener("click",()=>{
    full.classList.remove("fullshow")
    shad.classList.remove("backShadowshow")
})

let next=document.querySelector(".next")
let previos = document.querySelector(".pre")

next.addEventListener("click",()=>{
    if(count==photoes.length-1){
        count=0;
        lightbox(count);
    }else{
        count=count+1;
        lightbox(count);
    }
})

previos.addEventListener("click",()=>{
    if(count==0){
        count=count+(photoes.length-1)
        lightbox(count)
    }else{
        count=count-1;
        lightbox(count);
    }
})
console.log("succesefuly exacute the code thank to god")
