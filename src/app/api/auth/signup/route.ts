
import {NextResponse} from 'next/server';
import {z} from 'zod';
// import { hashPassword } from '@/lib/auth'; // For actual password hashing
// import db from '@/lib/db'; // For actual database interaction

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({message: 'Invalid input', errors: parsed.error.issues}, {status: 400});
    }

    const {name, email, password} = parsed.data;

    // --- Placeholder Logic ---
    // In a real app:
    // 1. Check if user with this email already exists in DB
    //    const existingUser = await db.user.findUnique({ where: { email } });
    //    if (existingUser) {
    //      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    //    }
    // 2. Hash the password
    //    const hashedPassword = await hashPassword(password);
    // 3. Create the user in the database
    //    const newUser = await db.user.create({ data: { name, email, passwordHash: hashedPassword } });
    //    (Return only necessary info, not the password hash)
    //    return NextResponse.json({ message: 'User created successfully', userId: newUser.id }, { status: 201 });

    console.log('SIMULATING SIGNUP:', {name, email, password}); // Log sensitive data only in dev
    
    // Simulate success
    if (email === "exists@example.com") {
        return NextResponse.json({ message: 'User already exists (simulated)' }, { status: 409 });
    }

    return NextResponse.json({message: 'Signup successful (simulated)', userId: 'user_123', name, email}, {status: 201});
    // --- End Placeholder Logic ---

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({message: 'Internal server error'}, {status: 500});
  }
}
