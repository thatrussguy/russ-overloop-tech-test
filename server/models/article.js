const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Territory Schema
 */
var TerritorySchema = new Schema({
  name: {
    type: String,
    default: "",
    trim: true,
  },
});

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    default: "",
    trim: true,
  },
  content: {
    type: String,
    default: "",
    trim: true,
  },
  territories: [{ type: Schema.Types.ObjectId, ref: "Territory" }],
});

/**
 * Validations
 */
ArticleSchema.path("title").validate(
  (title) => title.length,
  "Title cannot be blank"
);

mongoose.model("Article", ArticleSchema);
mongoose.model("Territory", TerritorySchema);
