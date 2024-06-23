var me_data = [];
var all_tags = [];
var fil_ques = [];
var curr_que = 0;
var que_mode = "mcq";
var new_ques = [];
var new_que_tags = ["apple", "banana", "cat"];
var me_admin = false;
var git_token = ""; // "ghp_XUplYMw_elahi_L0bgLAwvBBp_elahi_CVSXLcnF86on4g_elahi_Eoyq";

//me_data = getDataFromLocale("myData");
var gist_id = "1b59fd85ef6da4c753cc277887fe2b54"; // token gist file id
var gist_filename = "token_gist.json"; // token gist filename
//getDataFromGit(gist_id, gist_filename, "git_token");

gist_id = "4cb7b01ed98d271744b3cc662072b1ce"; // data gist file id
gist_filename = "my_mcq_app_data.json"; // data gist file name
getDataFromGit(gist_id, gist_filename, "me_data");

//saveDataInLocale("me_admin", true);
function initialLoading() {
    document.querySelector(".loading").classList.add("hide");
    document.querySelector(".me-content").classList.remove("hide");
    loadAllTags();
    sortArrayRandomly(me_data);
    fil_ques = me_data;
    displayQuestion();

    new_que_tags = all_tags;
    new_ques = getDataFromLocale("new_ques");
    if (!new_ques) new_ques = [];
    loadAllFilterTags();
    saveDataInLocale("me_admin", true);
    me_admin = getDataFromLocale("me_admin");
    //
    if (false) {
        var span1 = document.querySelector("span.add-new-que");
        span1.classList.remove("hide");
        /* span1.addEventListener("click", () => {
            debugger;
            document.querySelector("div.add-que").classList.toggle("hide");
        }); */
        document.body.addEventListener("click", (event) => {
            if (event.target === span1) {
                debugger;
                document.querySelector("div.add-que").classList.toggle("hide");
            }
        });
    }
}

document.querySelector(".refresh-icon").addEventListener("click", () => {
    location.reload(true);
    return;
    fil_ques = me_data;
    sortArrayRandomly(fil_ques);
    document.querySelector(".filtered-tags .tags").innerHTML = "";
    curr_que = 0;
    displayQuestion();
});
document.querySelector("button.update-gist").addEventListener("click", () => {
    if (checkInternetConnection) {
        updateMyMcqAppGistFile();
    } else {
        popupAlert("you are offline");
    }
});

document.querySelector("button.new-question").addEventListener("click", () => {
    ++curr_que;
    if (curr_que == fil_ques.length) {
        curr_que = 0;
        sortArrayRandomly(fil_ques);
    }
    displayQuestion();
});

document.querySelector("button.add-que").addEventListener("click", () => {
    /* var obj = {
        id: generateUniqueId(),
        create_date: getTodayDate(),
        question: document.querySelector("textarea.que").value,
        options: Array.from(document.querySelectorAll(".add-que .option")).map((option) => option.value),
        tags: [],
    }; */

    var obj = {
        id: generateUniqueId(),
        create_date: getTodayDate(),
        question: document.querySelector("textarea.que").value,
        options: Array.from(document.querySelectorAll(".add-que .option")).map((option) => {
            return {
                id: generateUniqueId(),
                text: option.value,
            };
        }),
        tags: [],
    };

    // Collect tags, ensuring no duplicates
    var tagElements = document.querySelectorAll(".que-tags .tag .name");
    var tagSet = new Set(); // Using Set to ensure uniqueness
    tagElements.forEach((tagElement) => {
        tagSet.add(tagElement.textContent.trim());
    });
    obj.tags = Array.from(tagSet); // Convert Set back to array

    // Add any new tags to new_que_tags array
    obj.tags.forEach((tag) => {
        if (!new_que_tags.includes(tag)) {
            new_que_tags.push(tag);
        }
    });

    new_ques.push(obj);
    saveDataInLocale("new_ques", new_ques);
    console.log(`new question object added ${obj}`);
    popupAlert("new question added");
});
function runForMeEditMode() {
    document.querySelector("span.add-new-que").classList.remove("hide");
    document.querySelector("div.add-que").classList.remove("hide");
}
document.querySelector("div.top input.search-filter").addEventListener("focus", (event) => {
    setAutoComplete(event, all_tags, "search-filter-tag");
});
document.querySelector("div.add-que .tags input").addEventListener("focus", (event) => {
    setAutoComplete(event, new_que_tags, "new-que-tag");
});

var autocompleteList = document.createElement("div");
autocompleteList.className = "me-autocomplete-list";
document.body.append(autocompleteList);

