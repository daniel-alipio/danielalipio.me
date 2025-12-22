const mongoose = require('mongoose');

const ProjectsSchema = new mongoose.Schema({
    projectId: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    tech: [{
        type: String,
        required: true
    }],
    status: {
        type: String,
        enum: ['Live', 'In Progress', 'Archived'],
        default: 'In Progress'
    },
    tag: {
        type: String,
        trim: true
    },
    fullUrl: {
        type: String,
        trim: true
    },
    shortDescription: {
        type: String,
        maxlength: 200
    },
    tagColor: {
        type: String,
        trim: true
    },
    logo: {
        type: String,
        trim: true
    },
    hero: {
        type: String,
        trim: true
    },
    accentColor: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    collection: 'projects'
});

ProjectsSchema.index({ status: 1, isActive: 1 });
ProjectsSchema.index({ order: 1 });

ProjectsSchema.statics.getAllProjects = async function() {
    return this.find({ isActive: true })
        .sort({ order: 1, projectId: 1 })
        .lean();
};

ProjectsSchema.statics.getProjectById = async function(projectId) {
    return this.findOne({ projectId, isActive: true }).lean();
};

module.exports = mongoose.model('Projects', ProjectsSchema);

