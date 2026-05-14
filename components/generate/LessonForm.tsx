import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { SUBJECTS_PRIMARY, SUBJECTS_O_LEVEL, SUBJECTS_A_LEVEL, CLASS_LEVELS } from '../../lib/curriculum';

export const LessonForm = ({ onGenerate, initialData }: { onGenerate: (data: any) => void, initialData?: any }) => {
  // Determine level if initialData is present
  const defaultLevel = React.useMemo(() => {
    if (initialData?.class_level) {
      if (initialData.class_level.startsWith('P')) return 'P';
      if (['S1','S2','S3','S4'].includes(initialData.class_level)) return 'O';
      if (['S5','S6'].includes(initialData.class_level)) return 'A';
    }
    return 'P';
  }, [initialData]);

  const [level, setLevel] = useState(defaultLevel); // P, O, A
  const [data, setData] = useState({
    subject: initialData?.generation_inputs?.subject || initialData?.subject || '',
    classLevel: initialData?.generation_inputs?.classLevel || initialData?.class_level || '',
    topic: initialData?.generation_inputs?.topic || initialData?.title?.replace(' Lesson Plan', '') || '',
    duration: initialData?.generation_inputs?.duration || '40 min',
    stream: initialData?.generation_inputs?.stream || '',
    special: initialData?.generation_inputs?.special || ''
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
        <label className="block text-sm font-semibold text-content mb-1.5 font-sans">Level</label>
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
          <label className="block text-sm font-semibold text-content mb-1.5 font-sans">Class</label>
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
          <label className="block text-sm font-semibold text-content mb-1.5 font-sans">Subject</label>
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

      {level === 'A' && (
        <div>
          <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Stream</label>
          <Select value={data.stream} onChange={(e) => setData({...data, stream: e.target.value})}>
            <option value="">Both</option>
            <option value="Sciences">Sciences</option>
            <option value="Arts">Arts</option>
          </Select>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Topic</label>
        <Input 
          required 
          placeholder="e.g. Photosynthesis" 
          value={data.topic} 
          onChange={(e) => setData({...data, topic: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Duration</label>
        <Select value={data.duration} onChange={(e) => setData({...data, duration: e.target.value})}>
          <option value="30 min">30 min</option>
          <option value="40 min">40 min</option>
          <option value="60 min">60 min</option>
          <option value="80 min">80 min</option>
          <option value="Double period">Double period</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Special Considerations (Optional)</label>
        <Textarea 
          placeholder="e.g. low-resource classroom, includes learners with disabilities" 
          value={data.special} 
          onChange={(e) => setData({...data, special: e.target.value})}
        />
      </div>

      <Button type="submit" className="w-full mt-4">Generate Lesson Plan</Button>
    </form>
  );
};
