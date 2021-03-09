import glob from 'glob'
import { DB } from "./vidalii.db";
import { Api } from "./vidalii.api";
import { VServer } from "./vidalii.server";
import type { OptionsCli } from './service.cli';




class VidaliiService {
  public cli: OptionsCli
  public db = new DB()
  public api = new Api()
  public server = new VServer()

  public initApi(globPattern: string) {
    console.log('Discovering .api files...\n')
    glob.sync(`${globPattern}.api.{js,ts}`, { absolute: true }).forEach(
      path => {
        console.log(path)
        require(path)
      }
    )

  }
  public initEntities(globPattern: string) {
    console.log('Discovering .entity files...\n')
    glob.sync(`${globPattern}.entity.{js,ts}`, { absolute: true }).forEach(
      (path) => {
        console.log(path)
        require(path)
      }
    )
  }

  public async start(): Promise<void> {
    this.initApi(this.cli.INPUT)
    this.initEntities(this.cli.INPUT)
    await this.db.start(this.cli)
    await this.server.start(this.db, this.api, this.cli)
  }
}

export default new VidaliiService()

