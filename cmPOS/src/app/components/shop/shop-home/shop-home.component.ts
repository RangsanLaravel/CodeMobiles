import { Component, OnInit } from '@angular/core';
import { NetworkServiceService } from 'src/app/services/network-service.service';
import { Product } from 'src/app/models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-home',
  templateUrl: './shop-home.component.html',
  styleUrls: ['./shop-home.component.css']
})
export class ShopHomeComponent implements OnInit {

  mIsPaymentShow = false;
  mProductArray = new Array<Product>();
  mOrderArray = new Array<Product>();
  mTotalPrice = 0;


  constructor(private networkservice: NetworkServiceService) { }

  ngOnInit() {
    this.feedData();
  }
  feedData() {
    this.networkservice.getProductAll().subscribe(
      result => {
        // result.result.forEach(element => {
        //   var im= element.image ;
        //   if(im != ''){
        //     element.image = this.networkservice.productImageURL+'/' + element.image;
        //   }else{
        //     element.image ='';
        //   }
        // });
        this.mProductArray=  result.result.map(
            (item)=>{
              if(item.image !==''){
                item.image=   this.networkservice.productImageURL+'/'+ item.image;
              }
              else{
                item.image = '';
              }
              
              return item
            }
        );
      }
    )
  }
  onClickAddOrder(item:Product){
    const foundIndex = this.mOrderArray.indexOf(item);

    if (foundIndex === -1) {
      item.qty = 1;
      this.mOrderArray.unshift(item);
    } else {
      item.qty++;
    }
    this.countSumPrice();
  }
  countSumPrice(){
    this.mTotalPrice =0;
    for(const item of this.mOrderArray){
      this.mTotalPrice += item.price * item.qty;
    }
  }
  isSelectedItem(item: Product) {
    return this.mOrderArray.indexOf(item) === -1 ? false : true;
  }

  onClickRemoveOrder(item: Product) {
    this.mProductArray.map(data => {
      if (item.productId === data.productId) {
        data.qty = null;
      }
    });

    this.mOrderArray.splice(this.mOrderArray.indexOf(item), 1);
    this.countSumPrice();
  }
  onClickPayment(){
    if(this.mTotalPrice > 0)
    {
      this.mIsPaymentShow = !this.mIsPaymentShow;
    }else{
     alert("order require")
     //Swal.fire("order require")
    }
  }
  submitPayment(){
    this.mTotalPrice = 0;
    this.mProductArray = new Array<Product>();
    this.mOrderArray = new Array<Product>();
    this.feedData();
    this.mIsPaymentShow =false;
  }
}
