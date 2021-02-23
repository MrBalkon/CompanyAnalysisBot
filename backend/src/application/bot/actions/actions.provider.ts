// import { YandexService } from "@application/yandex/yandex.service"
import { Telegraf } from 'telegraf'
import * as fs from 'fs'
import * as XLSX from 'xlsx'
import * as path from 'path'

export async function ActionsProvider(bot: Telegraf<any>, yandexService, textParserService){
    
    bot.command('start', (ctx) => {
        ctx.reply('Hello!')
    })
    bot.command('search', async (ctx) => {
        const message = ctx.message;
        const search_word = message.text;
        const result = await yandexService.searchCompany({text: search_word, results: 300,})
        // console.log(result.features)
        const wb = XLSX.utils.book_new();
        const ws_data = [
            [ "Название", "Адрес", "Сайт", "Номера телефонов", "t"],
        ];
        for(const feature of result.features){
            ws_data.push(textParserService.featureToArr(feature))
        }
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        console.log(ws)
        const stream = XLSX.stream.to_csv(ws, { FS: ';'});
        stream.pipe(fs.createWriteStream('out.csv'))

        const r_stream = fs.createReadStream(path.join(__dirname, '../../../../out.csv'));
        // console.log(r_stream.read())
        await ctx.replyWithDocument( { source: r_stream , filename: 'out.csv'})
    })
    bot.on('text', (ctx) => {
        // ctx.re
    })
}