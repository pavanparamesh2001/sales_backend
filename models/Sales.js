const mongoose = require('mongoose');

// Counter schema
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', CounterSchema);

// Generate Case ID
async function generateCaseId() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  const dateStr = `${y}${m}${d}`;
  const counterId = `sales_${dateStr}`;

  const counter = await Counter.findByIdAndUpdate(
    counterId,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seq = String(counter.seq).padStart(4, '0');
  return `SALES-${dateStr}-${seq}`;
}

const SalesSchema = new mongoose.Schema({
  caseId: {
    type: String,
    unique: true
  },
  asmname: { type: String, required: true },   // ✅ ASM NAME
  dealerName: { type: String, required: true },
  contactPerson: String,
  designation: String,
  contactNumber: String,
  state: String,
  city: String,
  oem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OEM'
  }, // ✅ LOCATION FROM WEB (ANDROID BROWSER)
   location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  geoApiMetaData: { type: Object, required: false },
  email: String,
  // ✅ NEW FIELD
  whatsappMessageSent: {
    type: Boolean,
    default: false
  },
  status: { type: String, default: 'Submitted' }
}, { timestamps: true });


 // ✅ GEO INDEX (VERY IMPORTANT FOR FUTURE)
SalesSchema.index({ location: '2dsphere' });

SalesSchema.pre('save', async function () {
  if (!this.caseId) {
    this.caseId = await generateCaseId();
  }
});



module.exports = mongoose.model('Sales', SalesSchema);
