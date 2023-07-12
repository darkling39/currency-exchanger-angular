import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ICurrency } from 'src/app/models/currency';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
export enum currencyTypes {
  LEFT = 'lCurrency',
  RIGHT = 'rCurrency',
}
export enum valueTypes {
  LEFT = 'lValue',
  RIGHT = 'rValue',
}

export enum currencyTypes {
  LEFT = 'lCurrency',
  RIGHT = 'rCurrency',
}
export enum valueTypes {
  LEFT = 'lValue',
  RIGHT = 'rValue',
}

@Component({
  selector: 'app-exchanger',
  templateUrl: './exchanger.component.html',
  styleUrls: ['./exchanger.component.css'],
})
export class ExchangerComponent {
  constructor(
    private apiService: ApiService,
    private storage: StorageService
  ) {}

  currencies$: Observable<ICurrency[]> = this.apiService.getAll();

  firstFormGroup!: FormGroup;

  myControl = new FormControl('');

  ngOnInit() {
    this.createForm();
    this.runStorage();
    this.runExchange();
  }

  runStorage() {
    this.toStorage(currencyTypes.LEFT);
    this.toStorage(currencyTypes.RIGHT);
  }

  runExchange() {
    this.exchange(valueTypes.LEFT);
    this.exchange(valueTypes.RIGHT);
  }
  createForm() {
    this.firstFormGroup = new FormGroup({
      lCurrency: new FormControl(''),
      lValue: new FormControl({ value: 1, disabled: true }, [
        Validators.required,
        Validators.pattern(/^\d+(\.\d+)*$/),
      ]),
      rCurrency: new FormControl(''),
      rValue: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
        Validators.pattern(/^\d+(\.\d+)*$/),
      ]),
    });
  }

  toStorage(curr: string) {
    this.firstFormGroup.get(curr)?.valueChanges.subscribe((change) => {
      if (curr === currencyTypes.LEFT) {
        this.storage.leftCurrency = change;
      } else {
        this.storage.rightCurrency = change;
      }
      if (this.storage.leftCurrency && this.storage.rightCurrency) {
        this.firstFormGroup.get(valueTypes.LEFT)?.enable();
        this.firstFormGroup.get(valueTypes.RIGHT)?.enable();
      }
    });
  }

  exchange(val: string) {
    if (val === valueTypes.LEFT) {
      this.firstFormGroup.get(val)?.valueChanges.subscribe((change) => {
        this.firstFormGroup
          .get(valueTypes.RIGHT)
          ?.setValue(
            (
              change *
              (this.storage.leftCurrency.rate / this.storage.rightCurrency.rate)
            ).toFixed(2),
            { emitEvent: false }
          );
      });
    } else {
      this.firstFormGroup.get(val)?.valueChanges.subscribe((change) => {
        this.firstFormGroup
          .get(valueTypes.LEFT)
          ?.setValue(
            (
              change *
              (this.storage.rightCurrency.rate / this.storage.leftCurrency.rate)
            ).toFixed(2),
            { emitEvent: false }
          );
      });
    }
  }
}
