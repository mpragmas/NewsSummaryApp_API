import { Injectable, UnauthorizedException, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface FirebaseProfile {
  uid: string;
  email: string | null;
  name: string | null;
  picture: string | null;
}

@Injectable()
export class FirebaseVerificationService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseVerificationService.name);
  private auth!: admin.auth.Auth;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    if (admin.apps.length > 0) {
      this.auth = admin.app().auth();
      return;
    }

    const serviceAccountJson = this.config.get<string>('firebase.serviceAccount');
    const projectId = this.config.get<string>('firebase.projectId');

    let credential: admin.credential.Credential;
    if (serviceAccountJson) {
      try {
        credential = admin.credential.cert(
          JSON.parse(serviceAccountJson) as admin.ServiceAccount,
        );
      } catch {
        throw new Error(
          'FIREBASE_SERVICE_ACCOUNT is set but contains invalid JSON',
        );
      }
    } else {
      credential = admin.credential.applicationDefault();
    }

    const app = admin.initializeApp({ credential, projectId: projectId ?? undefined });
    this.auth = app.auth();
    this.logger.log('Firebase Admin SDK initialized');
  }

  async verifyIdToken(idToken: string): Promise<FirebaseProfile> {
    try {
      const decoded = await this.auth.verifyIdToken(idToken, true);
      return {
        uid: decoded.uid,
        email: decoded.email ?? null,
        name: (decoded.name as string | undefined) ?? null,
        picture: (decoded.picture as string | undefined) ?? null,
      };
    } catch (err) {
      this.logger.warn(`Firebase token verification failed: ${(err as Error).message}`);
      throw new UnauthorizedException('Invalid or expired Firebase token');
    }
  }
}
