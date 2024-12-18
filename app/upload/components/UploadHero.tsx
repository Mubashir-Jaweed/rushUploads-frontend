'use client'

import GridPattern from '@/components/ui/grid-pattern'
import { SlCloudUpload } from "react-icons/sl";

import PulsatingButton from '@/components/ui/pulsating-button'
import { cn } from '@/lib/utils'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios';
import AnimatedCircularProgressBar from '@/components/ui/animated-circular-progress-bar';
import { IoClose } from 'react-icons/io5';
import { IoMdAdd } from "react-icons/io";


const UploadHero = () => {

    const [isSentToEmail, setIsSentToEmail] = useState(true)
    const [files, setFiles] = useState<File[]>([]);
    const [email, setEmail] = useState('');
    const [emailTo, setEmailTo] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const API_URL = 'https://rushuploads-backend.onrender.com/'
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NWZhNDg2NzMzMjRkZGFjYzRmNWQ4MiIsImVtYWlsIjoiYUB5b3BtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwidGllciI6IkZSRUUiLCJyZW1haW5pbmdTdG9yYWdlIjoyNjg0MzU0NTYwMCwiaXNWZXJpZmllZCI6dHJ1ZSwidXBkYXRlZEF0IjoiMjAyNC0xMi0xNlQwMzo1NDo0Ni40ODdaIiwiaWF0IjoxNzM0MzIxMzAzLCJleHAiOjE3MzQ5MjYxMDN9.SkIlwKrjtK9nyuyeOnYK8QVrevk4-bf2Jo-iemhLc_k'



    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            setFiles(acceptedFiles)
            console.log(acceptedFiles)
        },
        maxSize: 10 * 1024 * 1024,
    })

    const uploadFiles = async (data: FormData) => {
        console.log(data)
        try {
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
            setIsUploading(false)
            setProgress(0)
            setFiles([])
            setEmail('')
            setEmailTo('')
            setSubject('')
            setMessage('')
            console.log('Response:', response.data);
            return response.data;



        } catch (error) {
            console.error('Error uploading files:', error);
            throw error;
        }
    }
    const handleUpload = async () => {
        if (files.length < 1) {
            console.log('no file selected')
            return
        };
        const formData = new FormData();

        files.forEach((file) => formData.append('files', file));
        formData.append('title', subject);
        formData.append('message', message);
        formData.append('expiresInDays', '7');
        console.log('launch')
        setIsUploading(true)
        try {
            const response = await uploadFiles(formData);
            console.log('Upload successful:', response);
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
            <div className="h-[100%] w-[100%] hero-bg rounded-xl flex  justify-center items-center">

                {/*if btn press shoew progress else show form */}
                {isUploading ? <div className="glass-bg p-5 delay-5ms flex gap-1  w-[700px] h-[700px] flex-col items-center justify-center overflow-hidden rounded-2xl shadow-2xl ">
                    <AnimatedCircularProgressBar
                        max={100}
                        min={0}
                        value={progress}
                        gaugePrimaryColor="rgb(79 70 229)"
                        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
                    />
                </div>
                    : <div className="glass-bg p-5 delay-5ms flex gap-1  w-[700px]  flex-col items-center justify-between overflow-hidden rounded-2xl shadow-2xl ">
                        <div className='w-full'>
                            <span className='text-2xl font-semibold text-stone-800'>Upload Files</span>
                        </div>
                        {/* showfiles if selected else show drag drop cont */}
                        {files.length > 0 ?
                            <div className='w-full flex flex-col justify-center items-center gap-1 py-1'>
                                {files.map((file, i) => (
                                    <div key={i} className="hover:bg-[#f5f5f57e]  bg-[#f5f5f52d] w-full list-card cursor-pointer flex flex-col  justify-center items-center rounded-[8px] p-2">
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
                                <div   className='w-full flex justify-between items-center p-2 px-3 rounded-[8px] bg-[#93beff25] hover:bg-[#93beff41]'>
                                    <span className='text-base text-blue-700 font-medium'>{files.length} Files</span>
                                    <span className='flex gap-2 justify-center items-center text-base text-blue-700 font-medium'>
                                        Add more
                                        <span className='list-btn-title-cont delay-5ms hover:bg-blue-700 text-blue-200 bg-blue-600 p-1 rounded-full flex justify-center items-center'>
                                            <IoMdAdd className='size-5' />
                                            <span className='list-btn-title'>Add_more</span>

                                        </span>
                                    </span>
                                </div>
                            </div> :
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
                            <input type='email' placeholder='Your Email' value={email} onChange={(e) => setEmail(e.target.value)} className=' placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl' />
                            {isSentToEmail && <input type='email' value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder='Email to' className=' placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl' />}
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
