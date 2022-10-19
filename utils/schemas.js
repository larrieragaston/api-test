const addressSchema = {
  street: { type: String },
  city: { type: String },
  district: { type: String },
  country: { type: String },
  neighborhood: { type: String },
  postalCode: { type: String },
  buildingNumber: { type: String },
  apartmentNumber: { type: String },
  apartmentFloor: { type: String },
  betweenStreets: [{ type: String }],
}

module.exports = addressSchema
