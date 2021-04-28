import { HttpService, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AxiosResponse } from 'axios'
import { Logger } from "@infrastructure/logger/logger.service";
import * as HtmlParse from 'node-html-parser';

@Injectable()
export class YandexService {
    apiKey: string;
    apiUrl: string;
    language: string;
    geoUrl: string;
    geoKey: string;

  constructor(private httpService: HttpService) {
    this.apiKey = process.env.YANDEX_API_KEY;
    this.apiUrl = process.env.YANDEX_API_URL
    this.language = process.env.YANDEX_API_LANGUAGE
    this.geoUrl = process.env.YANDEX_GEO_API_URL
    this.geoKey = process.env.YANDEX_GEO_API_KEY
  }

  async httpRequest (url, query): Promise<void | AxiosResponse<any>>{
    const result = await this.httpService.get(`${url}`, {
        params:{
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

  async searchCompany(query): Promise<void | AxiosResponse<any>>{
    return await this.httpRequest(this.apiUrl,{apikey: this.apiKey, lang: this.language, ...query})
  }

  async searchNearestUnderground(query): Promise<void | AxiosResponse<any> | any>{
    return await this.httpRequest(this.geoUrl, { apikey: this.geoKey, format: "json", kind: 'metro',  ...query}).catch(() => 'Проблемы с яндексом')
  }

  async getCompanyHtmlFromRatingPage(companyId: number){
    return await this.httpRequest(`https://yandex.ru/maps/org/zdorovoye_pitaniye/${companyId}/reviews/`, {});
  }

  async getCompanyRating(companyId: number){
    const response = await this.getCompanyHtmlFromRatingPage(companyId);
    // console.log(response)
    const html = HtmlParse.parse(`${response}`);

    const unparsed_rating = html.querySelector('span.business-rating-badge-view__rating-text');
    
    return unparsed_rating && unparsed_rating.childNodes.length > 0 && unparsed_rating.childNodes[0].rawText ? unparsed_rating.childNodes[0].rawText : 0;
  }
}