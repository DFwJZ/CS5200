BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "patients" (
	"PatientID"	INTEGER NOT NULL UNIQUE,
	"Name"	TEXT,
	"DateOfBirth"	TEXT,
	"Address"	TEXT,
	"InsuranceID"	INTEGER NOT NULL UNIQUE,
	PRIMARY KEY("PatientID")
);
CREATE TABLE IF NOT EXISTS "doctors" (
	"Name"	TEXT,
	"Schedule"	TEXT,
	"PrimaryCare"	TEXT,
	"DoctorID"	INTEGER NOT NULL UNIQUE,
	PRIMARY KEY("DoctorID")
);
CREATE TABLE IF NOT EXISTS "appointments" (
	"AppointmentID"	INTEGER NOT NULL UNIQUE,
	"PatientID"	INTEGER UNIQUE,
	"Date"	TEXT,
	"DoctorID"	INTEGER UNIQUE,
	"Time"	TEXT,
	PRIMARY KEY("AppointmentID"),
	FOREIGN KEY("PatientID") REFERENCES "patients"("PatientID"),
	FOREIGN KEY("DoctorID") REFERENCES "doctors"("DoctorID")
);
CREATE TABLE IF NOT EXISTS "treatment_plans" (
	"PatientID"	INTEGER,
	"Diagnosis"	TEXT,
	"Treatment"	TEXT,
	"DoctorID"	INTEGER,
	"TreatmentPlanID"	INTEGER,
	PRIMARY KEY("TreatmentPlanID"),
	FOREIGN KEY("DoctorID") REFERENCES "doctors"("DoctorID"),
	FOREIGN KEY("PatientID") REFERENCES "patients"("PatientID")
);
CREATE TABLE IF NOT EXISTS "medical_equipment" (
	"EquipmentID"	INTEGER NOT NULL UNIQUE,
	"Name"	TEXT,
	"Availability"	TEXT,
	PRIMARY KEY("EquipmentID")
);
CREATE TABLE IF NOT EXISTS "departments" (
	"DepartmentID"	INTEGER NOT NULL UNIQUE,
	"Location"	TEXT,
	PRIMARY KEY("DepartmentID")
);
CREATE TABLE IF NOT EXISTS "admin_staff" (
	"StaffID"	INTEGER NOT NULL UNIQUE,
	"Name"	TEXT,
	"Role"	TEXT,
	PRIMARY KEY("StaffID")
);
CREATE TABLE IF NOT EXISTS "billing_information" (
	"BillingID"	INTEGER NOT NULL UNIQUE,
	"PatientID"	INTEGER,
	"AmountDue"	INTEGER,
	"PaymentStatus"	TEXT,
	PRIMARY KEY("BillingID"),
	FOREIGN KEY("PatientID") REFERENCES "patients"("PatientID")
);
COMMIT;
