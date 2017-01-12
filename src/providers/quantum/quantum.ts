import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';

@Injectable()
export class QuantumProvider {
  constructor(private http: Http) {
    
  }

  getQuantum(): Observable<string> {
    return this.http.get('https://qrng.anu.edu.au/API/jsonI.php?length=1&type=hex16&size=32').map((result) => {
      const body = result.json();
      const theRandomPart = body && body.data && body.data[0];
      console.log('Quantamium bits', theRandomPart);
      return theRandomPart;
    });
  }
}
