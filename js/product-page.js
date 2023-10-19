if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

  function ready() {
    
    dynamicProductPage();
      
  }

  async function dynamicProductPage() {
    const params = new URLSearchParams(window.location.search);
    let uuid = params.get("uuid");

    const allProducts = await fetchAllProducts();
    const pageContent = document.getElementsByClassName("page-content")[0]; 

    const selectedProduct = allProducts.find(product => product.uuid === uuid);

    if (selectedProduct) {
        pageContent.innerHTML += `
            <div class="product-content">
                
                <img src="${selectedProduct.image}" alt="" class="product-img">
                <div class="info">
                <h1>${selectedProduct.title}</h1>
                <div class="price">${selectedProduct.price} €</div>
                <div class="category">${selectedProduct.category} </div>
                <div class="brand">${selectedProduct.brand} </div>
                <div class="rating">${selectedProduct.rating}</div>
                </div>
                
                 </div> 
                <div>${selectedProduct.description}</div>
                
           
        `;


        

        const rating = selectedProduct.rating; 

        const starsTotal = 5;
        const starPercentage = (rating / starsTotal) * 100;
        const starPercentageRounded = `${starPercentage}%`;
        document.querySelector(".stars-inner").style.width = starPercentageRounded;
        document.querySelector(".number-rating").innerHTML = rating;
    } else {
        pageContent.innerHTML = "<p>Product not found</p>";
    }
}