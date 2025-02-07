import { AccessToken } from "src/auth/entities/access_token.entity";
import { ClientCredentials } from "src/auth/entities/client_credentials.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Log } from "./log.entity";
import { Event } from "./event.entity";
import { Device } from "./device.entity";


@Entity("projects", { schema: "projects" })
export class Project {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    externalId: string

    @Column()
    name: string

    @ManyToOne(() => User, (user) => user.projects)
    user: User

    @OneToMany(() => Device, (device) => device.project)
    devices: Device[]

    @OneToMany(() => Log, (log) => log.project)
    logs: Log[]

    @OneToMany(() => Event, (event) => event.project)
    events: Event[]

    @CreateDateColumn({ type: "timestamptz", name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
    updatedAt: Date
} 