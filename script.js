var me_data = [];
var all_tags = [];
var curr_que = 0;

//me_data = getDataFromLocale("myData");
me_data = getDataFromGit();

function initialLoading() {
    document.querySelector(".loading").classList.add("hide");
    document.querySelector(".me-content").classList.remove("hide");
    loadAllTags();
    displayQuestion();
}
// helllo HHHHHH
document.querySelector("button.new-question").addEventListener("click", () => {
    ++curr_que;
    if (curr_que == me_data.length) {
        curr_que = 0;
        me_data = sortArrayRandomly(me_data);
    }
    displayQuestion();
});

function sortArrayRandomly(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function displayQuestion(que) {
    if (!que) que = me_data[curr_que];
    var que_text = document.querySelector(".que-text");
    que_text.innerHTML = "";

    var span = document.createElement("span");
    span.className = "question";
    span.textContent = "Q: " + que.question;
    que_text.appendChild(span);

    var options = document.createElement("div");
    options.className = "options";
    que_text.appendChild(options);

    shuffleArray(que.options);

    que.options.forEach((opt, index) => {
        var span = document.createElement("span");
        span.className = "option me-cp";
        var optionLetters = ["(a)", "(b)", "(c)", "(d)"];
        var optionText = optionLetters[index] + " " + opt.replace(" #ans", "");
        span.textContent = optionText;
        if (opt.includes("#ans")) {
            span.classList.add("ans");
        }
        span.addEventListener("click", function () {
            // Check if the clicked span contains the 'ans' class
            if (span.classList.contains("ans")) {
                span.classList.add("correct-ans");
            } else {
                span.classList.add("wrong-ans");
            }

            // Add 'correct-ans' class to the span with the 'ans' class
            document.querySelectorAll(".option").forEach((optionSpan) => {
                if (optionSpan.classList.contains("ans")) {
                    optionSpan.classList.add("correct-ans");
                }
            });

            document.querySelectorAll(".option").forEach((optionSpan) => {
                optionSpan.classList.add("disabled");
            });
        });
        options.appendChild(span);
    });

    var tag_target = document.querySelector(".que-tags .tags");
    displayTags(que.tags, tag_target);
}

function displayTags(tag_array, tag_target) {
    tag_array.forEach((tag) => {
        var span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        tag_target.appendChild(span);
    });
}

function loadAllTags() {
    console.log("loadAllTags called");
    me_data.forEach((obj) => {
        obj.tags.forEach((tag) => {
            if (!all_tags.includes(tag)) all_tags.push(tag);
        });
    });
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function getDataFromLocale(key) {
    try {
        const jsonData = localStorage.getItem(key);
        if (jsonData === null) {
            console.log(`No local data is found for key: ${key}`);
            return null;
        }
        var data = JSON.parse(jsonData);
        console.log(`Local data for key "${key}" retrived successfully from locale`);
        return data;
    } catch (error) {
        console.error(`Error retrieving local data with key "${key}" from localStorage`);
        return null;
    }
}
function saveDataInLocale() {
    var jsonData = JSON.stringify(me_data);
    localStorage.setItem("myData", jsonData);
}

async function getDataFromGit() {
    var id = "355a6da99dbfceb52277a8e9dba96e93";
    var filename = "me_data.json";
    const apiUrl = `https://api.github.com/gists/${id}`;

    return await fetch(apiUrl)
        .then((response) => response.json())
        .then((gistData) => {
            if (gistData.files && gistData.files[filename]) {
                const fileContent = gistData.files[filename].content;
                const parsedData = JSON.parse(fileContent);
                console.log(`Data from "${filename}" retrieved successfully`);

                me_data = parsedData;
                initialLoading();
            } else {
                console.error("File not found in the Gist.");
            }
        })
        .catch((error) => {
            console.error("Error getting data from the Gist:", error);
        });
}
