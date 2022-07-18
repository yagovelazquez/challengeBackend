const { File } = require("../models");
const { User } = require("../models");
const { promisify } = require("util");
const fs = require("fs");
const unlinkAsync = promisify(fs.unlink);
const path = require("path");

async function storeFunction(req, res, type) {
  try {
    const { id: userId } = req.user;
    const { originalname: name, size, key } = req.file;
  
    const url = `${type}/${userId}/${type}/${key}`

    const userDb = await User.findOne({ where: { id: userId } });
    if (!userDb)
      return res.status(400).json({ error: "Could not find this user" });

    const fileDb = await File.findOne({
      where: { userId, type },
    });

    if (fileDb) {
      const { id: fileId, key: fileDbKey } = fileDb.dataValues;
      await File.update(
        { size, key, name, url },
        { where: { id: fileId } }
      );

      await unlinkAsync(
        `${path.resolve(
          __dirname,
          "..",
          "tmp",
          userId.toString(),
          type
        )}/${fileDbKey}`
      );

      return res.json({ name, size, key, url, type });
    }

    const postDb = await File.create({
      size,
      key,
      name,
      userId,
      type: type,
      url,
    });

    const { userId: userDbId, id: idDbFile, ...post } = postDb.dataValues;

    return res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error" });
  }
}

async function deleteFunction(req, res, type) {
  const { id: userId } = req.user;

  const fileDb = await File.findOne({ where: { userId, type } });
  if (!fileDb)
    return res.status(400).json({ error: "Could not find this file" });

  if (fileDb.dataValues.userId !== userId)
    return res
      .status(400)
      .json({ error: "You can't delete a file from another user" });

  await unlinkAsync(
    `${path.resolve(__dirname, "..", "tmp", userId.toString(), type)}/${
      fileDb.dataValues.key
    }`
  );

  File.destroy({
    where: { userId, type },
  });

  return res.json({});
}

module.exports = {
  async storeAvatar(req, res) {
    storeFunction(req, res, "avatar");
  },
  async storeContract(req, res) {
    storeFunction(req, res, "contract");
  },
  async deleteAvatar(req, res) {
    deleteFunction(req, res, "avatar");
  },
  async deleteContract(req, res) {
    deleteFunction(req, res, "contract");
  },
  async getFiles(req, res) {
    const { id: userId } = req.user;
    const userDb = await User.findOne({ where: { id: userId } });

    if (!userDb)
      return res.status(400).json({ error: "Could not find this user" });

    const fileDB = await File.findAll({ where: { userId } });

    res.json(fileDB);
  },
};
