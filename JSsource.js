

const ingrInput = document.getElementById("Ingredient");
const instInput = document.getElementById("Instruction");
const addIngr = document.getElementById("addIngr");
const addInst = document.getElementById("addInst");
const titleVal = document.getElementById("recipeTitle");
const resetButton = document.getElementById("reset");
const saveButton = document.getElementById("saveButton");

function addElement(theElement, parentElement){
    const inputValue = theElement.value;
    if (inputValue === ""){
        displayError(`${theElement.id} cannot be blank`)
        return;
    }
    var newLi = document.createElement("li");
    newLi.className = "addedElement";
    newLi.innerHTML = inputValue;
    newLi.id = inputValue;
    newLi.role = "button";
    newLi.tabIndex = 0;
    newLi.ariaLabel = inputValue + "delete";
    parentElement.appendChild(newLi);
    theElement.value = "";
    document.getElementById(inputValue).addEventListener("click", () => {
        newLi.remove();
    })
    document.getElementById(inputValue).addEventListener("keypress", (e) => {
        if (e.code === "Space" || e.code === "Enter"){
            newLi.remove();
        }
    })

}

document.getElementById("ingrAdd").addEventListener("click", (e) => {
    addElement(ingrInput, addIngr);
})

document.getElementById("instAdd").addEventListener("click", (e) => {
    addElement(instInput, addInst);
})

ingrInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter"){
        addElement(ingrInput, addIngr);
    }
})

instInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter"){
        addElement(instInput, addInst);
    }
})

resetButton.addEventListener("click", () => {
    titleVal.value = "";
    listAddedElements = document.getElementsByClassName("addedElement");
    console.log("listaddedelements length is " + listAddedElements.length)

    while (document.getElementsByClassName("addedElement").length > 0){
        element = document.getElementsByClassName("addedElement");
        element[0].remove();
    }
})

saveButton.addEventListener("click", () => {
    ingrList = [];
    instList = [];
    var parentIngr = document.querySelector("#addIngr");
    ingrObjects = parentIngr.getElementsByClassName("addedElement");
    var parentInst = document.querySelector("#addInst");
    instObjects = parentInst.getElementsByClassName("addedElement");
    for (let i = 0; i < ingrObjects.length; i++){
        ingrList.push(ingrObjects[i].id);
    }
    for (let j = 0; j < instObjects.length; j++){
        instList.push(instObjects[j].id);
    }
    if (titleVal.value == "") {
        displayError("The recipe must have a title to be saved")
        return;
    }
    else if ((ingrList.length < 1) || (instList.length < 1)){
        displayError("There must be at least one ingredient and one instruction to save")
        return;
    }
    recipeObject = {
        title: titleVal.value,
        ingredients: ingrList,
        instructions: instList
    }
    writeRecipeToFile(recipeObject);
})

function displayError(errorMessage){
    const element = document.getElementById("error-message");
    element.innerHTML = errorMessage;
    element.dataset.open = "true";
    setTimeout(() => {
        element.dataset.open = "false";
        element.innerHTML = "";
    }, 5000);
}


/* could'nt figure out how to import this so I just copied and pasted it into this file */
function writeRecipeToFile(recipe) {
    // taking from
    function download(text, filename){
      var blob = new Blob([text], {type: "text/html"});
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
    const output = `
      <html>
        <head>
          <style>
            :root {
              font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
            }
            h1 {
              background-color: rgb(15,35,57);
              color: white;
              padding: 16px;
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
            }
            .b-main {
              width: 600px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24);
            }
            .b-content {
              padding: 16px;
              display: flex;
              gap: 16px;
            }
            .b-ingredients {
              flex: 1
            }
            .b-instructions {
              flex: 1'
            }
          </style>
        </head>
        <body>
          <main class="b-main">
            <h1>${recipe.title}</h1>
            <div class="b-content">
              <div class="b-ingredients">
                <strong>Ingredients</strong>
                <hr>
                ${
                  recipe.ingredients.map(i => (
                    `
                      <div>${i}</div>
                    `
                  )).join('')
                }
              </div>
              <div class="instructions">
                <strong>Instructions</strong>
                <hr>
                ${
                  recipe.instructions.map((i, index) => (
                    `
                      <div>${index+1}: ${i}</div>
                    `
                  )).join('')
                }
              </div>
            </div>
          </main>
        </body>
      </html>
    `;
    download(output, `recipe-card.html`);
  }

