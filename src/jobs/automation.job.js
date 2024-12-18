// const cron = require('node-schedule');
// const { models } = require('../db/sequelize'); // Importa tus modelos
// const { sendEmail } = require('../utils/send-email'); // Asume que tienes una función para enviar correos

// // Programar una tarea cada minuto para revisar tareas pendientes
// cron.scheduleJob('* * * * *', async () => {
//   try {
//     const now = new Date();

//     // Obtener tareas pendientes
//     const pendingTasks = await models.Automation.findAll({
//       where: { status: 'pending' },
//     });

//     console.log("Tareas pendientes:", pendingTasks);

//     for (const task of pendingTasks) {
//       const taskDateTime = new Date(`${task.scheduleDate}T${task.scheduleTime}`);

//       // Ejecutar la tarea solo si su tiempo programado ha llegado o pasado
//       if (taskDateTime <= now) {
//         console.log(`Enviando correos para la tarea ${task.id}`);
        
//         for (const recipient of task.recipients) {
//           await sendEmail(recipient.email, task.templateId);
//           console.log(`Correo enviado a ${recipient.email}`);
//         }

//         // Actualizar el estado de la tarea a 'completed'
//         await models.Automation.update(
//           { status: 'completed' },
//           { where: { id: task.id } }
//         );
//         console.log(`Tarea ${task.id} marcada como completada.`);
//       } else {
//         console.log(`Tarea ${task.id} aún no se ejecuta, programada para: ${taskDateTime}`);
//       }
//     }
//   } catch (error) {
//     console.error('Error al procesar tareas pendientes:', error);
//   }
// });