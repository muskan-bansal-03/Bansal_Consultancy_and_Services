
import React, { useState } from 'react';
import { 
  User, 
  Users,
  CreditCard, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  CheckCircle,
  Plus,
  Trash2,
  Send,
  Loader2,
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react';
import { JoiningFormData, EducationRecord, EmploymentRecord, ReferenceRecord } from '../types';
import { DatabaseService } from '../services/database';

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/5">
      <Icon size={20} />
    </div>
    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
  </div>
);

const FormField = ({ label, required = false, children, dark = false }: { label: string, required?: boolean, children?: React.ReactNode, dark?: boolean }) => (
  <div className="flex flex-col gap-2 mb-6">
    <label className={`text-xs font-black uppercase tracking-widest ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props} 
    className="px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-slate-900 font-bold placeholder:text-slate-300 disabled:opacity-60 text-sm md:text-base"
  />
);

const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select 
    {...props}
    className="px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-slate-900 font-bold text-sm md:text-base appearance-none cursor-pointer"
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
    employment: [{ employer: '', location: '', designation: '', fromDate: '', toDate: '', ctc: '' }],
    references: [{ name: '', organization: '', mobile: '' }],
    isRelatedToCompany: 'No',
    relatedCompanyName: '',
    relatedPersonName: '',
    relatedDepartment: '',
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
    if (formData.employment.length === 1) {
        // Reset if it's the last row instead of removing
        setFormData(prev => ({
          ...prev,
          employment: [{ employer: '', location: '', designation: '', fromDate: '', toDate: '', ctc: '' }]
        }));
        return;
    }
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

  const addReferenceRow = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, { name: '', organization: '', mobile: '' }]
    }));
  };

  const removeReferenceRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  const updateReference = (index: number, field: keyof ReferenceRecord, value: string) => {
    const updated = [...formData.references];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, references: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Custom Logical Date Validation for Employment History
    for (let i = 0; i < formData.employment.length; i++) {
        const emp = formData.employment[i];
        
        // Skip validation if row is completely empty (though required attributes usually prevent this)
        if (!emp.employer && !emp.fromDate && !emp.toDate) continue;

        if (!emp.employer.trim()) {
            alert(`Employment History Row ${i + 1}: Employer Name is required.`);
            return;
        }

        if (emp.fromDate && emp.toDate) {
            const start = new Date(emp.fromDate);
            const end = new Date(emp.toDate);
            if (end < start) {
                alert(`Employment History Row ${i + 1}: 'To Date' cannot be earlier than 'From Date'.`);
                return;
            }
        }
    }

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
      <div className="max-w-4xl mx-auto px-4 py-20 md:py-32 text-center animate-in fade-in duration-1000">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-green-500/10">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Onboarding Complete!</h1>
        <p className="text-base md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Your documentation has been digitally verified and sent to the Bansal HR Core. We will reach out via email for the next steps.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-12 py-5 bg-blue-900 text-white rounded-2xl font-black shadow-2xl shadow-blue-900/20 hover:scale-105 transition-all"
        >
          Submit Another Entry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-10 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-blue-950 px-8 md:px-16 py-12 md:py-20 text-white relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 hidden lg:block">
              <Users size={300} />
            </div>
            <div className="relative z-10">
              <div className="inline-block px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">Internal Document</div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tighter">Onboarding Portal</h1>
              <p className="text-blue-300 font-bold text-sm md:text-lg">Bansal Consultancy and Services Enterprise Resource Center</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-16">
            <div className="flex items-center gap-3 p-6 bg-orange-50 text-orange-700 rounded-3xl mb-12 border border-orange-100">
              <AlertCircle size={24} className="shrink-0" />
              <p className="text-sm font-bold leading-relaxed">Please ensure all identity details match your government-issued documents for ESIC/EPF verification.</p>
            </div>

            {/* Personal Info */}
            <section className="mb-20">
              <SectionHeader icon={User} title="Personal Details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                <FormField label="Employee Code" required>
                  <Input name="employeeCode" value={formData.employeeCode} onChange={handleChange} required placeholder="BCS-000" />
                </FormField>
                <FormField label="First Name" required>
                  <Input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="First Name" />
                </FormField>
                <FormField label="Middle Name">
                  <Input name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Middle Name" />
                </FormField>
                <FormField label="Last Name" required>
                  <Input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Last Name" />
                </FormField>
                <FormField label="Father's Name" required>
                  <Input name="fatherName" value={formData.fatherName} onChange={handleChange} required />
                </FormField>
                <FormField label="Mother's Name" required>
                  <Input name="motherName" value={formData.motherName} onChange={handleChange} required />
                </FormField>
                <FormField label="Email Address" required>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
                </FormField>
                <FormField label="Mobile Number" required>
                  <Input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="+91" />
                </FormField>
                <FormField label="Alternate Mobile">
                  <Input type="tel" name="alternateMobile" value={formData.alternateMobile} onChange={handleChange} placeholder="+91" />
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
                  <Input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="O+" />
                </FormField>
                {formData.maritalStatus === 'Married' && (
                  <FormField label="Wife Name">
                    <Input name="wifeName" value={formData.wifeName} onChange={handleChange} placeholder="Full Name" />
                  </FormField>
                )}
                <FormField label="No. of Family Members">
                  <Input type="number" name="familyMembersCount" value={formData.familyMembersCount} onChange={handleChange} placeholder="0" />
                </FormField>
              </div>
            </section>

            {/* Bank Info */}
            <section className="mb-20">
              <SectionHeader icon={CreditCard} title="Bank & Identity" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                <FormField label="Bank Account Number" required>
                  <Input name="bankAccount" value={formData.bankAccount} onChange={handleChange} required />
                </FormField>
                <FormField label="IFSC Code" required>
                  <Input name="ifscCode" value={formData.ifscCode} onChange={handleChange} required />
                </FormField>
                <FormField label="Aadhaar Number" required>
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

            {/* Address */}
            <section className="mb-20">
              <SectionHeader icon={MapPin} title="Residency Details" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
                <FormField label="Local Address" required>
                  <textarea 
                    name="localAddress" 
                    rows={4} 
                    value={formData.localAddress} 
                    onChange={handleChange}
                    className="px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-slate-900 font-bold resize-none"
                    required
                  ></textarea>
                </FormField>
                <FormField label="Permanent Address" required>
                  <textarea 
                    name="permanentAddress" 
                    rows={4} 
                    value={formData.permanentAddress} 
                    onChange={handleChange}
                    className="px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-slate-900 font-bold resize-none"
                    required
                  ></textarea>
                </FormField>
                <FormField label="Pin Code" required>
                  <Input name="pincode" value={formData.pincode} onChange={handleChange} required />
                </FormField>
              </div>
            </section>

            {/* Education Table */}
            <section className="mb-20">
              <SectionHeader icon={GraduationCap} title="Academic Records" />
              <div className="overflow-x-auto rounded-[2rem] border border-slate-200 custom-scrollbar mb-4">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-6 border-b border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400">Level</th>
                      <th className="p-6 border-b border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400">Institution / University</th>
                      <th className="p-6 border-b border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400">Score (%)</th>
                      <th className="p-6 border-b border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formData.education.map((edu, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                        <td className="p-6 font-black text-slate-900 bg-slate-50/30">{edu.degree}</td>
                        <td className="p-3">
                          <input 
                            className="w-full p-3 rounded-xl border border-transparent focus:border-blue-600 outline-none text-slate-900 font-bold bg-white" 
                            placeholder="Institution Name"
                            value={edu.institution} 
                            onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                          />
                        </td>
                        <td className="p-3">
                          <input 
                            className="w-full p-3 rounded-xl border border-transparent focus:border-blue-600 outline-none text-slate-900 font-bold bg-white" 
                            placeholder="00.00"
                            value={edu.percentage} 
                            onChange={(e) => updateEducation(idx, 'percentage', e.target.value)}
                          />
                        </td>
                        <td className="p-3 text-right">
                          <input 
                            className="w-full max-w-[120px] p-3 rounded-xl border border-transparent focus:border-blue-600 outline-none text-slate-900 font-bold bg-white ml-auto" 
                            placeholder="YYYY"
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

            {/* Employment History Table */}
            <section className="mb-20">
              <SectionHeader icon={Briefcase} title="Employment History" />
              <div className="overflow-x-auto rounded-[2rem] border border-slate-200 custom-scrollbar mb-6">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-6 border-b border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400">Employer Name</th>
                      <th className="p-6 border-b border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400">Location</th>
                      <th className="p-6 border-b border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400">Designation</th>
                      <th className="p-6 border-b border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400">From</th>
                      <th className="p-6 border-b border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400">To</th>
                      <th className="p-6 border-b border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400">CTC</th>
                      <th className="p-6 border-b border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formData.employment.map((emp, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                        <td className="p-3">
                          <input 
                            className="w-full p-3 rounded-xl border border-transparent focus:border-blue-600 outline-none text-slate-900 font-bold bg-white" 
                            placeholder="Company Name" 
                            value={emp.employer} 
                            onChange={(e) => updateEmployment(idx, 'employer', e.target.value)} 
                            required={formData.employment.length > 1 || emp.fromDate !== '' || emp.toDate !== ''}
                          />
                        </td>
                        <td className="p-3">
                          <input 
                            className="w-full p-3 rounded-xl border border-transparent focus:border-blue-600 outline-none text-slate-900 font-bold bg-white" 
                            placeholder="City" 
                            value={emp.location} 
                            onChange={(e) => updateEmployment(idx, 'location', e.target.value)} 
                          />
                        </td>
                        <td className="p-3">
                          <input 
                            className="w-full p-3 rounded-xl border border-transparent focus:border-blue-600 outline-none text-slate-900 font-bold bg-white" 
                            placeholder="Role" 
                            value={emp.designation} 
                            onChange={(e) => updateEmployment(idx, 'designation', e.target.value)} 
                            required={emp.employer !== ''}
                          />
                        </td>
                        <td className="p-3">
                          <input 
                            type="date" 
                            className="w-full p-3 rounded-xl border border-transparent focus:border-blue-600 outline-none text-slate-900 font-bold bg-white" 
                            value={emp.fromDate} 
                            onChange={(e) => updateEmployment(idx, 'fromDate', e.target.value)} 
                            required={emp.employer !== ''}
                          />
                        </td>
                        <td className="p-3">
                          <input 
                            type="date" 
                            className="w-full p-3 rounded-xl border border-transparent focus:border-blue-600 outline-none text-slate-900 font-bold bg-white" 
                            value={emp.toDate} 
                            onChange={(e) => updateEmployment(idx, 'toDate', e.target.value)} 
                            required={emp.employer !== ''}
                          />
                        </td>
                        <td className="p-3">
                          <input 
                            className="w-full p-3 rounded-xl border border-transparent focus:border-blue-600 outline-none text-slate-900 font-bold bg-white" 
                            placeholder="LPA" 
                            value={emp.ctc} 
                            onChange={(e) => updateEmployment(idx, 'ctc', e.target.value)} 
                          />
                        </td>
                        <td className="p-3 text-right">
                          <button type="button" onClick={() => removeEmploymentRow(idx)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={addEmploymentRow} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">
                <Plus size={16}/> Add History Row
              </button>
            </section>

            {/* References */}
            <section className="mb-20">
              <SectionHeader icon={Users} title="Professional References" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
                {formData.references.map((ref, idx) => (
                  <div key={idx} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 relative group">
                    <button type="button" onClick={() => removeReferenceRow(idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <FormField label={`Reference #${idx + 1} Name`} required>
                      <Input value={ref.name} onChange={(e) => updateReference(idx, 'name', e.target.value)} placeholder="Full Name" required />
                    </FormField>
                    <FormField label="Organization" required>
                      <Input value={ref.organization} onChange={(e) => updateReference(idx, 'organization', e.target.value)} placeholder="Company Name" required />
                    </FormField>
                    <FormField label="Mobile Number" required>
                      <Input value={ref.mobile} onChange={(e) => updateReference(idx, 'mobile', e.target.value)} placeholder="+91" required />
                    </FormField>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addReferenceRow} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-blue-600 transition-all">
                <Plus size={16}/> Add Reference
              </button>
            </section>

            {/* Company Relation */}
            <section className="mb-20 p-10 bg-blue-50/50 rounded-[3rem] border border-blue-100">
              <SectionHeader icon={LinkIcon} title="Internal Declarations" />
              <FormField label="Are you related to anyone in this company?" required>
                <div className="flex gap-8 mt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="isRelatedToCompany" value="Yes" checked={formData.isRelatedToCompany === 'Yes'} onChange={handleChange} className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-slate-900">Yes</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="isRelatedToCompany" value="No" checked={formData.isRelatedToCompany === 'No'} onChange={handleChange} className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-slate-900">No</span>
                  </label>
                </div>
              </FormField>

              {formData.isRelatedToCompany === 'Yes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 p-8 bg-white rounded-3xl animate-in fade-in slide-in-from-top-4">
                  <FormField label="Company Name">
                    <Input name="relatedCompanyName" value={formData.relatedCompanyName} onChange={handleChange} placeholder="Bansal Unit" />
                  </FormField>
                  <FormField label="Person Name">
                    <Input name="relatedPersonName" value={formData.relatedPersonName} onChange={handleChange} placeholder="Full Name" />
                  </FormField>
                  <FormField label="Department">
                    <Input name="relatedDepartment" value={formData.relatedDepartment} onChange={handleChange} placeholder="IT/HR/Sales" />
                  </FormField>
                </div>
              )}
            </section>

            {/* Final Declaration Box */}
            <section className="mb-20 bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-black mb-10 text-blue-400">Final Verification</h2>
                <div className="flex items-start gap-6 mb-12 group cursor-pointer" onClick={() => setFormData(p => ({...p, finalDeclaration: !p.finalDeclaration}))}>
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl border-2 transition-all flex items-center justify-center shrink-0 ${formData.finalDeclaration ? 'bg-blue-600 border-blue-600' : 'border-slate-700 bg-slate-800'}`}>
                    {formData.finalDeclaration && <CheckCircle size={24} className="text-white" />}
                  </div>
                  <label className="text-sm md:text-base leading-relaxed text-slate-400 font-medium select-none">
                    I declare that the information provided above is true to the best of my knowledge. I understand that any false declaration will lead to immediate disqualification or termination from Bansal Consultancy and Services.
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <FormField label="Digital Signature (Type Full Name)" dark>
                    <input 
                      name="signature" 
                      value={formData.signature} 
                      onChange={handleChange}
                      className="bg-transparent border-b-2 border-slate-700 py-4 text-3xl md:text-5xl outline-none italic text-blue-500 w-full font-signature placeholder:text-slate-800"
                      style={{ fontFamily: 'cursive' }}
                      placeholder="Your Name"
                      required
                    />
                  </FormField>
                  <div className="flex flex-col justify-end items-end">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full md:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black flex items-center justify-center gap-4 transition-all shadow-2xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <><Send size={24} /> Execute Submission</>}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Careers;
