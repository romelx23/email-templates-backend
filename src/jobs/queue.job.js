const Queue = require('bull');
 // TODO Asume que tienes una función para enviar correos
const { models } = require('../db/sequelize');// Importa tu modelo
const { sendEmail } = require('../utils/send-email');

// Crear una cola de trabajo llamada "emailQueue"
const emailQueue = new Queue('emailQueue');

// Procesar los trabajos en la cola
emailQueue.process(async (job) => {
  const { recipients, templateId } = job.data;

  for (const recipient of recipients) {
    await sendEmail(recipient.email, templateId);
    console.log(`Correo enviado a ${recipient.email}`);
  }

  // Actualizar el estado de la tarea a 'completed' una vez que se haya enviado el correo
  await models.Automation.update({ status: 'completed' }, {
    where: { id: job.data.id }
  });
});

// Función para agregar trabajos a la cola
const addToQueue = async (automation) => {
  const { id, recipients, templateId, scheduleDate, scheduleTime } = automation;

  const jobDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
  const delay = jobDateTime.getTime() - Date.now(); // Delay hasta la fecha y hora programada

  await emailQueue.add(
    { id, recipients, templateId }, 
    { delay } // Retraso hasta la ejecución
  );
};

module.exports = { addToQueue };