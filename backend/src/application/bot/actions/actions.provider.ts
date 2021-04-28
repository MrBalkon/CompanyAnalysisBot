// import { YandexService } from "@application/yandex/yandex.service"
import { Telegraf } from 'telegraf'
import * as fs from 'fs'
import * as XLSX from 'xlsx'
import * as path from 'path'

async function get_aggregated_companies(stuckes: string[], yandexService): Promise<any[]>{
    const result = []
    for(let i = 0; i < stuckes.length; i++){
        // console.log(stuckes[i])
        const result_f = await yandexService.searchCompany({text: stuckes[i], results: 1,})

        for(let j = 0; j < result_f.features.length; j++){
            let exist_in_result = true;
            for(let h = 0; h < result.length; h++) {
                if(result[h].properties.description == result_f.features[j].properties.description) exist_in_result = false;

            }

            if(exist_in_result){
                result.push(result_f.features[j])
            }
        }
    }
    return result;
}

async function search(ctx){

}

async function aggregate(ctx, { yandexService, textParserService}){
    const message = ctx.message;
    const search_word = message.text.split('/aggregate')[1];
    // console.log(search_word)
    const result = await get_aggregated_companies(search_word.split('+') ,yandexService)
    // console.log(result)      
    const wb = XLSX.utils.book_new();
    const ws_data = [
        [ "Название", "Адрес", "Сайт", "Номера телефонов", "Время работы", 'Описание', 'Ближайшее метро', 'Рейтинг'],
    ];

    const features = result.sort( function( a , b){
        if(a.properties.name > b.properties.name) return 1;
        if(a.properties.name < b.properties.name) return -1;
        return 0;
    });

    for(const feature of features){
        const rating = await yandexService.getCompanyRating(feature.properties.CompanyMetaData.id)
        
        // console.log(rating)
        if(parseFloat(rating) > 3){
            const undergroundYandexResponse = await yandexService.searchNearestUnderground({geocode: `${feature.geometry.coordinates[0]},${feature.geometry.coordinates[1]}`, results: 1})
            const underground = undergroundYandexResponse.response && undergroundYandexResponse.response.GeoObjectCollection && undergroundYandexResponse.response.GeoObjectCollection.featureMember[0].GeoObject.name ? undergroundYandexResponse.response.GeoObjectCollection.featureMember[0].GeoObject.name : 'На найдено'
            
            // const underground = 'Метро';
            ws_data.push(textParserService.featureToArr(feature, underground, rating))
        }
    }
    
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const stream = XLSX.stream.to_csv(ws, { FS: ';'});
    stream.pipe(fs.createWriteStream('out.csv'))

    const r_stream = fs.createReadStream(path.join(__dirname, '../../../../out.csv'));
    await ctx.replyWithDocument( { source: r_stream , filename: 'out.csv'})
}

export async function ActionsProvider(bot: Telegraf<any>, yandexService, textParserService){
    
    bot.command('start', (ctx) => {
        ctx.reply('Hello!')
    })
    bot.command('search', async (ctx) => {
        await aggregate(ctx, { yandexService, textParserService})
    })

    bot.command('aggregate', async (ctx) => {
        await aggregate(ctx, { yandexService, textParserService})
    })

    bot.on('text', (ctx) => {
        // ctx.re
    })
}