function setAutoComplete(event, arr, type, target) {
    var input = event.target;

    input.addEventListener("input", function () {
        var inputValue = input.value.trim().toLowerCase();
        //const matchingNames = [];
        //try {
        const matchingNames = arr.filter((name) => name.toLowerCase().includes(inputValue));
        //} catch (e) {}

        autocompleteList.innerHTML = "";

        if (true && inputValue !== "" && type != "search-filter-tag") {
            const inputItem = document.createElement("div");
            inputItem.textContent = 'new: "' + inputValue + '"';

            inputItem.addEventListener("click", (event) => {
                var tar = input.parentElement;
                var tag = event.target.textContent.match(/"([^"]*)"/)[1].trim();
                var div = document.createElement("div");
                div.className = "tag";
                div.innerHTML = `<span class="name">${tag}</span>
                     <span class="remove-tag">x</span>`;
                tar.insertBefore(div, input);
                div.children[1].addEventListener("click", (event) => {
                    div.remove();
                });
                input.value = "";
                input.focus();
                autocompleteList.classList.remove("active");
                /*
                // Add your logic here for handling the click event of the input value
                var tar = input.parentElement;
                var tag = event.target.textContent.match(/"([^"]*)"/)[1].trim();
                if ((type = "me-add-que-tags")) {
                    handleNewQuestionTags(input, tag);
                }
                input.value = "";
                input.focus();
                autocompleteList.classList.remove("active");
                return;

                var div = document.createElement("div");
                div.className = "tag";
                div.innerHTML = `<span class="name">${tag}</span>
                 <span class="remove-tag">x</span>`;
                tar.insertBefore(div, input);
                div.children[1].addEventListener("click", (event) => {
                    div.remove();
                });*/
            });
            autocompleteList.appendChild(inputItem);
        }

        matchingNames.forEach((name) => {
            const item = document.createElement("div");
            item.textContent = name;

            item.addEventListener("click", (event) => {
                var tar = input.parentElement;
                if (type == "search-filter-tag") tar = document.querySelector(".filtered-tags .tags");
                var tag = event.target.textContent.trim();
                var div = document.createElement("div");
                div.className = "tag";
                div.innerHTML = `<span class="name">${tag}</span>
                     <span class="remove-tag">x</span>`;
                tar.insertBefore(div, tar.lastChild);

                if (type == "search-filter-tag") {
                    //handleFilterTag(input, tag);
                    filterQuestionsOnTagBased();
                    div.children[1].addEventListener("click", (event) => {
                        div.remove();

                        filterQuestionsOnTagBased("cross");
                    });
                } else if (type == "search-image") {
                    handleSelectedSearchImage(input, tag);
                } else if (type == "me-add-que-tags") {
                    handleNewQuestionTags(input, tag);
                } else {
                    div.children[1].addEventListener("click", (event) => {
                        div.remove();
                    });
                }
                input.value = "";
                input.focus();
                autocompleteList.classList.remove("active");
            });

            autocompleteList.appendChild(item);
        });

        if (matchingNames.length > 0 || inputValue !== "") {
            autocompleteList.classList.add("active");
        } else {
            autocompleteList.classList.remove("active");
        }

        var inputRect = input.getBoundingClientRect();
        autocompleteList.style.width = inputRect.width + "px";
        autocompleteList.style.top = inputRect.bottom + window.scrollY + "px";
        autocompleteList.style.left = inputRect.left + window.scrollX + "px";
        if (input.classList.contains("filter-tag")) autocompleteList.style.width = "300px";
    });

    window.addEventListener("mousedown", function (event) {
        if (!input.contains(event.target) && !autocompleteList.contains(event.target)) {
            autocompleteList.classList.remove("active");
        }
    });
}

