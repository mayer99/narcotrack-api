import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { Severity } from '../severity.enum';
import { ClientCredentials } from 'src/auth/entities/client_credentials.entity';
import { Device } from './device.entity';

@Entity("events", { schema: "projects" })
export class Event {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    externalId: string

    @Column()
    message: string

    @Column()
    type: string

    @Column({
        type: 'enum',
        enum: Severity
    })
    severity: Severity

    @ManyToOne(() => Device, { onDelete: "CASCADE" })
    device: Device

    @ManyToOne(() => Project, { onDelete: "CASCADE" })
    project: Project

    @Column({ type: "timestamptz", name: "created_at" })
    createdAt: Date

    @CreateDateColumn({ type: "timestamptz", name: "received_at" })
    receivedAt: Date

}
