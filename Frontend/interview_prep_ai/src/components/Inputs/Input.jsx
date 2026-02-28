import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {

  const [showPassword, setShowPassword] = useState(false);
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return <div>
             <label className='text-[13px] text-slate-800 border-amber-200'>{label}</label> 
             <div className='input-box flex items-center gap-2 border border-slate-400 rounded-md bg-white px-3 py-2
                focus-within:border-amber-200 transition-all'>
                <input
                 type={
                  type == "password" ? (showPassword ? "text" : "password") : type 
                 }
                 placeholder = {placeholder}
                 className='w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400'
                 value={value}
                 onChange={(e) => onChange(e)}
                />

                {type === "password" && (
                  <>
                     {showPassword ? (
                      <FaRegEye
                        size={22}
                        className='text-primary cursor-pointer'
                        onClick={() => toggleShowPassword()}
                      />  
                     ) : (
                        <FaRegEyeSlash
                         size={22}
                         className='text-slate-400 cursor-pointer'
                         onClick={() => toggleShowPassword()}
                        />
                     )}
                  </>    
                )}
             </div>  
         </div>
}

export default Input