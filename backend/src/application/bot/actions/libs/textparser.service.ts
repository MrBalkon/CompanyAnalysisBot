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


    featureToArr(feature: any, underground:string, rating: string){
        console.log(underground)
        const arr = [];
        console.log(feature.properties.CompanyMetaData.Hours)
        arr.push(feature.properties.name)
        arr.push(feature.properties.CompanyMetaData?.address)
        arr.push(feature.properties.CompanyMetaData.url ? feature.properties.CompanyMetaData.url : 'Нет')
        let phones = '';
        if(feature.properties.CompanyMetaData.Phones && feature.properties.CompanyMetaData.Phones.length > 0){
            feature.properties.CompanyMetaData.Phones.forEach(phone => phones += `${phone.formatted} ,`)
            arr.push(phones ? phones : 'Нет')
        }else {
            arr.push('Нет информации')
        }
        if(feature.properties.CompanyMetaData.Hours && feature.properties.CompanyMetaData.Hours.text) arr.push(feature.properties.CompanyMetaData.Hours.text);
        else arr.push('Нет информации')

        arr.push(feature.properties.description)
        arr.push(underground)
        arr.push(rating)

        return arr;
    }
}