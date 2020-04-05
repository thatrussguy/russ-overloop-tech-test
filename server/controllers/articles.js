const mongoose = require("mongoose");
const Article = mongoose.model("Article");
const Territory = mongoose.model("Territory");

module.exports.asParameter = async function (articleId, ctx, next) {
  try {
    let article = await Article.findOne({
      _id: articleId,
    }).populate("territories");
    if (!article) return;
    if (!ctx.parameters) {
      ctx.parameters = {};
    }
    ctx.parameters.article = article;
    return next();
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return;
    }
    throw e;
  }
};

module.exports.one = async function (ctx) {
  ctx.body = {
    article: ctx.parameters.article,
  };
};

module.exports.all = async function (ctx) {
  ctx.body = {
    articles: await Article.find().populate("territories"),
    territories: await Territory.find(),
  };
};

module.exports.create = async function (ctx) {
  const { territories } = ctx.request.body;
  return Promise.all(
    territories.map(async (territory) => {
      const result = await Territory.findOneAndUpdate(territory, territory, {
        upsert: true,
        new: true,
      });
      return result._id.toString();
    })
  )
    .then(async (territories) => {
      ctx.request.body.territories = territories;
      ctx.body = {
        success: true,
        article: await new Article(ctx.request.body).save(),
      };
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        ctx.body = {
          success: false,
          errors: e.errors,
        };
      } else {
        throw e;
      }
    });
};

module.exports.update = async function (ctx) {
  const { territories } = ctx.request.body;
  console.log(ctx.request.body);
  return Promise.all(
    territories.map(async (territory) => {
      const result = await Territory.findOneAndUpdate(territory, territory, {
        upsert: true,
        new: true,
      });
      return result._id.toString();
    })
  )
    .then(async (territories) => {
      ctx.request.body.territories = territories;
      ctx.parameters.article.set(ctx.request.body);
      ctx.body = {
        success: true,
        article: await ctx.parameters.article.save(),
      };
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        ctx.body = {
          success: false,
          errors: e.errors,
        };
      } else {
        throw e;
      }
    });
};
