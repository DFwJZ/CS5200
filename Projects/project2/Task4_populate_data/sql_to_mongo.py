import csv
import json

# Load data from CSV files
with open('../sql_schemas/patients.csv', mode='r') as file:
    patients = {row['PatientID']: row for row in csv.DictReader(file)}

# Load data from CSV files
with open('../sql_schemas/doctors.csv', mode='r') as file:
    doctors = {row['DoctorID']: row for row in csv.DictReader(file)}

# Load data from CSV files
with open('../sql_schemas/appointments.csv', mode='r') as file:
    appointments = {row['AppointmentID']: row for row in csv.DictReader(file)}

# Load data from CSV files
with open('../sql_schemas/treatment_plans.csv', mode='r') as file:
    treatment_plans = {row['PatientID']: row for row in csv.DictReader(file)}

# Load data from CSV files
with open('../sql_schemas/billing_information.csv', mode='r') as file:
    billing_information = {row['PatientID']: row for row in csv.DictReader(file)}

# Load data from CSV files
with open('../sql_schemas/admin_staff.csv', mode='r') as file:
    admin_staff = [row for row in csv.DictReader(file)]

# Load data from CSV files
with open('../sql_schemas/departments.csv', mode='r') as file:
    departments  = [row for row in csv.DictReader(file)]

# Load data from CSV files
with open('../sql_schemas/medical_equipment.csv', mode='r') as file:
    medical_equipment = [row for row in csv.DictReader(file)]



# Process appointments
appointment_details = []
index = 0
for appointmentID, appointment in appointments.items():
    equipment_item = medical_equipment[index] if index < len(medical_equipment) else None
    department = departments[index] if index < len(departments) else None
    admin_staff_each = admin_staff[index] if index < len(admin_staff) else None

    index += 1
    
    detail = {
        'appointment_id': appointmentID,
        'patient': patients.get(appointment['PatientID']),  # Using get for safer access
        'doctor': doctors.get(appointment['DoctorID']),    # Using get for safer access
        'treatment_plan': treatment_plans.get(appointment['PatientID']),
        'billing_information': billing_information.get(appointment['PatientID']),
        'medical_equipment': equipment_item,
        'department': department,
        'admin_staff': admin_staff_each,
        'appointment_info': appointment
        
    }
    appointment_details.append(detail)

# # Save to JSON
with open('../mongo.json', mode='w') as file:
    json.dump(appointment_details, file)
