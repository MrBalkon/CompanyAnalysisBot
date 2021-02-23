import { Injectable,OnModuleInit } from '@nestjs/common';
import { ConfigService } from "@nestjs/config"
import { Telegraf } from 'telegraf'
import { Logger } from '@infrastructure/logger/logger.service'
import { ActionsProvider } from './actions/actions.provider'
import { YandexService } from '@application/yandex/yandex.service';
import { TextParserService } from './actions/libs/textparser.service';


@Injectable()
export class TelegramService implements OnModuleInit{
  constructor(private configService: ConfigService, private yandexService: YandexService, private textParserService: TextParserService) {}
  private token=process.env.TELEGRAM_BOT_KEY;
  public bot = new Telegraf(this.token)
  
  sendMessage(chatId:string|number,message:string):void{
      this.bot.telegram.sendMessage(chatId,message)
  }    
  async onModuleInit() {
    Logger.info(`Initialization... telegram`);

    await ActionsProvider(this.bot, this.yandexService, this.textParserService)
    this.bot.command('start', (ctx) => {
      ctx.reply('Hello!')
      ctx.replyWithDocument('../../../../out.csv', {
        
      })
  })
    this.bot.launch()
  }
  
}