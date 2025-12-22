const mongoose = require('mongoose');

const TechItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    icon: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    isLearning: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    }
}, { _id: false });

const StackSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['frontend', 'backend', 'devops'],
        required: true,
        unique: true,
        index: true
    },
    techs: [TechItemSchema],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'stacks'
});

StackSchema.index({ category: 1, isActive: 1 });

StackSchema.statics.getAllStacks = async function() {
    const stacks = await this.find({ isActive: true })
        .sort({ category: 1 })
        .lean();

    const result = {};
    stacks.forEach(stack => {
        result[stack.category] = stack.techs.sort((a, b) => a.order - b.order);
    });

    return result;
};

StackSchema.statics.getStackByCategory = async function(category) {
    const stack = await this.findOne({ category, isActive: true }).lean();
    return stack ? stack.techs.sort((a, b) => a.order - b.order) : null;
};

module.exports = mongoose.model('Stack', StackSchema);

