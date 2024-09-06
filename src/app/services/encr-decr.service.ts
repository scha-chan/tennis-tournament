import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class EncrDecrService {
  constructor() { }
 
  public  decrypt(key,data) {
    return ((CryptoJS.AES.decrypt(data,key)).toString(CryptoJS.enc.Utf8));
    
  }
  public encrypt(key,data) {
    return (CryptoJS.AES.encrypt(data, key).toString());
    
  }

}