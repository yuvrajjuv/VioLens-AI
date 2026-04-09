# -*- coding: utf-8 -*-
import os

html_code = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Violence Detection</title>

<style>
body {
    margin: 0;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial;
    background: linear-gradient(135deg, #0f2027, #2c5364);
    color: white;
}

.container {
    background: rgba(255,255,255,0.05);
    padding: 30px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    text-align: center;
    box-shadow: 0 0 30px rgba(0,0,0,0.5);
}

.file-input {
    display: none;
}

.file-label {
    padding: 10px 20px;
    border-radius: 10px;
    background: #444;
    cursor: pointer;
    display: inline-block;
    margin-bottom: 10px;
}

.file-name {
    margin: 10px 0;
    font-size: 14px;
    color: #ccc;
}

button {
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    background: #00c6ff;
    color: black;
    cursor: pointer;
    font-weight: bold;
}

.result {
    margin-top: 20px;
    font-size: 20px;
}
</style>

</head>
<body>

<div class="container">
    <h2>Violence Detection</h2>

    <label class="file-label">
        Choose Video
        <input type="file" id="fileInput" class="file-input">
    </label>

    <div class="file-name" id="fileName">No file selected</div>

    <button onclick="upload()">Upload & Detect</button>

    <div class="result" id="result"></div>
</div>

<script>
function upload() {
    const file = document.getElementById("fileInput").files[0];
    if (!file) return alert("Select video");

    const formData = new FormData();
    formData.append("file", file);

    fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        const resultDiv = document.getElementById("result");

        resultDiv.innerText = data.result;

        if (data.result.includes("Violence")) {
            resultDiv.style.color = "red";
        } else {
            resultDiv.style.color = "lightgreen";
        }
    });
}

document.getElementById("fileInput").addEventListener("change", function() {
    const fileName = this.files[0]?.name || "No file selected";
    document.getElementById("fileName").innerText = fileName;
});
</script>

</body>
</html>
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html_code)

print("index.html created successfully")