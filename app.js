const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


for(let select of dropdowns){
    for(currCode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name==="from" && currCode==="USD"){
            newOption.selected = "selected";
        }else if(select.name==="to" && currCode==="INR"){
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt)=>{
        //evt : browser ka automatic event object
        //console.log(evt);
        updateFlag(evt.target);//<select> is target
    });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  // Input validation
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1"; // input field me bhi 1 show kare
  }

  // New URL using updated endpoint
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
  //console.log(fromCurr.value, toCurr.value);//CAPS mei ayegi

  try {
    let response = await fetch(URL);//from vale ke saare conversions aa jayenge
    let data = await response.json();
    //console.log(data);

    // Get conversion rate for target currency
    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];//"data[fromCurr.value.toLowerCase()]" it returns say usd {} object 
    //console.log(rate);

    // Calculate final converted amount
    let finalAmount = amtVal * rate;

    // Display the result
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching conversion rate.";
    console.error(error);
  }
};

//Based on option selected by user, we want to change the flag of country as well
const updateFlag = (element)=>{
    let currCode = element.value;//<select> ka value property hmesha currently selected option ka value deta hai
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

btn.addEventListener("click", (evt)=>{
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", ()=>{
    updateExchangeRate();
});