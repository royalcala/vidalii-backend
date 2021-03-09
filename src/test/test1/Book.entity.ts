import Vidalii from '../../vidalii'
import { Cascade, Collection, Entity, OneToMany, Property, ManyToOne, Unique } from '../../vidalii.orm';

// import { Book } from '.';
import { BaseEntity } from './BaseEntity.entity';

@Entity()
export class Author extends BaseEntity {

  @Property()
  name: String;

  @Property()
  @Unique()
  email: string;

  @Property()
  age?: number;

  @Property()
  termsAccepted = false;

  @Property()
  born?: Date;

  // @OneToMany(() => Book, b => b.author, { cascade: [Cascade.ALL] })
  // books = new Collection<Book>(this);

  // @ManyToOne(() => Book, { nullable: true })
  // favouriteBook?: Book;

  // constructor(name: string, email: string) {
  //   super();
  //   this.name = name;
  //   this.email = email;
  // }

}
//TODO change to @Vidalii.db.addEntity
Vidalii.db.addEntity(Author)