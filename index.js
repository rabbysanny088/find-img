const imagesWrapper = document.querySelector('.images');
const loadMoreBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('.search-box input');
const lightBox = document.querySelector('.lightbox');
const closeBtn = document.querySelector('.ri-close-line');
const downloadImgBtn = document.querySelector('.ri-download-2-line');

const apiKey = "KxSL9G6YPbc3KAhc7L7H41Sb84mE5kOsOBObbugoBaR07vamiTQS6IbA";

const per_page = 15;
let currenPage = 1;
let searchTime = null;
// const downloadImg = (imgURL) => {
//     fetch(imgURL)
//     .then(res => res.blob())
//     .then(file => {
//         const a = document.createElement("a");
//         a.href = URL.createObjectURL(file);
//         a.download = new Date().getTime();
//         a.click();
//     }).catch(() => alert('Failed to download image!'));
// }

const downloadImg = async (imgURL) => {
  const downloadBoxs = await fetch(imgURL);
  // console.log(downloadBoxs);
  const text = await downloadBoxs.blob();
  // console.log(text)
  const a = document.createElement("a");
  a.href = URL.createObjectURL(text);
   a.download = new Date().getTime();
   a.click();
}


const showLightbox = (name, img) => {
    lightBox.querySelector('img').src = img;
    lightBox.querySelector('img'). innerText = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add('show');
    document.body.style.overflow = "hidden";
}


const hideLightBtn = () => {
    lightBox.classList.remove('show');
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map( 
    (img) =>
      `   <li class="car" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="">
        <div class="details">
            <div class="photographer">
                <i class="ri-camera-2-fill"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImg('${img.src.large2x}'); event.stopPropagation();">
            <i class="ri-download-2-line"></i>
            </button>
        </div>
    </li>`
  ).join("");
};

// const getImages = (apiURL) => {
//     loadMoreBtn.innerText = "Loading...";
//     loadMoreBtn.classList.add('disabled');
//   fetch(apiURL, {
//     headers: { Authorization: apiKey },
//   })
//   .then((res) => res.json()
//     .then((data) => {
//       generateHTML(data.photos);
//     //   console.log(data)
//     loadMoreBtn.innerText = "Load More";
//     loadMoreBtn.classList.remove('disabled');
//     }).catch(() => alert("Failed to load images!"))
//   );
// };

// async function getImages(apiURL) {
//   try {
     
//     const backend = fetch(apiURL, {
//       headers: { Authorization: apiKey },
//     });

//     if(!backend.ok){
//       throw console.log('this code not excutd')
//     }
//     const res = (await backend).json();
//      generateHTML(res.photos);
//     console.log(res)

    
//   } catch (error) {
//     console.log(error)
//   }
// };


const getImages = async (apiURL) => {
  try {
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add('disabled');

    const response = await fetch(apiURL, {
      headers: { Authorization: apiKey },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    generateHTML(data.photos);

    loadMoreBtn.innerText = "Load More";
    loadMoreBtn.classList.remove('disabled');
  } catch (error) {
    console.error(error);
    alert("Failed to load images!");
  }
};










const loadMoreBtns = () => {
    currenPage++;
    let apiURL =   `https://api.pexels.com/v1/curated?per_page=${currenPage}&per_page=${per_page}`;
   apiURL = searchTime ? `https://api.pexels.com/v1/search?query=${searchTime}per_page=${currenPage}&per_page=${per_page}` : apiURL;
    getImages(apiURL); 
}

const loadSearchImages = (e) => {
    if(e.target.value === "") return searchTime = null;
    if(e.key === "Enter"){
        currenPage = 1;
        searchTime = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTime}&page=${currenPage}&per_page=${per_page}`)
    }
}

getImages(
  `https://api.pexels.com/v1/curated?per_page=${currenPage}&per_page=${per_page}`
);

loadMoreBtn.addEventListener("click", loadMoreBtns);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightBtn);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));