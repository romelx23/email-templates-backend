const { fn, col } = require('sequelize');
const { models } = require('../db/sequelize');

class AutomationService {
  async create(data,user) {
    console.log({user});
    const automation = await models.Automation.create({
      ...data,
      recipients: JSON.parse(data.recipients),
      userId: user.sub,
    });
    return automation;
  }

  async find(user) {
    const automations = await models.Automation.findAll({
      include: ['user'],
      attributes: [
        'id',
        'userId',
        'scheduleDate',
        'scheduleTime',
        'status',
        'templateId',
        [fn('count', col('recipients')), 'recipientsCount'] // Usa 'fn' directamente
      ],
      raw: true,
      where: {
        userId: user.sub,
      },
      group: [
        'Automation.id',
        'Automation.userId',
        'Automation.scheduleDate',
        'Automation.scheduleTime',
        'Automation.status',
        'Automation.templateId',
        'user.id',
      ],
    });
    return automations.length > 0 ? automations : [];
  }

  // async findOne(id) {
  //   const automation = await models.Automation.findByPk(id, {
  //     include: ['user'],
  //   });
  //   if (!automation) {
  //     throw new Error('Automation not found');
  //   }
  //   return automation;
  // }
  async findOne(id,user) {

    // console.log({user});

    const automation = await models.Automation.findByPk(id, {
      include: ['user'],
      // attributes: ['id', 'userId', 'scheduleDate', 'scheduleTime', 'status', 'templateId'], // Contamos los destinatarios
      raw: true,
      where: {
        userId: user.sub,
      }
    });
  
    if (!automation) {
      throw new Error('Automation not found');
    }
  
    // Devolvemos los datos necesarios
    return {
      id: automation.id,
      user: automation.user, // Información del usuario (id y name)    
      scheduleDate: automation.scheduleDate,
      scheduleTime: automation.scheduleTime,
      status: automation.status,
      templateId: automation.templateId,
      recipients: automation.recipients // Contamos los destinatarios
    };
  }
}

module.exports = AutomationService;