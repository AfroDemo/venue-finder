import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => (
  <textarea className={cn('p-2 border rounded-xl w-full', className)} {...props} />
);

export { Textarea };
