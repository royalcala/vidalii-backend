import { api,orm,val } from '../..';
import Vidalii from '../../vidalii'
import { MaxLength, Length } from "class-validator";

@api.InputType()
@orm.Entity()
export class book{
  @orm.PrimaryKey()
  _id: String = '1'

  @val.MaxLength(1,{
    message: 'name is too big',
  })
  @api.Field()
  @orm.Property()
  name: String
}