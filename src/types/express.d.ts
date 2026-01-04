// src/types/express.d.ts
import { Tenant } from '../modules/master/tenants/entities/tenant.entity';

declare global {
    namespace Express {
        interface Request {
            tenant?: Tenant;
        }
    }
}

export { };