const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let sel of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (sel.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (sel.name === "to" && currCode === "PKR") {
      newOption.selected = true;
    }
    sel.append(newOption);
  }

  sel.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}${fromCurr.value}`;
  try {
    let response = await fetch(URL);
    let data = await response.json();

    if (data.rates) {
      let rate = data.rates[toCurr.value];
      let finalAmount = (amtVal * rate).toFixed(2);
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } else {
      msg.innerText = "Error fetching exchange rate!";
    }
  } catch (error) {
    msg.innerText = "Failed to fetch exchange rate!";
    console.error("API Error:", error);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
