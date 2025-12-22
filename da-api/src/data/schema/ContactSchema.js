const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 100
    },
    phone: {
        type: String,
        trim: true,
        maxlength: 20,
        default: null
    },
    subject: {
        type: String,
        required: true,
        maxlength: 2000
    },
    ipAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'archived'],
        default: 'new'
    },
    emailSent: {
        type: Boolean,
        default: false
    },
    confirmationSent: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'contacts'
});

ContactSchema.index({ email: 1, createdAt: -1 });
ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ ipAddress: 1, createdAt: -1 });

ContactSchema.statics.createContact = async function(contactData) {
    const contact = new this(contactData);
    return await contact.save();
};

ContactSchema.statics.findByEmail = async function(email) {
    return await this.find({ email }).sort({ createdAt: -1 });
};

ContactSchema.statics.findRecentByIP = async function(ipAddress, minutes = 60) {
    const timeAgo = new Date(Date.now() - minutes * 60 * 1000);
    return await this.find({
        ipAddress,
        createdAt: { $gte: timeAgo }
    }).sort({ createdAt: -1 });
};

ContactSchema.statics.countRecentByEmail = async function(email, hours = 24) {
    const timeAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
    return await this.countDocuments({
        email,
        createdAt: { $gte: timeAgo }
    });
};

ContactSchema.methods.updateStatus = async function(newStatus) {
    this.status = newStatus;
    this.updatedAt = new Date();
    return await this.save();
};

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;

