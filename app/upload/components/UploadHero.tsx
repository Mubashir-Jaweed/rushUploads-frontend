'use client'

import GridPattern from '@/components/ui/grid-pattern'
import { SlCloudUpload } from "react-icons/sl";

import PulsatingButton from '@/components/ui/pulsating-button'
import { cn } from '@/lib/utils'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios, { AxiosError } from 'axios';
import AnimatedCircularProgressBar from '@/components/ui/animated-circular-progress-bar';
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { IoClose, IoLockClosed, IoLockOpen } from 'react-icons/io5';
import { IoMdAdd } from "react-icons/io";
import WordRotate from '@/components/ui/word-rotate';
import { IoCloudDoneOutline } from "react-icons/io5";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuEyeClosed } from 'react-icons/lu';
import { GoEye } from 'react-icons/go';
import { toast } from 'react-toastify';



const UploadHero = () => {

    const [files, setFiles] = useState<File[]>([]);
    const [senderEmails, setSenderEmails] = useState<string[]>([]);
    const [email, setEmail] = useState('');
    const [emailTo, setEmailTo] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSentToEmail, setIsSentToEmail] = useState(true)
    const [isToken, setIsToken] = useState(false)
    const [isFileUploaded, setIsFileUploaded] = useState(false)
    const [verificationInProgress, setVerificationInProgress] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [responseId, setResponseId] = useState('')
    const [progress, setProgress] = useState(0)
    const [isHidden, setIsHidden] = useState(true);
    const [otp, setOtp] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const API_URL = 'https://rushuploads-backend.onrender.com/'
    const router = useRouter();
    let token = localStorage.getItem('token')
    let verifyToken = localStorage.getItem('ru_anonymous_idk')




    useEffect(() => {
        if (token) {
            setIsToken(true)
        }

    }, [])



    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            setFiles(acceptedFiles)
            console.log(acceptedFiles)
        },
        maxSize: 10 * 1024 * 1024,
    })

    const createFileLink = async (data: FormData) => {
        setIsUploading(true)
        try {
            setIsUploading(true)
            const response = await axios.post(`${API_URL}files/link`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
                onUploadProgress: (ProgressEvent) => {
                    setProgress(
                        Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
                    )
                },
            });
            if (response) {
                console.log(response)
                setResponseId(response.data.data.link.id)
                setIsFileUploaded(true)
                setProgress(0)
                setFiles([])
                setEmail('')
                setEmailTo('')
                setSubject('')
                setMessage('')
            }


        } catch (error) {
            console.error('Error uploading files:', error);
            setIsFileUploaded(false)
            setIsUploading(false)
            setProgress(0)
            setFiles([])
            setEmail('')
            setEmailTo('')
            setSubject('')
            setMessage('')
            throw error;
        }
    }

    const sendToMail = async (data: FormData) => {
        setIsUploading(true)
        try {
            setIsUploading(true)
            const response = await axios.post(`${API_URL}files/mail`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
                onUploadProgress: (ProgressEvent) => {
                    setProgress(
                        Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
                    )
                },
            });


            if (response) {
                // setResponseId(response.data.data.mail.id)
                setIsFileUploaded(true)
                setProgress(0)
                setFiles([])
                setEmail('')
                setEmailTo('')
                setSubject('')
                setMessage('')
            }


        } catch (error) {
            let msg: string

            if (error instanceof AxiosError) {
                msg = error.response?.data.info.message

                console.log({ err: error })
            } else if (error instanceof Error) {
                msg = error.message
            } else {
                msg = JSON.stringify(error)
            }

            console.error('Error uploading files:', msg);

            setIsFileUploaded(false)
            setIsUploading(false)
            setProgress(0)
            setFiles([])
            setEmail('')
            setEmailTo('')
            setSubject('')
            setMessage('')
        }
    }

    const handleOtp = async () => {
        setIsProcessing(true)

        try {
            const data = {
                otp: otp,
                type: 'VERIFY_EMAIL'
            };
            const response = await axios.post(`${API_URL}auth/verify-otp`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${verifyToken}`,
                },


            });

            if (response) {
                localStorage.setItem('token', response.data.data.token)
                localStorage.removeItem('ru_anonymous_idk')
                token = localStorage.getItem('token')

                setIsProcessing(false)
                setVerificationInProgress(false)
                handleUpload()

            }
        } catch (error) {
            console.error('Error SignUp:', error.response.data.info.message);
            setIsProcessing(false)

            throw error;
        }

    }
    const quickSignUp = async () => {
        const data = {
            email: email,
        };
        try {
            const response = await axios.post(`${API_URL}auth/sign-up`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (response) {

                localStorage.setItem('ru_anonymous_idk', response.data.data.token)
                setVerificationInProgress(true)


            }

        } catch (error) {
            console.error('Error Quick SignUp:', error.response.data.info.message,);

            // throw error;
        }
    }

    const handleUpload = async () => {
        if (files.length < 1) {
            toast.error('No file selected!')
            return
        };
        if (!token && email.length < 1) {
            {
                toast.error('Email is required!' ,)
                return

            }
        }
        if (isSentToEmail && emailTo.length <= 0) {
            toast.error('Sender email required!')
            return
        }

        if (!token && email.length > 0) {
            quickSignUp()
            return
        }

        var sendTo = ''
        const formData = new FormData();

        files.forEach((file) => formData.append('files', file));
        formData.append('title', subject);
        formData.append('message', message);
        formData.append('expiresInDays', '7');
        if (isSentToEmail) {

            if (senderEmails.length > 0) {
                sendTo = senderEmails.join(',')
                formData.append('to', sendTo);
            } else {
                formData.append('to', emailTo);

            }
        }


        try {
            if (isSentToEmail) {
                await sendToMail(formData);
            } else {
                await createFileLink(formData);

            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    const formatFileSize = (sizeInBytes: number) => {
        if (sizeInBytes < 1024) {
            return `${sizeInBytes} Bytes`;
        } else if (sizeInBytes < 1024 * 1024) {
            return `${(sizeInBytes / 1024).toFixed(2)} KB`;
        } else if (sizeInBytes < 1024 * 1024 * 1024) {
            return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
        } else {
            return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        }
    };

    const removeSelectedFile = (idx: number) => {
        setFiles(files.filter((val, i) => i !== idx))
    }

    const removeSenderMails = (idx: number) => {
        setSenderEmails(senderEmails.filter((val, i) => i !== idx))
    }

    const mergeFiles = (newFiles: FileList | null) => {
        if (newFiles) {
            setFiles((prevFiles) => [...prevFiles, ...Array.from(newFiles)])
        }
    }

    const addEmailsToSenderList = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && emailTo.length > 0) {
            if (senderEmails.length < 5 && emailTo.includes('@') && emailTo.includes('.')) {

                senderEmails.push(emailTo)
                setEmailTo('');
            }
            return
        }
    }

    const sendMore = () => {
        setIsUploading(false)
        setIsFileUploaded(false)
    }

    const navigateTo = (route: string) => {
        router.push(route)
    }

    const copyUrl = (url:string) =>{
        navigator.clipboard.writeText(url)
      }
    return (
        <div className="bg-white h-screen w-full p-3" >
            <GridPattern
                width={40}
                height={40}
                x={-1}
                y={-1}
                className={cn(
                    "[mask-image:linear-gradient(to_bottom_top,white,transparent,transparent)] ",
                )}
            />
            <div className="h-[100%] w-[100%]  hero-bg rounded-xl flex  justify-center items-center">

                {/*if btn press shoew progress else show form */}
                {isUploading ?

                    isFileUploaded ?
                        <div className='mt-10 glass-bg p-5 delay-5ms flex gap-2  w-[600px] h-[700px] flex-col items-center justify-center overflow-hidden rounded-2xl shadow-2xl'>
                            <IoCloudDoneOutline className='size-32 m-2' />
                            <span className='text-2xl font-semibold text-stone-800'>
                                That’s a wrap!
                            </span>
                            {isSentToEmail ? <span>
                                The email has been delivered. <Link href={'/dashboard/workspace'} className='underline text-zinc-700'>Explore its contents</Link>.
                            </span>
                                :
                                <span className='text-zinc-600 text-lg font-normal'>
                                    Grab your download link or <span className='underline text-zinc-700'>explore your files!</span>
                                </span>}
                            {!isSentToEmail && <span className='text-zinc-700 text-base font-normal border border-zinc-500 rounded-[8px] text-center p-3 my-3 min-w-[80%]'>
                                https://we.tl/t-ZMUM8B85BEhttps://we.tl/t-ZMUM8B85BE
                            </span>}
                            {isSentToEmail ? <PulsatingButton onClick={() => navigateTo('dashboard/workspace')} className="text-lg font-medium p-3 w-[80%] my-2 rounded-full flex justify-center items-center">Go to dashboard
                            </PulsatingButton> :
                                <PulsatingButton onClick={()=>copyUrl('dsd')} className="text-lg font-medium p-3 w-[80%] my-2 rounded-full flex justify-center items-center">Copy link
                                </PulsatingButton>}
                            <span onClick={() => sendMore()} className='text-zinc-700 text-lg font-normal cursor-pointer underline'>
                                Send more files?
                            </span>

                        </div>
                        :
                        <div className="mt-10 glass-bg p-5 delay-5ms flex gap-2  w-[600px] h-[700px] flex-col items-center justify-center overflow-hidden rounded-2xl shadow-2xl ">
                            <AnimatedCircularProgressBar
                                max={100}
                                min={0}
                                value={progress}
                                gaugePrimaryColor="#27272a"
                                gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
                            />

                            <div className='flex flex-col justify-center items-center'>
                                <span className='text-base text-zinc-700 font-medium text-center'>
                                    Sending {files.length} files
                                </span>
                                <WordRotate
                                    duration={3000}
                                    className="text-3xl font-bold text-stone-800 dark:text-white"
                                    words={[" Uploading...", " Almost completed...", " Finalizing..."]}
                                />
                                <span className='text-base text-zinc-500  text-center'>
                                    Do not close this window until the file uploaded
                                </span>
                            </div>
                        </div>
                    :
                    verificationInProgress ?
                        <div className="mt-10 glass-bg p-5 delay-5ms flex gap-1  w-[600px] h-[700px]  flex-col items-center justify-center overflow-hidden rounded-2xl shadow-2xl ">
                            <MdOutlineMarkEmailUnread className='size-32 m-2' />
                            <span className='text-2xl font-semibold text-stone-800'>
                              Verify Email!
                            </span>
                            <span className='text-center  text-zinc-700 text-lg'>
                                An email with the code has been sent to <br /> {email}
                            </span>

                            <div className='rounded-xl glass-bg flex justify-between items-center w-[80%]'>
                                {isHidden ? <IoLockClosed className='text-2xl ml-3 text-stone-600' />
                                    : <IoLockOpen className='text-2xl ml-3 text-stone-600' />}

                                <input type={isHidden ? 'password' : 'text'} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder='Verification code' className='bg-transparent text-stone-800 text-xl font-normal p-4 outline-none h-full w-[88%]' />
                                {isHidden ? <LuEyeClosed onClick={() => setIsHidden(!isHidden)} className='cursor-pointer text-2xl mr-3 text-stone-600' />
                                    : <GoEye onClick={() => setIsHidden(!isHidden)} className='cursor-pointer text-2xl mr-3 text-stone-600' />}

                            </div>
                            <div className='mb-2 w-80 flex justify-center'>
                                <Link href={'/'} className='text-md text-zinc-400 underline'>Did not get the code?</Link>
                            </div>
                            <PulsatingButton onClick={handleOtp} className={`text-lg font-medium p-3 w-[80%] my-2 rounded-full flex justify-center items-center ${isProcessing ? 'cursor-wait' : 'cursor-pointer'}`}>Submit
                            </PulsatingButton>
                        </div>
                        :

                        <div className="mt-10 glass-bg p-5 delay-5ms flex gap-1  w-[600px]  flex-col items-center justify-between overflow-hidden rounded-2xl shadow-2xl ">
                            <div className='w-full'>
                                <span className='text-2xl font-semibold text-stone-800'>Upload Files</span>
                            </div>
                            {/* showfiles if selected else show drag drop cont */}
                            {files.length > 0 ?
                                <> <div className='w-full max-h-[200px] rounded-[8px] overflow-auto overflow-x-hidden flex flex-col justify-start items-center bg-transparent gap-1'>
                                    {files.map((file, i) => (
                                        <div key={i} className="hover:bg-[#f5f5f57e]  bg-[#f5f5f52d] w-full list-card cursor-pointer flex flex-col  justify-center items-center rounded-[8px] px-2 py-1">
                                            <span className=' text-lg font-medium capitalize w-full text-stone-800'>
                                                {file.name}
                                            </span>
                                            <div className=' flex w-full justify-between items-center'>
                                                <div className='flex justify-start items-center gap-3'>
                                                    <span className=' text-sm font-normal text-zinc-700'>{formatFileSize(file.size)}</span>
                                                    <span className=' text-xs font-normal text-zinc-700'>|</span>
                                                    <span className=' text-sm font-normal text-zinc-700'>{file.type}</span>
                                                </div>
                                                <div className='flex justify-center items-center '>

                                                    <span onClick={() => removeSelectedFile(i)} className='list-btn-title-cont delay-5ms hover:bg-[#32323218] text-stone-800 p-1 rounded-full flex justify-center items-center'>
                                                        <IoClose className='size-5' />
                                                        <span className='list-btn-title'>Delete</span>

                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                                    <div className='cursor-pointer w-full flex justify-between items-center p-2 px-3 rounded-[8px] bg-[#93beff25] hover:bg-[#93beff41]'>
                                        <span className='text-base text-blue-700 font-medium'>{files.length} Files</span>
                                        <input id='add-more' type='file' multiple className='hidden' onChange={(e) => mergeFiles(e.target.files)} />
                                        <label htmlFor='add-more' className='flex gap-2 justify-center items-center text-base text-blue-700 font-medium'>
                                            Add more
                                            <span className='list-btn-title-cont delay-5ms hover:bg-blue-700 text-blue-200 bg-blue-600 p-1 rounded-full flex justify-center items-center'>
                                                <IoMdAdd className='size-5' />

                                                <span className='list-btn-title'>Add_more</span>

                                            </span>
                                        </label>
                                    </div>
                                </> :
                                <div {...getRootProps()} className='cursor-pointer flex flex-col gap-2 justify-center items-center  border-[3px] border-zinc-400 border-dashed w-full h-[200px] rounded-xl mt-1'>
                                    <SlCloudUpload className='size-20 text-stone-800' />
                                    {isDragActive ? <span className='text-xl font-medium cursor-default'>
                                        Drop files here
                                    </span> : <span className='text-xl font-medium cursor-default'>
                                        Drag & drop files or <span className='cursor-pointer underline hover:no-underline'> <input {...getInputProps()} /> Browse</span>
                                    </span>}

                                </div>
                            }
                            <div className='flex justify-between items-center w-full text-[12px] text-zinc-600 '>
                                <span>Supported formts: JPEG, XLS, PDF, PNG</span>
                                <span>Max size: 250GB</span>
                            </div>
                            <div className='w-full flex justify-start items-center gap-3 my-3'>
                                <label className='flex gap-1 justify-center items-center text-stone-800 text-[15px] font-medium'>
                                    <input type='radio' checked={isSentToEmail ? true : false} onClick={() => setIsSentToEmail(true)} className='size-4' />
                                    Send Email
                                </label>
                                <label className='flex gap-1 justify-center items-center text-stone-800 text-[15px] font-medium'>
                                    <input type='radio' checked={!isSentToEmail ? true : false} onClick={() => setIsSentToEmail(false)} className='size-4' />
                                    Create Link
                                </label>
                            </div>
                            <div className='w-full bg-transparent flex flex-col gap-2'>
                                {isSentToEmail &&
                                    <div className='upload-input text-stone-800 text-lg font-normal flex gap-1 flex-wrap outline-none p-3  w-full rounded-xl'>
                                        {senderEmails.map((mail, i) => (
                                            <span key={i} className='hover:bg-white hover:border-zinc-300 cursor-pointer border shadow-sm rounded-xl w-max px-2 text-sm text-zinc-500 flex justify-center items-center gap-1'>
                                                {mail} <IoClose onClick={() => removeSenderMails(i)} className=' size-4 rounded-full' />
                                            </span>
                                        ))}
                                        <input type='email'
                                            value={emailTo}
                                            onChange={(e) => setEmailTo(e.target.value)}
                                            onKeyDown={addEmailsToSenderList}
                                            placeholder='Email to'
                                            className=' placeholder:text-zinc-500 bg-transparent text-stone-800 text-lg font-normal outline-none  w-full ' />
                                    </div>
                                }
                                {!isToken &&
                                    <input type='email' placeholder='Your Email' value={email} onChange={(e) => setEmail(e.target.value)} className=' placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl' />
                                }
                                <input type='text' placeholder='Subject' value={subject} onChange={(e) => setSubject(e.target.value)} className=' placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl' />
                                <textarea placeholder='Message' value={message} onChange={(e) => setMessage(e.target.value)} className='resize-none placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl'>

                                </textarea>
                                <PulsatingButton onClick={handleUpload} className="text-lg font-medium p-4 my-2 rounded-full flex justify-center items-center">Transfer File
                                </PulsatingButton>
                            </div>
                        </div>
                }

            </div>
        </div>
    )
}

export default UploadHero
