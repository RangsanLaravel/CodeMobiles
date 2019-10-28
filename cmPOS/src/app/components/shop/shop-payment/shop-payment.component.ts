import { Component, OnInit, Input, Output ,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-shop-payment',
  templateUrl: './shop-payment.component.html',
  styleUrls: ['./shop-payment.component.css']
})
export class ShopPaymentComponent implements OnInit {

  @Input() totalPayment: number
  @Output() submitPayment = new EventEmitter<void>();

  //Union type ได้ทั้งสอง
  //codemobile :number | String = 1;
  constructor() { }

  ngOnInit() {
  }
  givenNumber = '0.00';

  // constructor(private restService: RestService) { }

  public get mChange(): number {
    const cash = Number(this.givenNumber.replace(/,/g, ''));
    const result = cash - this.totalPayment;
    if (result >= 0) {
      return result;
    } else {
      return 0;
    }
  }

  public get isPaidEnough() {
    if (Number(this.givenNumber) >= this.totalPayment) {
      return true;
    }
    return false;
  }

  onClickExact() {
  this.givenNumber = String(this.totalPayment);
  }

  onClickGiven(addGiven: number) {
    this.givenNumber =String (Number(this.givenNumber)+ addGiven);
  }

  onClickReset() {
    this.givenNumber ="0";
  }

  onClickSubmit() {
    this.submitPayment.emit();
  }
}
