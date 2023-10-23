import { Component } from '@angular/core';
import { FileService } from './file.service';
import { saveAs} from 'file-saver';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  filenames: string[] = [];

  constructor(private fileService: FileService) {}

  // defina a function to upload files
  onUploadFiles(files: File[]): void {
    const formData = new FormData();
    for(const file of files) { 
      formData.append('files', file, file.name); 
    }

    this.fileService.upload(formData).subscribe(
      event => {
        console.log(event);
        this.reportProgress(event);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  // defina a function to download files
  onDownloadFiles(filename: string): void {
    this.fileService.download(filename).subscribe(
      event => {
        console.log(event);
        this.reportProgress(event);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  private reportProgress(httpEvent: HttpEvent<string[] | Blob>): void {
    switch(httpEvent.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total, 'Uploading...');
        break;
      case HttpEventType.DownloadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total, 'Downloading...');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned', httpEvent)
        break;
      case HttpEventType.Response:
        if(httpEvent.body instanceof Array) {
          for(const filename of httpEvent.body) {
            this.filenames.unshift(filename);
          }
        } else {
          saveAs(new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
            {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}));
        }
        break;
    }
  }

  updateStatus(loaded: number, total: number | undefined, arg2: string) {
    throw new Error('Method not implemented.');
  }

  
}
