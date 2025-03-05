import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  accountType: { type: String, required: true },
  createdAt: { type: Date, required: true },
  email: { type: String, required: true },
  expoPushToken: { type: String, required: false },
  geoLocation: { type: Object, required: false },
  education: { type: Number, required: false },
  receivedLikes: { type: Array, required: false },
  hasSeenFirstLikeAlert: { type: Boolean, required: false },
  hasGottenToEditProfileScreen: { type: Boolean, required: false },
  hasReceivedLikeNotification: { type: Boolean, required: false },
  matches: { type: Array, required: false },
  lastUpdatedOnWeb: { type: Boolean, required: false },
  appliedJobs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Job', // Reference to the Job model
    default: [],
  },
  settings: {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    img: { type: String, required: false },
    address: { type: String, required: false },
    aboutMeText: { type: String, required: false },
    yearsOfExperience: { type: Number, required: false },
    relevantSkills: { type: Array, required: false },
    jobTitle: { type: String, required: false },
    isUsCitizen: { type: Boolean, required: false },
    onSiteOptionsOpenTo: { type: Array, required: false },
    isSeekingFirstJob: { type: Boolean, required: false },
    jobHistory: { type: Array, required: false },
    educationHistory: { type: Array, required: false },
    employmentTypesOpenTo: { type: Array, required: false },
    companySizeOptionsOpenTo: { type: Array, required: false },
    frontendBackendOptionsOpenTo: { type: Array, required: false },
    linkedInUrl: { type: String, required: false },
  },
  preferences: {
    textSearch: { type: String, required: false },
    seniorityLevel: { type: Array, required: false },
    minimumSalary: { type: Number, required: false },
    city: { type: String, required: false },
    relevantSkills: { type: Array, required: false },
    locationFlexibility: { type: Array, required: false },
  },
});

EmployeeSchema.index({ geoLocation: '2dsphere' });

// create real mongoose types instead of just Array and Object and then
// replace TEmployee in employeeTypes.ts with this
// export type TEmployee = InferSchemaType<typeof CompaniesSchema>;

export default mongoose.model('Employees', EmployeeSchema);
