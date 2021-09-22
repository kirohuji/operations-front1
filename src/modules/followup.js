import { Service } from './questionnaire'
const module = 'c_admin/questionnaire/followup'
// export class News {
//   constructor(c_id, name, remark) {
//     this.c_id = c_id
//     this.name = name
//     this.remark = remark
//   }
// }
export class FollowupService extends Service {
  constructor({ api }) {
    super({ api, module })
  }
}
