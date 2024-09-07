const z = require('zod');

const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),  
});

const loginSchema = z.object({ 
    email: z.string().email(),
    password: z.string().min(6),
});

const createTaskSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(6),
});

const updateTaskSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(6).optional(),
    status: z.enum(["pending", "ongoing", "done"]).optional()
});

module.exports = {loginSchema, registerSchema, createTaskSchema, updateTaskSchema};
