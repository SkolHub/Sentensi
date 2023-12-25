import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LessonController } from './lesson/lesson.controller';

@Module({
	imports: [],
	controllers: [AppController, LessonController],
	providers: [AppService]
})
export class AppModule {
}
