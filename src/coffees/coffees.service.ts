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
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavour)
        private readonly flavourRepository: Repository<Flavour>
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

    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavours = await Promise.all(
            createCoffeeDto.flavours.map(item => this.preloadFlavourByName(item))
        )
 
        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavours
        })

        return this.coffeeRepository.save(coffee)
    }

    async update(id: string, updateCoffeeDto: any){
        const flavours = await Promise.all(
            updateCoffeeDto.flavours.map(item => this.preloadFlavourByName(item))
        )
    
        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavours
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
