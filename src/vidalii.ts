import glob from 'glob'
import { DB } from "./vidalii.db";
import { Api } from "./vidalii.api";
import { VServer } from "./vidalii.server";
import type { Context } from "./vidalii.server";
import type { OptionsCli } from './cli';
export { Context }



class VidaliiService {
  public cli: OptionsCli
  public db = new DB()
  public api = new Api()
  public server = new VServer()

  private initAddsFiles(pattern: string = '**/*') {
    console.log('Discovering .entity and .api files...\n')
    glob.sync(`${this.cli.PATTERN}.api.{js,ts}`, { absolute: true }).forEach(
      path => {
        console.log(path)
        require(path)
      }
    )
    glob.sync(`${this.cli.PATTERN}.entity.{js,ts}`, { absolute: true }).forEach(
      (path) => {
        console.log(path)
        require(path)
      }
    )
  }

  public async start(): Promise<void> {
    this.initAddsFiles()
    await this.db.start(this.cli)
    await this.server.start(this.db, this.api, this.cli)
  }
}

export default new VidaliiService()

