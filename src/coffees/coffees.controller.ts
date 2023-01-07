import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
    @Get()
    findAll(){
        return 'abc'
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return `returning id #${id} coffees`
    }

    @Post()
    create(@Body() body) {
        return body;
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body){
        return `update returning id #${id} coffees`
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        return `delete returning id #${id} coffees`
    }
}
