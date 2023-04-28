const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const s = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


//initially :
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

//HandleSlider() = > function to set the initial reading of the length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

//setIndicator function 
function setIndicator(color){
    indicator.style.backgroundColor = color;
}

// getRandomInt() => function to get a random integer value between some min and max value
function getRandomInt(min,max){
    return(Math.floor(Math.random()*(max-min))+min);
}

// get random letters and symbols and numeric values 
function generateUpperCase(){
    return(String.fromCharCode(getRandomInt(65,91)));
}
function generateLowerCase(){
    return(String.fromCharCode(getRandomInt(97,123)));
}
function generateNumber(){
    return(getRandomInt(0,9));
}
function generateSymbol(){
    const randomIndx = getRandomInt(0,s.length);
    return (s.charAt(randomIndx));
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");} 
    else if (
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");} 
    else {
        setIndicator("#f00");}
}

//To copy the code in the clipboard

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }

    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

// To shuffle the password :

function shufflePassword(array){
    for(let i=array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[j];
        array[i]=array[j];
        array[j]=temp;
    }

    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

//count the number of checkbox checked :

function HandleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

//adding event listener to all the checkboxes :

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',HandleCheckBoxChange);
})

inputSlider.addEventListener('input',(e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)  
      copyContent();
})

generateBtn.addEventListener('click',()=>{
    if(checkCount==0)   
        return;

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //Journey started ;
    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    
    if(numbersCheck.checked)
        funcArr.push(generateNumber);
    
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory action :

    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randomIndx = getRandomInt(0,funcArr.length);
        password += funcArr[randomIndx]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;
    calcStrength();
})