import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './person.entity';

@Module({
  controllers: [PeopleController],
  providers: [PeopleService],
  imports: [TypeOrmModule.forFeature([Person])],
})
export class PeopleModule {}
