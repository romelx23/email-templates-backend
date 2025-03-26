const boom = require('@hapi/boom');
const { CohereClient } = require('cohere-ai');
const { models } = require('../db/sequelize');

// Configuración del cliente de Cohere
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

class EmailService {

  async create(user,data) {
    const newTask = await models.Email.create({
      ...data,
      userId: user.sub,
    });
    console.log({ newTask });
    return newTask;
  }

  async find(user,query) {

    console.log({ user });

    const options = {
      where: {
        userId: user.sub,
      }
    }
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const tasks = await models.Email.findAll(options);
    return tasks;
  }

  async findOne(id) {
    const task = await models.Email.findByPk(id);
    if (!task) {
      throw boom.notFound('task not found');
    }
    return task;
  }

  async update(id, changes) {
    const task = await this.findOne(id);
    const rta = await task.update(changes);
    return rta;
  }

  async delete(id) {
    const task = await this.findOne(id);
    await task.destroy();
    return { id };
  }

  // endpoints for generating emails

  async generateEmail(user, { prompt }) {
    // Verificar créditos del usuario
    const credits = await this.checkCredits(user.sub);
    if (credits <= 0) throw new Error('Not enough credits');
    console.log({ prompt });
    // Generar contenido
    const response = await cohere.generate({
      model: 'command-r-plus-08-2024',
      prompt: `Crea el título y el contenido de un email de basado en la siguiente descripción: ${prompt}, retorna en formato json con las claves title y content`,
      // maxTokens: 200,
      temperature: 0.7,
    });

    if (!response.generations.length) throw new Error('Failed to generate email');

    console.log("response",response.generations[0]);

    const parsedText = JSON.parse(response.generations[0].text); // Convertir string a JSON

    const generatedTitle = parsedText.title.trim();
    const generatedContent = parsedText.content.trim();
    await this.consumeCredits(user.sub, 1);

    return { 
      title: generatedTitle,
      content: generatedContent,
      credits: await this.checkCredits(user.sub)
     };
  }

  async generateImage(user, { prompt }) {
    // Verificar créditos del usuario
    const credits = await this.checkCredits(user.sub);
    if (credits <= 0) throw new Error('Not enough credits');

    const sanitizedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${sanitizedPrompt}`;

    await this.consumeCredits(user.sub, 1);

    return { 
      imageUrl,
      credits: await this.checkCredits(user.sub)
     };
  }

  async checkCredits(userId) {
    console.log({ userId });
    const userCredits = await models.Credits.findOne({ where: 
      { userId } 
    });
    return userCredits ? userCredits.amount : 0;
  }

  async consumeCredits(userId, amount) {
    const userCredits = await models.Credits.findOne({ where: { userId } });
    if (!userCredits || userCredits.amount < amount) {
      throw new Error('Not enough credits');
    }
    userCredits.amount -= amount;
    await userCredits.save();
  }
}

module.exports = EmailService;
