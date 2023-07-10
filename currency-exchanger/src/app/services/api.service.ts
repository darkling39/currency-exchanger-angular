import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICurrency } from '../models/currency';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  url: string =
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

  getAll() {
    return this.http.get<ICurrency[]>(this.url);
  }
}
