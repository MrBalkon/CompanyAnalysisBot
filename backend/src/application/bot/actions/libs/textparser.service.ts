import { Injectable } from "@nestjs/common";
@Injectable()
export class TextParserService {
    featureToText(feature: any){
        let phones = '';
        if(feature.properties.CompanyMetaData.Phones && feature.properties.CompanyMetaData.Phones.length > 0){
            feature.properties.CompanyMetaData.Phones.forEach(phone => phones += `${phone.formatted} ,`)
        }
        return `<strong>Название:</strong> ${feature.properties.name}\n<strong>Адрес:</strong> ${feature.properties.CompanyMetaData?.address}\n<strong>Сайт: ${feature.properties.CompanyMetaData.url ? feature.properties.CompanyMetaData.url : 'Нет'}</strong>\n<strong>Номера телефонов: ${phones ? phones : 'Нет'}</strong>`
    }

    featureToArr(feature: any){
        const arr = [];

        arr.push(feature.properties.name)
        arr.push(feature.properties.CompanyMetaData?.address)
        arr.push(feature.properties.CompanyMetaData.url ? feature.properties.CompanyMetaData.url : 'Нет')
        let phones = '';
        if(feature.properties.CompanyMetaData.Phones && feature.properties.CompanyMetaData.Phones.length > 0){
            feature.properties.CompanyMetaData.Phones.forEach(phone => phones += `${phone.formatted} ,`)
            arr.push(phones ? phones : 'Нет')
        }

        return arr;
    }
}