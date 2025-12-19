import {supabase} from './supabase';
import {User} from '../types';

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email!,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  async signOut(): Promise<AuthResponse> {
    try {
      const {error} = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {success: true};
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
      };
    } catch (error) {
      return null;
    }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
        });
      } else {
        callback(null);
      }
    });
  },
};
