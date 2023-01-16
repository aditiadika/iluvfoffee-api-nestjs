import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavour } from './entities/flavour.entity';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        @InjectRepository(Flavour)

        private readonly coffeeRepository: Repository<Coffee>,
        private readonly flavourRepository: Repository<Coffee>
    ){}

    findAll(){
        return this.coffeeRepository.find({
            relations: ['flavours']
        });
    }

    async findOne(id: string){
        const coffee = await this.coffeeRepository.findOne({
            where: {id: parseInt(id)},
            relations: ['flavours']
        })
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found.,`)
        }
        return coffee
    }

    create(createCoffeeDto: CreateCoffeeDto) {
        const coffee = this.coffeeRepository.create(createCoffeeDto)
        return this.coffeeRepository.save(coffee)
    }

    async update(id: string, updateCoffeeDto: any){
        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto
        })
        if(!coffee) {
            throw new NotFoundException(`Coffee #${id} not found.`)

        }
        return this.coffeeRepository.save(coffee)
    }

    async remove(id: string){
        const coffee = await this.coffeeRepository.findOneBy({id: parseInt(id)})
        return this.coffeeRepository.remove(coffee)
    }

    private async preloadFlavourByName(name: string): Promise<Flavour>{
        const existingFlavours = await this.flavourRepository.findOneBy({ name })
        if(existingFlavours) {
            return existingFlavours;
        }
        return this.flavourRepository.create({ name })
    }
}
