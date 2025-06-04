
import {NextResponse} from 'next/server';
import {z} from 'zod';
// import { verifyPassword } from '@/lib/auth'; // For actual password verification
// import db from '@/lib/db'; // For actual database interaction
// import jwt from 'jsonwebtoken'; // For session management

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({message: 'Invalid input', errors: parsed.error.issues}, {status: 400});
    }

    const {email, password} = parsed.data;

    // --- Placeholder Logic ---
    // In a real app:
    // 1. Find user by email
    //    const user = await db.user.findUnique({ where: { email } });
    //    if (!user) {
    //      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    //    }
    // 2. Verify password
    //    const isValidPassword = await verifyPassword(password, user.passwordHash);
    //    if (!isValidPassword) {
    //      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    //    }
    // 3. Create a session / JWT token
    //    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    //    const response = NextResponse.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } }, { status: 200 });
    //    response.cookies.set('session_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 3600 });
    //    return response;

    console.log('SIMULATING LOGIN:', {email, password}); // Log sensitive data only in dev

    // Simulate success for a specific user or failure
    if (email === 'user@example.com' && password === 'password123') {
      // Simulate setting a cookie
      const response = NextResponse.json({message: 'Login successful (simulated)', user: {id: 'user_123', name: 'Test User', email}}, {status: 200});
      // response.cookies.set('mock_session_token', 'mocktoken123', { httpOnly: true, path: '/', maxAge: 3600 });
      return response;
    } else {
      return NextResponse.json({message: 'Invalid email or password (simulated)'}, {status: 401});
    }
    // --- End Placeholder Logic ---

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({message: 'Internal server error'}, {status: 500});
  }
}
