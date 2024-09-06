import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpRequest, HttpEvent} from '@angular/common/http';
import {Observable} from "rxjs";
import { environment } from '../../environments/environment';

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) { }

  // file from event.target.files[0]
  uploadFile(id: string, file: File): Observable<HttpEvent<any>> {

    let formData = new FormData();
    formData.append('avatar', file);

    let params = new HttpParams();
    let url = environment.apiUrl + 'avatar/'+id;

    const options = {
      params: params,
      reportProgress: true,
    };
    //return this.http.post(environment.apiUrl + 'avatar/'+id, formData, options);
    const req = new HttpRequest('POST', url, formData, options);
    return this.http.request(req);
  }
}