import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { Severity } from '../severity.enum';
import { ClientCredentials } from 'src/projects/entities/client_credentials.entity';

@Entity("devices", { schema: "projects" })
export class Device {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    externalId: string

    @Column()
    name: string

    @ManyToOne(() => Project, { onDelete: "CASCADE" })
    project: Project

    @OneToMany(() => ClientCredentials, (clientCredentials) => clientCredentials.device)
    clientCredentials: ClientCredentials[]

    @CreateDateColumn({ type: "timestamptz", name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
    updatedAt: Date

}
