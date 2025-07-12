'use client'
import {zodResolver} from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';  
import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { useEffect,} from 'react';
import { useDebounceValue } from 'usehooks-ts'

const page = () => {
  const [username,setUsername]= useState('');
  const [usernameMessage,setUsernameMessage]= useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername= useDebounceValue(username, 300);
  // 300 milisecond is the delay time for the debounce
  return (
    <div>
      
    </div>
  )
}

export default page



