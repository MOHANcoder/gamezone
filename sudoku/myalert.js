function myAlert(htmlContent){
    const overlay = document.createElement("div");
    overlay.style.visibility = "hidden";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backdropFilter = "blur(10px)";
    overlay.style.position = "fixed";
    alertBox.style.top = "0px";
    
    const alertBox = document.createElement("div");
    alertBox.style.width = "20vw";
    alertBox.style.height = "20vh";
    alertBox.innerHTML = htmlContent;
    alertBox.style.position = "fixed";
    alertBox.style.top = "40vh";
    alertBox.style.margin = "auto";

    document.body.appendChild(overlay);
    overlay.appendChild(alertBox);
}

myAlert(`
<h1>Congratulations</h1>
<h3><strong><i>You solved it!</i></strong></h3>
`);
