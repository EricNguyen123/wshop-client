'use client';

import RegisterBase from '@/components/auth/register/register-base';
import { motion } from 'framer-motion';
import React from 'react';

export default function RegisterPage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className='w-full h-full'
    >
      <RegisterBase />
    </motion.div>
  );
}
