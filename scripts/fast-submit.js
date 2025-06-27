const isTaskPage = () => location.href.startsWith("https://cses.fi/problemset/task");
const getProblemId = () => {
    const taskInput = document.querySelector("input[name='task']");
    if (taskInput) {
        return taskInput.value;
    }
    const match = location.href.match(/\/task\/(\d+)/);
    return match ? match[1] : null;
};

const loadLanguageSelectorCache = () => {
    setTimeout(() => {
        const languageSelector = document.getElementById("lang");
        const languageOption = document.getElementById("option");
        
        if (!languageSelector || !languageOption) return;

        browser.storage.local.get(["language", "option"]).then((result) => {
            setTimeout(() => {
                if (result.language) {
                    languageSelector.value = result.language;
                    languageSelector.dispatchEvent(new Event('change'));
                    setTimeout(() => {
                        if (result.option) languageOption.value = result.option;
                        languageOption.dispatchEvent(new Event('change'));
                    }, 300);
                }
            }, 300);
        });
    }, 600);
}

const submitCodeFile = (fileData) => {
    const formData = new FormData();
    const languageSelector = document.getElementById("lang");
    const languageOption = document.getElementById("option");
    const csrfToken = document.querySelector("input[name='csrf_token']");
    
    if (!csrfToken) {
        console.error('CSRF token not found');
        return;
    }
    
    const problemId = getProblemId();
    if (!problemId) {
        console.error('Problem ID not found');
        return;
    }
    
    formData.append('csrf_token', csrfToken.value);
    formData.append('task', problemId);
    formData.append('lang', languageSelector.value);
    if (!languageOption.disabled) formData.append('option', languageOption.value);
    formData.append('target', 'problemset');
    formData.append('type', 'course');
    formData.append('file', fileData, 'code.cpp');
    
    fetch('https://cses.fi/course/send.php', {
        method: 'POST',
        body: formData
    }).then((response) => {
        if (response.ok) {
            location.href = response.url;
        }
    }).catch((error) => {
        console.error('Error:', error);
    });
};

const createLanguageSelectorCache = () => {
    setTimeout(() => {
        const languageSelector = document.getElementById("lang");
        const languageOption = document.getElementById("option");
        
        if (!languageSelector || !languageOption) return;
        
        languageSelector.addEventListener("change", () => {
            browser.storage.local.set({ language: languageSelector.value });
        });
        languageOption.addEventListener("change", () => {
            browser.storage.local.set({ option: languageOption.value });
        });
    }, 500);
}

const createCodeInputArea = () => {
}

const modifySubmitButton = () => {
    setTimeout(() => {
        const submitButton = document.querySelector("#cses-companion-form input[type='submit']");
        if (!submitButton) return;
        
        submitButton.addEventListener("click", (event) => {
            event.preventDefault();
            
            const code = document.getElementById("code").value.trim();
            const fileInput = document.querySelector("#cses-companion-form input[type='file']");
            
            if (code !== "") {
                submitCodeFile(new Blob([code], { type: 'text/plain' }));
            } else if (fileInput && fileInput.files && fileInput.files[0]) {
                submitCodeFile(fileInput.files[0]);
            } else {
                alert("Please enter code in the textarea or select a file to upload.");
            }
        });
    }, 500);
}

