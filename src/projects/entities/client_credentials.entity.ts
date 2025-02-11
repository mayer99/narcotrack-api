import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Device } from 'src/projects/entities/device.entity';

@Entity("client_credentials", { schema: "auth" })
export class ClientCredentials {
    
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({ unique: true, name: "client_id" })
    clientId: string

    @Column({ name: "hashed_client_secret"})
    hashedClientSecret: string

    @Column("text", { array: true })
    scope: string[]

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