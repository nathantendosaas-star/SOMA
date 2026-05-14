import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { SUBJECTS_PRIMARY, SUBJECTS_O_LEVEL, SUBJECTS_A_LEVEL, CLASS_LEVELS } from '../../lib/curriculum';

export const SchemeForm = ({ onGenerate, initialData }: { onGenerate: (data: any) => void, initialData?: any }) => {
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
    term: initialData?.generation_inputs?.term || (initialData?.title?.includes('Term 2') ? 'Term 2' : initialData?.title?.includes('Term 3') ? 'Term 3' : 'Term 1'),
    weeks: initialData?.generation_inputs?.weeks || '12',
    periods: initialData?.generation_inputs?.periods || '4',
    startWeek: initialData?.generation_inputs?.startWeek || '1'
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
          <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Term</label>
          <Select value={data.term} onChange={e => setData({...data, term: e.target.value})}>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Number of Weeks</label>
          <Select value={data.weeks} onChange={e => setData({...data, weeks: e.target.value})}>
            <option value="8">8 Weeks</option>
            <option value="10">10 Weeks</option>
            <option value="12">12 Weeks</option>
            <option value="13">13 Weeks</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Periods per Week</label>
          <Select value={data.periods} onChange={e => setData({...data, periods: e.target.value})}>
            <option value="3">3 Periods</option>
            <option value="4">4 Periods</option>
            <option value="5">5 Periods</option>
            <option value="6">6 Periods</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Starting Week</label>
          <Input type="number" min="1" max="13" value={data.startWeek} onChange={e => setData({...data, startWeek: e.target.value})} />
        </div>
      </div>

      <Button type="submit" className="w-full mt-4">Generate Scheme of Work</Button>
    </form>
  );
};