const createFormInContentDiv = () => {
    const contentDiv = document.querySelector(".content");
    if (!contentDiv) return;
    
    if (document.querySelector("#cses-companion-form")) return;
    
    const problemId = getProblemId();
    if (!problemId) {
        console.error('Cannot create form: Problem ID not found');
        return;
    }
    
    const csrfToken = document.querySelector("input[name='csrf_token']")?.value || "7d396b771153e028e87618d2b526f1f5";
    
    const formHTML = `
<div id="cses-companion-form">
<h3>Submit Solution</h3>
<form action="/course/send.php" method="post" enctype="multipart/form-data">
<input type="hidden" name="csrf_token" value="${csrfToken}">
<input type="hidden" name="task" id="task" value="${problemId}">
<input type="hidden" name="type" value="course">
<input type="hidden" name="target" value="problemset">

<div style="margin-bottom: 15px;">
<label for="lang" style="display: block; margin-bottom: 5px; font-weight: bold;">Language:</label>
<select name="lang" id="lang" style="width: 300px; padding: 5px; border: 1px solid #ccc;">
<option value="">Select Language</option>
<option value="Assembly">Assembly</option>
<option value="C">C</option>
<option value="C++">C++</option>
<option value="Haskell">Haskell</option>
<option value="Java">Java</option>
<option value="Node.js">Node.js</option>
<option value="Pascal">Pascal</option>
<option value="Python2">Python2</option>
<option value="Python3">Python3</option>
<option value="Ruby">Ruby</option>
<option value="Rust">Rust</option>
<option value="Scala">Scala</option>
</select>
<span id="optionInput" style="display: none; margin-left: 15px;">
<label for="option">Option:</label>
<select name="option" id="option" disabled="" style="padding: 5px; border: 1px solid #ccc;">
</select>
</span>
</div>

<hr style="border: none; height: 1px; background-color: #d3d3d3; margin: 15px 0;"/>

<div style="margin-bottom: 15px;">
<label style="display: block; margin-bottom: 5px; font-weight: bold;">Source code:</label>
<div style="position: relative;">
<textarea id="code" name="source_code" placeholder="Paste your source code here..." 
style="width: 100%; height: 300px; font-family: 'Courier New', monospace; font-size: 14px; 
padding: 10px; border: 1px solid #ccc; border-radius: 4px; resize: vertical; 
 line-height: 1.4;"></textarea>
</div>
</div>
</div>

<div style="margin-bottom: 15px;">
<label style="display: block; margin-bottom: 5px; font-weight: bold;">Or choose file:</label>
<input type="file" name="file" onchange="check(this)" style="padding: 5px;">
<small style="display: block; margin-top: 5px; color: #666;">
Upload a source code file instead of using the text area above
</small>
</div>
<hr style="border: none; height: 1px; background-color: #d3d3d3; margin: 15px 0;"/>
<div>
<input type="submit" value="Submit">
</div>
</form>
</div>
    `;
    
    const taskDiv = contentDiv.querySelector('.md');
    if (taskDiv) {
        taskDiv.insertAdjacentHTML('afterend', formHTML);
    } else {
        contentDiv.insertAdjacentHTML('beforeend', formHTML);
    }
    
    setTimeout(() => {
        window.check = function(file) {
            var lang = document.getElementById("lang");
            if (file.value.match(/\.asm$/)) lang.value = "Assembly"
            if (file.value.match(/\.c$/)) lang.value = "C"
            if (file.value.match(/\.cpp$/)) lang.value = "C++"
            if (file.value.match(/\.hs$/)) lang.value = "Haskell"
            if (file.value.match(/\.java$/)) lang.value = "Java"
            if (file.value.match(/\.zip$/)) lang.value = "Make"
            if (file.value.match(/\.js$/)) lang.value = "Node.js"
            if (file.value.match(/\.pas$/)) lang.value = "Pascal"
            if (file.value.match(/\.py$/)) lang.value = "Python2"
            if (file.value.match(/\.py$/)) lang.value = "Python3"
            if (file.value.match(/\.rb$/)) lang.value = "Ruby"
            if (file.value.match(/\.rs$/)) lang.value = "Rust"
            if (file.value.match(/\.scala$/)) lang.value = "Scala"
            if (file.value.match(/\.cc$/)) lang.value = "C++";
            if (file.value.match(/\.java$/)) {
                var reader = new FileReader();
                reader.onloadend = function() {
                    if (reader.result.match(/^package\s/m)) {
                        alert("Warning: don't use 'package' in your code");
                    }
                };
                if (file.files[0]) reader.readAsBinaryString(file.files[0]);
            }
            if (file.value.match(/\.py$/)) {
                lang.value = "Python2";
                var reader = new FileReader();
                reader.onloadend = function() {
                    if (!reader.result.match(/python2|raw_input|print\\s+[^(]/)) {
                        lang.value = "Python3";
                        window.checkSelects();
                    }
                };
                if (file.files[0]) reader.readAsBinaryString(file.files[0]);
             }
             window.checkSelects();
        };
        
        window.type = [];
        window.type[` + problemId + `] = 0;
        
        window.options = {"C++":["C++11","C++17","C++20"],"Python2":["CPython2","PyPy2"],"Python3":["CPython3","PyPy3"],"Rust":[2018,2021]};
        window.defaults = {"C++":null,"Python2":"PyPy2","Python3":"PyPy3","Rust":"2021"};
        
        window.optionsPopulated = null;
        window.checkSelects = function() {
            var option = document.getElementById("option");
            var task = document.getElementById("task");
            var lang = document.getElementById("lang");
            var optionInput = document.getElementById("optionInput");
            
            if (task) lang.disabled = window.type[task.value] == 1;
            if (!lang.disabled && lang.value in window.options) {
                if (window.optionsPopulated != lang.value) {
                    option.innerHTML = "";
                    var list = window.options[lang.value];
                    for (var i = 0; i < list.length; i++) {
                        var o = document.createElement("option");
                        o.text = o.value = list[i];
                        option.add(o);
                    }
                    option.selectedIndex = 0;
                    if (window.defaults[lang.value]) option.value = window.defaults[lang.value];
                    window.optionsPopulated = lang.value;
                }
                if (optionInput) {
                    optionInput.style.display = "";
                }
                option.disabled = false;
            } else {
                if (optionInput) {
                    optionInput.style.display = "none";
                }
                option.disabled = true;
            }
        };
        
        const langSelect = document.getElementById("lang");
        const taskInput = document.getElementById("task");
        
        if (langSelect) {
            langSelect.addEventListener("change", window.checkSelects);
        }
        if (taskInput) {
            taskInput.addEventListener("change", window.checkSelects);
        }
        
        window.checkSelects();
    }, 100);
};

if (isTaskPage()) {
    setTimeout(() => {
        createFormInContentDiv();
        createLanguageSelectorCache();
        modifySubmitButton();
        loadLanguageSelectorCache();
    }, 1000);
}