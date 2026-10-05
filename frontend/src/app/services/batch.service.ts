import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Batch, BatchRequest } from '../models/batch.model';
import { Intern } from '../models/intern.model';

@Injectable({ providedIn: 'root' })
export class BatchService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/batches`;

  getAll(): Observable<Batch[]> {
    return this.http.get<Batch[]>(this.url);
  }
    getOne(id: number): Observable<Batch> {
    return this.http.get<Batch>(`${this.url}/${id}`);
  }

  create(request: BatchRequest): Observable<Batch> {
    return this.http.post<Batch>(this.url, request);
  }

  getInterns(batchId: number): Observable<Intern[]> {
    return this.http.get<Intern[]>(`${this.url}/${batchId}/interns`);
  }
}