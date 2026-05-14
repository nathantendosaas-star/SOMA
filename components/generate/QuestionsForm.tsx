import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { SUBJECTS_PRIMARY, SUBJECTS_O_LEVEL, SUBJECTS_A_LEVEL, CLASS_LEVELS } from '../../lib/curriculum';

export const QuestionsForm = ({ onGenerate, initialData }: { onGenerate: (data: any) => void, initialData?: any }) => {
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
    topic: initialData?.generation_inputs?.topic || initialData?.title?.replace(' Revision Questions', '') || '',
    type: initialData?.generation_inputs?.type || 'Mixed',
    count: initialData?.generation_inputs?.count || '10',
    difficulty: initialData?.generation_inputs?.difficulty || 'Medium',
    includeAnswers: initialData?.generation_inputs?.includeAnswers ?? true
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

      <div>
        <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Topic or Subtopic</label>
        <Input required value={data.topic} onChange={e => setData({...data, topic: e.target.value})} placeholder="e.g. Cell Division" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Question Type</label>
          <Select value={data.type} onChange={e => setData({...data, type: e.target.value})}>
            <option value="MCQ">MCQ</option>
            <option value="Short Answer">Short Answer</option>
            <option value="Essay">Essay</option>
            <option value="Mixed">Mixed</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Number</label>
          <Select value={data.count} onChange={e => setData({...data, count: e.target.value})}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Difficulty Distribution</label>
        <Select value={data.difficulty} onChange={e => setData({...data, difficulty: e.target.value})}>
          <option value="Easy">Mostly Easy</option>
          <option value="Medium">Balanced (UNEB Standard)</option>
          <option value="Hard">Mostly Hard</option>
        </Select>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input 
          type="checkbox" 
          id="answers" 
          checked={data.includeAnswers}
          onChange={(e) => setData({...data, includeAnswers: e.target.checked})}
          className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
        />
        <label htmlFor="answers" className="text-sm font-medium text-surface-dark cursor-pointer">Include Answer Key</label>
      </div>

      <Button type="submit" className="w-full mt-4">Generate Questions</Button>
    </form>
  );
};
