const mongoose = require('mongoose');
const config = require('config');

const DB = {
	url: config.db.url,

	async connect() {
		// Устранение deprecations
		mongoose.set('useNewUrlParser', true);
		mongoose.set('useFindAndModify', false);
		mongoose.set('useCreateIndex', true);
		mongoose.set('useUnifiedTopology', true);

		// Подключение к базе данных
		try {
			await mongoose.connect(DB.url);
			console.log('=> [DB] База данных подключена');
		} catch (err) {
			console.error(`XXX [DB] Возникла ошибка при подключении к MongoDB! Текст ошибки: \n${err.message}`);
			process.exit(1); // Выход из приложения
		}
	}
};

export default DB;
