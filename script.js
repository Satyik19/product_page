const URL = "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json" ;

class Product {
    constructor(url) {
        this.url = url;
        this._titleID = "title";
        this._descID = "desc";
        this._vendorID = "vendor";
        this._priceID = "price";
        this._comparePriceID = "comp";
        this._chooseSizeID = "size";
        this._chooseColorID = "color";
        this._bigImageID = "big";
        this._smallImagesId = "smalls";
        this.noOfItem = 1;
    }

    async getProductDetails()  {
        if (this._product) return this._product;
        const response = await fetch(this.url);
        this._product = (await response.json()).product;
        return this._product;
    }

    updateTitle() {
        document.getElementById(this._titleID).innerText = this._product.title;
    }

    updateDesc() {
        document.getElementById(this._descID).innerHTML = this._product.description;
    }

    updateVendor() {
        document.getElementById(this._vendorID).innerText = this._product.vendor;
    }

    updatePrice() {
        document.getElementById(this._priceID).innerText = this._product.price;
    }

    updateComp() {
        document.getElementById(this._comparePriceID).innerText = this._product.compare_at_price;
    }

    updateSize() {
        document.getElementById(this._chooseSizeID).innerHTML = this._product.options[1].values.map(size => `<label data-size=${size} class="checkbox">
             <input class="size-input" type="checkbox">
             ${size}
            </label>`).join("\n");
    }

    updateColor() {
        document.getElementById(this._chooseColorID).innerHTML = this._product.options[0].values.map(color => `
        <span data-color="${Object.keys(color)[0]}" style="background-color: ${Object.values(color)[0]};${Object.keys(color)[0] == this._color ? `border: 2px solid ${Object.keys(color)[0]}; padding: 3px;`: ""}" class="color ${Object.keys(color)[0] == this._color ? "active-color" : ""}"></span>`).join("\n");
    }

    updateBigImage(index = 0) {
        console.log(this._product, index)
        document.getElementById(this._bigImageID).setAttribute("src", this._product.images[index]?.src);
    }

    updateSmallImages() {
        document.getElementById(this._smallImagesId).innerHTML = this._product.images.map(img => `<img src="${img.src}" alt="Product Details" class="small-image">`).join("\n");
    }

    updateItemInCart(num) {
        this.noOfItem += num;
    }

    updateCartNum() {
        document.getElementById("noOfItem").innerText = this.noOfItem;
    }

    updateProject() {
        this.updateTitle();
        this.updatePrice();
        this.updateDesc();
        this.updateBigImage();
        this.updateColor();
        this.updateSize();
        this.updateVendor();
        this.updateBigImage();
        this.updateSmallImages();
        this.updateComp();
    }

    addColorEvent() {
        let colors = document.getElementsByClassName("color")
        for (const child of colors) {
            child.addEventListener("click", () => {
                console.log(child.getAttribute("data-color"))
                this._color = child.getAttribute("data-color");
                this.updateColor();
                this.addColorEvent();
            })
        }
    }

    addEvents() {
        let imgs = document.getElementsByClassName("small-image")
        let i = 0;
        for (const child of imgs) {
            child.addEventListener("click", () => {
                this.updateBigImage(i)
                i = (i + 1) % imgs.length;
            });
        }

        let sizes = document.getElementsByClassName("checkbox");
        for (const child of sizes) {
            child.addEventListener("click", () => {
                this._size = child.getAttribute("data-size");
                this.updateSize();
            })
        }

       

        document.getElementById("minus-cart").addEventListener("click", () => {
            this.updateItemInCart(-1);
            this.updateCartNum();
        })

        document.getElementById("plus-cart").addEventListener("click", () => {
            this.updateItemInCart(1);
            this.updateCartNum();
        })

    }
}


const product = new Product(URL);
product.getProductDetails().then(pdct => {
    console.log(pdct)
    product.updateProject();
    product.addEvents();
    product.addColorEvent();
});
