const axios = require("axios").default;

const uploadImgBtn = document.querySelector("#upload-btn");
const removeBtn = document.querySelector("#remove-btn");
const uploadField = document.querySelector("#upload-file");
const backBtn = document.querySelector("#back-btn");
const uploadedImgContainer = document.querySelector(
  ".dog-classifier__uploaded-img-container"
);
const resultImgContainer = document.querySelector(
  ".dog-classifier__result-img-container"
);
const uploadContent = document.querySelector(".dog-classifier__upload-content");
const confirmUploadContent = document.querySelector(
  ".dog-classifier__confirm-upload-content"
);
const resultContent = document.querySelector(".dog-classifier__result-content");
const loader = document.querySelector(".loader");
const resultBreed = document.querySelector("#result-breed");
const resultScore = document.querySelector("#result-score");
const url = "http://dbc.my.to:8000/api";

// Function that takes the uploaded image file as parameter and makes request to the API and shows the response
const sendApiReq = function (imgFile) {
  const formData = new FormData();
  formData.append("image", imgFile);
  const options = {
    method: "POST",
    url,
    data: formData,
  };

  axios(options)
    .then((jsonResponse) => {
      console.log(jsonResponse.data);
      resultImgContainer.innerHTML = "";
      const imgEle = document.createElement("img");
      imgEle.src = URL.createObjectURL(uploadField.files[0]);
      imgEle.alt = "Uploaded image for classification";
      resultImgContainer.appendChild(imgEle);

      resultBreed.textContent = jsonResponse.data.breed
        .split("_")
        .map((item) => item[0].toUpperCase() + item.slice(1))
        .join(" ");
      resultScore.textContent = `${(jsonResponse.data.score * 100).toFixed(
        2
      )}% confidence`;
      loader.classList.add("hidden");
      confirmUploadContent.classList.add("hidden");
      resultContent.classList.remove("hidden");
    })
    .catch((err) => {
      console.log("Error while sending API request", err);
    });
};

// Resets the uploaded file and shows the upload file content
const removeImgFunc = function () {
  uploadField.value = "";
  uploadedImgContainer.innerHTML = "";
  confirmUploadContent.classList.add("hidden");
  resultContent.classList.add("hidden");
  uploadContent.classList.remove("hidden");
};
// Click event listener for upload button to show the loader and make API request
uploadImgBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loader.classList.remove("hidden");
  sendApiReq(uploadField.files[0]);
});

// Click event listener to go back to the upload file content
backBtn.addEventListener("click", () => removeImgFunc());

// Click event listener for removing the uploaded image and show the upload file content
removeBtn.addEventListener("click", removeImgFunc);

// Change event listener for input 'file' which shows the uploaded image to the user and shows remove and upload buttons
uploadField.addEventListener("change", function (e) {
  console.log("added image");
  uploadedImgContainer.innerHTML = "";
  const imgEle = document.createElement("img");
  imgEle.src = URL.createObjectURL(this.files[0]);
  imgEle.alt = "Uploaded image for dog breed classification";
  uploadedImgContainer.appendChild(imgEle);
  uploadContent.classList.add("hidden");
  confirmUploadContent.classList.remove("hidden");
});
