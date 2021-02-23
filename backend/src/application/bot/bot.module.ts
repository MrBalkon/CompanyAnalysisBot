import { HttpModule, HttpService, Module } from '@nestjs/common';
import { TelegramService } from './bot.service';
import { TelegramController } from './bot.controller';
import { ConfigService } from '@nestjs/config';
import { YandexModule } from '@application/yandex/yandex.module'
import { YandexService } from '@application/yandex/yandex.service';
import { TextParserService } from '@application/bot/actions/libs/textparser.service'


@Module({
  imports: [YandexModule],
  providers: [TelegramService, ConfigService, TextParserService],
  controllers: [TelegramController],
  exports: [TelegramService]
})
export class TelegramModule {}