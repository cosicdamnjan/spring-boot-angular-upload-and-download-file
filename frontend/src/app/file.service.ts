import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class FileService {
  private server = 'http://localhost:8080';

  constructor(private http: HttpClient) { 
    
    // define function to upload files
    upload(formData: FormData): Observable<HttpEvent<string[]>> {
      return this.http.post<string[]>('${this}/file/upload', formData, {
        reportProgress: true,
        observe: 'events'
      });
    }

    // define function to download files
  }
}
