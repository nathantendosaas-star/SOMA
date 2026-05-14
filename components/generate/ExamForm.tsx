import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { SUBJECTS_PRIMARY, SUBJECTS_O_LEVEL, SUBJECTS_A_LEVEL, CLASS_LEVELS } from '../../lib/curriculum';

export const ExamForm = ({ onGenerate, initialData }: { onGenerate: (data: any) => void, initialData?: any }) => {
  const defaultLevel = React.useMemo(() => {
    if (initialData?.class_level) {
      if (initialData.class_level.startsWith('P')) return 'P';
      if (['S1','S2','S3','S4'].includes(initialData.class_level)) return 'O';
      if (['S5','S6'].includes(initialData.class_level)) return 'A';
    }
    return 'O';
  }, [initialData]);

  const [level, setLevel] = useState(defaultLevel);
  const [data, setData] = useState({
    subject: initialData?.generation_inputs?.subject || initialData?.subject || '',
    classLevel: initialData?.generation_inputs?.classLevel || initialData?.class_level || '',
    duration: initialData?.generation_inputs?.duration || '2 hrs 30 min',
    type: initialData?.generation_inputs?.type || 'Mock UNEB',
    marks: initialData?.generation_inputs?.marks || '100',
    topics: initialData?.generation_inputs?.topics || (initialData?.title?.split(' - ')[0] !== initialData?.type && initialData?.title?.split(' - ')[0] ? initialData?.title?.split(' - ')[0] : 'Full syllabus'),
    includeAnswers: initialData?.generation_inputs?.includeAnswers ?? true,
    sections: initialData?.generation_inputs?.sections || {
      A: true,
      B: true,
      C: false
    }
  });

  const getSubjects = () => {
    if (level === 'P') return SUBJECTS_PRIMARY;
    if (level === 'O') return SUBJECTS_O_LEVEL;
    return SUBJECTS_A_LEVEL;
  };

  const getClasses = () => {
    if (level === 'P') return CLASS_LEVELS.filter(c => c.startsWith('P'));
    if (level === 'O') return CLASS_LEVELS.filter(c => ['S1','S2','S3','S4'].includes(c));
    return ['S5', 'S6'];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(data);
  };

  const toggleSection = (section: 'A'|'B'|'C') => {
    setData({
      ...data, 
      sections: { ...data.sections, [section]: !data.sections[section] }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Level</label>
        <Select 
          value={level} 
          onChange={(e) => {
            setLevel(e.target.value);
            setData({...data, subject: '', classLevel: ''});
          }}
        >
          <option value="P">Primary</option>
          <option value="O">O-Level</option>
          <option value="A">A-Level</option>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Class</label>
          <Select 
            required 
            value={data.classLevel} 
            onChange={(e) => setData({...data, classLevel: e.target.value})}
          >
            <option value="">Select Class</option>
            {getClasses().map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Subject</label>
          <Select 
            required 
            value={data.subject} 
            onChange={(e) => setData({...data, subject: e.target.value})}
          >
            <option value="">Select Subject</option>
            {getSubjects().map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Duration</label>
          <Select value={data.duration} onChange={e => setData({...data, duration: e.target.value})}>
            <option value="1 hr 30 min">1 hr 30 min</option>
            <option value="2 hrs">2 hrs</option>
            <option value="2 hrs 30 min">2 hrs 30 min</option>
            <option value="3 hrs">3 hrs</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Total Marks</label>
          <Select value={data.marks} onChange={e => setData({...data, marks: e.target.value})}>
            <option value="40">40</option>
            <option value="60">60</option>
            <option value="80">80</option>
            <option value="100">100</option>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Paper Type</label>
        <Select value={data.type} onChange={e => setData({...data, type: e.target.value})}>
          <option value="Mock UNEB">Mock UNEB</option>
          <option value="End of term">End of term</option>
          <option value="Mid-term">Mid-term</option>
          <option value="Topic test">Topic test</option>
        </Select>
      </div>

      <div>
         <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Sections to Include</label>
         <div className="space-y-2 bg-surface p-3 rounded-xl border border-border">
           <label className="flex items-center gap-2 text-sm">
             <input type="checkbox" checked={data.sections.A} onChange={() => toggleSection('A')} className="rounded border-border text-primary focus:ring-primary w-4 h-4" />
             Section A: MCQ
           </label>
           <label className="flex items-center gap-2 text-sm">
             <input type="checkbox" checked={data.sections.B} onChange={() => toggleSection('B')} className="rounded border-border text-primary focus:ring-primary w-4 h-4" />
             Section B: Structured 
           </label>
           <label className="flex items-center gap-2 text-sm">
             <input type="checkbox" checked={data.sections.C} onChange={() => toggleSection('C')} className="rounded border-border text-primary focus:ring-primary w-4 h-4" />
             Section C: Essay
           </label>
         </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Topics to Cover</label>
        <Input value={data.topics} onChange={e => setData({...data, topics: e.target.value})} placeholder="e.g. Full syllabus, or specific topics comma separated" />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input 
          type="checkbox" 
          id="exam-answers" 
          checked={data.includeAnswers}
          onChange={(e) => setData({...data, includeAnswers: e.target.checked})}
          className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
        />
        <label htmlFor="exam-answers" className="text-sm font-medium text-surface-dark cursor-pointer">Include Answer Scheme</label>
      </div>

      <Button type="submit" className="w-full mt-4">Generate Exam Paper</Button>
    </form>
  );
};
