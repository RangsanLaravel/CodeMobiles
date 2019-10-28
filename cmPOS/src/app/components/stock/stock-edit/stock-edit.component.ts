import { Component, OnInit } from '@angular/core';
import { NetworkServiceService } from 'src/app/services/network-service.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { Location } from '@angular/common';


@Component({
  selector: 'app-stock-edit',
  templateUrl: './stock-edit.component.html',
  styleUrls: ['./stock-edit.component.css']
})
export class StockEditComponent implements OnInit {
  mProduct: Product = new Product();
  imageSrc :ArrayBuffer| string = null;
  imageUrl :String ;
  mIsSubmitted = false;

  constructor(private location:Location,
    private activateRoute:ActivatedRoute,
    private networkService:NetworkServiceService) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(
      params=>{
        
        this.feedData(params.id)
      }
    )
    this.imageUrl =this.networkService.productImageURL;
  }
  onSubmit() {
    this.networkService.editProduct(this.mProduct,this.mProduct.productId).subscribe(
      result => {
        this.mIsSubmitted = true;
        this.location.back();
      }
    );
  }
  feedData(id:Number) {
    this.networkService.getProduct(id).subscribe(
      data => {
        var img =data.result.image
        if(img !=''){
          data.result.image = this.imageUrl +"/"+ data.result.image
        }else{
          data.result.image ='';
        }
        this.mProduct =data.result;
       }
    );
  }
  onUploadImage(event) {
    const metaImage = event.target.files[0];
    if (metaImage) {
      const reader = new FileReader();
      reader.readAsDataURL(metaImage);
      reader.onload = () => {
        this.imageSrc = reader.result;
        this.mProduct.image = metaImage
      };
    }
  }

  onCancel(){
    this.location.back();
  }

}
