
const shoppnmb = document.querySelector('.shopping-header-number');// number in sabad kharid
const totalprice = document.querySelector('.span-editor-buy-cart');
const shoppicon = document.querySelector('.shopping-header-div');
const cartall =document.querySelector('.carts-all');
const buybox = document.querySelector('.buy-box');
const body = document.getElementById('body');
const editbuycart = document.querySelector('.edit-buy-cart');
const containerproduct = document.querySelector('.container-product');
const clearcart = document.querySelector('.clear-cart');


// visible  or  hidden
shoppicon.addEventListener('click',showbuying);
function showbuying(){
   if( buybox.style.visibility=== 'visible'){
       buybox.style.visibility='hidden';
       body.children[3].style.visibility='hidden';
       
   }else{
       buybox.style.visibility='visible';
       body.children[3].style.visibility='visible';
       
   };
   
}
// visible  or  hidden



const Productsdata=[
    {id:1,title:'first panel',price:10.99,imageurl:'product-1.jpeg'},
    {id:2,title:'second panel',price:14.99,imageurl:'product-2.jpeg'},
    {id:3,title:'third panel',price:7.99,imageurl:'product-3.jpeg'},
    {id:4,title:'fourth panel',price:11.99,imageurl:'product-4.jpeg'},
    {id:5,title:'fifth panel',price:4.99,imageurl:'product-5.jpeg'},
    {id:6,title:'sixth panel',price:23.99,imageurl:'product-6.jpeg'},
    {id:7,title:'seventh panel',price:50.99,imageurl:'product-7.jpeg'},
    {id:8,title:'eight panel',price:120.99,imageurl:'product-8.jpeg'},
];

let cart =[];
let btnalldom=[];
class Products{
    getProducts(){
        return Productsdata;
    }
    
};



////////////////
class Ui{
    displayProducts(productsss){            // نشان دادن 8 تا پروداکت در صفحه
        let result='';
        productsss.forEach((item) => {
            result+=`<div class="product">
            <div class="product-box">
                <img class="img-product" src=${item.imageurl} alt="product-1">
                <div class="info-product-box">
                    <span class="prices-of-product">${item.price}</span>
                    <p>${item.title}</p>
                </div>
                <div class="btn-type">
                    <button id=${item.id} class="btn-product-box" type="submit">add to cart</button>
                    
                 </div>
                 </div>
                
                 </div>`



                });
            
                containerproduct.innerHTML=result;
            };
            getallbtn(){
                const btnproducts = [...document.querySelectorAll('.btn-product-box')];
                btnalldom=btnproducts;    
                btnproducts.forEach((btn)=>{
                    const idbtn =parseInt(btn.id);
                    
                    const isincart = cart.find(p=>p.id===idbtn);
                    
                    if(isincart){
                        btn.innerHTML='in cart';
                        btn.disabled=true;
                    }
                    btn.addEventListener('click',(event)=>{
                      event.target.innerText='in cart';
                      event.target.disabled=true;  
                      
                       const addedproduct= {...Storage.getproductsStorage(idbtn),quantity:1};
                       

                       cart=[...cart,addedproduct];
                       console.log(cart);
                       
                      Storage.savecart(cart);
                       this.setcartalue(cart);
                       //custom code 
                       this.showcartinmodal(addedproduct);
                      
                       //custom code
                       
                    })
                })
                
            }
            setcartalue(cart){
               let numbercart=0;
               const total = cart.reduce((acc,curr)=>{
                   numbercart+=curr.quantity;
                   return acc+curr.quantity*curr.price;
                },0);
                totalprice.innerText=total.toFixed(2);
                shoppnmb.innerText=numbercart;
            };
            showcartinmodal(cartitem){
               const div= document.createElement('div');
               div.classList.add('carty');
               div.innerHTML=`<div class="image-container-buy-cart"><img class="image-buy-cart" src=${cartitem.imageurl} alt="product-1"></div>
                
               <div class="info-cart-cell">
                   <p class="p-buy-cart">${cartitem.title}</p>
                   <span class="span-buy-cart">${cartitem.price}</span>
               </div>

               <div class="number-buy-cart">
                   <span class="span-increase"><i class="fas fa-chevron-up" id=${cartitem.id}></i></span>
                   <span>${cartitem.quantity}</span>
                   <span class="span-decrease"><i class="fas fa-chevron-down" id=${cartitem.id}></i></span>
               </div>
               <i class="fas fa-trash" id=${cartitem.id}></i>
                `;
                cartall.appendChild(div);

            }
            setupapp(){
               cart =  Storage.getcart() || [];
                cart.forEach((cartitem)=>{this.showcartinmodal(cartitem)});
                  this.setcartalue(cart);
            }
            clearcarts(){
                clearcart.addEventListener('click',()=>{
                    cart.forEach((Citem)=>this.removeItem(Citem.id));
                   while(cartall.children.length){
                       cartall.removeChild(cartall.children[0]);
                   }
                    
                });
                //custom
                cartall.addEventListener('click',(event)=>{

                    if(event.target.classList.contains('fa-chevron-up')){
                      const icontop =  event.target;
                     const carttarget = cart.find(c=>c.id===parseInt(icontop.id));
                     console.log(carttarget);
                     
                         carttarget.quantity++;
                         icontop.parentNode.nextElementSibling.innerText=carttarget.quantity;
                         this.setcartalue(cart);
                         Storage.savecart(cart);
                        
                    }else if(event.target.classList.contains('fa-trash')){
                        const removeitem = event.target;
                        const _removeditem = cart.find(c=>c.id==parseInt(removeitem.id));
                        console.log(_removeditem.id);
                        this.removeItem(_removeditem.id);
                        this.setcartalue(cart);
                        Storage.savecart(cart);
                        cartall.removeChild(removeitem.parentElement);
                        
                    }else if(event.target.classList.contains('fa-chevron-down')){
                        const subQuantity = event.target;
                        const substractedItem = cart.find(c=>c.id===parseInt(subQuantity.id));
                        if(substractedItem.quantity===1){
                            this.removeItem(substractedItem.id);
                            cartall.removeChild(subQuantity.parentElement.parentElement.parentElement);
                            return;
                        }
                            substractedItem.quantity--;
                            this.setcartalue(cart);
                            Storage.savecart(cart);
                            subQuantity.parentNode.previousElementSibling.innerText=substractedItem.quantity; 
                    }
                });
            }
            
        removeItem(id){
            cart = cart.filter((C)=>{return C.id !==id});
            this.setcartalue(cart);
            Storage.savecart(cart);
            const button =  btnalldom.find(b=>b.id==parseInt(id));
            button.innerText='add to cart';
            button.disabled=false;
        }

                     
    };
    ////////////////////

    class Storage{
       static saveproducts(productssave){
            localStorage.setItem('myproduct',JSON.stringify(productssave));
        }
        static getproductsStorage(id){
           const _productsStorage =  JSON.parse(localStorage.getItem("myproduct"));
           return _productsStorage.find(p=>p.id===id);
        }
        static savecart(cart){
            localStorage.setItem('cart',JSON.stringify(cart));
        }
        //custom code
        static getcart(){
           return JSON.parse(localStorage.getItem('cart'));
        }
        
        //custom code
    
    };
    ///////////////////
    document.addEventListener('DOMContentLoaded',()=>{
        const pproducts = new Products();
      const pproductsdata = pproducts.getProducts();
       const ui = new Ui();
       ui.setupapp();
       ui.clearcarts();
       
       ui.displayProducts(pproductsdata);
       ui.getallbtn();
       Storage.saveproducts(pproductsdata);
    })
    //////////////////

                
                 
 
             

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

   







