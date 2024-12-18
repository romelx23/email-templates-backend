// Ejemplo de función de envío de correo
const sendEmail = async (email, templateId) => {
    // Aquí iría tu lógica para enviar el correo (con un servicio como SendGrid, SES, etc.)
    console.log(`Enviando correo a ${email} usando el template ${templateId}`);
  };

  module.exports = { sendEmail };