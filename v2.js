   function changeTextSize() {
    const size = prompt("Enter the text size (1-7)");
    if (size) {
        document.execCommand('fontSize', false, size);
    }
}
        function getSelectedTable() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let node = range.startContainer;
        while (node && node.nodeName !== 'TABLE') {
            node = node.parentNode;
        }
        return node;
    }
    return null;
}

function addRow() {
    const table = getSelectedTable();
    if (table) {
        const newRow = table.insertRow();
        for (let i = 0; i < table.rows[0].cells.length; i++) {
            newRow.insertCell().innerHTML = '&nbsp;';
        }
    }
}

function deleteRow() {
    const table = getSelectedTable();
    if (table && table.rows.length > 0) {
        table.deleteRow(-1);
    }
}

function addColumn() {
    const table = getSelectedTable();
    if (table) {
        for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].insertCell().innerHTML = '&nbsp;';
        }
    }
}

function deleteColumn() {
    const table = getSelectedTable();
    if (table && table.rows[0].cells.length > 0) {
        for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].deleteCell(-1);
        }
    }
}

        function printDocument() {
    const content = document.getElementById('editor').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Document</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

        function autoSave() {
    const content = document.getElementById('editor').innerHTML;
    localStorage.setItem('autosaveContent', content);
}

function loadAutoSavedContent() {
    const savedContent = localStorage.getItem('autosaveContent');
    if (savedContent) {
        document.getElementById('editor').innerHTML = savedContent;
    }
}

setInterval(autoSave, 30000); // Autosave every 30 seconds
window.onload = loadAutoSavedContent;

        function changeTextColor() {
    const color = prompt("Enter the text color (e.g., red, blue, #123456)");
    if (color) {
        document.execCommand('foreColor', false, color);
    }
}
function changeFontFamily() {
    const font = prompt("Enter the font family (e.g., Arial, Courier, Times New Roman)");
    if (font) {
        document.execCommand('fontName', false, font);
    }
}

                function createLink() {
            const url = prompt("Right Click Link to open");
            if (url) {
                document.execCommand('createLink', false, url);
            }
        }
                function highlightText() {
            const color = prompt("Enter the highlight color (e.g., yellow, pink)");
            if (color) {
                document.execCommand('hiliteColor', false, color);
            }
        }
        function clearText() { const editor = document.getElementById('editor'); editor.innerHTML = ''; updateWordCount();}
        function execCmd(command) {
            document.execCommand(command, false, null);
        }

        function insertImage(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                document.execCommand('insertHTML', false, img.outerHTML);
            };
            reader.readAsDataURL(file);
        }

        function insertTable() {
            const rows = prompt("Enter the number of rows", 2);
            const cols = prompt("Enter the number of columns", 2);
            if (rows && cols) {
                let table = '<table border="1">';
                for (let i = 0; i < rows; i++) {
                    table += '<tr>';
                    for (let j = 0; j < cols; j++) {
                        table += '<td>&nbsp;</td>';
                    }
                    table += '</tr>';
                }
                table += '</table>';
                document.execCommand('insertHTML', false, table);
            }
        }

        function updateWordCount() {
            const text = document.getElementById('editor').innerText || '';
            const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
            document.getElementById('wordCount').innerText = `Word Count: ${wordCount}`;
        }

        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            const editor = document.getElementById('editor');
            editor.classList.toggle('dark-mode');
        }

        function saveHTML() {
            const content = document.getElementById('editor').innerHTML;
            const blob = new Blob([content], { type: "text/html;charset=utf-8" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = "document.html";
            link.click();
        }
        

        function uploadHTML(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('editor').innerHTML = e.target.result;
                updateWordCount();
            };
            reader.readAsText(file);
        }
        let versionHistory = [];

function saveVersion() {
    const content = document.getElementById('editor').innerHTML;
    const timestamp = new Date().toLocaleString();
    versionHistory.push({ timestamp, content });
    localStorage.setItem('versionHistory', JSON.stringify(versionHistory));
    alert('Version saved!');
}

function loadVersionHistory() {
    const savedVersions = JSON.parse(localStorage.getItem('versionHistory')) || [];
    versionHistory = savedVersions;
}

function showVersionHistory() {
    loadVersionHistory();
    const historyContainer = document.createElement('div');
    historyContainer.style.position = 'fixed';
    historyContainer.style.top = '10%';
    historyContainer.style.left = '10%';
    historyContainer.style.width = '80%';
    historyContainer.style.height = '80%';
    historyContainer.style.backgroundColor = 'white';
    historyContainer.style.border = '1px solid #ccc';
    historyContainer.style.overflowY = 'scroll';
    historyContainer.style.zIndex = '1000';
    document.body.appendChild(historyContainer);

    versionHistory.forEach((version, index) => {
        const versionDiv = document.createElement('div');
        versionDiv.style.padding = '10px';
        versionDiv.style.borderBottom = '1px solid #ddd';

        const versionContent = document.createElement('div');
        versionContent.innerHTML = version.content;
        versionContent.style.marginTop = '10px';

        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load';
        loadButton.onclick = () => loadVersion(index);

        versionDiv.innerHTML = `<strong>${version.timestamp}</strong>`;
        versionDiv.appendChild(loadButton);
        versionDiv.appendChild(versionContent);

        historyContainer.appendChild(versionDiv);
    });

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = () => document.body.removeChild(historyContainer);
    historyContainer.appendChild(closeButton);
}

function loadVersion(index) {
    const selectedVersion = versionHistory[index];
    if (selectedVersion) {
        document.getElementById('editor').innerHTML = selectedVersion.content;
    }
}

window.onload = loadVersionHistory;
function increaseIndent() {
    document.execCommand('indent', false, null);
}

function decreaseIndent() {
    document.execCommand('outdent', false, null);
}
function addBookmark() {
    const bookmarkName = prompt("Enter bookmark name");
    if (bookmarkName) {
        const editor = document.getElementById('editor');
        const span = document.createElement('span');
        span.id = bookmarkName;
        span.textContent = "🔖";
        span.style.color = "black";
        editor.appendChild(span);
    }
}

function goToBookmark() {
    const bookmarkName = prompt("Enter bookmark name to go to");
    const bookmark = document.getElementById(bookmarkName);
    if (bookmark) {
        bookmark.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        alert("Bookmark not found");
    }
}
function findAndReplace() {
    const findText = prompt("Enter text to find");
    const replaceText = prompt("Enter text to replace with");
    if (findText && replaceText) {
        const editor = document.getElementById('editor');
        const content = editor.innerHTML;
        const updatedContent = content.replace(new RegExp(findText, 'g'), replaceText);
        editor.innerHTML = updatedContent;
    }
}
function insertBulletPoints() {
    document.execCommand('insertUnorderedList', false, null);
}
function speakText() {
    const text = document.getElementById('editor').innerText;
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}
function translateText() {
    const text = document.getElementById('editor').innerText;
    const targetLanguage = prompt("Enter the target language code (e.g., 'es' for Spanish, 'fr' for French)");

    if (targetLanguage) {
        fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`)
            .then(response => response.json())
            .then(data => {
                const translatedText = data.responseData.translatedText;
                document.getElementById('editor').innerText = translatedText;
            })
            .catch(error => console.error('Error translating text:', error));
    }
}
function lookupWord() {
    const word = prompt("Enter the word to look up");
    if (word) {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => response.json())
            .then(data => {
                if (data[0] && data[0].meanings[0] && data[0].meanings[0].definitions[0]) {
                    const definition = data[0].meanings[0].definitions[0].definition;
                    alert(`Definition of ${word}: ${definition}`);
                } else {
                    alert(`No definition found for ${word}`);
                }
            })
            .catch(error => console.error('Error looking up word:', error));
    }
}
function insertIframe() {
    const url = prompt("Enter the website URL");
    if (url) {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = '100%';
        iframe.height = '400px';
        iframe.style.border = '1px solid #ccc';
        iframe.className = 'embedded-iframe';
        document.execCommand('insertHTML', false, iframe.outerHTML);
    }
}

function removeIframe() {
    const iframes = document.querySelectorAll('.embedded-iframe');
    if (iframes.length > 0) {
        iframes[iframes.length - 1].remove();
    } else {
        alert("No embedded iframes found.");
    }
}
function changeBackgroundColor() {
    const color = prompt("Enter the background color (e.g., red, blue, #123456)");
    if (color) {
        document.getElementById('editor').style.backgroundColor = color;
    }
}
let recognition;

function startSpeechRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = function(event) {
        const transcript = event.results[event.resultIndex][0].transcript;
        document.execCommand('insertText', false, transcript);
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
    };

    recognition.start();
}

function stopSpeechRecognition() {
    if (recognition) {
        recognition.stop();
    }
}
function insertYouTubeVideo() {
    const url = prompt("Enter the YouTube video URL");
    if (url) {
        const videoId = url.split('v=')[1];
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.width = '100%';
        iframe.height = '500px';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.className = 'embedded-video';
        document.execCommand('insertHTML', false, iframe.outerHTML);
    }
}

function removeYouTubeVideo() {
    const videos = document.querySelectorAll('.embedded-video');
    if (videos.length > 0) {
        videos[videos.length - 1].remove();
    } else {
        alert("No embedded videos found.");
    }
}
let cropper;

function openImageEditor(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const image = document.getElementById('imageToEdit');
        image.src = e.target.result;
        document.getElementById('imageEditorModal').style.display = 'block';
        cropper = new Cropper(image, {
            aspectRatio: 1,
            viewMode: 1
        });
    };
    reader.readAsDataURL(file);
}

function applyCrop() {
    const canvas = cropper.getCroppedCanvas();
    const croppedImage = canvas.toDataURL('image/png');
    document.execCommand('insertImage', false, croppedImage);
    closeImageEditor();
}

function closeImageEditor() {
    document.getElementById('imageEditorModal').style.display = 'none';
    cropper.destroy();
}

function removeLastImage() {
    const images = document.querySelectorAll('#editor img');
    if (images.length > 0) {
        images[images.length - 1].remove();
    } else {
        alert("No images found.");
    }
}
function insertCheckbox() {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    document.execCommand('insertHTML', false, checkbox.outerHTML);
}
function insertEquation() {
    const equation = prompt("Enter the LaTeX equation (e.g., E=mc^2)");
    if (equation) {
        const span = document.createElement('span');
        span.innerHTML = `\\(${equation}\\)`;
        span.className = 'equation';
        document.execCommand('insertHTML', false, span.outerHTML);
        MathJax.typeset();
    }
}

function removeEquation() {
    const equations = document.querySelectorAll('.equation');
    if (equations.length > 0) {
        equations[equations.length - 1].remove();
        MathJax.typeset();
    } else {
        alert("No equations found.");
    }
}
function insertAudio(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const audio = document.createElement('audio');
        audio.src = e.target.result;
        audio.controls = true;
        audio.className = 'embedded-audio';
        document.execCommand('insertHTML', false, audio.outerHTML);
    };
    reader.readAsDataURL(file);
}

function removeLastAudio() {
    const audios = document.querySelectorAll('.embedded-audio');
    if (audios.length > 0) {
        audios[audios.length - 1].remove();
    } else {
        alert("No embedded audios found.");
    }
}
function increaseTextSize() {
    const editor = document.getElementById('editor');
    const currentSize = window.getComputedStyle(editor, null).getPropertyValue('font-size');
    const newSize = parseFloat(currentSize) + 2;
    editor.style.fontSize = newSize + 'px';
}

function decreaseTextSize() {
    const editor = document.getElementById('editor');
    const currentSize = window.getComputedStyle(editor, null).getPropertyValue('font-size');
    const newSize = parseFloat(currentSize) - 2;
    editor.style.fontSize = newSize + 'px';
}
function getSelectedTable() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let node = range.startContainer;
        while (node && node.nodeName !== 'TABLE') {
            node = node.parentNode;
        }
        return node;
    }
    return null;
}

function addRow() {
    const table = getSelectedTable();
    if (table) {
        const newRow = table.insertRow();
        for (let i = 0; i < table.rows[0].cells.length; i++) {
            newRow.insertCell().innerHTML = '&nbsp;';
        }
    }
}

function deleteRow() {
    const table = getSelectedTable();
    if (table && table.rows.length > 1) {
        table.deleteRow(-1);
    }
}

function addColumn() {
    const table = getSelectedTable();
    if (table) {
        for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].insertCell().innerHTML = '&nbsp;';
        }
    }
}

function deleteColumn() {
    const table = getSelectedTable();
    if (table && table.rows[0].cells.length > 1) {
        for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].deleteCell(-1);
        }
    }
}

function mergeCells() {
    const table = getSelectedTable();
    const selection = window.getSelection();
    if (table && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const startCell = range.startContainer.closest('td, th');
        const endCell = range.endContainer.closest('td, th');

        if (startCell && endCell && startCell !== endCell) {
            const startIndex = Array.from(startCell.parentNode.children).indexOf(startCell);
            const endIndex = Array.from(endCell.parentNode.children).indexOf(endCell);

            startCell.colSpan = endIndex - startIndex + 1;
            endCell.remove();
        }
    }
}

function splitCells() {
    const table = getSelectedTable();
    if (table) {
        const selection = window.getSelection();
        const selectedCell = selection.anchorNode.closest('td, th');

        if (selectedCell && selectedCell.colSpan > 1) {
            for (let i = 0; i < selectedCell.colSpan - 1; i++) {
                const newCell = document.createElement(selectedCell.nodeName);
                newCell.innerHTML = '&nbsp;';
                selectedCell.parentNode.insertBefore(newCell, selectedCell.nextSibling);
            }
            selectedCell.colSpan = 1;
        }
    }
}
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
}
function addLink() {
    const url = prompt("Enter the URL");
    if (url) {
        document.execCommand('createLink', false, url);
    }
}

function editLink() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const node = range.startContainer.parentNode;
        if (node && node.nodeName === 'A') {
            const newUrl = prompt("Enter the new URL", node.href);
            if (newUrl) {
                node.href = newUrl;
            }
        } else {
            alert("Please select a link to edit.");
        }
    }
}

function removeLink() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const node = range.startContainer.parentNode;
        if (node && node.nodeName === 'A') {
            document.execCommand('unlink', false, null);
        } else {
            alert("Please select a link to remove.");
        }
    }
}
async function exportToDocx() {
    const { Document, Packer, Paragraph, TextRun } = window.docx;

    const content = document.getElementById('editor').innerText;
    const doc = new Document();
    const paragraphs = content.split('\n').map(line => new Paragraph(line));

    paragraphs.forEach(paragraph => doc.addSection({ children: [paragraph] }));

    const packer = new Packer();
    const blob = await packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "document.docx";
    link.click();
}
function exportToText() {
    const content = document.getElementById('editor').innerText;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "document.txt";
    link.click();
}
async function importPdf(event) {
    const file = event.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const text = await pdfDoc.getTextContent();
    document.getElementById('editor').innerText = text;
}
function toggleFullScreen() {
    const editor = document.getElementById('editor');
    if (!document.fullscreenElement) {
        editor.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
}
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'b') {
        // Ctrl+B for bold
        document.execCommand('bold');
        event.preventDefault();
    } else if (event.ctrlKey && event.key === 'i') {
        // Ctrl+I for italic
        document.execCommand('italic');
        event.preventDefault();
    } else if (event.ctrlKey && event.key === 'u') {
        // Ctrl+U for underline
        document.execCommand('underline');
        event.preventDefault();
    } else if (event.ctrlKey && event.key === 's') {
        // Ctrl+S for save
        saveHTML();
        event.preventDefault();
    }
    // Add more custom shortcuts as needed
});
