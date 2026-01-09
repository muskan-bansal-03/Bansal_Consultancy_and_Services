
export interface EducationRecord {
  degree: string;
  institution: string;
  percentage: string;
  passingYear: string;
}

export interface EmploymentRecord {
  employer: string;
  location: string;
  designation: string;
  fromDate: string;
  toDate: string;
  ctc: string;
}

export interface ReferenceRecord {
  name: string;
  organization: string;
  mobile: string;
}

export interface JoiningFormData {
  id?: string;
  submittedAt?: string;
  
  // Personal Information
  employeeCode: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  email: string;
  mobile: string;
  alternateMobile: string;
  dob: string;
  doj: string;
  maritalStatus: 'Married' | 'Unmarried';
  bloodGroup: string;
  wifeName: string;
  familyMembersCount: string;

  // Bank & Identification
  bankAccount: string;
  ifscCode: string;
  aadhaarNumber: string;
  panNumber: string;
  uanNumber: string;
  esicNumber: string;

  // Address
  localAddress: string;
  permanentAddress: string;
  pincode: string;

  // Tables
  education: EducationRecord[];
  employment: EmploymentRecord[];
  references: ReferenceRecord[];

  // Declaration
  isRelatedToCompany: 'Yes' | 'No';
  relatedCompanyName?: string;
  relatedPersonName?: string;
  relatedDepartment?: string;
  finalDeclaration: boolean;
  signature: string;
  submissionDate: string;
}

export interface AdminUser {
  username: string;
  role: string;
}
