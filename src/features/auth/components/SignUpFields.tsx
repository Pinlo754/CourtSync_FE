import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone } from 'lucide-react';
import { Input } from '../../../components/ui/Input';

interface SignUpFieldsProps {
  isSignUp: boolean;
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SignUpFields: React.FC<SignUpFieldsProps> = ({ isSignUp, formData, onChange }) => {
  return (
    <AnimatePresence>
      {isSignUp && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {/* First Name & Last Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                placeholder="Nhập tên"
                label="Tên"
                icon={User}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                placeholder="Nhập họ"
                label="Họ"
                icon={User}
              />
            </motion.div>
          </div>

          {/* Phone Number */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              placeholder="Nhập số điện thoại"
              label="Số điện thoại"
              icon={Phone}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};