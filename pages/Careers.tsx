
import React, { useState } from 'react';
import { 
  User, 
  Users,
  CreditCard, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Link as LinkIcon, 
  CheckCircle,
  Plus,
  Trash2,
  Send,
  Loader2
} from 'lucide-react';
import { JoiningFormData, EducationRecord, EmploymentRecord, ReferenceRecord } from '../types';
import { DatabaseService } from '../services/database';

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
    <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
      <Icon size={20} />
    </div>
    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
  </div>
);

const FormField = ({ label, required = false, children, dark = false }: { label: string, required?: boolean, children?: React.ReactNode, dark?: boolean }) => (
  <div className="flex flex-col gap-1.5 mb-5">
    <label className={`text-sm font-semibold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props} 
    className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-900 placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
  />
);

const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select 
    {...props}
    className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-900"
  >
    {children}
  </select>
);

const Careers = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<JoiningFormData>({
    employeeCode: '',
    firstName: '',
    middleName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    email: '',
    mobile: '',
    alternateMobile: '',
    dob: '',
    doj: '',
    maritalStatus: 'Unmarried',
    bloodGroup: '',
    wifeName: '',
    familyMembersCount: '',
    bankAccount: '',
    ifscCode: '',
    aadhaarNumber: '',
    panNumber: '',
    uanNumber: '',
    esicNumber: '',
    localAddress: '',
    permanentAddress: '',
    pincode: '',
    education: [
      { degree: '10th', institution: '', percentage: '', passingYear: '' },
      { degree: '12th', institution: '', percentage: '', passingYear: '' },
      { degree: 'Graduation', institution: '', percentage: '', passingYear: '' },
      { degree: 'Post-Graduation', institution: '', percentage: '', passingYear: '' },
      { degree: 'Diploma', institution: '', percentage: '', passingYear: '' },
      { degree: 'Post Diploma', institution: '', percentage: '', passingYear: '' },
      { degree: 'Others', institution: '', percentage: '', passingYear: '' }
    ],
    employment: [],
    references: [{ name: '', organization: '', mobile: '' }],
    isRelatedToCompany: 'No',
    finalDeclaration: false,
    signature: '',
    submissionDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const updateEducation = (index: number, field: keyof EducationRecord, value: string) => {
    const updated = [...formData.education];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, education: updated }));
  };

  const addEmploymentRow = () => {
    setFormData(prev => ({
      ...prev,
      employment: [...prev.employment, { employer: '', location: '', designation: '', fromDate: '', toDate: '', ctc: '' }]
    }));
  };

  const removeEmploymentRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      employment: prev.employment.filter((_, i) => i !== index)
    }));
  };

  const updateEmployment = (index: number, field: keyof EmploymentRecord, value: string) => {
    const updated = [...formData.employment];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, employment: updated }));
  };

  const updateReference = (index: number, field: keyof ReferenceRecord, value: string) => {
    const updated = [...formData.references];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, references: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.finalDeclaration) {
      alert("Please check the final declaration.");
      return;
    }
    setLoading(true);
    try {
      const result = await DatabaseService.saveApplication(formData);
      if (result.success) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Application Submitted!</h1>
        <p className="text-xl text-slate-600 mb-10">
          Your joining form has been successfully received by Bansal Consultancy and Services. 
          Our HR team will review your details and get back to you shortly.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-blue-900 text-white rounded-xl font-bold"
        >
          Submit Another Form
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-blue-900 px-8 py-12 text-white">
            <h1 className="text-4xl font-extrabold mb-4">Bansal Consultancy & Services</h1>
            <p className="text-blue-200 text-lg uppercase tracking-widest font-semibold">Employee Joining Form</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-12">
            
            {/* Personal Information */}
            <section className="mb-16">
              <SectionHeader icon={User} title="Personal Information" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
                <FormField label="Employee Code" required>
                  <Input name="employeeCode" value={formData.employeeCode} onChange={handleChange} required />
                </FormField>
                <FormField label="First Name" required>
                  <Input name="firstName" value={formData.firstName} onChange={handleChange} required />
                </FormField>
                <FormField label="Middle Name">
                  <Input name="middleName" value={formData.middleName} onChange={handleChange} />
                </FormField>
                <FormField label="Last Name" required>
                  <Input name="lastName" value={formData.lastName} onChange={handleChange} required />
                </FormField>
                <FormField label="Father's Name" required>
                  <Input name="fatherName" value={formData.fatherName} onChange={handleChange} required />
                </FormField>
                <FormField label="Mother's Name" required>
                  <Input name="motherName" value={formData.motherName} onChange={handleChange} required />
                </FormField>
                <FormField label="Email ID" required>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </FormField>
                <FormField label="Mobile Number" required>
                  <Input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />
                </FormField>
                <FormField label="Alternate Mobile">
                  <Input type="tel" name="alternateMobile" value={formData.alternateMobile} onChange={handleChange} />
                </FormField>
                <FormField label="Date of Birth" required>
                  <Input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                </FormField>
                <FormField label="Date of Joining" required>
                  <Input type="date" name="doj" value={formData.doj} onChange={handleChange} required />
                </FormField>
                <FormField label="Marital Status" required>
                  <Select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                    <option value="Unmarried">Unmarried</option>
                    <option value="Married">Married</option>
                  </Select>
                </FormField>
                <FormField label="Blood Group">
                  <Input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="e.g. O+" />
                </FormField>
                {formData.maritalStatus === 'Married' && (
                  <FormField label="Wife Name">
                    <Input name="wifeName" value={formData.wifeName} onChange={handleChange} />
                  </FormField>
                )}
                <FormField label="No. of Family Members">
                  <Input type="number" name="familyMembersCount" value={formData.familyMembersCount} onChange={handleChange} />
                </FormField>
              </div>
            </section>

            {/* Bank & Identification */}
            <section className="mb-16">
              <SectionHeader icon={CreditCard} title="Bank & Identification Details" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
                <FormField label="Bank Account Number" required>
                  <Input name="bankAccount" value={formData.bankAccount} onChange={handleChange} required />
                </FormField>
                <FormField label="IFSC Code" required>
                  <Input name="ifscCode" value={formData.ifscCode} onChange={handleChange} required />
                </FormField>
                <FormField label="Aadhaar Card Number" required>
                  <Input name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} required />
                </FormField>
                <FormField label="PAN Number" required>
                  <Input name="panNumber" value={formData.panNumber} onChange={handleChange} required />
                </FormField>
                <FormField label="UAN Number">
                  <Input name="uanNumber" value={formData.uanNumber} onChange={handleChange} />
                </FormField>
                <FormField label="ESIC Number">
                  <Input name="esicNumber" value={formData.esicNumber} onChange={handleChange} />
                </FormField>
              </div>
            </section>

            {/* Address Details */}
            <section className="mb-16">
              <SectionHeader icon={MapPin} title="Address Details" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <FormField label="Local Address" required>
                  <textarea 
                    name="localAddress" 
                    rows={3} 
                    value={formData.localAddress} 
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-900"
                    required
                  ></textarea>
                </FormField>
                <FormField label="Permanent Address" required>
                  <textarea 
                    name="permanentAddress" 
                    rows={3} 
                    value={formData.permanentAddress} 
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-900"
                    required
                  ></textarea>
                </FormField>
                <FormField label="Pincode" required>
                  <Input name="pincode" value={formData.pincode} onChange={handleChange} required />
                </FormField>
              </div>
            </section>

            {/* Education Details */}
            <section className="mb-16">
              <SectionHeader icon={GraduationCap} title="Education Details" />
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-4 border border-slate-200 font-bold text-slate-700">Degree</th>
                      <th className="p-4 border border-slate-200 font-bold text-slate-700">College / Board</th>
                      <th className="p-4 border border-slate-200 font-bold text-slate-700">Percentage / Marks</th>
                      <th className="p-4 border border-slate-200 font-bold text-slate-700">Passing Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.education.map((edu, idx) => (
                      <tr key={idx}>
                        <td className="p-4 border border-slate-200 font-semibold text-slate-600 bg-slate-50/50">{edu.degree}</td>
                        <td className="p-2 border border-slate-200">
                          <input 
                            className="w-full p-2 outline-none text-slate-900 bg-white" 
                            value={edu.institution} 
                            onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                          />
                        </td>
                        <td className="p-2 border border-slate-200">
                          <input 
                            className="w-full p-2 outline-none text-slate-900 bg-white" 
                            value={edu.percentage} 
                            onChange={(e) => updateEducation(idx, 'percentage', e.target.value)}
                          />
                        </td>
                        <td className="p-2 border border-slate-200">
                          <input 
                            className="w-full p-2 outline-none text-slate-900 bg-white" 
                            value={edu.passingYear} 
                            onChange={(e) => updateEducation(idx, 'passingYear', e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Employment History */}
            <section className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <SectionHeader icon={Briefcase} title="Employment History" />
                <button 
                  type="button" 
                  onClick={addEmploymentRow}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold hover:bg-blue-100 transition-colors"
                >
                  <Plus size={18} /> Add Experience
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-4 border border-slate-200 font-bold text-slate-700">Employer's Name</th>
                      <th className="p-4 border border-slate-200 font-bold text-slate-700">Location</th>
                      <th className="p-4 border border-slate-200 font-bold text-slate-700">Designation</th>
                      <th className="p-4 border border-slate-200 font-bold text-slate-700">From Date</th>
                      <th className="p-4 border border-slate-200 font-bold text-slate-700">To Date</th>
                      <th className="p-4 border border-slate-200 font-bold text-slate-700">CTC</th>
                      <th className="p-4 border border-slate-200"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.employment.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 italic">No employment history added</td>
                      </tr>
                    )}
                    {formData.employment.map((emp, idx) => (
                      <tr key={idx}>
                        <td className="p-2 border border-slate-200"><input className="w-full p-2 text-slate-900 bg-white" value={emp.employer} onChange={e => updateEmployment(idx, 'employer', e.target.value)} /></td>
                        <td className="p-2 border border-slate-200"><input className="w-full p-2 text-slate-900 bg-white" value={emp.location} onChange={e => updateEmployment(idx, 'location', e.target.value)} /></td>
                        <td className="p-2 border border-slate-200"><input className="w-full p-2 text-slate-900 bg-white" value={emp.designation} onChange={e => updateEmployment(idx, 'designation', e.target.value)} /></td>
                        <td className="p-2 border border-slate-200"><input type="date" className="w-full p-2 text-slate-900 bg-white" value={emp.fromDate} onChange={e => updateEmployment(idx, 'fromDate', e.target.value)} /></td>
                        <td className="p-2 border border-slate-200"><input type="date" className="w-full p-2 text-slate-900 bg-white" value={emp.toDate} onChange={e => updateEmployment(idx, 'toDate', e.target.value)} /></td>
                        <td className="p-2 border border-slate-200"><input className="w-full p-2 text-slate-900 bg-white" value={emp.ctc} onChange={e => updateEmployment(idx, 'ctc', e.target.value)} /></td>
                        <td className="p-2 border border-slate-200 text-center">
                          <button type="button" onClick={() => removeEmploymentRow(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* References */}
            <section className="mb-16">
              <SectionHeader icon={LinkIcon} title="References" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {formData.references.map((ref, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <FormField label="Full Name">
                      <Input value={ref.name} onChange={e => updateReference(idx, 'name', e.target.value)} />
                    </FormField>
                    <FormField label="Organization">
                      <Input value={ref.organization} onChange={e => updateReference(idx, 'organization', e.target.value)} />
                    </FormField>
                    <FormField label="Mobile Number">
                      <Input value={ref.mobile} onChange={e => updateReference(idx, 'mobile', e.target.value)} />
                    </FormField>
                  </div>
                ))}
              </div>
            </section>

            {/* Company Relation */}
            <section className="mb-16">
              <SectionHeader icon={Users} title="Company Relation Declaration" />
              <div className="p-8 bg-blue-50/50 rounded-2xl border border-blue-100">
                <FormField label="Are you related to anyone in this company?">
                  <Select name="isRelatedToCompany" value={formData.isRelatedToCompany} onChange={handleChange}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </Select>
                </FormField>
                {formData.isRelatedToCompany === 'Yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-blue-100">
                    <FormField label="Company Name">
                      <Input name="relatedCompanyName" value={formData.relatedCompanyName} onChange={handleChange} />
                    </FormField>
                    <FormField label="Person Name">
                      <Input name="relatedPersonName" value={formData.relatedPersonName} onChange={handleChange} />
                    </FormField>
                    <FormField label="Department">
                      <Input name="relatedDepartment" value={formData.relatedDepartment} onChange={handleChange} />
                    </FormField>
                  </div>
                )}
              </div>
            </section>

            {/* Final Declaration */}
            <section className="mb-16 bg-slate-900 text-white p-10 rounded-3xl">
              <div className="flex items-start gap-4 mb-10">
                <input 
                  type="checkbox" 
                  id="finalDeclaration"
                  name="finalDeclaration" 
                  checked={formData.finalDeclaration} 
                  onChange={handleChange}
                  className="w-6 h-6 mt-1 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="finalDeclaration" className="text-lg leading-relaxed text-slate-300">
                  I hereby declare that all the information provided above is true to the best of my knowledge and belief. I understand that any false statement or suppression of material facts will render me liable for termination of service without notice.
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <FormField label="Signature (Type Name)" dark>
                  <input 
                    name="signature" 
                    value={formData.signature} 
                    onChange={handleChange}
                    className="bg-transparent border-b-2 border-slate-700 py-2 text-2xl font-signature focus:border-blue-500 outline-none italic text-white w-full"
                    style={{ fontFamily: 'cursive' }}
                    placeholder="John Doe"
                    required
                  />
                </FormField>
                <FormField label="Date" dark>
                  <Input type="date" name="submissionDate" value={formData.submissionDate} disabled />
                </FormField>
              </div>
            </section>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-white transition-all duration-200 bg-blue-900 font-pj rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 hover:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <>
                    Submit Joining Form
                    <Send className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Careers;
