import { HttpService, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AxiosResponse } from 'axios'
import { Logger } from "@infrastructure/logger/logger.service";

@Injectable()
export class YandexService {
    apiKey: string;
    apiUrl: string;
    language: string;

  constructor(private httpService: HttpService) {
    this.apiKey = process.env.YANDEX_API_KEY;
    this.apiUrl = process.env.YANDEX_API_URL
    this.language = process.env.YANDEX_API_LANGUAGE
  }

  async searchCompany(query): Promise<void | AxiosResponse<any>>{
    const result = await this.httpService.get(`${this.apiUrl}`, {
        params:{
            apikey: this.apiKey,
            lang: this.language,
            ...query
        }
    })
    .toPromise()
    .catch(e => {
        Logger.error('YANDEX SERVICE REQUEST: ' + e.message)
    })
    .then(res => res && res.data ? res.data : '')
    return result.data ? result.data : result;
  }
}