import { Injectable } from '@angular/core';
import { ICurrency } from '../models/currency';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  leftCurrency: ICurrency;
  rightCurrency: ICurrency;
}
