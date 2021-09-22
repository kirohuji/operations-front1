export class Service {
  constructor(options) {
    for (const name in options) {
      // eslint-disable-next-line no-prototype-builtins
      if (options.hasOwnProperty(name)) {
        this[name] = options[name]
      }
    }
  }
  makeUserService({ api }) {
    this.api = api
    return this
  }
  // @flow
  insert(target) {
    return this.api.post(`${this.module}/createExamine`, target)
  }
  // @flow
  remove(target) {
    return this.api.post(`${this.module}/delExamine`, target)
  }
  // @flow
  update(target) {
    return this.api.post(`${this.module}/saveExamine`, target)
  }
  findOne(target) {
    return this.api.post(`${this.module}/getInfo`, target)
  }
  /**
   * @flow
   * target：
   *    c_id 分类id
   *    name 问卷名称
   * */
  find(target) {
    return this.api.post(`${this.module}/getExamineList`, target)
  }
  // 量表问卷列表
  findForGauge(target) {
    return this.api.post(`${this.module}/getGaugeList`, target)
  }
  // 问题列表
  findForQuestion(target) {
    return this.api.post(`${this.module}/getQuestionList`, target)
  }
  // 字典类型分类节点列表
  findForTabTypeData(target) {
    return this.api.post(`${this.module}/getTabTypeData`, target)
  }
  // 对象列表
  findForMemberTag(target) {
    return this.api.post(`${this.module}/getmembertag`, target)
  }
  findForInformation(target) {
    return this.api.post(`${this.module}/getInformationList`, target)
  }
  getMemberTagCount(target) {
    return this.api.post(`${this.module}/getmembertagcount`, target)
  }
  setStatus(target) {
    return this.api.post(`${this.module}/setStatusExamine`, target)
  }
}
