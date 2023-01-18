import { type } from "os"
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { Flavour } from "./flavour.entity"

@Entity()
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    brand: string

    @JoinTable()
    @ManyToMany(
        type => Flavour,
        flavour => flavour.coffees,
        {
            cascade: true
        }
    )
    flavours: Flavour[]
}