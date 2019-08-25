import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; 

@Injectable()
export class localService { 
    constructor(){

    }
    getLocaldata(): Observable<any> {
         let arr = JSON.parse(localStorage.getItem('data'));
         return (arr != null)? arr: [];
    }
    setLocalData(dt): Observable<any>{
        window.localStorage.setItem("data",JSON.stringify(dt));
        return;
    }
}