import { Project } from 'src/projects/entities/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AccessToken } from './access_token.entity';
import { User } from 'src/users/entities/user.entity';
import { ClientType } from '../client-type.enum';
import { Device } from 'src/projects/entities/device.entity';

@Entity("client_credentials", { schema: "auth" })
export class ClientCredentials {
    
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({ unique: true, name: "client_id" })
    clientId: string

    @Column({ name: "hashed_client_secret"})
    hashedClientSecret: string

    @Column("text")
    scope: string

    @Column()
    name: string

    @Column({ nullable: true })
    description?: string

    @ManyToOne(() => Device, (device) => device.clientCredentials, { onDelete: "CASCADE" })
    @JoinColumn()
    device: Device

    @CreateDateColumn({ type: "timestamptz", name: "issued_at" })
    issuedAt: Date

}