function sortArrayRandomly(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function displayQuestion(que) {
    if (!que) que = fil_ques[curr_que];

    var que_text = document.querySelector(".que-text");
    que_text.innerHTML = "";
    var que_count = document.createElement("span");
    que_count.className = "que-count hide";
    que_count.textContent = curr_que + 1 + "/" + fil_ques.length;
    que_text.appendChild(que_count);
    if (fil_ques.length == 0) {
        que_count.className = "que-count";
        que_count.textContent = "No question found...!";
        return;
    }

    var span = document.createElement("span");
    span.className = "question";
    que_text.appendChild(span);
    span.textContent = "Q. " + que.question;

    if (que_mode == "normal") {
        var span = document.createElement("span");
        span.className = "check-ans link";
        span.textContent = "check ans";
        que_text.appendChild(span);

        span.addEventListener("click", function () {
            que.options.forEach((opt) => {
                /*if (opt.indexOf("#ans")) {
                    span.classList.add("me_ans");
                    span.textContent = opt.replace(" #ans", "");
                }*/
                que.options.forEach((opt) => {
                    if (opt.text.indexOf("#ans")) {
                        span.classList.add("me_ans");
                        span.id = opt.id;
                        span.textContent = opt.text.replace(" #ans", "");
                    }
                });
            });
        });
        return;
    }

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
            var div = document.createElement("div");
            div.className = "prev-que me-cp";
            div.id = que.id;
            div.textContent = "";
            document.querySelector("div.prev-ques-list").append(div);

            if (span.classList.contains("ans")) {
                span.classList.add("correct-ans");
                div.classList.add("correct-ans");
            } else {
                span.classList.add("wrong-ans");
                div.classList.add("wrong-ans");
            }
            div.addEventListener("click", () => {
                var que = getQuestionById(div.id);
                displayQuestion(que);
            });

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
function saveDataInLocale(key, data) {
    if (Array.isArray(data)) {
        var jsonData = JSON.stringify(data);
        localStorage.setItem(key, jsonData);
    } else {
        //var jsonData = JSON.stringify(data);
        localStorage.setItem(key, data);
    }
}

function checkInternetConnection() {
    if (navigator.onLine) {
        console.log("You are online.");
        return true;
    } else {
        console.log("You are offline.");
        return false;
    }
}

document.querySelector(".link.all-tags").addEventListener("click", (event) => {
    const allTagsDiv = document.querySelector(".all-tags.tags");
    const linkElement = event.target;

    if (linkElement.classList.contains("active")) {
        // Hide all-tags and update link text
        allTagsDiv.classList.add("hide");
        linkElement.textContent = "Show all tags";
        linkElement.classList.remove("active");
    } else {
        // Show all-tags and update link text
        allTagsDiv.classList.remove("hide");
        linkElement.textContent = "Hide all tags";
        linkElement.classList.add("active");
    }
});
function loadAllFilterTags() {
    const sortedTags = all_tags.sort();

    //Count occurrences of each tag in me_data
    const tagCounts = {};
    me_data.forEach((question) => {
        question.tags.forEach((tag) => {
            if (tagCounts[tag]) {
                tagCounts[tag]++;
            } else {
                tagCounts[tag] = 1;
            }
        });
    });
    // Step 3: Create div elements for each tag based on sortedTags and tagCounts
    const tagsContainer = document.querySelector(".all-tags.tags"); // Assuming there's a container element with id 'tags-container'

    sortedTags.forEach((tag, index) => {
        const tagDiv = document.createElement("div");
        tagDiv.className = "tag me-cp";
        //.classList.add("tag");
        tagDiv.textContent = `${tag} ${tagCounts[tag] ? tagCounts[tag] : ""}`;
        tagsContainer.appendChild(tagDiv);
        tagDiv.addEventListener("click", () => {
            var input = document.querySelector("div.top input.search-filter");
            filterQuestionsOnTagBased(input, tag);
        });
    });
}

function getQuestionById(id) {
    for (const que of me_data) {
        if (que.id == id) {
            return que;
        }
    }
    return null; // Return null if no match is found
}

async function getDataFromGit(id, filename, type) {
    const apiUrl = `https://api.github.com/gists/${id}`;

    return await fetch(apiUrl)
        .then((response) => response.json())
        .then((gistData) => {
            if (gistData.files && gistData.files[filename]) {
                const fileContent = gistData.files[filename].content;
                const parsedData = JSON.parse(fileContent);
                console.log(`Data from "${filename}" retrieved successfully`);

                //me_data = parsedData;
                //return parsedData;
                if (type == "git_token") {
                    git_token = parsedData[0].me_mcq_app;
                    saveDataInLocale("git_token", git_token);
                } else if (type == "me_data") {
                    me_data = parsedData;
                    saveDataInLocale("me_data", me_data);
                    initialLoading();
                }
                saveDataInLocale("me_data");
                initialLoading();
            } else {
                return;
                console.error("File not found in the Gist.");
                var data = getDataFromLocale("me_data");
                if (data) initialLoading();
            }
        })
        .catch((error) => {
            console.error("Error getting data from the Gist:", error);
            return;
            var data = getDataFromLocale("me_data");
            if (data) initialLoading();
        });
}

function generateUniqueId() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var id = "";
    for (var i = 0; i < 10; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function getTodayDate() {
    // in the YYYY-MM-DD format
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    var day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

//async function updateGist(gistId, filename, newContent, accessToken) {
async function updateMyMcqAppGistFile() {
    //const gistId = "523f1476680bd526e4656c082f99f24a";
    //const gistId = "4cb7b01ed98d271744b3cc662072b1ce";
    const gistId = "4cb7b01ed98d271744b3cc662072b1ce";
    const filename = "my_mcq_app_data.json";
    console.log("Updating Gist with ID:", gistId);
    const all_data = [...new_ques, ...me_data];
    const newContent = JSON.stringify(all_data, null, 2);
    const accessToken = "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"; //git_token.replace(/_elahi_/g, "");

    const url = `https://api.github.com/gists/${gistId}`;
    const headers = {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
    };
    const body = {
        files: {
            [filename]: {
                content: newContent,
            },
        },
    };

    try {
        console.log("Sending request to update Gist...");
        const response = await fetch(url, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(body),
        });

        console.log("Response received:", response);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
            downloadJSON(all_data);
        }

        const data = await response.json();
        console.log("Gist updated successfully:", data);
        popupAlert("Gist updated successfully");
        new_ques = [];
        saveDataInLocale("new_ques", new_ques);
    } catch (error) {
        console.error("Failed to update gist:", error);
        popupAlert("Failed to Update Gist");
    }
}

//updateGist(gistId, filename, newContent, accessToken);

function filterQuestionsOnTagBased(input, tag) {
    if (tag) {
        var tar = document.querySelectorAll(".filtered-tags .tags");
        var div = document.createElement("div");
        div.className = "tag";
        div.innerHTML = `<span class="name">${tag}</span>
                     <span class="remove-tag">x</span>`;
        tar[0].appendChild(div);
        div.children[1].addEventListener("click", (event) => {
            div.remove();
            filterQuestionsOnTagBased("cross");
        });
    }

    //const nameElements = document.querySelectorAll(".search-filter .tag .name");
    const nameElements = document.querySelectorAll(".filtered-tags .tag .name");
    const filter_tags = Array.from(nameElements).map((element) => element.textContent.trim());
    var filtered_tags_ele = document.querySelector(".filtered-tags");

    if (filter_tags.length == 0) {
        filtered_tags_ele.classList.add("hide");
    } else {
        filtered_tags_ele.classList.remove("hide");
    }
    // Function to filter questions based on tags
    function filterQuestionsByTags(questions, tags) {
        return questions.filter((question) => tags.every((tag) => question.tags.includes(tag)));
    }
    var filteredQuestions;
    if (input == "cross") filteredQuestions = filterQuestionsByTags(me_data, filter_tags);
    else filteredQuestions = filterQuestionsByTags(fil_ques, filter_tags);

    fil_ques = filteredQuestions;
    curr_que = 0;
    displayQuestion();
}
function handleFilterTag(input, tag) {
    var tar = input.parentElement;
    var tag = event.target.textContent.trim();

    var div = document.createElement("div");
    div.className = "tag";
    div.innerHTML = `<span class="name">${tag}</span>
                     <span class="remove-tag">x</span>`;
    tar.insertBefore(div, input);
    div.children[1].addEventListener("click", (event) => {
        div.remove();
    });
    input.value = "";
    input.focus();
}

const calendarIcon = document.querySelector(".calendar-icon");
const datePicker = document.getElementById("date-picker");

// Show date picker when calendar icon is clicked
calendarIcon.addEventListener("click", () => {
    datePicker.classList.toggle("hide");
    datePicker.focus();
    //datePicker.click();
});

// Handle date selection
datePicker.addEventListener("change", (event) => {
    const selectedDate = event.target.value;
    const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

    // Filter questions based on selected date
    var input = document.querySelector("input.search-filter");

    //filterQuestionsOnTagBased(input, formattedDate);
    const filteredQuestions = me_data.filter((que) => que.create_date === formattedDate);
    fil_ques = filteredQuestions;
    curr_que = 0;
    displayQuestion();
});

function popupAlert(message, time) {
    var div = document.createElement("div");
    div.className = "me-popup-alert";
    div.textContent = message;
    document.body.append(div);
    if (time) return;
    setTimeout(function () {
        div.remove();
    }, 3000);
}
function removePopupAlert() {
    var x = document.querySelector(".me-popup-alert");
    if (x) x.remove();
}

function downloadJSON(all_data) {
    // Convert object array to JSON format
    const jsonData = JSON.stringify(all_data, null, 4);

    // Get the current date and time
    const currentDate = new Date();
    const fileName = `my_mcq_app_${currentDate.getFullYear()}_${String(currentDate.getMonth() + 1).padStart(2, "0")}_${String(currentDate.getDate()).padStart(2, "0")}_${String(currentDate.getHours()).padStart(2, "0")}_${String(currentDate.getMinutes()).padStart(2, "0")}.json`;

    // Create a blob with the JSON data
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Remove the link element from the document
    document.body.removeChild(link);
}
