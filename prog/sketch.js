function _(selector){
    return document.querySelector(selector);
}
function setup(){
    let canvas = createCanvas(650, 600);
    canvas.parent("canvas-wrapper");
    background(255);
}

function mouseDragged(){
    let size = parseInt(_("#pen-size").value);
    let color = _("#pen-color").value;
    fill(color);
    stroke(color);
    ellipse(mouseX, mouseY, size, size);
}
function clearCanvas(){
    background(255);
}
function sendCanvasToServer(canvas) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:5000/predict", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
  
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // This function will be called when the server responds
        var prediction = JSON.parse(this.responseText).prediction;
        _("result").innerHTML = "<h1>Your prediction is: " + prediction + "</h1>";
      }
    };
  
    // Create a JSON object with the canvas data and send it to the server
    var data = { image: canvas.toDataURL() };
    xhttp.send(JSON.stringify(data));
}
function sendCanvas(){
    let canvas = document.getElementsByTagName('canvas')[0];
    let dataURL = canvas.toDataURL('image/png');

    fetch('/predict', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({image: dataURL})
    })
    .then(response => response.json())
    .then(data => {
        let prediction = data.prediction;
        _("h1").innerHTML = "Your prediction is: " + prediction;
    })
    .catch(error => console.error(error));
}  

document.addEventListener("DOMContentLoaded", function() {
    _("#clear-canvas").addEventListener("click", function () {
        clearCanvas();
    });
});
  
document.addEventListener("DOMContentLoaded", function() {
    _("#save-canvas").addEventListener("click", function () {
        saveCanvas(canvas, "sketch", "jpg")
    });
});  

document.addEventListener("DOMContentLoaded", function() {
    _("#send-canvas").addEventListener("click", function () {
        // sendCanvasToServer(canvas);
        // sendCanvas();
        // Get the canvas image as a base64-encoded data URL
        let canvas = _("#defaultCanvas0");
        let image_data = canvas.toDataURL("image/png");
        
        // Send the image to the server and get the prediction
        fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({image: image_data})
        })
        .then(response => response.json())
        .then(data => {
            // Update the HTML content with the prediction
            let prediction = data.prediction;
            _(".result h1").innerHTML = `Your prediction is: ${prediction}`;
        })
        .catch(error => console.error(error));
    });
});


document.addEventListener("DOMContentLoaded", function() {
    _("#send-img").addEventListener("click", function () {
        let fileInput = _("#image-input");
        let file = fileInput.files[0];
        
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            let image_data = reader.result;
            
            fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({image: image_data})
            })
            .then(response => response.json())
            .then(data => {
                let prediction = data.prediction;
                _(".result h1").innerHTML = `Your prediction is: ${prediction}`;
            })
            .catch(error => console.error(error));
        };
    });
});
