import { HttpModule, HttpService, Module } from "@nestjs/common";
import { YandexService } from "./yandex.service";


@Module({
    imports: [HttpModule],
    providers: [YandexService],
    exports: [YandexService]
  })
export class YandexModule {}