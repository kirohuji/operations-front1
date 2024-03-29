import { Service } from './base'
const module = 'c_admin/information/active'
export class Active {
  constructor(i_id, node_id, title, image, content, status) {
    this.i_id = i_id
    this.node_id = node_id
    this.title = title
    this.image = image
    this.content = content
    this.status = status
  }
}
export class ActiveService extends Service {
  constructor({ api }) {
    super({ api, module })
  }
  //  分类列表
  getcategorylist() {
    return this.api.post(`${this.module}/getcategorylist`)
  }
  //  发布主体列表
  getpublist() {
    return this.api.post(`${this.module}/getpublist`)
  }
  //  下架
  setpull(target) {
    return this.api.post(`${this.module}/setpull`, target)
  }
  getmembertagcount(target) {
    return this.api.post(`c_admin/information/infomanage/getmembertagcount`, target)
  }
  getmembertag(target) {
    return this.api.post(`${this.module}/getmembertag`, target)
  }
  getJoinList(target) {
    return this.api.post(`${this.module}/getJoinList`, target)
  }
  getHealthyActive(target) {
    return this.api.post(`${this.module}/getHealthyActive`, target)
  }
  getQRCode(target) {
    return this.api.get(`${this.module}/getQRCode`, {
      params: target
    })
  }
  activityQRCode(target) {
    return this.api.get(`${this.module}/activityQRCode`, {
      params: target
    })
  }
}
