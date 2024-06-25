var data = [];
var parent_b_uid = "sZ5BRVCZm";
var new_ques = [];

var blocks = getBlockInfo(parent_b_uid)[0][0];
//var str = blocks.children[0].string;
if (blocks.children) {
    blocks.children.forEach((block) => {
        var str = block.string;
        getNewQuestionObject(str);
    });
}

function getNewQuestionObject(input) {
    const lines = input.trim().split("\n");
    const question = lines[0];
    const options = lines.slice(1, 5).map((line) => ({
        id: generateUniqueId(),
        text: line.trim(),
    }));
    const tagsLine = lines[5];
    const tags = tagsLine.match(/\[\[(.*?)\]\]/g).map((tag) => tag.replace(/\[\[|\]\]/g, ""));

    var obj = {
        id: generateUniqueId(),
        create_date: getTodayDate(),
        question: question,
        options: options,
        tags: tags,
        explanation: "",
    };
    new_ques.push(obj);
    return obj;
}

function getBlockInfo(uid) {
    console.log("me: getBlockInfo called");
    const blocks = window.roamAlphaAPI.q(`[:find ( pull  ?block [ * {:block/children ...} ] ):where[?block :block/uid \"${uid}\"]]`);
    return blocks.length ? blocks : null;
}

async function getUpdatedJsonFile() {
    var id = "4cb7b01ed98d271744b3cc662072b1ce"; // data gist file id
    var filename = "my_mcq_app_data.json"; // data gist file name

    const apiUrl = `https://api.github.com/gists/${id}`;

    return await fetch(apiUrl)
        .then((response) => response.json())
        .then((gistData) => {
            if (gistData.files && gistData.files[filename]) {
                const fileContent = gistData.files[filename].content;
                const parsedData = JSON.parse(fileContent);
                console.log(`me: Data from gist file "${filename}" retrieved successfully`);

                var data = parsedData;
                const all_data = [...new_ques, ...data];
                downloadJSON(all_data);
            } else {
                return null;
                console.error("File not found in the Gist.");
                var data = getDataFromLocale("me_data");
                if (data) initialLoading();
            }
        })
        .catch((error) => {
            return null;
            console.error("Error getting data from the Gist:", error);
            return;
            var data = getDataFromLocale("me_data");
            if (data) initialLoading();
        });
}

function downloadJSON(all_data) {
    // Convert object array to JSON format
    const jsonData = JSON.stringify(all_data, null, 4);

    // Get the current date and time
    const currentDate = new Date();
    const fileName = `my_mcq_updates_data${currentDate.getFullYear()}_${String(currentDate.getMonth() + 1).padStart(2, "0")}_${String(currentDate.getDate()).padStart(2, "0")}_${String(currentDate.getHours()).padStart(2, "0")}_${String(currentDate.getMinutes()).padStart(2, "0")}.json`;

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
