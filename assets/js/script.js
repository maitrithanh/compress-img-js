var upload = document.querySelector('.upload');
var download = document.querySelector('.download');
var hiddenButton = document.querySelector('#hidden-button');
var input = document.querySelector('#slider-input');
var inputValue = document.querySelector('.input-value');
var inputMetadata = document.getElementsByClassName('metadata')[0];
var outputMetadata = document.getElementsByClassName('metadata')[1];
var showProgress = document.querySelector('.showprogress');

input.oninput = function() {
    var c =  document.getElementsByClassName('top')[0]
    c.style.width = (931/100)*input.value + 'px';
}

upload.onclick = function() {
    //click on input type file
    hiddenButton.click();
}

hiddenButton.onchange = () => {
    //get selected file
    var file = hiddenButton.files[0];
    var url =  URL.createObjectURL(file);
    var img = document.createElement('img');
    //load image to get widh hight
    img.src = url;
    img.onload = function() {
        var w = img.width;
        var h = img.height;
        //give metadata of input file
        inputMetadata.getElementsByTagName('li')[0].getElementsByTagName('span')[0].innerHTML = file.name;
        inputMetadata.getElementsByTagName('li')[1].getElementsByTagName('span')[0].innerHTML = w + '/' + h;
        inputMetadata.getElementsByTagName('li')[2].getElementsByTagName('span')[0].innerHTML = ((file.size/1024)/1024).toFixed(2) + 'MB';
        //set attribute for file name used in downloading
        upload.setAttribute('filename', file.name);
        //create function to get ratio of width height
        calculatorValues(inputValue.value, w, h);
        inputValue.onchange = function() {
            //run funct again on changing compressed ratio
            calculatorValues(inputValue.value, w, h);
        }
        //set original image on preview
        document.querySelector('.bottom img').src = url;
    }
}

//create calculatorValues function
function calculatorValues(v, w, h) {
    var outputQuality = ((100-v)/100);
    var outputWidth = w * outputQuality;
    var outputHeight = h * outputQuality;
    //function to compress 
    Compress(outputQuality, outputWidth, outputHeight);
}

function Compress(q, w, h) {
    new Compressor(hiddenButton.files[0], {
        quality: q,
        width: w,
        height: h, 
        success(result) {
            var url = URL.createObjectURL(result);
            document.getElementsByClassName('output')[0].style.display = 'block';
            document.getElementsByClassName('progress')[0].style.display = 'block';
            document.getElementsByClassName('preview-container')[0].style.display = 'block';
            document.getElementsByClassName('progress-container')[0].style.display = 'block';
            var img = document.createElement('img');
            img.src = url;
            img.onload = function() {
                //show compressed image on preview
                document.querySelector('.top img').src = url;
                var w = img.width;
                var h = img.height;
                //give metadata of output file
                outputMetadata.getElementsByTagName('li')[0].getElementsByTagName('span')[0].innerHTML = ((((q*100)-99)) + ((q*100)/100)*10).toFixed(0) + '%';
                outputMetadata.getElementsByTagName('li')[1].getElementsByTagName('span')[0].innerHTML = w + '/' + h;
                outputMetadata.getElementsByTagName('li')[2].getElementsByTagName('span')[0].innerHTML = (result.size/1024).toFixed(0) + 'KB';
                showProgress.innerHTML = ((((q*100)-99)) + ((q*100)/100)*10).toFixed(0) + '%';
            }
            download.onclick = function() {
                var filename = upload.getAttribute('filename').split('.');
                var a = document.createElement('a');
                a.href = url;
                a.download = filename[0] + '-min.' +  filename[1];
                a.click();
            }
        },
        error(err) {
            console.log(err.message);
        }
    })
}


