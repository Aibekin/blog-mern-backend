import PostModel from '../models/Post.js';


// CRUD methods
export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec();

		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось получить статьи',
		});
	}
}

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();

		const tags = posts
			.map(obj => obj.tags)
			.flat()
			.slice(0, 3);

		res.json(tags);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось получить статьи',
		});
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;

		const updatedDoc = await PostModel.findOneAndUpdate(
			{ _id: postId },
			{ $inc: { viewsCount: 1 } },
			{ returnDocument: 'after' }
		).populate('user');

		if (!updatedDoc) {
			return res.status(404).json({
				message: 'Статья не найдена',
			});
		}

		res.json(updatedDoc);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось получить статьи',
		});
	}
}

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;

		const removeDoc = await PostModel.findByIdAndDelete(
			{ _id: postId },
		);

		if (!removeDoc) {
			return res.status(404).json({
				message: 'Статья не найдена',
			});
		}

		res.json({
			success: true,
		})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось удалить статью',
		});
	}
}

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags.split(','),
			user: req.userId,
		});

		const post = await doc.save();

		res.json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось создать статью',
		});
	}
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id;

		const updateDoc = await PostModel.findOneAndUpdate(
			{ _id: postId },
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				tags: req.body.tags.split(','),
				user: req.userId,
			},
		);

		res.json({
			success: true,
		})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось обновить статью',
		});
	}
}